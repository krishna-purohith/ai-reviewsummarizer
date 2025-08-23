import type { Request, Response } from 'express';
import express from 'express';
import { chatController } from './controllers/chat.controller';
import { reviewController } from './controllers/review.controller';

const router = express.Router();

router.post('/api/c', chatController.sendMessage);

router.get('/', (req: Request, res: Response) => {
   res.send('krishna is creating a new aiproject');
});

router.get('/api/ai', (req: Request, res: Response) => {
   res.json({ message: 'Server is responding from /api/ai' });
});

router.get('/api/products/:id/reviews', reviewController.getReviews);

router.post(
   '/api/products/:id/reviews/summarize',
   reviewController.summarizeReviews
);

export default router;
