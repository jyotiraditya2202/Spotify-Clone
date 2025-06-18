import React, { useState, useEffect } from 'react';
import './MainContent.css';
import useAudioPlayer from '../Hooks/HandleCurrentSong';

const MainContent = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { CurrentSong ,songUrl, isPlaying, playSong, pauseSong, setSong } = useAudioPlayer();

  useEffect(() => {
    const fetchTrendingSongs = async () => {
      try {
        const response = await fetch(
          'https://thingproxy.freeboard.io/fetch/https://api.deezer.com/chart/tracks?limit=100&index=0'
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        const topTracks = result.tracks.data;

        setSongs(topTracks.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist.name,
          posterUrl: track.album.cover_medium,
          preview: track.preview
        })));
        
      } catch (error) {
        console.error('Error fetching trending songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingSongs();
  }, []);

  const SongCard = ({ song }) => {
    const handlePlay = () => {
      if (songUrl === song.preview && isPlaying) {
        pauseSong();
      } else {
        setSong(song)
        playSong(song.preview);
        song.play(song.preview);
      }
    };

    return (
      <div className="song-card">
        <img src={song.posterUrl} alt={song.title} className="poster-img" />
        <div className="song-info">
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
        </div>
        <div className="play-button" onClick={handlePlay}>
          <div className="play-circle">
            <div className={songUrl === song.preview && isPlaying ? 'pause-icon' : 'play-icon'}></div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading trending songs...</div>;

  return (
    <div className="main-content">
      <div className="song-grid">
        {songs.map(song => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default MainContent;
