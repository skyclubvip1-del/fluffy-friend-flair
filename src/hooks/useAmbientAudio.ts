import { useState, useEffect } from "react";

class AudioManager {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private filter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private isEnabled: boolean = false;
  private lfo: OscillatorNode | null = null;

  public toggle(enabled?: boolean) {
    const nextState = enabled !== undefined ? enabled : !this.isEnabled;
    if (nextState === this.isEnabled) return this.isEnabled;

    if (nextState) {
      this.init();
    } else {
      this.stop();
    }
    
    this.isEnabled = nextState;
    return this.isEnabled;
  }

  private init() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      
      // Lowpass Filter for atmospheric warm drone
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(140, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(3.5, this.ctx.currentTime);
      this.filter.connect(this.masterGain);

      // Create 3 atmospheric drone oscillators (harmonic triad)
      const frequencies = [55, 110, 165]; // A1, A2, E3 (perfect fifths/octaves)
      this.oscillators = frequencies.map((freq, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = i === 0 ? "sawtooth" : "triangle";
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
        
        // Connect osc to filter
        osc.connect(this.filter!);
        osc.start();
        return osc;
      });

      // LFO for slow breathing volume & filter cutoff modulation
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = "sine";
      this.lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // very slow: 0.12Hz

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(35, this.ctx.currentTime); // modulate cutoff by 35Hz
      
      this.lfo.connect(lfoGain);
      lfoGain.connect(this.filter.frequency);
      this.lfo.start();

      // Fade in master volume
      this.masterGain.gain.linearRampToValueAtTime(0.38, this.ctx.currentTime + 2.5);
    } catch (e) {
      console.warn("Failed to init AudioContext:", e);
    }
  }

  private stop() {
    if (!this.ctx) return;
    const currentCtx = this.ctx;
    const currentGain = this.masterGain;

    if (currentGain) {
      currentGain.gain.cancelScheduledValues(currentCtx.currentTime);
      currentGain.gain.setValueAtTime(currentGain.gain.value, currentCtx.currentTime);
      currentGain.gain.linearRampToValueAtTime(0, currentCtx.currentTime + 0.8);
    }

    setTimeout(() => {
      this.oscillators.forEach(osc => { try { osc.stop(); } catch(e) {} });
      if (this.lfo) { try { this.lfo.stop(); } catch(e) {} }
      try { currentCtx.close(); } catch(e) {}
      
      this.oscillators = [];
      this.filter = null;
      this.masterGain = null;
      this.lfo = null;
      this.ctx = null;
    }, 900);
  }

  // Synthesis of a subtle analog click
  public playClick() {
    if (!this.ctx || this.ctx.state === "suspended") return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Synthesis of 3D metallic chimes using FM Synthesis (frequency modulation)
  public playChime(freq: number, isDeep: boolean = false) {
    if (!this.ctx || this.ctx.state === "suspended") return;
    const now = this.ctx.currentTime;

    // Carrier Oscillator
    const carrier = this.ctx.createOscillator();
    carrier.type = "sine";
    carrier.frequency.setValueAtTime(freq, now);

    // Modulator Oscillator (FM synthesis)
    const modulator = this.ctx.createOscillator();
    modulator.type = "sine";
    modulator.frequency.setValueAtTime(freq * (isDeep ? 1.48 : 2.01), now);

    // Modulator Gain (Index of Modulation)
    const modGain = this.ctx.createGain();
    modGain.gain.setValueAtTime(freq * (isDeep ? 0.95 : 0.75), now);
    modGain.gain.exponentialRampToValueAtTime(0.01, now + (isDeep ? 0.8 : 0.35));

    // Chime Gain Node
    const chimeGain = this.ctx.createGain();
    chimeGain.gain.setValueAtTime(isDeep ? 0.28 : 0.14, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + (isDeep ? 1.6 : 0.75));

    // Reverb / Echo simulator (Feedback Delay line)
    const delay = this.ctx.createDelay();
    delay.delayTime.setValueAtTime(isDeep ? 0.32 : 0.22, now);
    
    const feedback = this.ctx.createGain();
    feedback.gain.setValueAtTime(0.38, now);

    // Connect FM chain
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    
    // Connect Carrier to Destination
    carrier.connect(chimeGain);
    
    // Feedback echo connection
    chimeGain.connect(this.ctx.destination);
    chimeGain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(this.ctx.destination);

    // Start oscillators
    carrier.start(now);
    modulator.start(now);
    
    carrier.stop(now + (isDeep ? 2.0 : 1.0));
    modulator.stop(now + (isDeep ? 2.0 : 1.0));
  }

  public getActive() {
    return this.isEnabled;
  }
}

export const audioManager = new AudioManager();

export const useAmbientAudio = () => {
  const [isPlaying, setIsPlaying] = useState(audioManager.getActive());

  const toggle = () => {
    const nextState = audioManager.toggle();
    setIsPlaying(nextState);
  };

  useEffect(() => {
    const handlePlayChime = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { freq, isDeep } = customEvent.detail || { freq: 880, isDeep: false };
      audioManager.playChime(freq, isDeep);
    };

    const handlePlayClick = () => {
      audioManager.playClick();
    };

    window.addEventListener("play-audio-chime", handlePlayChime as EventListener);
    window.addEventListener("play-audio-click", handlePlayClick);
    return () => {
      window.removeEventListener("play-audio-chime", handlePlayChime as EventListener);
      window.removeEventListener("play-audio-click", handlePlayClick);
    };
  }, []);

  return { isPlaying, toggle };
};
