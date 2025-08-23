import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid Product ID.' });
         return;
      }
      try {
         const reviews = await reviewService.getReviews(productId);

         res.json(reviews);
      } catch (error) {
         res.status(500).json({ error: 'Internal server occured. Try again!' });
      }
   },

   async summarizeReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product Id.' });
         return;
      }

      const summary = await reviewService.summarizeReviews(productId);

      res.json({ summary });
   },
};
