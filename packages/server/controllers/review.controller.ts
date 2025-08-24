import type { Request, Response } from 'express';
import { productRepository } from '../repositories/product.repository';
import { reviewService } from '../services/review.service';
import { reviewRepository } from '../repositories/review.repository';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid Product ID.' });
         return;
      }

      const product = await productRepository.getProduct(productId);
      if (!product) {
         res.status(400).json({ error: 'Product doesnot exist.' });
      }

      const reviews = await reviewRepository.getReviews(productId);
      const summary = await reviewRepository.getSummary(productId);

      res.json({ reviews, summary });

      res.status(500).json({ error: 'Internal server occured. Try again!' });
   },

   async summarizeReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product Id.' });
         return;
      }

      const product = await productRepository.getProduct(productId);
      if (!product) {
         res.status(400).json({ error: 'Enter a valid product Id.' });
         return;
      }

      const productReviews = await reviewRepository.getReviews(productId, 1);

      if (!productReviews.length) {
         res.status(400).json({
            message: "The product doesn't have any reviews yet!!",
         });
         return;
      }

      const summary = await reviewService.summarizeReviews(productId);

      res.json({ summary });
   },
};
