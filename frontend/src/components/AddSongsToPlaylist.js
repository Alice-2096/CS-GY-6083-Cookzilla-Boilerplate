import React, { useState } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import '../css/playlist.css';
import AuthService from '../services/auth.service';

const API_URL = 'http://localhost:3000/';

export default function AddSongsToPlaylist() {
const [title, setTitle] = useState([]);
const [playlists, setPlaylists] = useState([]);
const [success, setSuccess] = useState(false);
const [addedToPlaylistName, setAddedToPlaylistName] = useState([]);
const currentUser = AuthService.getCurrentUser();
const username = currentUser.username;

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const handleSubmitSong = (event) => {
  event.preventDefault();
  addSong(username, title, addedToPlaylistName);
};

const addSong = async(username, title, addedToPlaylistName) => {
  try{
  const response = fetch(API_URL + 'addtoplaylist', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      title: title,
      playlistName: addedToPlaylistName,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    // .then((response) => response.json())
    // .then((data) => {
    //   setPlaylists([...playlists, data]);
    // })
    // .catch((error) => console.log(error));
    if(response.ok){
      const data = await response.json();
      console.log(data);
      setPlaylists([...playlists, data]);
      setSuccess(true);
      setTimeout(()=>{
        setSuccess(false); 
      },5000);
    }
  }catch(err){
    console.error(err);
  }
};


  return(
    <div className="playlist">
        <span>Add Song To Playlist</span>
        {success && (
          <div className="alert alert-success" role="alert">
            Song added to playlist successfully!
          </div>
        )}
        <Form name="addsong" onSubmit={handleSubmitSong}>
          <label htmlFor='title'>
            Song Title:
            <Input
              name="title"
              placeholder="Enter song title here"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              validations={[required]}
            ></Input>
          </label>
          <label htmlFor='addedToPlaylistName'>
            Playlist Name:
            <Input
              name="addedToPlaylistName"
              placeholder="Enter playlist name here"
              type="text"
              value={addedToPlaylistName}
              onChange={(e) => setAddedToPlaylistName(e.target.value)}
              validations={[required]}
            ></Input>
          </label>
          <button type="submit">Add Song To Playlist</button>
        </Form>
      </div>
  );
}
