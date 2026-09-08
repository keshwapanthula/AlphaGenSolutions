import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import app from '../app.js';

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.AI_PROVIDER;
  delete process.env.AI_ENDPOINT;
  delete process.env.AI_MODEL;
  delete process.env.AI_API_KEY;
});

describe('AI agents API', () => {
  it('lists project agents', async () => {
    const res = await request(app).get('/api/ai/agents');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.agents).toHaveLength(3);
    expect(res.body.agents.map((agent) => agent.id)).toEqual([
      'site-concierge',
      'employee-copilot',
      'supervisor-copilot'
    ]);
  });

  it('returns a contextual response for the selected agent', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ agentId: 'employee-copilot', message: 'How do I submit my timesheet hours?' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.provider).toBe('local-rules');
    expect(res.body.agent.id).toBe('employee-copilot');
    expect(res.body.reply).toContain('weekly timesheet');
    expect(res.body.suggestions.length).toBeGreaterThan(0);
  });

  it('uses a configured OpenAI-compatible provider when available', async () => {
    process.env.AI_PROVIDER = 'openai-compatible';
    process.env.AI_ENDPOINT = 'https://example.test/chat/completions';
    process.env.AI_MODEL = 'test-model';
    process.env.AI_API_KEY = 'test-key';

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: 'Remote AI answer' } }] })
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await request(app)
      .post('/api/ai/chat')
      .send({ agentId: 'site-concierge', message: 'Tell me about services' });

    expect(res.status).toBe(200);
    expect(res.body.provider).toBe('openai-compatible');
    expect(res.body.reply).toBe('Remote AI answer');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.test/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-key' })
      })
    );
  });

  it('validates unknown agents and empty messages', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ agentId: 'unknown-agent', message: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'agentId' }),
        expect.objectContaining({ field: 'message' })
      ])
    );
  });
});
