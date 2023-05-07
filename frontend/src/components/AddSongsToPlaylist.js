import React, { useEffect, useState } from 'react';
import '../css/playlist.css';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';

const API_URL = 'http://localhost:3000/';

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export default function AddSongsToPlaylist(props) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [addSongError, setAddSongError] = useState(false);
  const [addedToPlaylistName, setAddedToPlaylistName] = useState([]);
  const [songTitle, setSongTitle] = useState('');
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  //const [success, setSuccess] = useState(false)

  const handleSongTitleChange = (event) => {
    setSongTitle(event.target.value);
  };

  function handleSongSelect(song) {
    setSelectedSong(song);
  }

  const handleAddedToPlayListNameChange = (event) => {
    setAddedToPlaylistName(event.target.value);
  };

  const handleSubmitSong = (event) => {
    event.preventDefault();
    props.onAddSong(addedToPlaylistName, selectedSong.title);
  };

  //handle search song
  const handleSearchSong = (event) => {
    event.preventDefault();
    fetch(API_URL + `searchsongs?songtitle=${songTitle}`)
      .then((response) => response.json())
      .then((data) => {
        setSongs(data);
      });
  };

  useEffect(() => {
    console.log('props.success changed:', props.success);
    if (props.success) {
      setShowSuccess(true);
      // Hide the success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        props.setSuccess(false);
      }, 3000);
    }
  }, [props.success]);

  useEffect(() => {
    console.log('props.addSongError changed:', props.addSongError);
    if (props.addSongError) {
      setAddSongError(true);
      // Hide the error message after 3 seconds
      setTimeout(() => {
        setAddSongError(false);
      }, 3000);
    }
  }, [props.addSongError]);

  return (
    <div className="playlist">
      <span>Add Song To Playlist</span>
      {showSuccess && (
        <div className="alert alert-success" role="alert">
          Song added to playlist successfully!
        </div>
      )}
      {addSongError && (
        <div className="alert alert-danger" role="alert">
          Error adding song to playlist!
        </div>
      )}
      <Form name="searchsong" onSubmit={handleSearchSong}>
        <label htmlFor="songTitle">
          Search by Song Title:
          <Input
            name="songTitle"
            placeholder="Enter song title here"
            type="text"
            value={songTitle}
            onChange={handleSongTitleChange}
            validations={[required]}
          ></Input>
        </label>
        <button type="submit">Search</button>
      </Form>
      <br></br>
      {songs.length > 0 ? (
        <ul>
          {songs.map((song) => (
            <li key={song.id}>
              <button type="button" onClick={() => handleSongSelect(song)}>
                {song.title} by {song.fname} {song.lname}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
      {selectedSong && (
        <Form onSubmit={handleSubmitSong}>
          <h4>
            {selectedSong.title} by {selectedSong.fname} {selectedSong.lname}
          </h4>
          <label htmlFor="addedToPlaylistName">
            Playlist Name:
            <Input
              name="addedToPlaylistName"
              placeholder="Enter playlist name here"
              type="text"
              value={addedToPlaylistName}
              onChange={handleAddedToPlayListNameChange}
              validations={[required]}
            ></Input>
          </label>
          <button type="submit">Add To This Playlist</button>
        </Form>
      )}
      {/* <ul>
          {songs.map((song) => (
            <div>
              <h4>{song.title}</h4>
              <Input
              name="addedToPlaylistName"
              placeholder="Enter playlist name here"
              type="text"
              value={addedToPlaylistName}
              onChange={handleAddedToPlayListNameChange}
              validations={[required]}
            ></Input>
              <button type="add" onClick={() => 
              props.onAddSong(addedToPlaylistName, song.title)}>Add To Playlist</button>
            </div>
          ))}
        </ul> */}
    </div>
  );
}
