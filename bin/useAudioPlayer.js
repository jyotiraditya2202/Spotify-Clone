import { set } from 'mongoose';
import { useState, useEffect, useRef } from 'react';
import { PiShoppingCartSimpleFill } from 'react-icons/pi';

function useAudioPlayer() {
  const [songUrl, setSongUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [CurrentSong, setCurrentSong] = useState(null);

  const audioRef = useRef(new Audio());


  useEffect(() => {
    const audio = audioRef.current;

    if (songUrl) {
      audio.src = songUrl;
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
    return () => {
      audio.pause();  // Cleanup on unmount
    };
  }, [songUrl, isPlaying]); 

  useEffect(() => {
    if (CurrentSong) {
      console.log('A new song was set:', CurrentSong.title);
    }
  }, [CurrentSong]);
  
  const setSong = (song) => {
    setCurrentSong(song);
  }
  const playSong = (url) => {
    setSongUrl(url);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const stopSong = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setSongUrl(null);
  };

  return { CurrentSong, songUrl, isPlaying, playSong, pauseSong, stopSong, setSong };
}

export default useAudioPlayer;