import OpenAI from 'openai';
import { chatRepository } from '../repositories/chat.repository';

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

type ChatResponse = {
   id: string;
   message: string;
};

export const chatService = {
   async sendMessage(prompt: string, chatId: string): Promise<ChatResponse> {
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 30,
         previous_response_id: chatRepository.getLastResponseId(chatId),
      });

      chatRepository.setLastResponseId(chatId, response.id);

      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
