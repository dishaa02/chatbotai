
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { SidebarProvider } from '@/components/ui/sidebar';

const Index = () => {
  const [currentChatId, setCurrentChatId] = useState<string>('');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Sidebar 
          currentChatId={currentChatId}
          onChatSelect={setCurrentChatId}
        />
        <main className="flex-1 flex flex-col">
          <ChatInterface chatId={currentChatId} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
