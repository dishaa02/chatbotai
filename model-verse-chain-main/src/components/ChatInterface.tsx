
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Link2, Paperclip, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModelSelector } from '@/components/ModelSelector';
import { ChainToggle } from '@/components/ChainToggle';
import { CopyButton } from '@/components/CopyButton';
import { UserProfile } from '@/components/UserProfile';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  model?: string;
  timestamp: Date;
  isChained?: boolean;
}

interface ChatInterfaceProps {
  chatId: string;
}

export const ChatInterface = ({ chatId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('mistral-7b-instruct');
  const [isChaining, setIsChaining] = useState(false);
  const [chainModels, setChainModels] = useState(['mistral-7b-instruct', 'deepseek-chat']);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateResponse = async (prompt: string, model: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = {
      // Chat / QA Models
      'mistral-7b-instruct': `Mistral 7B Instruct Response: I understand you're asking about "${prompt}". This is a fast and efficient response from Mistral's instruction-tuned model with clear explanations...`,
      'kimi-72b': `Kimi 72B Response: Thank you for your question about "${prompt}". As a large-scale model, I can provide comprehensive analysis with deep understanding...`,
      'cypher-alpha': `Cypher Alpha Response: Analyzing your query "${prompt}" with advanced reasoning capabilities and sophisticated problem-solving approaches...`,
      'qwen3-14b': `Qwen3 14B Response: Processing your request about "${prompt}" with balanced performance and reliable insights...`,
      'qwen3-30b-a3b': `Qwen3 30B A3B Response: As a high-capacity model, I can provide detailed analysis of "${prompt}" with extensive knowledge and nuanced understanding...`,
      // Coding Models
      'deepseek-chat': `DeepSeek Chat Response: For your coding-related question "${prompt}", I can provide specialized assistance with code generation, debugging, and best practices...`,
      'dolphin3.0-r1': `Dolphin 3.0 R1 Response: As a code generation expert, I can help you with "${prompt}" by providing efficient, well-structured code solutions...`,
      'chimera': `Chimera Response: With multi-modal coding capabilities, I can assist with "${prompt}" through various programming paradigms and approaches...`,
      'qwen3-8b': `Qwen3 8B Response: For your coding query "${prompt}", I can provide efficient solutions with optimized performance...`,
      // Multilingual / Indian Models
      'sarvam-m': `Sarvam M Response: For your question "${prompt}", I can provide support in Indian languages with cultural context and local understanding...`,
      'glm-z1': `GLM Z1 Response: Processing your multilingual query "${prompt}" with cross-language understanding and translation capabilities...`,
      // Experimental Models
      'llama-4-maverick': `Llama 4 Maverick Response: As an experimental model, I can explore "${prompt}" with cutting-edge features and innovative approaches...`,
      'mai-ds-r1': `MAI DS R1 Response: For your research question "${prompt}", I can provide experimental insights and novel perspectives...`
    };
    
    return responses[model as keyof typeof responses] || `${model} Response: ${prompt}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    let messageContent = input;
    if (uploadedFiles.length > 0) {
      messageContent += `\n\nAttached files: ${uploadedFiles.map(f => f.name).join(', ')}`;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedFiles([]);
    setIsLoading(true);

    try {
      if (isChaining) {
        let currentInput = input;
        
        for (let i = 0; i < chainModels.length; i++) {
          const model = chainModels[i];
          const response = await simulateResponse(currentInput, model);
          
          const botMessage: Message = {
            id: `${Date.now()}-${i}`,
            content: response,
            isUser: false,
            model: model,
            timestamp: new Date(),
            isChained: true
          };
          
          setMessages(prev => [...prev, botMessage]);
          currentInput = response;
          
          if (i < chainModels.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      } else {
        const response = await simulateResponse(input, selectedModel);
        const botMessage: Message = {
          id: `${Date.now()}-single`,
          content: response,
          isUser: false,
          model: selectedModel,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-sm p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            AI Assistant Pro
          </h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-slate-400 border-slate-600 bg-slate-800/50">
              {isChaining ? `Chain: ${chainModels.join(' → ')}` : selectedModel}
            </Badge>
            <UserProfile />
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-200 mb-4">
                Welcome to AI Assistant Pro
              </h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Start a conversation, upload files, or enable chain mode to connect multiple AI models for enhanced responses
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-4xl ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.isUser 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                }`}>
                  {message.isUser ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                </div>
                
                {/* Message Content */}
                <div className={`rounded-2xl px-6 py-4 shadow-lg ${
                  message.isUser
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-slate-800/80 text-slate-100 border border-slate-700/50 backdrop-blur-sm'
                }`}>
                  {!message.isUser && message.model && (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300 border-slate-600">
                          {message.model}
                        </Badge>
                        {message.isChained && (
                          <Link2 className="h-3 w-3 text-emerald-400" />
                        )}
                      </div>
                      <CopyButton text={message.content} />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="flex gap-4 max-w-4xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-slate-800/80 rounded-2xl px-6 py-4 border border-slate-700/50 backdrop-blur-sm shadow-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-slate-700/50 bg-slate-900/30 backdrop-blur-sm p-6 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* File Upload Area */}
          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-600">
                  {file.type.startsWith('image/') ? (
                    <Image className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <FileText className="h-4 w-4 text-emerald-400" />
                  )}
                  <span className="text-sm text-slate-300 truncate max-w-32">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-slate-400 hover:text-red-400 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              disabled={isChaining}
            />
            <ChainToggle
              isChaining={isChaining}
              onToggle={setIsChaining}
              chainModels={chainModels}
              onChainModelsChange={setChainModels}
            />
          </div>
          
          {/* Input */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isChaining ? "Enter your prompt for model chaining..." : "Type your message..."}
                className="min-h-[80px] max-h-40 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 resize-none pr-20 rounded-2xl shadow-lg backdrop-blur-sm focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleSend}
              disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 h-[80px] px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <Input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};
