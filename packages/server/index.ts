import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import z from 'zod';
import { chatRepository } from './repositories/chat.repository';
import { chatService } from './services/chat.service';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is neccessary.')
      .max(100, 'Message is to long. Maximum 100 charecters.'),
   chatId: z.uuid(),
});

app.post('/api/c', async (req: Request, res: Response) => {
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
});

app.get('/', (req: Request, res: Response) => {
   res.send('krishna is creating a new aiproject');
});

app.get('/api/ai', (req: Request, res: Response) => {
   res.json({ message: 'Server is responding from /api/ai' });
});

app.listen(port, () =>
   console.log('aiproject app started listening on port: ', port)
);
