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
   const [error, setError] = useState('');
   const lastMessageRef = useRef<HTMLDivElement | null>(null);
   const chatId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

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

   const onCopyHandler = (e: React.ClipboardEvent) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };
   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-4 mb-10 overflow-y-auto">
            {messages.map((message, index) => (
               <div
                  key={index}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                  onCopy={onCopyHandler}
                  className={`
                     px-3 py-1 rounded-4xl
                     ${message.role === 'user' ? 'bg-indigo-500 text-white self-end' : 'bg-slate-200 text-slate-900 self-start'}`}
               >
                  <ReactMarkDown>{message.content}</ReactMarkDown>
               </div>
            ))}
            {isTyping && (
               <div className="flex gap-1 px-3 py-3 bg-gray-100 self-start rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animate-delay:0.4s]"></div>
               </div>
            )}
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
