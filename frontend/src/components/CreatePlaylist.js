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

export default function CreatePlaylist(props) {

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    console.log('props.addSuccess changed:', props.addSuccess);
    if (props.addSuccess) {
      setShowSuccess(true);
      // Hide the success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        props.setAddSuccess(false);
      }, 3000);
    }
  }, [props.addSuccess]);


  return  (
    <div className="playlist">
    <span>Create A New Playlist</span>
    {showSuccess && (
        <div className="alert alert-success" role="alert">
           You created a new playlist successfully!
         </div>
        )}
    <Form name="newplaylist" onSubmit={props.handleSubmitPlaylist}>
      <label htmlFor="playlistName">
        New Playlist Name:
        <Input
          name="playlistName"
          type="text"
          placeholder="Enter playlist name"
          value={props.playlistName}
          onChange={props.handlePlaylistNameChange}
          validations={[required]}
        ></Input>
      </label>
      <label htmlFor="description">
        Description:
        <Input
          name="description"
          type="text"
          placeholder="Enter description"
          value={props.description}
          onChange={props.handleSetDescription}
          validations={[required]}
        ></Input>
      </label>
      <button type="submit">Create New Playlist</button>
    </Form>
  </div>
);
}
