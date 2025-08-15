'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { LucideUser, Bot, LucideMessageCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    // Call your API
    const res = await fetch('/api/chat-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userMessage }),
    });
    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: data.answer },
    ]);

    scrollToBottom();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className='fixed bottom-18 right-4 flex flex-col items-end'>
      <button
        className='mb-2 p-2 rounded-full bg-blue-500/80 hover:bg-blue-500 text-white shadow-lg'
        onClick={() => setOpen(!open)}
      >
        <LucideMessageCircle size={24} />
      </button>

      {open && (
        <div className='w-80 rounded-2xl p-4 shadow-lg bg-white/10 backdrop-blur-xl border border-white/20 text-white flex flex-col'>
          <div className='h-64 overflow-y-auto mb-2 pr-1'>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`my-1 flex items-start gap-2 ${
                  msg.role === 'user' ? 'text-blue-300' : 'text-green-300'
                }`}
              >
                {msg.role === 'user' ? (
                  <LucideUser size={18} />
                ) : (
                  <Bot size={20} className='flex-shrink-0' />
                )}
                <span>{msg.content}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className='flex gap-2'>
            <textarea
              className='flex-1 rounded p-2 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Ask your question...'
              rows={1}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); // prevent newline
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              className='bg-blue-500/80 hover:bg-blue-500 text-white px-3 rounded transition'
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
