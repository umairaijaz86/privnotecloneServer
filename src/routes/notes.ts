import {Router, Request, Response} from 'express';
import {Note} from '../models/note';

const router = Router();

// POST /api/notes -> create new note
router.post('/', async (req: Request, res: Response) => {
    try {
        const { cipherText, iv, alg, expiresInMinutes  } = req.body;
        
        if (!cipherText || !iv || !alg ) {

            return res.status(400).json({ error: 'Missing required fields' });
        }

        const note = await Note.create({
            cipherText,
            iv,
            alg,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        });

        const host = req.headers['x-forwarded-host']?.toString() ||
                     req.headers.host || 
                     `localhost${process.env.PORT || 3000}`;
        const proto = req.headers['x-forwarded-proto'] || 'http';

        const url = `${proto}://${host}/notes/${note._id}`;

        return res.status(201).json({id:note.id.toString(), url});

    } catch (error) {   
        return res.status(500).json({ error: 'Could not create note' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const  { id } = req.params;
        const note = await Note.findOneAndDelete({ _id: id, hasBeenRead: false });

        if( !note ) {
            return res.status(404).json({ error: 'Note not found or has already been read' });
        }

        return res.json({
            cipherText: note.cipherText,
            iv: note.iv,
            alg: note.alg,
        });

    } catch (e){
        console.error(e);
        return res.status(500).json({ error: 'Could not retrieve note' });
    }

});

export default router;