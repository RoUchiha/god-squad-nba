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

    expect(response.status).toBe(503);
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

  it('rejects cross-site simulation requests', async () => {
    const response = await simulatePost(request('https://game.example/api/simulate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://attacker.example' },
      body: '{}',
    }));

    expect(response.status).toBe(403);
  });

  it('accepts same-origin requests using the forwarded host authority', async () => {
    const response = await simulatePost(request('http://localhost/api/simulate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://game.example',
        'x-forwarded-host': 'game.example',
        'x-forwarded-proto': 'https',
      },
      body: '{}',
    }));

    expect(response.status).toBe(400);
  });

  it('rejects oversized simulation bodies before parsing them', async () => {
    const response = await simulatePost(request('http://localhost/api/simulate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'content-length': '70000' },
      body: '{}',
    }));

    expect(response.status).toBe(413);
  });
});
