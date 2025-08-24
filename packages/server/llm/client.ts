import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
      const response = await client.responses.create({
         model,
         input: prompt,
         instructions,
         temperature,
         max_output_tokens: maxTokens,
         previous_response_id: previousResponseId,
      });
      return { id: response.id, llmOutput: response.output_text };
   },
};
