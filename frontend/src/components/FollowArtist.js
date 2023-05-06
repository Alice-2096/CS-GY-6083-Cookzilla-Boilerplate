import React, { useEffect, useState } from 'react';
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

export default function FollowArtist(props) {
    const [newArtist, setNewArtist] = useState('');
    const [ret, setRet] = useState(0);
    const [artistMessage, setArtistMessage] = useState(props.artistMessage);
    
    useEffect(() => {
      console.log('artist message: ' + props.artistMessage);
      setArtistMessage(props.artistMessage);
    }, [props.artistMessage]);
    
    const handleSearchInputChange = (event) => {
     setNewArtist(event.target.value);
    };

   useEffect(() => {
    let timeoutId;
    if (ret) {
      timeoutId = setTimeout(() => {
        setRet(0);
        setNewArtist('');
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [ret]);

  const handleFollowArtist = (e) => {
    e.preventDefault();
    props.onFollowArtist(newArtist);
    console.log('new following artist: ' + newArtist);
    setRet(1);
  };

  return (
    <div className="search-container">
      <h4>Follow Artist: </h4>
      <Form onSubmit={handleFollowArtist}>
        <label htmlFor="username"></label>
        <Input
          type="text"
          placeholder="Search by artist name"
          value={newArtist}
          onChange={handleSearchInputChange}
          validations={[required]}
        />
        <br />
        <button> Follow </button>
      </Form>
      {ret === 1 && <p>{artistMessage}</p>}
    </div>
  );
}