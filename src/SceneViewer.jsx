import React, { useState, useEffect, useRef } from "react";

const SceneViewer = ({ scenes, mediaResults }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [audioQueue, setAudioQueue] = useState([]);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  
  // Helper to get absolute URL for assets
  const getAbsoluteUrl = (relativePath) => {
    // Base URL of the backend server
    const baseUrl = 'http://localhost:5000';
    
    // If the path already starts with http, it's already absolute
    if (relativePath && relativePath.startsWith('http')) {
      return relativePath;
    }
    
    // Otherwise join with the base URL
    return relativePath ? `${baseUrl}${relativePath}` : '';
  };

  // Prepare audio queue for current scene when scene changes
  useEffect(() => {
    if (!scenes || !mediaResults || scenes.length === 0 || mediaResults.length === 0) return;
    
    const scene = scenes[currentSceneIndex];
    const media = mediaResults[currentSceneIndex];
    
    if (!scene || !media) return;
    
    // Build audio queue: first narration, then dialogues
    const queue = [];
    
    if (media.narration_path) {
      queue.push({
        type: 'narration',
        path: getAbsoluteUrl(media.narration_path),
        text: scene.narration
      });
    }
    
    if (media.dialogue_paths && scene.dialogue) {
      scene.dialogue.forEach((dialog, index) => {
        if (media.dialogue_paths[index]) {
          queue.push({
            type: 'dialogue',
            path: getAbsoluteUrl(media.dialogue_paths[index].audio_path),
            character: dialog.character,
            text: dialog.line
          });
        }
      });
    }
    
    setAudioQueue(queue);
    setCurrentAudioIndex(0);
    
  }, [currentSceneIndex, scenes, mediaResults]);

  // Handle audio playback
  useEffect(() => {
    if (!isPlaying || audioQueue.length === 0) return;
    
    const playCurrentAudio = () => {
      if (currentAudioIndex >= audioQueue.length) {
        // Move to next scene if we've played all audio for this scene
        if (currentSceneIndex < scenes.length - 1) {
          setCurrentSceneIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
        return;
      }
      
      const currentAudio = audioQueue[currentAudioIndex];
      audioRef.current.src = currentAudio.path;
      audioRef.current.play().catch(err => {
        console.error("Audio playback error:", err);
        // Move to next audio if this one fails
        setCurrentAudioIndex(prev => prev + 1);
      });
      setAudioPlaying(true);
    };
    
    playCurrentAudio();
    
    // Set up event listener for when audio ends
    const handleAudioEnd = () => {
      setAudioPlaying(false);
      setCurrentAudioIndex(prev => prev + 1);
    };
    
    audioRef.current.addEventListener('ended', handleAudioEnd);
    
    return () => {
      audioRef.current.removeEventListener('ended', handleAudioEnd);
      audioRef.current.pause();
    };
  }, [isPlaying, currentAudioIndex, audioQueue, currentSceneIndex, scenes]);
  
  // Trigger next audio when current one finishes
  useEffect(() => {
    if (isPlaying && !audioPlaying && audioQueue.length > 0 && currentAudioIndex < audioQueue.length) {
      const timer = setTimeout(() => {
        const currentAudio = audioQueue[currentAudioIndex];
        audioRef.current.src = currentAudio.path;
        audioRef.current.play().catch(err => {
          console.error("Audio playback error:", err);
          // Move to next audio if this one fails
          setCurrentAudioIndex(prev => prev + 1);
        });
        setAudioPlaying(true);
      }, 500); // Small delay between audio clips
      
      return () => clearTimeout(timer);
    }
  }, [audioPlaying, currentAudioIndex, audioQueue, isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setAudioPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      audioRef.current.pause();
      setCurrentSceneIndex(prev => prev + 1);
      setCurrentAudioIndex(0);
      setAudioPlaying(false);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      audioRef.current.pause();
      setCurrentSceneIndex(prev => prev - 1);
      setCurrentAudioIndex(0);
      setAudioPlaying(false);
    }
  };

  const handleRestart = () => {
    audioRef.current.pause();
    setCurrentAudioIndex(0);
    setAudioPlaying(false);
    setIsPlaying(true);
  };

  const getCurrentAudioInfo = () => {
    if (audioQueue.length === 0 || currentAudioIndex >= audioQueue.length) {
      return null;
    }
    return audioQueue[currentAudioIndex];
  };

  if (!scenes || !mediaResults || scenes.length === 0 || mediaResults.length === 0) {
    return <div className="text-white text-center p-6">No scenes available to play.</div>;
  }

  const currentScene = scenes[currentSceneIndex];
  const currentMedia = mediaResults[currentSceneIndex];
  const currentAudio = getCurrentAudioInfo();
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
      {/* Scene display area */}
      <div className="relative w-full h-[400px] overflow-hidden">
        {/* Background image */}
        {currentMedia.image_path ? (
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: `url(${getAbsoluteUrl(currentMedia.image_path)})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-slate-900 flex items-center justify-center">
            <p className="text-white/60 text-lg">No image available for this scene</p>
          </div>
        )}
        
        {/* Overlay for text */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
          {/* Current dialogue or narration */}
          {currentAudio && (
            <div className={`mb-4 p-4 rounded-xl transition-all duration-300 ${
              currentAudio.type === 'narration' 
                ? 'bg-black/60 text-white/90 italic' 
                : 'bg-indigo-900/80 text-white'
            }`}>
              {currentAudio.type === 'dialogue' && (
                <div className="font-bold mb-1 text-blue-300">{currentAudio.character}</div>
              )}
              <p className={currentAudio.type === 'narration' ? 'font-light' : 'font-normal'}>
                {currentAudio.text}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-slate-950/90 p-4 border-t border-white/10">
        {/* Scene information */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-white/70">
            <span className="text-blue-400 font-medium">Scene {currentSceneIndex + 1}</span> of {scenes.length}
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-1">
            {audioQueue.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full ${
                  idx === currentAudioIndex 
                    ? 'bg-blue-400 animate-pulse' 
                    : idx < currentAudioIndex 
                      ? 'bg-blue-400/60' 
                      : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Playback controls */}
        <div className="flex justify-center items-center space-x-4">
          <button 
            onClick={handlePrevScene}
            disabled={currentSceneIndex === 0}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={handleRestart}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition transform hover:scale-105"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          
          <button 
            onClick={handleNextScene}
            disabled={currentSceneIndex === scenes.length - 1}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Scene selection thumbnails */}
      <div className="bg-slate-950/80 p-4 overflow-x-auto">
        <div className="flex space-x-2">
          {scenes.map((scene, idx) => (
            <div 
              key={idx}
              onClick={() => {
                audioRef.current.pause();
                setCurrentSceneIndex(idx);
                setCurrentAudioIndex(0);
                setAudioPlaying(false);
              }}
              className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition ${
                currentSceneIndex === idx ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-transparent'
              }`}
            >
              {mediaResults[idx]?.image_path ? (
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${getAbsoluteUrl(mediaResults[idx].image_path)})` }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-800 to-slate-800 flex items-center justify-center">
                  <span className="text-xs text-white/80">Scene {idx + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SceneViewer;