import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import '../css/Reviews.css';
import AuthService from '../services/auth.service';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';

const API_URL = 'http://localhost:3000/';

export default function RatingSongs() {
  const currentUser = AuthService.getCurrentUser();
  const username = currentUser.username;

  //add a new rating
  const [songList, setSongList] = useState([]);
  const [songTitle, setSongTitle] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [rating, setRating] = useState(1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  //past ratings
  const [songRatings, setSongRatings] = useState([]);

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
    const getSongRatings = async () => {
      try {
        const response = await fetch(
          API_URL + `pastratings?username=${username}`
        );
        const data = await response.json();
        setSongRatings(data);
      } catch (err) {
        console.error(err);
      }
    };
    getSongRatings();
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    // Fetch the list of songs from db based on the song title
    fetch(API_URL + `searchsongs?songtitle=${songTitle}`)
      .then((response) => response.json())
      .then((data) => {
        setSongList(data);
      });
  }

  function handleSongSelect(song) {
    setSelectedSong(song);
  }

  function handleRatingChange(event) {
    setRating(event.target.value);
  }

  const handleSongTitleChange = (event) => {
    setSongTitle(event.target.value);
  };

  const handleRatingSubmit = async (username, songID, rating) => {
    try {
      const response = await fetch(API_URL + 'ratesong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          songID: songID,
          rating: rating,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSongRatings([...songRatings, data]);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else if (response.status === 500) {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleRatingSubmit(username, selectedSong.songID, rating);
    setSelectedSong(null);
    setRating(0);
  };

  return (
    <div className="review-rate-container">
      <div className="review-rate">
        <span>Add New Rating</span>
        {success && (
          <div className="alert alert-success" role="alert">
            Rating added successfully!
          </div>
        )}
        {error && (
          <div className="alert alert-danger" role="alert">
            Invalid song name!
          </div>
        )}

        <Form onSubmit={handleSearch}>
          <label htmlFor="songTitle">Song Title:</label>
          <Input
            name="songTitle"
            placeholder="Enter song title here"
            validations={[required]}
            type="text"
            value={songTitle}
            onChange={handleSongTitleChange}
          />
          <button type="submit">Search for this song</button>
        </Form>
        {songList.length > 0 ? (
          <ul>
            {songList.map((song) => (
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
          <Form onSubmit={handleSubmit}>
            <h3>
              {selectedSong.title} by {selectedSong.fname} {selectedSong.lname}
            </h3>
            <div className="form-group">
              <label htmlFor="rating">Rating:</label>
              <select
                className="form-control"
                id="rating"
                name="rating"
                value={rating}
                onChange={handleRatingChange}
              >
                <option value="">Select a rating...</option>
                <option value="1">1 - Terrible</option>
                <option value="2">2 - Bad</option>
                <option value="3">3 - Average</option>
                <option value="4">4 - Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Rating
            </button>
          </Form>
        )}

        <div className="past-reviews">
          <h2>Your Past Ratings</h2>
          <ul>
            {songRatings.map((Rating) => (
              <li key={Rating.title}>
                <h3>
                  {Rating.title}
                  {Rating.songTitle}
                </h3>
                <p>
                  Stars: {Rating.rating}
                  {Rating.stars}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
