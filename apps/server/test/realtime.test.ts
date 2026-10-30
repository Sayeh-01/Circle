import { serve } from '@hono/node-server';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { createDb } from '../src/db/client';
import { createDevMailer } from '../src/mailer';

// Real HTTP server + real WebSocket clients (Node's global WebSocket).

let base = '';
let close: () => Promise<void>;
const mailer = createDevMailer(false);

async function signIn(email: string) {
  await fetch(`${base}/api/auth/email-otp/send-verification-otp`, { method: 'POST', headers: { 'content-type': 'application/json', origin: base }, body: JSON.stringify({ email, type: 'sign-in' }) });
  const res = await fetch(`${base}/api/auth/sign-in/email-otp`, { method: 'POST', headers: { 'content-type': 'application/json', origin: base }, body: JSON.stringify({ email, otp: mailer.lastOtp!(email) }) });
  const cookie = res.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ');
  const call = async (method: string, path: string, body?: unknown) => {
    const r = await fetch(`${base}/api${path}`, { method, headers: { 'content-type': 'application/json', origin: base, cookie }, body: body ? JSON.stringify(body) : undefined });
    return r.json();
  };
  return { call, cookie };
}

function socket(ticket: string) {
  const ws = new WebSocket(`${base.replace('http', 'ws')}/api/ws?ticket=${encodeURIComponent(ticket)}`);
  const messages: any[] = [];
  const waiters: { pred: (m: any) => boolean; resolve: (m: any) => void }[] = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(String(e.data));
    messages.push(m);
    for (const w of [...waiters]) if (w.pred(m)) (waiters.splice(waiters.indexOf(w), 1), w.resolve(m));
  };
  const next = (pred: (m: any) => boolean, ms = 5000) =>
    new Promise<any>((resolve, reject) => {
      const found = messages.find(pred);
      if (found) return resolve(found);
      waiters.push({ pred, resolve });
      setTimeout(() => reject(new Error('timeout waiting for ws message')), ms);
    });
  return { ws, messages, next };
}

beforeAll(async () => {
  const { db, close: closeDb } = await createDb();
  const { app, injectWebSocket } = createApp({ db, mailer, realtime: true, env: { nodeEnv: 'test', publicUrl: 'http://localhost' } });
  const server = serve({ fetch: app.fetch, port: 0 });
  injectWebSocket(server as any);
  await new Promise((r) => server.once('listening', r));
  base = `http://localhost:${(server.address() as AddressInfo).port}`;
  close = async () => {
    server.close();
    await closeDb();
  };
});
afterAll(() => close());

describe('realtime', () => {
  it('members get "entity changed" after a write; outsiders do not; bad tickets are refused', async () => {
    const a = await signIn('a@example.com');
    const b = await signIn('b@example.com');
    const outsider = await signIn('o@example.com');
    const g = await a.call('POST', '/groups', { templateId: 'work', name: 'Team', lang: 'en' });
    await b.call('POST', `/invites/${g.invite.code}/join`, {});
    const sb = socket((await b.call('POST', '/ws-ticket')).ticket);
    const so = socket((await outsider.call('POST', '/ws-ticket')).ticket);
    await sb.next((m) => m.type === 'ready');
    await so.next((m) => m.type === 'ready');
    await a.call('POST', `/groups/${g.group.id}/tasks`, { title: 'Ship it' });
    const msg = await sb.next((m) => m.type === 'invalidate' && m.entity === 'tasks');
    expect(msg.groupId).toBe(g.group.id);
    // chat messages carry their payload
    await a.call('POST', `/groups/${g.group.id}/messages`, { body: 'hello' });
    const chat = await sb.next((m) => m.type === 'message');
    expect(chat.message.body).toBe('hello');
    expect(so.messages.filter((m) => m.groupId === g.group.id)).toEqual([]);

    const bad = new WebSocket(`${base.replace('http', 'ws')}/api/ws?ticket=forged.1.x`);
    const code = await new Promise<number>((r) => (bad.onclose = (e) => r(e.code)));
    expect(code).toBe(4401);
    sb.ws.close();
    so.ws.close();
  });

  it('a removed member stops receiving that group immediately', async () => {
    const a = await signIn('a2@example.com');
    const c = await signIn('c2@example.com');
    const g = await a.call('POST', '/groups', { templateId: 'work', name: 'Team 2', lang: 'en' });
    await c.call('POST', `/invites/${g.invite.code}/join`, {});
    const sc = socket((await c.call('POST', '/ws-ticket')).ticket);
    await sc.next((m) => m.type === 'ready');
    const me = await c.call('GET', '/me');
    await a.call('DELETE', `/groups/${g.group.id}/members/${me.id}`);
    await sc.next((m) => m.type === 'membership' && m.groupId === g.group.id);
    await new Promise((r) => setTimeout(r, 100));
    const before = sc.messages.length;
    await a.call('POST', `/groups/${g.group.id}/tasks`, { title: 'secret' });
    await new Promise((r) => setTimeout(r, 300));
    expect(sc.messages.slice(before).filter((m) => m.groupId === g.group.id && m.type === 'invalidate')).toEqual([]);
    sc.ws.close();
  });
});

describe('realtime after creating a group', () => {
  it('the creator’s already-open socket hears the new group', async () => {
    const a = await signIn('creator@example.com');
    const sa = socket((await a.call('POST', '/ws-ticket')).ticket);
    await sa.next((m) => m.type === 'ready');
    const g = await a.call('POST', '/groups', { templateId: 'work', name: 'Fresh', lang: 'en' });
    await sa.next((m) => m.type === 'membership' && m.groupId === g.group.id);
    await new Promise((r) => setTimeout(r, 100));
    await a.call('POST', `/groups/${g.group.id}/tasks`, { title: 'First' });
    await sa.next((m) => m.type === 'invalidate' && m.groupId === g.group.id);
    sa.ws.close();
  });
});
