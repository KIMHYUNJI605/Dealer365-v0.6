import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, User, ChevronRight, Loader2 } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
}

const SUGGESTIONS = [
    "Check inventory for white X5",
    "Calculate lease for James Miller",
    "Show overdue tasks",
    "What is the CSI score today?"
];

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
      { id: '1', role: 'assistant', text: "Hello! I'm your Dealer365 Copilot. How can I assist you with sales or service today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (text: string = inputValue) => {
      if (!text.trim()) return;

      const newMsg: Message = { id: Date.now().toString(), role: 'user', text: text };
      setMessages(prev => [...prev, newMsg]);
      setInputValue('');
      setIsTyping(true);

      // Mock AI Response
      setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, { 
              id: (Date.now() + 1).toString(), 
              role: 'assistant', 
              text: `I've found information regarding "${text}". Would you like me to open the relevant record or summarize the data?` 
          }]);
      }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none font-sans">
        
        {/* Chat Window */}
        <div className={`
            mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-[360px] sm:w-[400px] 
            transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-right pointer-events-auto
            flex flex-col
            ${isOpen ? 'opacity-100 scale-100 translate-y-0 h-[600px]' : 'opacity-0 scale-90 translate-y-10 pointer-events-none h-0'}
        `}>
            {/* Header */}
            <div className="bg-[#1A1A1A] p-4 flex justify-between items-center text-white shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg">
                        <Sparkles size={16} className="text-white fill-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm leading-none">AI Copilot</h3>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center mt-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                            Online
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-full transition-colors text-gray-400 hover:text-white">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${msg.role === 'assistant' ? 'bg-white border-gray-100' : 'bg-gray-200 border-gray-300'}`}>
                            {msg.role === 'assistant' ? <Bot size={16} className="text-indigo-600" /> : <User size={16} className="text-gray-600" />}
                        </div>
                        <div className={`
                            p-3 rounded-2xl text-sm max-w-[80%] shadow-sm
                            ${msg.role === 'assistant' 
                                ? 'bg-white text-gray-700 border border-gray-100 rounded-tl-none' 
                                : 'bg-indigo-600 text-white rounded-tr-none'}
                        `}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                            <Bot size={16} className="text-indigo-600" />
                        </div>
                        <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1 items-center h-10">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions (only if few messages) */}
            {messages.length < 3 && !isTyping && (
                <div className="px-4 pb-2 bg-gray-50 flex flex-nowrap overflow-x-auto space-x-2 no-scrollbar">
                    {SUGGESTIONS.map((sugg, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleSend(sugg)}
                            className="whitespace-nowrap px-3 py-1.5 bg-white border border-indigo-100 rounded-full text-xs text-indigo-700 font-medium hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm mb-2"
                        >
                            {sugg}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <div className="relative flex items-center">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..." 
                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border-gray-200 focus:bg-white border focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all focus:ring-4 focus:ring-indigo-500/10"
                    />
                    <button 
                        onClick={() => handleSend()}
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                </div>
                <div className="text-[10px] text-center text-gray-400 mt-2">
                    AI can make mistakes. Check important info.
                </div>
            </div>
        </div>

        {/* Floating Button */}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`
                pointer-events-auto h-14 w-14 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group
                ${isOpen ? 'bg-white text-gray-800 rotate-90' : 'bg-[#1A1A1A] text-white hover:shadow-[0_8px_30px_rgba(79,70,229,0.4)]'}
            `}
        >
            {isOpen ? (
                <ChevronRight size={24} />
            ) : (
                <div className="relative">
                    <Sparkles size={24} className="fill-yellow-400 text-yellow-400 group-hover:animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-[#1A1A1A] rounded-full"></span>
                </div>
            )}
        </button>
    </div>
  );
};

export default AIAssistant;