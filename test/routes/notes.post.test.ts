/**
 * @jest-environment node
 */
import * as NotesService from '../../src/services/notes.service';
import { Note } from '../../src/models/note';

// Mock Mongoose model methods we call
jest.mock('../../src/models/Note', () => ({
  Note: {
    create: jest.fn(),
    findOneAndDelete: jest.fn()
  }
}));

// Mock crypto util so we don't depend on env/real crypto
jest.mock('../../src/utils/crypto', () => ({
  encryptMessage: (plaintext: string) => ({
    cipherTextB64: Buffer.from(`enc:${plaintext}`).toString('base64'),
    ivB64: Buffer.from('fake-iv').toString('base64'),
    alg: 'AES-256-GCM'
  })
}));

describe('NotesService', () => {
  afterEach(() => jest.clearAllMocks());

  it('createNote: generates iv/alg internally, computes expiresAt, saves a note', async () => {
    const saved = { _id: 'abc123', cipherText: '...', iv: '...', alg: 'AES-256-GCM' };
    (Note.create as jest.Mock).mockResolvedValue(saved);

    const result = await NotesService.createNote({ message: 'hello', expiresInMinutes: 5 } as any);

    expect(Note.create).toHaveBeenCalledTimes(1);
    const arg = (Note.create as jest.Mock).mock.calls[0][0];
    expect(typeof arg.cipherText).toBe('string');
    expect(typeof arg.iv).toBe('string');
    expect(arg.alg).toBe('AES-256-GCM');
    expect(arg.expiresAt instanceof Date).toBe(true);
    expect(result).toBe(saved);
  });

  it('readNoteOnce: returns null when not found', async () => {
    (Note.findOneAndDelete as jest.Mock).mockResolvedValue(null);
    const result = await NotesService.readNoteOnce('missing');
    expect(Note.findOneAndDelete).toHaveBeenCalledWith({ _id: 'missing' });
    expect(result).toBeNull();
  });

  it('readNoteOnce: returns the note when found', async () => {
    const doc = { _id: 'xyz', cipherText: 'C', iv: 'I', alg: 'AES-256-GCM' };
    (Note.findOneAndDelete as jest.Mock).mockResolvedValue(doc);
    const result = await NotesService.readNoteOnce('xyz');
    expect(result).toBe(doc);
  });
});
