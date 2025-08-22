/**
 * @jest-environment node
 */
import express from 'express';
import request from 'supertest';
import notesRouter from '../../src/routes/notes';
import { Note } from '../../src/models/note';

jest.mock('../../src/models/Note', () => ({
  Note: {
    findOneAndDelete: jest.fn()
  }
}));

jest.mock('../../src/utils/crypto', () => ({
  decryptMessage: () => 'decrypted message'
}));

function appFactory() {
  const app = express();
  app.use(express.json());
  app.use('/api/notes', notesRouter);
  return app;
}

describe('GET /api/notes/:id', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns plaintext on first read and 404 on subsequent read', async () => {
    const app = appFactory();

    // first read returns a note
    (Note.findOneAndDelete as jest.Mock).mockResolvedValueOnce({
      _id: 'n1',
      cipherText: 'BASE64_CIPHERTEXT',
      iv: 'BASE64_IV',
      alg: 'AES-256-GCM'
    });

    const first = await request(app).get('/api/notes/n1').expect(200);
    expect(first.body).toEqual({ message: 'decrypted message' });

    // second read returns null
    (Note.findOneAndDelete as jest.Mock).mockResolvedValueOnce(null);

    const second = await request(app).get('/api/notes/n1').expect(404);
    expect(second.body).toHaveProperty('error');
  });
});
