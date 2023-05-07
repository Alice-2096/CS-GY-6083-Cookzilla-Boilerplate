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

export default function SearchUser(props) {
    const [newSearch, setNewSearch] = useState('');

    const handleSearchInputChange = (event) => {
     setNewSearch(event.target.value);
    };


    const handleSearchUser = (e) => {
      e.preventDefault();
      props.onSearchUser(newSearch);
      console.log('new search user: ' + newSearch);
    };

  return (
    <div className="search-container">
      <h4>Search User: </h4>
      <Form onSubmit={handleSearchUser}>
        <label htmlFor="username"></label>
        <Input
          type="text"
          placeholder="Search by username"
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
