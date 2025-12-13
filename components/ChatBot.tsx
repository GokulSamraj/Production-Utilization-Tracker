import React, { useState, useRef, useEffect } from 'react';
import { generateInsights } from '../services/geminiService';
import { ProductionRecord, ChatMessage } from '../types';
import { MessageCircle, X, Send, Bot, User as UserIcon, Loader } from 'lucide-react';

interface ChatBotProps {
  records: ProductionRecord[];
}

export const ChatBot: React.FC<ChatBotProps> = ({ records }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello Admin. I have analyzed the team data. Ask me anything about production or utilization.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateInsights(input, records);
    
    const modelMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="glass rounded-2xl shadow-2xl border border-mac-border w-96 h-[500px] mb-4 flex flex-col overflow-hidden animate-fade-in-up origin-bottom-right">
          <div className="bg-mac-surface/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-mac-border">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Bot size={20} className="text-mac-accent" />
              AI Analyst
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-mac-bg/50 scrollbar-thin scrollbar-thumb-gray-700" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-mac-accent' : 'bg-gray-700'}`}>
                      {msg.role === 'user' ? <UserIcon size={12} className="text-white"/> : <Bot size={12} className="text-white"/>}
                   </div>
                   <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                     msg.role === 'user' 
                     ? 'bg-mac-accent text-white rounded-br-none' 
                     : 'bg-mac-surface border border-mac-border text-gray-200 rounded-bl-none'
                   }`}>
                    {msg.text}
                   </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-end gap-2">
                   <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                      <Bot size={12} className="text-white"/>
                   </div>
                   <div className="bg-mac-surface border border-mac-border p-3 rounded-2xl rounded-bl-none">
                      <Loader size={16} className="animate-spin text-gray-400" />
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-mac-surface/50 border-t border-mac-border flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about team utilization..."
              className="flex-1 bg-mac-bg border border-mac-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mac-accent placeholder-gray-600"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-mac-accent text-white p-2 rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-mac-accent hover:bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-110 flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};