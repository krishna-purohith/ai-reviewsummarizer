import axios from 'axios';
import { useForm } from 'react-hook-form';
import { RiTelegram2Fill } from 'react-icons/ri';
import ReactMarkDown from 'react-markdown';
import { Button } from './ui/button';
import { useEffect, useRef, useState } from 'react';

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
   const [isTyping, setIsTyping] = useState(false);
   const formRef = useRef<HTMLFormElement | null>(null);
   const chatId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   useEffect(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsTyping(true);
      reset();
      const { data } = await axios.post<ChatResponse>('/api/c', {
         prompt: prompt,
         chatId: chatId.current,
      });
      console.log(data);
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
      setIsTyping(false);
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
                  <ReactMarkDown>{message.content}</ReactMarkDown>
               </p>
            ))}
            {isTyping && (
               <div className="flex gap-1 px-3 py-3 bg-gray-100 self-start rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animate-delay:0.4s]"></div>
               </div>
            )}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            ref={formRef}
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
