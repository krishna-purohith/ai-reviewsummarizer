import axios from 'axios';
import { useRef, useState } from 'react';
import type { Message } from './Chats';
import Chats from './Chats';
import type { ChatFormData } from './PromptForm';
import PromptForm from './PromptForm';
import TypingIndicator from './TypingIndicator';

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isTyping, setIsTyping] = useState(false);
   const [error, setError] = useState('');
   const chatId = useRef(crypto.randomUUID());

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsTyping(true);
         setError('');
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

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-4 mb-10 overflow-y-auto">
            <Chats messages={messages} />
            {isTyping && <TypingIndicator />}
            {error && <p className="text-red-500">{error}</p>}
         </div>
         <PromptForm onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
