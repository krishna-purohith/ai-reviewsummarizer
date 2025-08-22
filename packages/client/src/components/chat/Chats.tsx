import { useEffect, useRef } from 'react';
import ReactMarkDown from 'react-markdown';

export type Message = {
   role: 'user' | 'bot';
   content: string;
};

type Props = {
   messages: Message[];
};

const Chats = ({ messages }: Props) => {
   const lastMessageRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onCopyHandler = (e: React.ClipboardEvent) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };
   return (
      <div className="flex flex-col gap-3">
         {messages.map((message, index) => (
            <div
               key={index}
               ref={index === messages.length - 1 ? lastMessageRef : null}
               onCopy={onCopyHandler}
               className={`
                     px-3 py-1 rounded-xl max-w-md
                     ${message.role === 'user' ? 'bg-indigo-500 text-white self-end' : 'bg-slate-200 text-slate-900 self-start'}`}
            >
               <ReactMarkDown>{message.content}</ReactMarkDown>
            </div>
         ))}
      </div>
   );
};

export default Chats;
