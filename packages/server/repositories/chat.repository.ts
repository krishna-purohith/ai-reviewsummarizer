const chats = new Map<string, string>();

export const chatRepository = {
   getLastResponseId(chatId: string) {
      return chats.get(chatId);
   },

   setLastResponseId(chatId: string, responseId: string) {
      chats.set(chatId, responseId);
   },
};
