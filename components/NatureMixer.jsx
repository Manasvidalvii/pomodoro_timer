import React, { useState, useEffect, useRef } from 'react';

export default function NatureMixer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [windVol, setWindVol] = useState(70);
  const [oceanVol, setOceanVol] = useState(40);
  const [birdsVol, setBirdsVol] = useState(30);

  const audioCtxRef = useRef(null);
  const windGainRef = useRef(null);
  const oceanGainRef = useRef(null);
  const birdsGainRef = useRef(null);
  const intervalRef = useRef(null);

  const startAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // 1. Wind Sound Generator (Pink Noise + Lowpass Filter)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const windSource = ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime((windVol / 100) * 0.2, ctx.currentTime);
    windGainRef.current = windGain;

    windSource.connect(filter);
    filter.connect(windGain);
    windGain.connect(ctx.destination);
    windSource.start();

    // 2. Gentle Ocean Waves (Low Sine Modulation)
    const oceanSource = ctx.createBufferSource();
    oceanSource.buffer = noiseBuffer;
    oceanSource.loop = true;

    const oceanFilter = ctx.createBiquadFilter();
    oceanFilter.type = 'lowpass';
    oceanFilter.frequency.setValueAtTime(250, ctx.currentTime);

    const oceanGain = ctx.createGain();
    oceanGain.gain.setValueAtTime((oceanVol / 100) * 0.15, ctx.currentTime);
    oceanGainRef.current = oceanGain;

    oceanSource.connect(oceanFilter);
    oceanFilter.connect(oceanGain);
    oceanGain.connect(ctx.destination);
    oceanSource.start();

    // 3. Morning Chirping Birds (Randomized Oscillators)
    const birdsGain = ctx.createGain();
    birdsGain.gain.setValueAtTime((birdsVol / 100) * 0.05, ctx.currentTime);
    birdsGainRef.current = birdsGain;
    birdsGain.connect(ctx.destination);

    intervalRef.current = setInterval(() => {
      if (Math.random() > 0.4) {
        const osc = ctx.createOscillator();
        const chirpGain = ctx.createGain();
        osc.type = 'sine';
        const startFreq = 2000 + Math.random() * 1000;
        osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(startFreq + 800, ctx.currentTime + 0.1);

        chirpGain.gain.setValueAtTime(0.08, ctx.currentTime);
        chirpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        osc.connect(chirpGain);
        chirpGain.connect(birdsGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    }, 1200);

    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  useEffect(() => {
    if (windGainRef.current && audioCtxRef.current) {
      windGainRef.current.gain.setValueAtTime((windVol / 100) * 0.2, audioCtxRef.current.currentTime);
    }
  }, [windVol]);

  useEffect(() => {
    if (oceanGainRef.current && audioCtxRef.current) {
      oceanGainRef.current.gain.setValueAtTime((oceanVol / 100) * 0.15, audioCtxRef.current.currentTime);
    }
  }, [oceanVol]);

  useEffect(() => {
    if (birdsGainRef.current && audioCtxRef.current) {
      birdsGainRef.current.gain.setValueAtTime((birdsVol / 100) * 0.05, audioCtxRef.current.currentTime);
    }
  }, [birdsVol]);

  return (
    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', color: 'white' }}>
      <h3 style={{ margin: '0 0 15px 0' }}>🌲 Ambient Nature Soundscape</h3>
      
      <button 
        onClick={togglePlay}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          background: isPlaying ? '#ef4444' : '#3b82f6',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '15px'
        }}
      >
        {isPlaying ? '⏸ Pause Ambience' : '▶ Play Ambience'}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>🍃 Forest Wind ({windVol}%)</label>
          <input 
            type="range" min="0" max="100" value={windVol} 
            onChange={(e) => setWindVol(e.target.value)} 
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>🌊 Ocean Waves ({oceanVol}%)</label>
          <input 
            type="range" min="0" max="100" value={oceanVol} 
            onChange={(e) => setOceanVol(e.target.value)} 
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>🐦 Chirping Birds ({birdsVol}%)</label>
          <input 
            type="range" min="0" max="100" value={birdsVol} 
            onChange={(e) => setBirdsVol(e.target.value)} 
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}