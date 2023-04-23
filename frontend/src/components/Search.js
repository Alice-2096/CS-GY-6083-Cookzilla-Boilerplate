import React, { useState, useRef } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';

const API_URL = 'http://localhost:3000/';

export default function Search(props) {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [rating, setRating] = useState('');
  const [genre, setGenre] = useState('');
  const form = useRef();

  const onSearch = async (fname, lname, genre, rating) => {
    try {
      const response = await fetch(API_URL + 'querysongs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fname: fname,
          lname: lname,
          genre: genre,
          rating: rating,
        }),
      });
      console.log(fname, lname, genre, rating);
      const data = await response.json();
      console.log(data);
      props.onData(data['songs']);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(fname, lname, genre, rating);
  };

  return (
    <Form className="search-form" onSubmit={handleSearch} ref={form}>
      <label htmlFor="artist">Search by Artist's first name</label>
      <Input
        type="text"
        name="fname"
        value={fname}
        placeholder="Enter first name of artist here"
        onChange={(e) => setFname(e.target.value)}
        className="search-input"
      />
      <label htmlFor="artist">Search by Artist's last name</label>
      <Input
        type="text"
        name="lname"
        placeholder="Enter last name of artist here"
        value={lname}
        onChange={(e) => setLname(e.target.value)}
        className="search-input"
      />
      <label htmlFor="rating">Search by Genre</label>
      <Input
        type="text"
        name="genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="rating-input"
      />
      <label htmlFor="rating">Search by Rating</label>
      <Input
        type="number"
        name="rating"
        min="1"
        max="5"
        placeholder="Filter by average rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="genre-input"
      />
      <br />
      <button type="submit" className="search-button">
        Search
      </button>
    </Form>
  );
}
