import axios from 'axios';
import { useForm } from 'react-hook-form';
import { RiTelegram2Fill } from 'react-icons/ri';
import { Button } from './ui/button';
import { useRef, useState } from 'react';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

type Message = {
   role: 'user' | 'bot';
   content: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const chatId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      reset();
      const { data } = await axios.post<ChatResponse>('/api/c', {
         prompt: prompt,
         chatId: chatId.current,
      });
      console.log(data);
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };
   return (
      <div>
         <div className="flex flex-col gap-4 mb-10">
            {messages.map((message, index) => (
               <p
                  key={index}
                  className={`
                     px-3 py-1 rounded-4xl
                     ${message.role === 'user' ? 'bg-indigo-500 text-white self-end' : 'bg-slate-200 text-slate-900 self-start'}`}
               >
                  {message.content}
               </p>
            ))}
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
