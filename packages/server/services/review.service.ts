import { type Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);

      const allReviews = reviews.map((r) => r.content).join('\n\n');

      const prompt = `Summarize all the below reviews of the product into a short paragraph highlighting key themes, both positive and negative.
            ${allReviews}
         `;

      const response = await llmClient.callLLM({
         model: 'gpt-4o-mini',
         prompt,
         temperature: 0.2,
         maxTokens: 300,
      });

      return response.llmOutput;
   },
};
