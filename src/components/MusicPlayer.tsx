import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Drive - AI Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Cyberpunk Alley - AI Generated',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Digital Horizon - AI Wave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-fuchsia-500/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.15)] w-full max-w-md mx-auto">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <h3 className="text-fuchsia-400 font-bold text-lg tracking-wider uppercase drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">
            {currentTrack.title}
          </h3>
          <p className="text-cyan-400/70 text-xs uppercase tracking-widest mt-1">Track {currentTrackIndex + 1} of {TRACKS.length}</p>
        </div>

        {/* Progress Bar */}
        <div 
          className="h-2 bg-gray-800 rounded-full overflow-hidden cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(!isMuted)} className="text-cyan-400 hover:text-fuchsia-400 transition-colors">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-cyan-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <button onClick={prevTrack} className="text-cyan-400 hover:text-fuchsia-400 transition-colors">
              <SkipBack size={24} />
            </button>
            <button 
              onClick={togglePlay} 
              className="w-12 h-12 flex items-center justify-center bg-cyan-500/20 border border-cyan-400 rounded-full text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <button onClick={nextTrack} className="text-cyan-400 hover:text-fuchsia-400 transition-colors">
              <SkipForward size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
