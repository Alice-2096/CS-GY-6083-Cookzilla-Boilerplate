import React, { useEffect, useState } from 'react';
import '../css/playlist.css';
import AuthService from '../services/auth.service';
import CreatePlaylist from './CreatePlaylist';
import AddSongsToPlaylist from './AddSongsToPlaylist';
import PlaylistDisplay from './PlaylistDisplay';

const API_URL = 'http://localhost:3000/';

export default function Playlist() {
  const currentUser = AuthService.getCurrentUser();
  const [playlists, setPlaylists] = useState([]);
  const [description, setDescription] = useState([]);
  const [playlistName, setPlaylistName] = useState([]);
  const [success, setSuccess] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [addSongError, setAddSongError] = useState(false);



  // fetch playlists(playlistName, title[]) from backend
  useEffect(() => {
    fetch(API_URL + `getplaylists?username=${currentUser.username}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => setPlaylists(data))
      .catch((error) => console.log(error));
  }, []);
  
 
 const handleSubmitPlaylist = (event) => {
    event.preventDefault();
    addPlaylist(playlistName, description);
  };

  const handlePlaylistNameChange = (event) => {
    setPlaylistName(event.target.value);
  };

  const handleSetDescription = (event) =>{
    setDescription(event.target.value);
  }

  // handle adding a new playlist
  const addPlaylist = (playlistName, description) => {
    fetch(API_URL + 'createplaylist', {
      method: 'POST',
      body: JSON.stringify({
        playlistName: playlistName,
        description: description,
        username: currentUser.username,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setAddSuccess(true);
          const newPlaylists = [...playlists];
          newPlaylists.push({
            playlistName: playlistName,
            description: description,
            songsInPlaylist: [],
          });
          setPlaylists(newPlaylists);
          console.log();
        } else if (response.status === 500) {
          // Handle not found error
          setAddError(true); 
          setTimeout(() => {
          setAddError(false);
          }, 3000);
        }
      })
      .catch((error) => console.log(error));
  };

  // addind a song to a playlist
  const addSong = (playlistName, song) => {
     fetch(API_URL + 'addtoplaylist', {
      method: 'POST',
      body: JSON.stringify({
        playlistName: playlistName,
        title: song,
        username: currentUser.username,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(true);
          const playlistToUpdate = playlists.find(
            (playlist) => playlist.playlistName === playlistName
          );
          const updatedSongs = [...playlistToUpdate.songsInPlaylist, song];
          playlistToUpdate.songsInPlaylist = updatedSongs;
          setPlaylists([...playlists]);
        } else if (response.status === 500) {
          // Handle not found error
          setAddSongError(true); 
          setTimeout(() => {
          setAddSongError(false);
          }, 3000);
          console.log('Playlist not found');
        }
      })
      .catch((error) => console.log(error));
  };

  //handle song title change
  // const handleSongTitleChange = (event) => {
  //   setTitle(event.target.value);
  // }

  //handle added to playlist name change
  // const handleAddedToPlayListNameChange = (event) =>{
  //   setAddedToPlaylistName(event.target.value);
  // }

  const handleDelete = (playlistName) => {
    removePlaylist(playlistName);
    console.log();
  };

  //invoked onclick of delete button
  const removePlaylist = (playlistToRemove) => {
    fetch(API_URL + 'deleteplaylist', {
      method: 'DELETE',
      body: JSON.stringify({
        playlistName: playlistToRemove,
        username: currentUser.username,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.status === 200) {
        const newPlaylists = playlists.filter(
          (playlist) => playlist.playlistName !== playlistToRemove
        );
        setPlaylists(newPlaylists);
        setDeleteSuccess(true);
        setTimeout(() => {
        setDeleteSuccess(false);
        }, 3000);
      }
    })
    .catch((error) => console.log(error));
  };

  return (
    <div className="playlist-container">

        <PlaylistDisplay
        playlists={playlists}
        handleDelete={handleDelete}
        deleteSuccess={deleteSuccess}
        />

        <CreatePlaylist 
        addSuccess={addSuccess}
        setAddSuccess={setAddSuccess}
        handleSubmitPlaylist={handleSubmitPlaylist}
        playlistName={playlistName}
        handlePlaylistNameChange={handlePlaylistNameChange}
        description={description}
        handleSetDescription={handleSetDescription}
        addError = {addError}/>
     
       <AddSongsToPlaylist 
        onAddSong = {addSong}
        success={success}
        setSuccess={setSuccess}
        addSongError = {addSongError}
        /> 
    </div>
  );
}


