import {Router, Request, Response} from 'express';
import {validate } from '../middleware/validate';
import { noteDto } from '../dto/note.dto';
import {createNote, readNoteOnce} from '../services/notes.service';
import { decryptMessage } from '../utils/crypto';

const router = Router();

// Route to create a new note, Validate the request body using Zod schema as middleware
router.post('/', validate(noteDto), async (req: Request, res: Response) => {
    try {
        // Create a new note using the request body
        const note = await createNote(req.body);
        // If note creation is successful, return the note ID and URL
        const host = req.headers["x-forwaded-host"] || req.headers.host || `localhost:${process.env.PORT }`;
        // Use x-forwarded-proto header or req.protocol to determine the protocol
        const proto = (req.headers["x-forwarded-proto"] || req.protocol ) as string || 'http';
        // Return the note ID and URL in the response
        return res.status(201).json({ id:note.id, url: `${proto}://${host}/notes/${note.id.toString()}`});


    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Could not create note' });
    }
});

// Route to read a note by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const  { id } = req.params;
        // read the note once
        const note = await readNoteOnce(id);
        // If note is not found or has already been read, return 404
        if( !note ) {
            return res.status(404).json({ error: 'Note not found or has already been read' });
        }

        // Decrypt the message using the IV stored in the note
        const plainText = decryptMessage(note.message, note.iv);
        
        return res.json({
            message: plainText
        });

    } catch (e){
        // If anything fails, return 500
        console.error('Read note error:',e);
        return res.status(500).json({ error: 'Could not retrieve note' });
    }

});

export default router;