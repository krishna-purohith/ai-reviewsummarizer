import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';

const router = express.Router();

router.post('/api/c', chatController.sendMessage);

router.get('/', (req: Request, res: Response) => {
   res.send('krishna is creating a new aiproject');
});

router.get('/api/ai', (req: Request, res: Response) => {
   res.json({ message: 'Server is responding from /api/ai' });
});

export default router;
