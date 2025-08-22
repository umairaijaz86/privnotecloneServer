/**
 * @jest-environment node
 */
import express from 'express';
import request from 'supertest';
import { validate } from '../../src/middleware/validate';
import { noteDto } from '../../src/dto/note.dto';

// minimal handler to test the middleware behavior
const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.post('/test', validate(noteDto), (req, res) => {
    res.json({ ok: true, data: req.body });
  });
  return app;
};

describe('validate middleware with noteDto', () => {
  it('rejects missing message with 400', async () => {
    const app = buildApp();
    const res = await request(app).post('/test').send({}).expect(400);
    expect(res.body.error).toBe('Validation failed');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('accepts valid payload and passes sanitized data', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/test')
      .send({ message: 'hello', expiresInMinutes: 5, extra: 'remove-me' })
      .expect(200);
    // zod returned only the declared fields
    expect(res.body.data).toEqual({ message: 'hello', expiresInMinutes: 5 });
  });
});
