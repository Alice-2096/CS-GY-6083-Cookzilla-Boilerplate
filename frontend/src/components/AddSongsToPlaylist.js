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

  useEffect(() => {
    console.log('props.success changed:', props.success);
    if (props.success) {
      setShowSuccess(true);
      // Hide the success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  }, [props.success]);

  console.log('AddSongsToPlaylist rendered!');

  return (
    
  <div className="playlist">
    <span>Add Song To Playlist</span>
    {showSuccess && (
        <div className="alert alert-success" role="alert">
           Song added to playlist successfully!
         </div>
        )}
        <Form name="addsong" onSubmit={props.handleSubmitSong}>
          <label htmlFor='title'>
            Song Title:
            <Input
              name="title"
              placeholder="Enter song title here"
              type="text"
              value={props.title}
              onChange={props.handleSongTitleChange}
              validations={[required]}
            ></Input>
          </label>
          <label htmlFor='addedToPlaylistName'>
            Playlist Name:
            <Input
              name="addedToPlaylistName"
              placeholder="Enter playlist name here"
              type="text"
              value={props.addedToPlaylistName}
              onChange={props.handleAddedToPlayListNameChange}
              validations={[required]}
            ></Input>
          </label>
          <button type="submit">Add Song To Playlist</button>
        </Form>
      </div>
);
}
