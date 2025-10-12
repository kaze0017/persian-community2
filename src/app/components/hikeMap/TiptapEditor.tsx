import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { Button } from '@/components/ui/button';
import { MarkerData } from '@/types/event';
import { Editor } from '@tiptap/react';
import type { JSONContent } from '@tiptap/core';
import { motion } from 'framer-motion';
import { X, Save, Cpu, Check, ArrowRight } from 'lucide-react'; // X for Cancel, Save for Save, Cpu for AI Assist
import { filter } from '../filters/logoFilter';
import { DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface TiptapEditorProps {
  marker: MarkerData;
  eventId: string;
  pinId?: string;
  setImages: React.Dispatch<
    React.SetStateAction<{ file: File; tempSrc: string }[]>
  >;
  handleUpdateMarker: (markerId: string, updates: Partial<MarkerData>) => void;
  editable?: boolean;
  initialContent?: JSONContent;
}

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}
type ButtonVariant =
  | 'default'
  | 'outline'
  | 'link'
  | 'destructive'
  | 'secondary'
  | 'ghost'
  | null
  | undefined;
export default function TiptapEditor({
  marker,
  handleUpdateMarker,
  setImages,
  eventId,
  pinId,
  editable = true,
  initialContent,
}: TiptapEditorProps) {
  const editorRef = useRef<Editor | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  // --- Save editor content ---
  const handleSave = useCallback(() => {
    if (!editorRef.current) return;
    const content = editorRef.current.getJSON();
    handleUpdateMarker(marker.id, {
      description: JSON.stringify(content),
      title:
        editorRef.current.getText().split('\n')[0] ||
        marker.title ||
        'Untitled',
    });
    setTimeout(() => {
      const dialog = document
        .querySelector('[data-state="open"]')
        ?.closest('dialog');
      dialog?.close();
    }, 0);
  }, [marker.id, marker.title, handleUpdateMarker]);

  const handleCancel = useCallback(() => {
    const dialog = document
      .querySelector('[data-state="open"]')
      ?.closest('dialog');
    dialog?.close();
  }, []);

  // --- Send chat message to AI ---
  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: chatInput };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setChatInput('');

    try {
      // ✅ Get current editor content (if any)
      const currentContent = editorRef.current?.getJSON();
      const hasExistingContent = currentContent?.content?.some(
        (n) => n.type === 'paragraph' || n.type === 'heading'
      );

      const response = await fetch('/api/generate-vertex-marker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          text: chatInput,
          tone: 'friendly',
          history: newHistory.slice(-6), // send recent context only
          currentContent: hasExistingContent ? currentContent : null, // 🧩 include existing content if present
        }),
      });

      const raw = await response.text();

      // 🧩 Try to extract JSON
      let jsonCandidate: string | null = null;
      let parsedOuter: any;
      try {
        parsedOuter = JSON.parse(raw);
        if (typeof parsedOuter.message === 'string') {
          const match =
            parsedOuter.message.match(/```json\s*([\s\S]*?)```/) ||
            parsedOuter.message.match(/\{[\s\S]*\}/);
          jsonCandidate = match ? match[1] || match[0] : null;
        } else if (parsedOuter.type === 'doc') {
          jsonCandidate = raw;
        }
      } catch {
        const match =
          raw.match(/```json\s*([\s\S]*?)```/) || raw.match(/\{[\s\S]*\}/);
        jsonCandidate = match ? match[1] || match[0] : null;
      }

      let parsedJSON: JSONContent | null = null;
      if (jsonCandidate) {
        try {
          parsedJSON = JSON.parse(jsonCandidate);
        } catch (err) {
          console.warn('⚠️ JSON parse failed:', err);
        }
      }

      // ✅ If valid Tiptap JSON, merge and update
      if (parsedJSON?.type === 'doc' && Array.isArray(parsedJSON.content)) {
        const current = editorRef.current?.getJSON();
        const imageNodes =
          current?.content?.filter((n: JSONContent) => n.type === 'image') ||
          [];

        const mergedContent: JSONContent = {
          ...parsedJSON,
          content: [...parsedJSON.content, ...imageNodes],
        };

        editorRef.current?.commands.setContent(mergedContent);
        setChatHistory((prev) => [
          ...prev,
          { role: 'bot', text: '✨ I’ve improved your content in the editor!' },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { role: 'bot', text: parsedOuter?.message || raw },
        ]);
      }
    } catch (error) {
      console.error('Chat failed:', error);
      setChatHistory((prev) => [
        ...prev,
        { role: 'bot', text: '❌ Failed to respond.' },
      ]);
    }
  }, [chatHistory, chatInput]);

  // --- Toggle chat panel ---
  const toggleChat = () => {
    setShowChat((prev) => !prev);
    if (!showChat) {
      setChatHistory([
        {
          role: 'bot',
          text: 'Hi! 🤖 What would you like to do with your content? Tailor, add to it, or generate something new?',
        },
      ]);
    }
  };
  console.log('marker', marker);
  useEffect(() => {
    if (editorRef.current) {
      console.log('Editor is ready:', editorRef.current);
    }
  }, [editorRef.current]);

  return (
    <div className='w-full flex flex-col h-full p-4 gap-1.5'>
      {editable && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className='relative'
        >
          <div className='rounded-2xl p-4 md:p-6 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl flex flex-wrap items-center gap-2'>
            {[
              {
                key: 'cancel',
                label: 'Cancel',
                icon: <X className='w-4 h-4' style={{ filter }} />,
                tooltip: 'Discard changes',
                onClick: handleCancel,
                variant: 'outline' as ButtonVariant,
                className:
                  'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
              },
              {
                key: 'save',
                label: 'Save All',
                icon: <Save className='w-4 h-4' style={{ filter }} />,
                tooltip: 'Save all map data',
                onClick: handleSave,
                variant: 'outline' as ButtonVariant,
                className: 'bg-grok-teal-600 hover:bg-grok-teal-700 text-white',
              },
              {
                key: 'ai',
                label: 'AI Assist',
                icon: <Cpu className='w-4 h-4' style={{ filter }} />,
                onClick: toggleChat,
                variant: 'outline' as ButtonVariant,
                className: '', // ✅ empty string, not 'outline'
              },
            ].map(({ key, label, icon, onClick, variant, className }) => (
              <Button
                key={key}
                onClick={onClick}
                variant={variant} // ✅ matches ButtonVariant
                className={`flex items-center gap-1 ${className ?? ''}`}
              >
                {icon}
                <span className='hidden sm:inline'>{label}</span>
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Editor */}
      <DialogTitle>
        <VisuallyHidden>Editor</VisuallyHidden>
      </DialogTitle>

      <SimpleEditor
        eventId={marker.eventId}
        pinId={marker.id}
        className='w-full prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert min-h-[300px]'
        onUpdate={({ editor }) => {
          editorRef.current = editor;
        }}
        onReady={(editor) => {
          editorRef.current = editor;
          console.log('✅ Editor is ready:', editor);
        }}
        content={
          initialContent
          //  ||
          // marker.description.length > 0
          //   ? JSON.parse(marker.description)
          //   : { type: 'doc', content: [] }
        }
        setImages={setImages}
        editable={editable}
      />

      {editable && showChat && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.35 }}
          className=''
        >
          <div
            className='border-t pt-4
          rounded-2xl p-4 md:p-6 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl
          '
          >
            <div className='h-48 overflow-y-auto mb-4 flex flex-col gap-2'>
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded ${
                    msg.role === 'user'
                      ? 'bg-black-200 self-end'
                      : 'bg-black-300 self-start'
                  }`}
                >
                  <strong>{msg.role === 'user' ? 'You:' : 'Bot:'}</strong>{' '}
                  {msg.text}
                </div>
              ))}
            </div>
            <div className='flex gap-2'>
              <input
                type='text'
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className='flex-1 p-2 border rounded'
                placeholder='Type your message...'
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <Button
                onClick={handleSendChat}
                className='flex items-center gap-1'
                variant='outline'
              >
                <ArrowRight
                  className='w-8 h-8 text-2xl'
                  style={{ filter, fontSize: '2rem' }}
                />
              </Button>{' '}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
