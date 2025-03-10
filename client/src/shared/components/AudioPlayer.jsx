import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const AudioPlayer = ({ audioUrl }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'rgb(77, 87, 94)',
        progressColor: 'rgb(255, 255, 255, 0.5)',
        barWidth: 3,
        barRadius: 3,
        barHeight: 2,
        cursorWidth: 0,
        height: 30,
        barGap: 2,
      });

      wavesurfer.current.on('finish', () => {
        setIsPlaying(false);
      });

      wavesurfer.current.load(audioUrl);

      return () => wavesurfer.current.destroy();
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    wavesurfer.current.playPause();
  };

  return (
    <div className="audio-player" style={{ width: '100%' }}>
      <button type="button" className="audio-player__button" onClick={handlePlayPause}>
        {isPlaying ? 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="white"/>
          </svg>
        :
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="white"/>
          </svg>}
      </button>
      <div ref={waveformRef} style={{ width: '200px', height: '30px', cursor: 'pointer' }} />
    </div>
  );
};

export default AudioPlayer;
