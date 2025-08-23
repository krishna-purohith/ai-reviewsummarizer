import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';
import { chatRepository } from '../repositories/chat.repository';

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is neccessary.')
      .max(100, 'Message is to long. Maximum 100 charecters.'),
   chatId: z.uuid(),
});

export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const validate = chatSchema.safeParse(req.body);
      if (!validate.success)
         return res.status(400).json(z.treeifyError(validate.error));

      try {
         const { prompt, chatId } = req.body;

         const response = await chatService.sendMessage(prompt, chatId);

         res.json({
            message: response.message,
            id: chatRepository.getLastResponseId(chatId),
         });
      } catch (error) {
         res.status(500).json({
            error: 'Internal server Error, Try after sometime.',
         });
      }
   },
};
