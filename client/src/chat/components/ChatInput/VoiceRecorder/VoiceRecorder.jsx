import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import MainStore from '../../../../store/MainStore';
import ChatStore from '../../../../store/chat/ChatStore';
import { useParams } from 'react-router-dom';
import ConfirmWindow from '../../../../shared/components/ConfirmWindow';
import AudioPlayer from '../../../../shared/components/AudioPlayer';

const VoiceRecorder = observer(() => {
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);
  const mediaRecorder = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const dataArray = useRef(new Uint8Array(128));
  const {id} = useParams()
  const [showConfirmWindow, setShowConfirmWindow] = useState()

  useEffect(() => {
    if (isRecording) {
      const updateVolume = () => {
        analyser.current.getByteFrequencyData(dataArray.current);
        const average = dataArray.current.reduce((a, b) => a + b) / dataArray.current.length;
        setVolume(average / 128);
        requestAnimationFrame(updateVolume);
      };
      updateVolume();
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const audioBlob = new Blob([event.data], { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          MainStore.setAudioURL(url);
          MainStore.setAudioBlob(audioBlob);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Ошибка при начале записи:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setShowConfirmWindow(true)
      setVolume(0);
    }
  };

  const sendAudio = async () => {
    if(!MainStore.audioBlob) return
      await ChatStore.messageManager.createAudioMessage({audioBlob: MainStore.audioBlob, id})
  };

  const iconStyle = {
    fill: isRecording ? 'white' : 'white',
    opacity: isRecording ? Math.max(0.3, volume) : 1,
    border: isRecording ? '2px solid white' : 'none',
    borderRadius: '50px'
  };

  return (
    <div className='voice-recorder'>
      <button type='button' className='voice-recorder chat-input-button' onClick={isRecording ? stopRecording : startRecording}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          style={iconStyle}
        >
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      </button>
      {showConfirmWindow && <ConfirmWindow func={() => {sendAudio()}} isShow={setShowConfirmWindow} rightButtonText={'send'}>
        {MainStore.audioURL && <AudioPlayer audioUrl={MainStore.audioURL}/>}
      </ConfirmWindow>}
    </div>
  );
});

export default VoiceRecorder;
