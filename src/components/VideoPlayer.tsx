import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onLoadedMetadata?: (videoWidth: number, videoHeight: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, onLoadedMetadata }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <div 
      className="relative w-full h-full group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        playsInline
        preload="metadata"
        loop
        onClick={togglePlay}
        onContextMenu={(e) => e.preventDefault()}
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          if (onLoadedMetadata) {
            onLoadedMetadata(video.videoWidth, video.videoHeight);
          }
        }}
      />
      
      {/* Central Play Button Overlay */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-neo border-4 border-[#2D2331] transform hover:scale-110 transition-transform">
            <Play size={32} className="text-[#2D2331] fill-[#2D2331] ml-1" />
          </div>
        </div>
      )}

      {/* Custom Bottom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={togglePlay}
              className="p-1.5 bg-white neo-border-thin text-[#2D2331] hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </button>
            
            <button 
              onClick={toggleMute}
              className="p-1.5 bg-white neo-border-thin text-[#2D2331] hover:scale-105 transition-transform"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
          
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
