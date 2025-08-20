'use client';

import { useState, useRef, useEffect } from 'react';
import { LucideUser, Bot } from 'lucide-react';
import Image from 'next/image';
import { filter } from '../components/filters/logoFilter';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  link: string | null;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔑 Create sessionId on first load
  useEffect(() => {
    let stored = sessionStorage.getItem('chatSessionId');
    if (!stored) {
      stored = uuidv4();
      sessionStorage.setItem('chatSessionId', stored);
    }
    setSessionId(stored);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage = input;
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage, link: null },
    ]);
    setInput('');

    // Call API with sessionId
    const res = await fetch('/api/chat-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userMessage, sessionId }),
    });
    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: data.answer, link: data.link },
    ]);

    scrollToBottom();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='fixed bottom-18 right-4 flex flex-col items-end'>
      <button
        onClick={() => setOpen(!open)}
        className='rounded-full p-2 bg-white/10 backdrop-blur-md shadow-lg'
      >
        <Image
          src='/bot.png'
          alt='Chat Icon'
          width={40}
          height={40}
          style={{ filter }}
        />
      </button>

      {open && (
        <div className='w-80 rounded-2xl p-4 shadow-lg bg-white/10 backdrop-blur-xl border border-white/20 text-white flex flex-col'>
          <div className='h-64 overflow-y-auto mb-2 pr-1'>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`my-1 flex flex-col gap-1 ${
                  msg.role === 'user' ? 'text-blue-300' : 'text-green-300'
                }`}
              >
                <div className='flex items-start gap-2'>
                  {msg.role === 'user' ? (
                    <LucideUser size={18} />
                  ) : (
                    <Bot size={20} />
                  )}
                  <span>{msg.content}</span>
                </div>
                {msg.link && (
                  <a
                    href={msg.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-400 hover:underline'
                  >
                    Click here to see more details
                  </a>
                )}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              className='bg-blue-300/80 hover:bg-blue-300 text-white px-3 rounded transition'
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
