import { z } from 'zod';

const EnvSchema = z.object({
  BALLDONTLIE_API_KEY: z.string().trim().min(1).optional(),
  CRON_SECRET: z.string().trim().min(32).optional(),
  OPENAI_API_KEY: z.string().trim().min(1).optional(),
  OPENAI_MODEL: z.string().trim().min(1).default('gpt-4o-mini'),
  OPENAI_DAILY_REQUEST_LIMIT: z.coerce.number().int().min(0).max(10000).default(250),
  OPENAI_TIMEOUT_MS: z.coerce.number().int().min(1000).max(30000).default(8000),
});

export type ServerEnv = z.infer<typeof EnvSchema>;

let cachedEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedEnv) return cachedEnv;

  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid server environment: ${parsed.error.issues.map(issue => issue.path.join('.')).join(', ')}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function requireCronSecret(): string {
  const { CRON_SECRET } = getServerEnv();
  if (!CRON_SECRET) {
    throw new Error('CRON_SECRET is required for cron endpoints');
  }
  return CRON_SECRET;
}

export function resetServerEnvForTests(): void {
  if (process.env.NODE_ENV === 'test') {
    cachedEnv = null;
  }
}
