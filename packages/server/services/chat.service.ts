import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { chatRepository } from '../repositories/chat.repository';
import template from '../prompts/chatbot.txt';

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);

const instructions = template.replace('{{parkInfo}}', parkInfo);

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
         instructions,
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 100,
         previous_response_id: chatRepository.getLastResponseId(chatId),
      });

      chatRepository.setLastResponseId(chatId, response.id);

      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
