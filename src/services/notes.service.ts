//Note Service 

import  {Note} from '../models/note';
import { noteDto } from '../dto/note.dto';
import { expiresAtFromMinutes } from '../utils/time';
import { encryptMessage } from '../utils/crypto';
import dotenv from 'dotenv';

// Create a new note in the database
export const createNote = async (dto: noteDto) => {
    // Validate the input data
    const {message, expiresInMinutes = parseInt(process.env.DEFAULT_EXPIRY_MINUTES as string, 10)} = dto;
    
    const { cipherTextB64, ivB64, alg } = encryptMessage(message);
    // create a note
    const note = await Note.create({
        message: cipherTextB64,
        iv: ivB64,
        alg,
        expiresAt: expiresAtFromMinutes(expiresInMinutes)
    });
    //return back the note
    return note;
};

// Read a note once and delete it from the database
export const readNoteOnce = async (id: string) => { 
    return Note.findOneAndDelete({_id: id});
};

