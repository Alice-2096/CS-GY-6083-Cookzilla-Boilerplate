import React, { useEffect, useState } from 'react';
import '../css/playlist.css';
import AuthService from '../services/auth.service';
import CreatePlaylist from './CreatePlaylist';
import AddSongsToPlaylist from './AddSongsToPlaylist';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';

const API_URL = 'http://localhost:3000/';

export default function Playlist() {
  const currentUser = AuthService.getCurrentUser();
  const [playlists, setPlaylists] = useState([]);
  const [description, setDescription] = useState([]);
  const [playlistName, setPlaylistName] = useState([]);
  const [title, setTitle] = useState([]);
  const [addedToPlaylistName, setAddedToPlaylistName] = useState([]);
  const [success, setSuccess] = useState(false);

  //TODO -- ADDING SUCCESS ALERT FOR ADDING A NEW PLAYLIST AND SONG TO PLAYLIST
  //TODO -- BREAKING DOWN INTO COMPONENTS --- PASSING PROPS TO CHILD COMPONENTS AND USING STATE IN PARENT COMPONENT.
  //TODO -- ADDING DELETE BUTTON FOR PLAYLISTS AND SONGS IN PLAYLISTS
  //TODO -- SHOW SONGS IN PLAYLISTS ON CLICK OF SHOW SONGS BUTTON
  //TODO -- ADDING CSS TO MAKE IT LOOK PRETTY :)

  // fetch playlists(playlistName, title[]) from backend
  useEffect(() => {
    fetch(API_URL + `getplaylists?username=${currentUser.username}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => setPlaylists(data))
      .catch((error) => console.log(error));
  }, []);


  const handleSubmitSong = (event) => {
    event.preventDefault();
    addSong(addedToPlaylistName, title);
  };

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

  const required = (value) => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };

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
        if (response.status == 200) {
          const newPlaylists = [...playlists];
          newPlaylists.push({
            playlistName: playlistName,
            description: description,
            songsInPlaylist: [],
          });
          setPlaylists(newPlaylists);
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
        if (response.status == 200) {
          const newPlaylists = [...playlists];
          const playlistsToUpdate = playlists.filter(
            (playlist) => playlist.playlistName === playlistName
          );
          const updatedPlaylist = playlistsToUpdate[0];
          const songs = updatedPlaylist.songsInPlaylist.split(',');
          songs.push(song);
          updatedPlaylist.songsInPlaylist = songs.join(',');
          setPlaylists(newPlaylists);
          setSuccess(true);
          setTimeout(()=>{
            setSuccess(false);
          },5000);
        }
      })
      .catch((error) => console.log(error));
  };

  //handle song title change
  const handleSongTitleChange = (event) => {
    setTitle(event.target.value);
  }

  //handle added to playlist name change
  const handleAddedToPlayListNameChange = (event) =>{
    setAddedToPlaylistName(event.target.value);
  }

  //invoked onclick of delete button
  const removePlaylist = async (playlistToRemove) => {
    const response = await fetch(API_URL + 'deleteplaylist', {
      method: 'DELETE',
      body: JSON.stringify({
        playlistName: playlistToRemove,
        username: currentUser.username,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      const newPlaylists = [...playlists];
      const playlistsToRemove = playlists.filter(
        (playlist) => playlist.playlistName === playlistToRemove
      );
      setPlaylists(newPlaylists);
    }
  };

  return (
    <div className="playlist-container">
      {playlists.length == 0 ? (
        <h4>You do not have any playlist for now</h4>
      ) : (
        <h4>My Playlists</h4>
      )}
      <ul>
        {playlists.map((playlist) => (
          <div key={playlist.playlistName}>
            <h2>{playlist.playlistName}</h2>
            <button>Show songs</button>
            <ul>
              {playlist.songsInPlaylist.map((song) => (
                <li key={song}>{song}</li>
              ))}
            </ul>
          </div>
        ))}
      </ul>

      <CreatePlaylist 
      handleSubmitPlaylist={handleSubmitPlaylist}
      playlistName={playlistName}
      handlePlaylistNameChange={handlePlaylistNameChange}
      description={description}
      handleSetDescription={handleSetDescription}/>
      {/* <div className="playlist">
        <Form name="newplaylist" onSubmit={handleSubmitPlaylist}>
          <label htmlFor="playlistName">
            New Playlist Name:
            <Input
              name="playlistName"
              type="text"
              value={playlistName}
              onChange={handlePlaylistNameChange}
              validations={[required]}
            ></Input>
          </label>
          <label htmlFor="description">
            Description:
            <Input
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              validations={[required]}
            ></Input>
          </label>
          <button type="submit">Create New Playlist</button>
        </Form>
      </div> */}

      { <AddSongsToPlaylist handleSubmitSong={handleSubmitSong} 
        title={title}
        sucess={success}
        handleSongTitleChange={handleSongTitleChange}
        addedToPlaylistName={addedToPlaylistName}
        handleAddedToPlayListNameChange={handleAddedToPlayListNameChange} /> }
    </div>
  );
}
