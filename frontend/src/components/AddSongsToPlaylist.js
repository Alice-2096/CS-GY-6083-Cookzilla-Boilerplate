import React, { useEffect, useState } from 'react';
import '../css/playlist.css';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';

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
  const [title, setTitle] = useState([]);
  //const [success, setSuccess] = useState(false)

  const handleSongTitleChange = (event) => {
    setTitle(event.target.value);
  }

  const handleAddedToPlayListNameChange = (event) =>{
    setAddedToPlaylistName(event.target.value);
  }

  const handleSubmitSong = (event) => {
    event.preventDefault();
    props.onAddSong(addedToPlaylistName, title);
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
          Invalid song or playlist name!
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
              onChange={handleSongTitleChange}
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
              onChange={handleAddedToPlayListNameChange}
              validations={[required]}
            ></Input>
          </label>
          <button type="submit">Add Song To Playlist</button>
        </Form>
      </div>
);
}
