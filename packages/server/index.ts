import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import express from 'express';
import { chatController } from './controllers/chat.controller';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.post('/api/c', chatController.sendMessage);

app.get('/', (req: Request, res: Response) => {
   res.send('krishna is creating a new aiproject');
});

app.get('/api/ai', (req: Request, res: Response) => {
   res.json({ message: 'Server is responding from /api/ai' });
});

app.listen(port, () =>
   console.log('aiproject app started listening on port: ', port)
);
