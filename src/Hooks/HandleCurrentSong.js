import { create } from 'zustand';

let audio = null;

const HandleCurrentSong = create((set) => ({

    CurrentSong: null,
    songUrl: null,
    isPlaying: false,

    playSong: (url) => set((state) => {
        if (audio) {
            audio.pause();
        }
        audio = new Audio(url);
        audio.play();
        return {
            songUrl: url,
            isPlaying: true
        };
    }),

    pauseSong: () => set((state) => {
        if (audio) {
            audio.pause();
        }
        return { isPlaying: false };
    }),

    resumeSong: () => set((state) => {
        if (audio) {
            audio.play();
        }
        return { isPlaying: true };
    }),

    stopSong: () => set((state) => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        return {
            isPlaying: false,
            CurrentSong: null,
            songUrl: null
        };
    }),

    setSong: (song) => set((state) => ({
        CurrentSong: song
    }))
}));

export default HandleCurrentSong;
