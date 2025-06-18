import './Header.css';
import HandleLoginHook from '../Hooks/HandleLogin';
import { FaSearch } from 'react-icons/fa';
import useAudioPlayer from '../Hooks/HandleCurrentSong';
import React, { useState, useEffect } from 'react';
import HandlePageState from '../Hooks/HandlePageState';
import { motion, AnimatePresence } from 'framer-motion';


// Logo Component
const Logo = () => {
  return <div className="logo"></div>;
};

// HomeIcon Component
const HomeIcon = ({onClick}) => {
  return <div className="home-icon" onClick={onClick}>=</div>;
};

const SideBar = () => {
  const [playlists, setPlaylists] = useState([]);
  const { IsLogin,Login,Logout,CurrentUser } = HandleLoginHook();
  const { CurrentPage, SetPage } = HandlePageState();

  const FetchPlayList = async () => {
      const user_id = CurrentUser;
    
      if (!user_id) {
        console.log("User has not logged in yet!!");
        return [];
      }
    
      try {
        const response = await fetch('http://localhost:5000/Playlist/check_user_id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user_id })
        });
    
        const data = await response.json();
    
        if (response.ok) {
          console.log("PlayList Is Fetched!!", data.playlists);
          return data.playlists;
        } else {
          console.log("Error:", data.error);
          return [];
        }
      } catch (error) {
        console.error("Error Fetching the Data:", error);
        return [];
      }
    };
  

  const CreatePlaylist = async() => {
      const name = prompt("Enter Playlist Name:")
      if (!name) return alert("Playlist name cannot be empty!!");
      const id = CurrentUser;

      try{
          const response = await fetch('http://localhost:5000/Playlist/insert',
          
              {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, id })
              }
          );

          const data = await response.json();

          if (!response.ok){
              throw new Error (data.error || 'Unkown Error ');
          }
          alert(`Playlist Creater Succesfully!!`)
          const updatedPlaylists = await FetchPlayList();
          setPlaylists(updatedPlaylists);

      }
      catch(error){
          
          console.error("Error during login:", error);
          alert("An error occurred. Please try again.");
      }

  };

  useEffect(() => {
    const fetchData = async () => {
      if (IsLogin) {
        const data = await FetchPlayList();
        setPlaylists(data);
      }
    };
    fetchData();
  }, [IsLogin]);


  return <motion.div className='SideBar'
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            
          <button onClick={CreatePlaylist}>Create</button>
          
    {
      IsLogin ?(
        <>
          {playlists.length > 0 ? (
            playlists.map((playlist, index) => (
              <div key={index} className="PlayListCard" onClick={() => SetPage(1)}>
                <div className="SearchSong-Card">
                  <img src="#" alt="" className="Poster" />
                  <h4 className="Poster-Title">{playlist.name}</h4>
                  <div className="play-button">
                    <div className="play-circle"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No playlists found.</p>
          )}
        </>

      ):
      (
        <h4>Login to make playlist!!</h4>
      )
    }
    
  </motion.div>
}


// SearchBar Component
const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(''); 
  const [songs, setSongs] = useState([]);
  
    // ResultsDiv Component
    const ResultsDiv = () => {
      const { CurrentSong, playSong, pauseSong, setSong, songUrl, isPlaying } = useAudioPlayer();

        const handlePlay = (song) => {
          setIsFocused(true);

          if (song.preview === CurrentSong?.preview && isPlaying){
            pauseSong();
          }
          else{
          setSong({
            id: song.id,
            title: song.title,
            artist: song.artist.name,
            posterUrl: song.album.cover_medium,
            preview: song.preview
          });
          playSong(song.preview);
          }
        };

          return (
          <div className="results-div">
          {songs.map((song) => (
              <div key={song.id} className="SearchSong-Card" onClick={() => handlePlay(song)}>
                  <img src={song.album.cover} alt={song.title} className="Poster" />
                  <h4 className="Poster-Title">{song.title}</h4>
                  <div className="play-button" onClick={() => handlePlay(song)}>
                  <div className="play-circle">
                      <div className={songUrl === song.preview && isPlaying ? 'pause-icon' : 'play-icon'}></div>
                    </div>
                  </div>
              </div>
          ))}
          
          </div>
          );
      };


  //To Get the searched song from api
  const searchSong = async () => {

    if (!query) return;
    const url = `https://thingproxy.freeboard.io/fetch/https://api.deezer.com/search?q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        setSongs(data.data);
        setIsFocused(true)

    } catch (error) {
        console.error('Error fetching data:', error);
    }
    };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <button onClick={searchSong} className='search-icon'>
            <FaSearch size={20} />
        </button>
        
        <input
          type="text"
          placeholder="What do you want to play?"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
      </div>
      {isFocused && <ResultsDiv />}
    </div>
  );
};

// RightLinks Component
const RightLinks = () => {

    const { IsLogin,Login,Logout } = HandleLoginHook();

    //Signup Registration
    const HandleSignup = async() => {
        const name = prompt("Enter User-Name:")
        if (!name) return alert("name cannot be empty!!");

        const password = prompt("Enter Password:")
        if (!password) return alert("password cannot be empty!!");

        try{

            const response = await fetch('http://localhost:5000/User/insert',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, password })
                }
            );

            const data = await response.json();

            if (!response.ok){
                throw new Error (data.error || 'Unkown Error ');
            }
            alert(`Registered in Succesfully!!`);
            const userId = data.user._id;
            Login(userId);

        }
        catch(error){
            
            console.error("Error during login:", error);
            alert("An error occurred. Please try again.");
        }

    };

    //Login Authentication
    const HandleLogin = async() => {

        const Username = prompt("Enter User-Name:")
        if (!Username) return alert("name cannot be empty!!");

        const password = prompt("Enter Password:")
        if (!password) return alert("password cannot be empty!!");
        
        try {

            const response =await fetch('http://localhost:5000/User/Check',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Username, password })
                }
            );

            const data = await response.json();
            

            if (!response.ok){
                throw new Error (data.error || 'Unkown Error ');
            }
            alert(`Loged in Succesfully!!`)
            const userId = data.user._id;
            Login(userId)

        }

        catch(error){

            console.error("Error during login:", error);
            alert("An error occurred. Please try again.");

        }

    };
  return (
    <div className="right-links">
      
      {
        IsLogin?(
        <button className="login-btn" onClick={Logout}>Logout</button>
        )
            :   
        (
        <>
        <a href='#' onClick={HandleSignup}>Sign up</a>
        <button className="login-btn" onClick={HandleLogin}>Login</button>
        </>
        )
      }
    </div>
  );
};


// Header Component
const Header = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  return (
    <header className="header">
      <div className="left-section">
        <Logo />
        <HomeIcon onClick={() => setSidebarVisible(!isSidebarVisible)}/>
        <AnimatePresence>
        {isSidebarVisible && <SideBar />}
        </AnimatePresence>

      </div>
      <SearchBar />
      <div className="right-section">
        <RightLinks />
      </div>
    </header>
  );
};

export default Header;