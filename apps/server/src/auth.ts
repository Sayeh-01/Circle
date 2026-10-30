import { expo } from '@better-auth/expo';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP } from 'better-auth/plugins';
import * as schema from './db/schema';
import type { DB } from './db/client';
import type { Env } from './deps';
import type { Mailer } from './mailer';

export function createAuth(db: DB, env: Env, mailer: Mailer) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      usePlural: true,
      schema: { users: schema.users, sessions: schema.sessions, accounts: schema.accounts, verifications: schema.verifications },
    }),
    secret: env.authSecret,
    baseURL: env.publicUrl,
    basePath: '/api/auth',
    trustedOrigins: env.trustedOrigins,
    rateLimit: { enabled: env.nodeEnv === 'production' },
    session: { expiresIn: 60 * 60 * 24 * 60, updateAge: 60 * 60 * 24 },
    user: {
      additionalFields: {
        language: { type: 'string', defaultValue: 'en', input: false },
        digits: { type: 'string', defaultValue: 'latn', input: false },
        timezone: { type: 'string', defaultValue: 'Africa/Cairo', input: false },
      },
    },
    socialProviders: {
      ...(env.google ? { google: env.google } : {}),
      ...(env.apple ? { apple: env.apple } : {}),
    },
    plugins: [
      emailOTP({
        otpLength: 6,
        expiresIn: 600,
        async sendVerificationOTP({ email, otp }) {
          await mailer.sendOtp(email, otp);
        },
      }),
      expo(),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
