import React, { useEffect, useState } from 'react';
import '../css/playlist.css';
import AuthService from '../services/auth.service';
import CreatePlaylist from './CreatePlaylist';
import AddSongsToPlaylist from './AddSongsToPlaylist';

const API_URL = 'http://localhost:3000/';

export default function Playlist() {
  const currentUser = AuthService.getCurrentUser();
  const [playlists, setPlaylists] = useState([]);
  const [description, setDescription] = useState([]);
  const [playlistName, setPlaylistName] = useState([]);
  const [title, setTitle] = useState([]);
  const [addedToPlaylistName, setAddedToPlaylistName] = useState([]);
  const [success, setSuccess] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [activeSections, setActiveSections] = useState([]);

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

  const toggleSection = (playlistName) => {
    if (activeSections.includes(playlistName)) {
      setActiveSections(activeSections.filter((i) => i !== playlistName));
    } else {
      setActiveSections([...activeSections, playlistName]);
    }
  };


  
  
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
          setAddSuccess(true);
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
          setSuccess(true);
          const newPlaylists = [...playlists];
          const playlistsToUpdate = playlists.filter(
            (playlist) => playlist.playlistName === playlistName
          );
          const updatedPlaylist = playlistsToUpdate[0];
          const songs = updatedPlaylist.songsInPlaylist.split(',');
          songs.push(song);
          updatedPlaylist.songsInPlaylist = songs.join(',');
          setPlaylists(newPlaylists);
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


  const handleDelete = (playlistName) => {
    removePlaylist(playlistName);
    console.log();
  };

  //invoked onclick of delete button
  const removePlaylist = async (playlistToRemove) => {
    try{
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
      const newPlaylists = playlists.filter(
        (playlist) => playlist.playlistName === playlistToRemove
      );
      setPlaylists(newPlaylists);
    }
    } catch(err){
      console.error(err.response.data);
    }
  };

  return (
    <div className="playlist-container">
      <div className="playlist">
      {playlists.length == 0 ? (
        <h4>You do not have any playlist for now</h4>
      ) : (
        <div> 
        <h2>My Playlists</h2>
        <span>Click to see songs in the playlist</span>
        </div>
      )}
      
        {playlists.map((playlist, playlistName) => (
          <div key={playlist}>
            <button type="show" 
                    onClick={() => toggleSection(playlistName)}>
              {playlist.playlistName}
            </button> 
            <button type="delete"
                    onClick={() => handleDelete(playlist.playlistName)}>
              Delete Playlist
            </button>
            {activeSections.includes(playlistName) && 
            <ul>
              {playlist.songsInPlaylist.map((song) => (
                <li key={song}>{song}</li>
              ))}
            </ul>}
          </div>  
        ))}
      </div>

        <CreatePlaylist 
        addSuccess={addSuccess}
        setAddSuccess={setAddSuccess}
        handleSubmitPlaylist={handleSubmitPlaylist}
        playlistName={playlistName}
        handlePlaylistNameChange={handlePlaylistNameChange}
        description={description}
        handleSetDescription={handleSetDescription}/>
     

       <AddSongsToPlaylist 
        handleSubmitSong={handleSubmitSong} 
        title={title}
        success={success}
        setSuccess={setSuccess}
        handleSongTitleChange={handleSongTitleChange}
        addedToPlaylistName={addedToPlaylistName}
        handleAddedToPlayListNameChange={handleAddedToPlayListNameChange} /> 
    </div>
  );
}
