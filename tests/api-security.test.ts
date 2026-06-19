import { describe, expect, it } from 'vitest';
import type { NextRequest } from 'next/server';
import { GET as cronGet } from '../app/api/cron/nba-refresh/route';
import { POST as simulatePost } from '../app/api/simulate/route';
import { resetServerEnvForTests } from '../lib/serverEnv';

function request(url: string, init?: RequestInit): NextRequest {
  return new Request(url, init) as unknown as NextRequest;
}

describe('API security controls', () => {
  it('fails the cron endpoint closed when CRON_SECRET is missing', async () => {
    const previousSecret = process.env.CRON_SECRET;
    delete process.env.CRON_SECRET;
    resetServerEnvForTests();

    const response = await cronGet(request('http://localhost/api/cron/nba-refresh'));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'Cron endpoint is not configured' });

    if (previousSecret) process.env.CRON_SECRET = previousSecret;
    resetServerEnvForTests();
  });

  it('rejects simulate payloads with unexpected fields and unsupported sports', async () => {
    const response = await simulatePost(request('http://localhost/api/simulate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        sport: 'nfl',
        mode: 'combined',
        is_admin: true,
        slots: [],
      }),
    }));

    expect(response.status).toBe(400);
  });
});
