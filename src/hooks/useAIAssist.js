import { useState, useCallback, useRef } from 'react';
import { getApiUrl } from '../config/api';

/* ══════════════════════════════════════════════════════
   useAIAssist — React hook for the experiment AI co-pilot
   Handles SSE streaming, message history, and error state
   ══════════════════════════════════════════════════════ */
export function useAIAssist() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  const sendMessage = useCallback(async (userMessage, context) => {
    if (!userMessage.trim() || isStreaming) return;

    setError(null);

    // Append user message immediately
    const userMsg = { role: 'user', content: userMessage.trim(), id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingText('');

    // Only send the last 10 messages as history to keep context window lean
    const history = messages
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await fetch(getApiUrl('/api/ai/assist'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.trim(),
          history,
          context: {
            title:   context?.title   || 'Untitled Experiment',
            subject: context?.subject || '',
            nodes:   context?.nodes   || [],
            edges:   context?.edges   || [],
            blocks:  context?.blocks  || [],
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and append to our rolling buffer
        buffer += decoder.decode(value, { stream: true });

        // Split on newlines — keep any incomplete line in the buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));

            if (data.content) {
              accumulated += data.content;
              setStreamingText(accumulated);
            }

            if (data.done) {
              // Commit the full streamed response as an assistant message
              setMessages(prev => [
                ...prev,
                { role: 'assistant', content: accumulated, id: Date.now() },
              ]);
              setStreamingText('');
              setIsStreaming(false);
            }

            if (data.error) {
              throw new Error(data.error);
            }
          } catch {
            /* ignore JSON parse errors on partial lines */
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return; // user cancelled
      console.error('[AI Assist]', err);
      setError('Something went wrong. Please try again.');
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I ran into a problem. Check your connection and try again.',
          id: Date.now(),
          isError: true,
        },
      ]);
    } finally {
      setIsStreaming(false);
      setStreamingText('');
      abortRef.current = null;
    }
  }, [messages, isStreaming]);

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setStreamingText('');
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamingText('');
    setError(null);
  }, []);

  return { messages, isStreaming, streamingText, error, sendMessage, cancelStream, clearChat };
}
