import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
py

const app = express();
app.use(cors());
app.use(express.json());

//--------Data Base Connection--------
mongoose.connect('mongodb://localhost:27017/Spotify')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

//--------Model declarations--------
const UserSchema = new mongoose.Schema({
  name: String,
  password: String
});
const Users = mongoose.model('users', UserSchema);

const PlayListSchema = new mongoose.Schema({
  name: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
});
const Playlists = mongoose.model('Playlists', PlayListSchema);

const PlaylistSongSchema = new mongoose.Schema({
  playlist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlists',
    required: true
  },
  song_url: String
});
const PlaylistsSongs = mongoose.model('PlaylistsSongs', PlaylistSongSchema);

//--------User Schema APIs--------

// User Insert
app.post('/User/insert', async (req, res) => {
  const { name, password } = req.body;

  try {
    if (!name || !password) {
      return res.status(400).json({ error: 'All Fields are required!' });
    }

    const newUser = new Users({ name, password });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error Registering the user: ' + error.message });
  }
});

// User Delete
app.post('/User/delete', async (req, res) => {
  const { id } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: 'User ID is required!' });
    }

    const deletedUser = await Users.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found!' });
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the user: ' + error.message });
  }
});

// User Check (using Query Params for GET)
app.post('/User/check', async (req, res) => {
  const { Username, password } = req.body;

  try {
    if (!Username) {
      return res.status(400).json({ error: 'User name is required!' });
    }
    const user = await Users.findOne({name: Username});
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }
    if (password !== user.password){
        return res.status(401).json({ error: 'Invalid password!' });
    }
    res.status(200).json({ message: 'User exists!', user });
  } catch (error) {
    res.status(500).json({ error: 'Error checking user: ' + error.message });
  }
});

//-----------Playlist Schema Operations---------

// Playlist Insert
app.post('/Playlist/insert', async (req, res) => {
  const { name, id } = req.body;

  try {
    if (!name || !id) {
      return res.status(400).json({ error: 'All Fields are required!' });
    }

    const newPlaylist = new Playlists({ name, user_id: id });
    await newPlaylist.save();

    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ error: 'Error Creating the playlist: ' + error.message });
  }
});

// Playlist Delete
app.post('/Playlist/delete', async (req, res) => {
  const { id } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: 'ID is required!' });
    }

    const deletedPlaylist = await Playlists.findByIdAndDelete(id);

    if (!deletedPlaylist) {
      return res.status(404).json({ error: 'Playlist not found!' });
    }

    res.status(200).json({ message: 'Playlist deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the playlist: ' + error.message });
  }
});

// Playlist Check using playlist id

app.post('/Playlist/check_id', async (req, res) => {
    const {id} = req.query;
  
    try {
      if (!id) {
        return res.status(400).json({ error: 'ID is required!' });
      }
  
      const checkPlaylist = await Playlists.findById(id);
  
      if (!checkPlaylist) {
        return res.status(404).json({ error: 'Playlist not found!' });
      }
  
      res.status(200).json({ message: 'Playlist exists!', playlist: checkPlaylist });
    } catch (error) {
      res.status(500).json({ error: 'Error checking playlist: ' + error.message });
    }
});

// Playlist Check using user id

app.post('/Playlist/check_user_id', async (req, res) => {
    const {id} = req.body;

    try {
      if (!id) {
        return res.status(400).json({ error: 'ID is required!' });
      }
  
      const userPlaylists = await Playlists.find({ user_id: id });
  
      if (userPlaylists.length === 0) {
        return res.status(404).json({ error: 'No playlists found for this user!' });
      }
  
      res.status(200).json({ message: 'Playlists found!', playlists: userPlaylists });
    } catch (error) {
      res.status(500).json({ error: 'Error checking playlists: ' + error.message });
    }
});

// Server Listen
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
