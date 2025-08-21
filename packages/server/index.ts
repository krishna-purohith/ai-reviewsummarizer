import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';

dotenv.config();

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const chats = new Map<string, string>();

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
      const response = await client.responses.create({
         model: 'gpt-4o-mini!',
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 30,
         previous_response_id: chats.get(chatId),
      });

      chats.set(chatId, response.id);

      res.json({
         message: response.output_text,
         id: chats.get(chatId),
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
