import { llmClient } from '../llm/client';
// import template from '../llmprompts/summarize-reviews.txt';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async summarizeReviews(productId: number): Promise<string> {
      const existingSummary = await reviewRepository.getSummary(productId);
      if (existingSummary) return existingSummary;

      const reviews = await reviewRepository.getReviews(productId, 10);

      const combinedReviews = reviews.map((r) => r.content).join('\n\n');

      // const prompt = template.replace('{{reviews}}', combinedReviews);

      // const { llmOutput } = await llmClient.callLLM({
      //    model: 'gpt-4o-mini',
      //    prompt,
      //    temperature: 0.2,
      //    maxTokens: 300,
      // });

      // const summary = await llmClient.callOpenllm(prompt);

      // return summary;

      const summary = await llmClient.summarizeUsingOpenModels(combinedReviews);
      reviewRepository.storeSummary(productId, summary);
      return summary;
   },
};
