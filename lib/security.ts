import type { NextRequest } from 'next/server';

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface LimitRecord {
  count: number;
  resetAt: number;
}

const rateLimits = new Map<string, LimitRecord>();
const dailyQuotas = new Map<string, LimitRecord>();

function pruneExpired(store: Map<string, LimitRecord>, now: number): void {
  if (store.size < 5000) return;
  for (const [key, value] of Array.from(store.entries())) {
    if (value.resetAt <= now) store.delete(key);
  }
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || req.headers.get('x-real-ip') || 'unknown';
}

export function checkRateLimit(key: string, options: RateLimitOptions): { allowed: true } | { allowed: false; retryAfter: number } {
  const now = Date.now();
  pruneExpired(rateLimits, now);

  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true };
  }

  if (current.count >= options.limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }

  current.count += 1;
  return { allowed: true };
}

export function checkDailyQuota(key: string, limit: number): { allowed: true } | { allowed: false; retryAfter: number } {
  if (limit === 0) return { allowed: false, retryAfter: 86400 };

  const now = Date.now();
  pruneExpired(dailyQuotas, now);

  const current = dailyQuotas.get(key);
  if (!current || current.resetAt <= now) {
    dailyQuotas.set(key, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
    return { allowed: true };
  }

  if (current.count >= limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }

  current.count += 1;
  return { allowed: true };
}

export async function fetchWithTimeout(
  input: string | URL | Request,
  init: (RequestInit & { next?: { revalidate?: number } }) = {},
  timeoutMs = 5000
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}
