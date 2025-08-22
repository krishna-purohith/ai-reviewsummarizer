import axios from 'axios';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiTelegram2Fill } from 'react-icons/ri';
import { Button } from '../ui/button';
import type { Message } from './Chats';
import TypingIndicator from './TypingIndicator';
import Chats from './Chats';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isTyping, setIsTyping] = useState(false);
   const [error, setError] = useState('');
   const chatId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsTyping(true);
         setError('');
         reset({ prompt: '' });
         const { data } = await axios.post<ChatResponse>('/api/c', {
            prompt: prompt,
            chatId: chatId.current,
         });
         console.log(data);
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
      } catch (error) {
         console.error(error);
         setError('Something went wrong, try again.');
      } finally {
         setIsTyping(false);
      }
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-4 mb-10 overflow-y-auto">
            <Chats messages={messages} />
            {isTyping && <TypingIndicator />}
            {error && <p className="text-red-500">{error}</p>}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })}
               autoFocus
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Prompt here"
               maxLength={250}
            />
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <RiTelegram2Fill />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
