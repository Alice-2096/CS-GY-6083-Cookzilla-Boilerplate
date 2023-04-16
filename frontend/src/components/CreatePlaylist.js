import React, { useEffect, useState } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';

export default function CreatePlaylist(props) {
  const [description, setDescription] = useState([]);
  const [playlistName, setPlaylistName] = useState([]);
  const [ret, setRet] = useState(0);

  const handlePlaylistNameChange = (event) => {
    setPlaylistName(event.target.value);
  };

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

  const handleAdd = (e) => {
    e.preventDefault();
    props.onCreate(playlistName, description);
    setRet(1);
  };

  return (
    <div className="playlist">
      <Form name="newplaylist" onSubmit={handleAdd}>
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
      {ret === 1 && <div className="success-alert">New Playlist Added!</div>}
    </div>
  );
}
