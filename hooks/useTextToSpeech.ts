import { useState, useEffect, useCallback } from 'react';

export const useTextToSpeech = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const populateVoices = useCallback(() => {
    if (!isSupported) return;
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      setVoices(availableVoices);
    }
  }, [isSupported]);

  useEffect(() => {
    if (!isSupported) return;
    
    populateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', populateVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', populateVoices);
      window.speechSynthesis.cancel();
    };
  }, [isSupported, populateVoices]);

  const speak = useCallback((text: string, langCode: string) => {
    if (!text || !isSupported) return;

    window.speechSynthesis.cancel(); // Stop any currently playing speech

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a matching voice.
    // 1. Exact match (e.g., 'es-ES')
    // 2. Language match (e.g., 'es')
    const voice = voices.find(v => v.lang.replace('_', '-') === langCode.replace('_', '-')) || voices.find(v => v.lang.startsWith(langCode));
    
    if (voice) {
      utterance.voice = voice;
    } else {
        // Fallback to the lang property, the browser will try to find a suitable voice.
        utterance.lang = langCode;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voices, isSupported]);

  return { speak, isSpeaking, isSupported };
};
