//DTO created to keep seperation of concern 
// Zod to help sanitize and validate the data before it reaches the controller
import { z } from 'zod';

// DTO for creating a note, with validation. 
export const noteDto = z.object({
    message: z.string().min(1, 'Cipher text is required'),
    expiresInMinutes: z.number().optional(),
});

//This type is inferred from the CreateNoteDto schema.
export type noteDto = z.infer<typeof noteDto>;