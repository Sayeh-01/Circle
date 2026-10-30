import type { Bus } from './bus';
import type { DB } from './db/client';
import type { Mailer } from './mailer';
import type { PushSender } from './push';
import type { FileStorage } from './storage';

export interface Env {
  nodeEnv: string;
  /** Public base URL of this server, e.g. https://api.circle.app */
  publicUrl: string;
  authSecret: string;
  trustedOrigins: string[];
  /** Placeholder domain used in universal-link files until a real domain exists. */
  linkDomain: string;
  google?: { clientId: string; clientSecret: string };
  apple?: { clientId: string; clientSecret: string };
  anthropicApiKey?: string;
  iosTeamId: string;
  iosBundleId: string;
  androidPackage: string;
  androidSha256: string[];
}

export interface Deps {
  db: DB;
  env: Env;
  mailer: Mailer;
  clock: () => Date;
  bus: Bus;
  storage: FileStorage;
  push: PushSender;
}

export function envFromProcess(overrides: Partial<Env> = {}): Env {
  const p = process.env;
  const publicUrl = p.PUBLIC_URL ?? `http://localhost:${p.PORT ?? 4100}`;
  return {
    nodeEnv: p.NODE_ENV ?? 'development',
    publicUrl,
    authSecret: p.BETTER_AUTH_SECRET ?? 'dev-only-secret-change-me-dev-only-secret',
    trustedOrigins: [publicUrl, 'circleapp://', 'http://localhost:8081', ...(p.TRUSTED_ORIGINS?.split(',').filter(Boolean) ?? [])],
    linkDomain: p.LINK_DOMAIN ?? 'circle.example.com',
    google: p.GOOGLE_CLIENT_ID && p.GOOGLE_CLIENT_SECRET ? { clientId: p.GOOGLE_CLIENT_ID, clientSecret: p.GOOGLE_CLIENT_SECRET } : undefined,
    apple: p.APPLE_CLIENT_ID && p.APPLE_CLIENT_SECRET ? { clientId: p.APPLE_CLIENT_ID, clientSecret: p.APPLE_CLIENT_SECRET } : undefined,
    anthropicApiKey: p.ANTHROPIC_API_KEY || undefined,
    iosTeamId: p.IOS_TEAM_ID ?? 'TEAMID0000',
    iosBundleId: p.IOS_BUNDLE_ID ?? 'app.circle.mobile',
    androidPackage: p.ANDROID_PACKAGE ?? 'app.circle.mobile',
    androidSha256: p.ANDROID_SHA256?.split(',').filter(Boolean) ?? ['00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00'],
    ...overrides,
  };
}
