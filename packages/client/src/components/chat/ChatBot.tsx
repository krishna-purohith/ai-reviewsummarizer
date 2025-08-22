import axios from 'axios';
import { useRef, useState } from 'react';
import type { Message } from './Chats';
import Chats from './Chats';
import type { ChatFormData } from './PromptForm';
import PromptForm from './PromptForm';
import TypingIndicator from './TypingIndicator';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

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
         popAudio.play();

         const { data } = await axios.post<ChatResponse>('/api/c', {
            prompt: prompt,
            chatId: chatId.current,
         });
         console.log(data);
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         notificationAudio.play();
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
