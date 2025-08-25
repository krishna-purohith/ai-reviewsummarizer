import OpenAI from 'openai';

const openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
import { InferenceClient } from '@huggingface/inference';
const inferenceClient = new InferenceClient(process.env.HF_TOKEN);
import summarizeInstructionPrompt from '../llm/prompts/summarize-reviews.txt';

type llmOutputType = {
   id: string;
   llmOutput: string;
};

type GenerateTextOptions = {
   model?: string;
   prompt: string;
   instructions?: string;
   temperature?: number;
   maxTokens?: number;
   previousResponseId?: string;
};

export const llmClient = {
   async callLLM({
      model = 'gpt-40-mini',
      prompt,
      instructions,
      temperature = 0.2,
      maxTokens = 200,
      previousResponseId,
   }: GenerateTextOptions): Promise<llmOutputType> {
      const response = await openAIClient.responses.create({
         model,
         input: prompt,
         instructions,
         temperature,
         max_output_tokens: maxTokens,
         previous_response_id: previousResponseId,
      });
      return { id: response.id, llmOutput: response.output_text };
   },

   async summarizeUsingOpenModels(reviewsToSummarize: string) {
      const chatCompletion = await inferenceClient.chatCompletion({
         provider: 'sambanova',
         model: 'meta-llama/Llama-3.1-8B-Instruct',
         messages: [
            {
               role: 'system',
               content: summarizeInstructionPrompt,
            },
            {
               role: 'user',
               content: reviewsToSummarize,
            },
         ],
      });
      return chatCompletion.choices[0]?.message.content || '';
   },
};
