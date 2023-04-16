import React, { useEffect, useState } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';

export default function AddSongsToPlaylist(props) {
  const [ret, setRet] = useState(0);
  const [title, setTitle] = useState([]);
  const [addedToPlaylistName, setAddedToPlaylistName] = useState([]);

  const required = (value) => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };

  useEffect(() => {
    let timeoutId;
    if (ret) {
      timeoutId = setTimeout(() => {
        setRet(0);
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [ret]);

  const handleAddSong = (e) => {
    e.preventDefault();
    props.onAddSong(addedToPlaylistName, title);
    setRet(1);
  };

  return (
    <div className="playlist">
      <Form name="addsong" onSubmit={handleAddSong}>
        <label>
          Song:
          <Input
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            validations={[required]}
          ></Input>
        </label>
        <label>
          Playlist Name:
          <Input
            name="playlistName"
            type="text"
            value={addedToPlaylistName}
            onChange={(e) => setAddedToPlaylistName(e.target.value)}
            validations={[required]}
          ></Input>
        </label>
        <button type="submit">Add Song To Playlist</button>
      </Form>
      {ret === 1 && (
        <div className="success-alert">Song Added to the Playlist!</div>
      )}
    </div>
  );
}
