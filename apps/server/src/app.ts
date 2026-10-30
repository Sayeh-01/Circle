import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createAuth, type Auth } from './auth';
import { Bus } from './bus';
import type { DB } from './db/client';
import type { Deps, Env } from './deps';
import { HttpError } from './errors';
import { createRouter, type Router } from './http';
import { createDevMailer, type Mailer } from './mailer';
import { createMemoryPushSender, type PushSender } from './push';
import { attachRealtime, signTicket } from './realtime';
import { registerChatRoutes } from './routes/chat';
import { registerGuestRoutes } from './routes/guest';
import { registerIcsRoutes, registerWellKnown } from './routes/ics';
import { registerEventRoutes } from './routes/events';
import { registerExpenseRoutes } from './routes/expenses';
import { registerGroupRoutes } from './routes/groups';
import { registerListRoutes } from './routes/lists';
import { registerMeRoutes } from './routes/me';
import { registerMiscRoutes } from './routes/misc';
import { registerPollRoutes } from './routes/polls';
import { registerTaskRoutes } from './routes/tasks';
import { createDevSms, type SmsSender } from './sms';
import { createMemoryStorage, type FileStorage } from './storage';
import { envFromProcess } from './deps';

export interface AppOptions {
  db: DB;
  env?: Partial<Env>;
  mailer?: Mailer;
  clock?: () => Date;
  push?: PushSender;
  sms?: SmsSender;
  storage?: FileStorage;
  /** Serve the exported Expo web build (E2E and simple deployments). */
  staticDir?: string;
  /** Register the WebSocket route (needs injectWebSocket on a real HTTP server). */
  realtime?: boolean;
}

export type FeatureModule = (r: Router, deps: Deps, root: Hono) => void;

/** Later versions register themselves here (one line per version). */
export const features: FeatureModule[] = [
  (r, d) => registerGroupRoutes(r, d),
  (r, d) => registerTaskRoutes(r, d),
  (r, d) => registerListRoutes(r, d),
  (r, d) => registerEventRoutes(r, d),
  (r, d) => registerExpenseRoutes(r, d),
  (r, d) => registerPollRoutes(r, d),
  (r, d) => registerChatRoutes(r, d),
  (r, d) => registerMiscRoutes(r, d),
  (r, d) => registerMeRoutes(r, d),
  // v1.1 Reach
  (r, d, root) => registerGuestRoutes(r, d, root),
  (r, d, root) => registerIcsRoutes(r, d, root),
  (_r, d, root) => registerWellKnown(d, root),
];

export function createApp(opts: AppOptions) {
  const env = envFromProcess(opts.env);
  const mailer = opts.mailer ?? createDevMailer(env.nodeEnv !== 'test');
  const deps: Deps = {
    db: opts.db,
    env,
    mailer,
    clock: opts.clock ?? (() => new Date()),
    bus: new Bus(),
    storage: opts.storage ?? createMemoryStorage(),
    push: opts.push ?? createMemoryPushSender(),
    sms: opts.sms ?? createDevSms(env.nodeEnv !== 'test'),
  };
  const auth: Auth = createAuth(opts.db, env, mailer, deps.sms);
  const router = createRouter(deps, auth);
  const app = new Hono();

  app.onError((err, c) => {
    if (err instanceof HttpError) return c.json({ error: err.code, message: err.message, details: err.details }, err.status);
    console.error(err);
    return c.json({ error: 'internal_error' }, 500);
  });

  const httpOrigins = env.trustedOrigins.filter((o) => o.startsWith('http'));
  app.use('/api/*', cors({ origin: httpOrigins, credentials: true, allowHeaders: ['content-type', 'authorization', 'expo-origin'], allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'] }));
  app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw));
  app.get('/api/health', (c) => c.json({ ok: true }));
  app.get('/api/config', (c) =>
    c.json({ google: !!env.google, apple: !!env.apple, phone: true, ai: !!env.anthropicApiKey, linkDomain: env.linkDomain }),
  );
  app.post('/api/ws-ticket', router.requireUser as any, (c: any) =>
    c.json({ ticket: signTicket(env.authSecret, c.get('user').id, deps.clock().getTime() + 60_000) }),
  );

  // Test-only: lets E2E read the emailed code. Never registered in production.
  if (env.nodeEnv !== 'production') {
    app.get('/api/test/otp', (c) => {
      const code = mailer.lastOtp?.(c.req.query('email') ?? '');
      return code ? c.json({ code }) : c.json({ error: 'not_found' }, 404);
    });
    app.get('/api/test/sms', (c) => {
      const code = deps.sms.lastCode?.(c.req.query('phone') ?? '');
      return code ? c.json({ code }) : c.json({ error: 'not_found' }, 404);
    });
  }

  for (const feature of features) feature(router, deps, app);
  app.route('/api', router.app);
  const rt = opts.realtime ? attachRealtime(app, deps) : null;
  app.all('/api/*', (c) => c.json({ error: 'not_found' }, 404));

  if (opts.staticDir) {
    const root = opts.staticDir;
    app.use('/*', serveStatic({ root }));
    app.get('*', async (c) => c.html(await readFile(join(root, 'index.html'), 'utf8')));
  }

  return { app, auth, deps, router, injectWebSocket: rt?.injectWebSocket ?? (() => {}), presence: rt?.presence ?? null };
}

export type CircleApp = ReturnType<typeof createApp>;
