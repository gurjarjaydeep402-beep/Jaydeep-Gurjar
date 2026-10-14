import { useState, useEffect, useRef, useCallback } from 'react';
import type { WorkspaceId } from '../types';

// SpeechRecognition type declarations for cross-browser support
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    length: number;
    item: (index: number) => {
      length: number;
      item: (index: number) => {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
    [index: number]: {
      length: number;
      item: (index: number) => {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export interface VoiceCommandLog {
  id: string;
  text: string;
  timestamp: number;
  type: 'navigation' | 'prompt' | 'search' | 'fallback';
  target?: string;
  status: 'executed' | 'error';
}

export interface UseVoiceNavigationProps {
  onNavigate: (id: WorkspaceId) => void;
  onAskAstra: (prompt: string) => void;
  onOpenSearch?: () => void;
  onNotify: (msg: string) => void;
}

// Audio beep tone synthesis using Web Audio API
function playChime(type: 'start' | 'success' | 'cancel') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    gain.connect(ctx.destination);
    osc.connect(gain);

    const now = ctx.currentTime;
    if (type === 'start') {
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch {
    // Ignore audio autoplay restrictions
  }
}

export function useVoiceNavigation({
  onNavigate,
  onAskAstra,
  onOpenSearch,
  onNotify,
}: UseVoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState<number>(0); // 0 to 100 for visualizer
  const [isSupported, setIsSupported] = useState(true);
  const [isLogsOpen, setIsLogsOpen] = useState(false);

  // Command logs state buffer persisted to localStorage
  const [commandLogs, setCommandLogs] = useState<VoiceCommandLog[]>(() => {
    try {
      const saved = localStorage.getItem('astra_voice_command_logs_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [
      {
        id: 'seed-1',
        text: 'Go to Chat',
        timestamp: Date.now() - 1000 * 60 * 3,
        type: 'navigation',
        target: 'ASTRA Chat',
        status: 'executed',
      },
      {
        id: 'seed-2',
        text: 'Open Projects & Forge',
        timestamp: Date.now() - 1000 * 60 * 12,
        type: 'navigation',
        target: 'Projects & Forge',
        status: 'executed',
      },
      {
        id: 'seed-3',
        text: 'Ask ASTRA: Design a trading matrix architecture',
        timestamp: Date.now() - 1000 * 60 * 25,
        type: 'prompt',
        target: 'ASTRA 4 Pro',
        status: 'executed',
      },
    ];
  });

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check browser support
  useEffect(() => {
    const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechAPI) {
      setIsSupported(false);
    }
  }, []);

  // Process voice command for navigation or prompting
  const handleProcessCommand = useCallback(
    (rawText: string) => {
      const clean = rawText.trim().toLowerCase();
      if (!clean) return;

      const recordLog = (text: string, type: 'navigation' | 'prompt' | 'search' | 'fallback', target?: string) => {
        const newLog: VoiceCommandLog = {
          id: `vlog-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          text,
          timestamp: Date.now(),
          type,
          target,
          status: 'executed',
        };
        setCommandLogs((prev) => {
          const updated = [newLog, ...prev.filter((l) => l.text.toLowerCase() !== text.toLowerCase())].slice(0, 30);
          try {
            localStorage.setItem('astra_voice_command_logs_v2', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      };

      // 1. Voice prompt commands: "ask astra [query]", "search [query]", "tell me [query]"
      if (
        clean.startsWith('ask astra') ||
        clean.startsWith('ask extra') ||
        clean.startsWith('tell astra') ||
        clean.startsWith('prompt') ||
        clean.startsWith('generate') ||
        clean.startsWith('write') ||
        clean.startsWith('explain')
      ) {
        let promptText = clean
          .replace(/^(ask astra|ask extra|tell astra|prompt)\s*/i, '')
          .trim();
        if (!promptText) promptText = rawText;
        playChime('success');
        recordLog(promptText, 'prompt', 'ASTRA Chat');
        onNotify(`🎙️ Voice Prompt: "${promptText}"`);
        onAskAstra(promptText);
        return;
      }

      // 2. Navigation commands
      const navMap: { keywords: string[]; id: WorkspaceId; label: string }[] = [
        { keywords: ['home', 'command deck', 'dashboard', 'main screen', 'overview'], id: 'home', label: 'Command Deck' },
        { keywords: ['chat', 'astra chat', 'conversation', 'assistant', 'talk'], id: 'chat', label: 'ASTRA Chat' },
        { keywords: ['developer ji', 'developer', 'autonomous engineer', 'ji'], id: 'developer-ji', label: 'Developer Ji' },
        { keywords: ['code', 'coding', 'code assistant', 'code and dev', 'programming'], id: 'coding', label: 'Code Assistant' },
        { keywords: ['projects', 'forge', 'astra forge', 'repository', 'builds'], id: 'projects', label: 'Projects & Forge' },
        { keywords: ['image', 'image generator', 'image studio', 'pictures', 'photos'], id: 'image-generator', label: 'Image Studio' },
        { keywords: ['video', 'video generator', 'video studio', 'movies'], id: 'video-generator', label: 'Video Studio' },
        { keywords: ['audio', 'voice', 'sound', 'voice engine', 'speech'], id: 'audio', label: 'Voice Engine' },
        { keywords: ['app factory', 'app builder', 'build app', 'mobile app'], id: 'app-factory', label: 'App Factory' },
        { keywords: ['website factory', 'website builder', 'landing page', 'web builder'], id: 'website-factory', label: 'Website Factory' },
        { keywords: ['game', 'game factory', 'arcade', 'games'], id: 'game-factory', label: 'Game Factory' },
        { keywords: ['research', 'deep research', 'investigate', 'web search'], id: 'research', label: 'Deep Research Agent' },
        { keywords: ['files', 'documents', 'docs', 'vector rag', 'knowledge'], id: 'files', label: 'Files & Vector RAG' },
        { keywords: ['automation', 'automator', 'chains', 'visual automation', 'flows', 'workflows'], id: 'automation', label: 'Visual Automator & Chains' },
        { keywords: ['connectors', 'cloud connectors', 'integrations', 'api connectors'], id: 'connectors', label: 'Cloud Connectors' },
        { keywords: ['market', 'trading', 'finance', 'stocks', 'bitcoin', 'crypto'], id: 'market', label: 'Trading & Finance' },
        { keywords: ['marketing', 'affiliate', 'campaigns', 'growth'], id: 'affiliate', label: 'Marketing & Monetization' },
        { keywords: ['models', 'ai models', 'providers', 'openai', 'gemini'], id: 'providers', label: 'AI Models Hub' },
        { keywords: ['control', 'control hub', 'admin', 'settings', 'diagnostics'], id: 'control', label: 'Control Hub & Admin' },
      ];

      for (const item of navMap) {
        if (
          item.keywords.some(
            (kw) =>
              clean === kw ||
              clean === `go to ${kw}` ||
              clean === `open ${kw}` ||
              clean === `switch to ${kw}` ||
              clean === `navigate to ${kw}` ||
              clean === `show ${kw}` ||
              clean.includes(`open ${kw}`) ||
              clean.includes(`go to ${kw}`)
          )
        ) {
          playChime('success');
          recordLog(rawText, 'navigation', item.label);
          onNotify(`🎙️ Voice Navigated to ${item.label}`);
          onNavigate(item.id);
          return;
        }
      }

      // 3. Search / Command Palette trigger
      if (
        clean.includes('search') ||
        clean.includes('command palette') ||
        clean === 'find' ||
        clean === 'open search'
      ) {
        playChime('success');
        recordLog(rawText, 'search', 'Command Palette');
        onNotify('🎙️ Opened Command Palette');
        onOpenSearch?.();
        return;
      }

      // 4. Fallback: treat non-navigation voice inputs as an intelligent prompt for ASTRA
      if (clean.length > 5) {
        playChime('success');
        recordLog(rawText, 'prompt', 'ASTRA Chat');
        onNotify(`🎙️ Dispatching to ASTRA: "${rawText}"`);
        onAskAstra(rawText);
      } else {
        onNotify(`🎙️ Unrecognized voice command: "${rawText}". Try "Go to Chat" or "Ask ASTRA..."`);
      }
    },
    [onNavigate, onAskAstra, onOpenSearch, onNotify]
  );

  // Setup mic audio analyzer for real visualizer frequencies
  const startAudioVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.6;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Compute average volume level
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);

        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // If mic analyzer fails, simulate acoustic pulse oscillations
      let step = 0;
      const interval = setInterval(() => {
        step += 0.2;
        const simulated = Math.round(25 + Math.sin(step) * 20 + Math.random() * 25);
        setAudioLevel(simulated);
      }, 100);
      return () => clearInterval(interval);
    }
  };

  const stopAudioVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  // Start listening session
  const startListening = useCallback(() => {
    const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechAPI) {
      onNotify('Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setInterimTranscript('');
        playChime('start');
        startAudioVisualizer();
        onNotify('🎙️ Listening... Say "Go to Chat", "Open Code", or "Ask ASTRA..."');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalChunk += res[0].transcript;
          } else {
            currentInterim += res[0].transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (finalChunk) {
          setTranscript(finalChunk);
          setInterimTranscript('');
          handleProcessCommand(finalChunk);

          // Reset silence timer
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            stopListening();
          }, 3500);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === 'no-speech') {
          // Normal timeout, continue listening
          return;
        }
        if (event.error === 'not-allowed') {
          onNotify('Microphone permission was denied. Please allow microphone access in browser settings.');
        } else {
          onNotify(`Voice input notice: ${event.error}`);
        }
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
        stopAudioVisualizer();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      stopAudioVisualizer();
      onNotify('Could not initialize Speech Recognition.');
    }
  }, [handleProcessCommand, onNotify]);

  // Stop listening session
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setIsListening(false);
    stopAudioVisualizer();
    playChime('cancel');
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Re-trigger an existing past command from logs buffer
  const retriggerCommand = useCallback(
    (commandText: string) => {
      onNotify(`Re-triggering voice command: "${commandText}"`);
      handleProcessCommand(commandText);
    },
    [handleProcessCommand, onNotify]
  );

  // Clear all command logs
  const clearLogs = useCallback(() => {
    setCommandLogs([]);
    try {
      localStorage.removeItem('astra_voice_command_logs_v2');
    } catch {}
    onNotify('Voice command logs cleared');
  }, [onNotify]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopAudioVisualizer();
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    audioLevel,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    commandLogs,
    isLogsOpen,
    setIsLogsOpen,
    retriggerCommand,
    clearLogs,
  };
}
