import fs from 'fs';
import path from 'path';
import { chatRepository } from '../repositories/chat.repository';
import template from '../prompts/chatbot.txt';
import { llmClient } from '../llm/client';

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);

const instructions = template.replace('{{parkInfo}}', parkInfo);

type ChatResponse = {
   id: string;
   message: string;
};

export const chatService = {
   async sendMessage(prompt: string, chatId: string): Promise<ChatResponse> {
      const response = await llmClient.callLLM({
         model: 'gpt-4o-mini',
         instructions,
         prompt,
         temperature: 0.2,
         maxTokens: 100,
         previousResponseId: chatRepository.getLastResponseId(chatId),
      });

      chatRepository.setLastResponseId(chatId, response.id);

      return {
         id: response.id,
         message: response.llmOutput,
      };
   },
};
