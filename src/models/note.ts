import mongoose, {Document, Schema} from 'mongoose';
import { Interface } from 'readline';

// Notes interface 
export interface INote extends Document {
    cipherText: string;
    iv: string;
    alg: string;
    hasBeenRead: boolean;
    createdAt: Date;    
    expiresAt: Date;
}

// Schema for Notes based on the interface
const NotesSchema: Schema = new Schema<INote>({
    cipherText: { type: String, required: true},
    iv: { type: String, required: true },
    alg: { type: String, required: true},
    hasBeenRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
});
// TTL Index to auto delete notes at expiration date passed
NotesSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for sorting and fetching 
NotesSchema.index({ createdAt: 1 });

// Export note

export const Note = mongoose.model<INote>('Note', NotesSchema);