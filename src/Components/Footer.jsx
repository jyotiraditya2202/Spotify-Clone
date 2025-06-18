import React from 'react';
import './Footer.css';
import {
  MdShuffle,
  MdSkipPrevious,
  MdPlayCircleFilled,
  MdSkipNext,
  MdRepeat,
  MdDevices,
  MdQueueMusic,
  MdLyrics,
  MdVolumeUp,
  MdFullscreen,
  MdPauseCircleFilled
} from 'react-icons/md';

import useAudioPlayer from '../Hooks/HandleCurrentSong';

const Footer = () => {

  const { CurrentSong ,songUrl, isPlaying, playSong, pauseSong, setSong, resumeSong } = useAudioPlayer();

  console.log(CurrentSong)
  
  return(
  <div className="footer">
    {/* Left: album art + info */}
    <div className="footer__left">
      <img
        className="footer__albumLogo"
        src={CurrentSong ? CurrentSong.posterUrl : 'https://via.placeholder.com/60'}    
        alt="Album Cover"
      />
      <div className="footer__songInfo">
        <h4>{CurrentSong ? CurrentSong.title : "No Title"}</h4>
        <p>{CurrentSong ? CurrentSong.artist : "No Artist"}</p>
      </div>
    </div>

    {/* Center: playback controls + progress */}
    <div className="footer__center">
      <div className="footer__controls">
        <MdShuffle className="footer__icon footer__green" />
        <MdSkipPrevious className="footer__icon" />
        {
          isPlaying ?(
            <MdPauseCircleFilled fontSize={40} className="footer__icon" onClick={pauseSong}/>
          ):(
            <MdPlayCircleFilled fontSize={40} className="footer__icon" onClick={resumeSong}/>
          ) 
        }
        <MdSkipNext className="footer__icon" />
        <MdRepeat className="footer__icon footer__green" />
      </div>
      <div className="footer__controls_responsive">
      {
          isPlaying ?(
            <MdPauseCircleFilled fontSize={40} className="footer__icon" onClick={pauseSong}/>
          ):(
            <MdPlayCircleFilled fontSize={40} className="footer__icon" onClick={resumeSong}/>
          ) 
      }
        
      </div>
      <div className="footer__progress">
        <span className="footer__time">0:08</span>
        <input
          type="range"
          min="0"
          max="100"
          className="footer__slider"
        />
        <span className="footer__time">3:27</span>
      </div>
    </div>
  </div>
  );
};

export default Footer;
