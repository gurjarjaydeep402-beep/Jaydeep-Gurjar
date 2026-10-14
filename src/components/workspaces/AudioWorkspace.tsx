import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Mic2,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react';

interface AudioWorkspaceProps {
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export function AudioWorkspace({ onBack, onNotify }: AudioWorkspaceProps) {
  const [text, setText] = useState(
    'Welcome to ASTRA, the next generation AI Operating System. All neural voice synthesis channels are calibrated and ready.'
  );
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const available = window.speechSynthesis.getVoices();
        if (available.length > 0) {
          setVoices(available);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      onNotify('Speech synthesis is not supported on this device');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    onNotify('Playing synthesized audio...');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in select-text">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mic2 size={20} className="text-purple-400" />
              ASTRA Audio & Voice Studio
            </h2>
            <p className="text-xs text-slate-400">
              Text to Speech, ElevenLabs neural voice cloning, sound design
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/25">
          Ultra-HD Neural TTS
        </span>
      </div>

      {/* Main Studio Console */}
      <div className="p-6 rounded-2xl bg-[#060c24]/90 border border-purple-500/25 backdrop-blur-xl shadow-xl space-y-6">
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Speech Script / Dialogue
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full rounded-xl bg-[#08102e] border border-cyan-500/25 p-4 text-sm text-white outline-none focus:border-cyan-400/60 transition-colors"
          />
        </div>

        {/* Audio Waveform Animation Visualization */}
        <div className="p-4 rounded-xl bg-black/40 border border-purple-500/20 flex items-center justify-center gap-1.5 h-20 overflow-hidden">
          {Array.from({ length: 36 }).map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 rounded-full bg-gradient-to-t from-cyan-400 to-purple-500 transition-all duration-150 ${
                isPlaying ? 'animate-pulse' : 'h-3 opacity-40'
              }`}
              style={{
                height: isPlaying ? `${Math.max(12, Math.sin(idx * 0.5) * 45 + 20)}px` : '8px',
                animationDelay: `${(idx % 6) * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Sliders & Voice selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">Voice Model</label>
            <select
              value={selectedVoiceIndex}
              onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
              className="w-full rounded-xl bg-[#08102e] border border-white/10 px-3 py-2 text-xs text-white outline-none"
            >
              {voices.length > 0 ? (
                voices.map((v, i) => (
                  <option key={i} value={i}>
                    {v.name} ({v.lang})
                  </option>
                ))
              ) : (
                <option value={0}>ASTRA Neural Voice 1 (Default)</option>
              )}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Speaking Rate</span>
              <span className="font-mono text-cyan-300">{rate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Pitch Modulation</span>
              <span className="font-mono text-purple-300">{pitch}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-purple-400"
            />
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleSpeak}
          className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-400 text-white hover:brightness-110 shadow-[0_0_25px_rgba(168,85,247,0.3)]'
          }`}
        >
          {isPlaying ? (
            <>
              <Square size={16} fill="white" />
              <span>Stop Playback</span>
            </>
          ) : (
            <>
              <Play size={16} fill="white" />
              <span>Synthesize & Speak</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
