import React, { useState } from 'react';
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
  const [newSearch, setNewSearch] = useState('');

  const handleSearchInputChange = (event) => {
   setNewSearch(event.target.value);
  };


  const handleSearchArtist = (e) => {
    e.preventDefault();
    props.onSearchArtist(newSearch);
    console.log('new search artist: ' + newSearch);
  };

  return (
    <div className="search-container">
      <h4>Search Artist: </h4>
      <Form onSubmit={handleSearchArtist}>
        <label htmlFor="username"></label>
        <Input
          type="text"
          placeholder="Search by artist name"
          value={newSearch}
          onChange={handleSearchInputChange}
          validations={[required]}
        />
        <br/>
        <button> Search </button>
      </Form>
    </div>
  );
}