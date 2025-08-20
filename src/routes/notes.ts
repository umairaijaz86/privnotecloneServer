import {Router, Request, Response} from 'express';
import {validate } from '../middleware/validate';
import { noteDto } from '../dto/note.dto';
import {createNote, readNoteOnce} from '../services/notes.service';

const router = Router();

router.post('/', validate(noteDto), async (req: Request, res: Response) => {
    try {

        //TODO: Add Encryption Logic

        const note = await createNote(req.body);

        const host = req.headers["x-forwaded-host"] || req.headers.host || `localhost:${process.env.PORT || 3000}`;
        const proto = (req.headers["x-forwarded-proto"] || req.protocol ) as string || 'http';

        return res.status(201).json({ id:note.id, url: `${proto}://${host}/notes/${note.id.toString()}`});


    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Could not create note' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const  { id } = req.params;
        
        const note = await readNoteOnce(id);

        if( !note ) {
            return res.status(404).json({ error: 'Note not found or has already been read' });
        }

        //TODO: Add Decryption Logic
        const plainText = note.cipherText;

        return res.json({
            cipherText: plainText
        });

    } catch (e){
        console.error(e);
        return res.status(500).json({ error: 'Could not retrieve note' });
    }

});

export default router;