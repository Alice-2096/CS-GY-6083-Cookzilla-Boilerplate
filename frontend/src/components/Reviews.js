import React, { useEffect, useState } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import AuthService from '../services/auth.service';
import '../css/Reviews.css';

const API_URL = 'http://localhost:3000/';

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export default function Reviews() {
  const [songTitle, setSongTitle] = useState('');
  const [songList, setSongList] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [reviewText, setReviewText] = useState('');

  const currentUser = AuthService.getCurrentUser();
  const username = currentUser.username;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await fetch(
          API_URL + `pastreviews?username=${username}`
        );
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      }
    };
    getReviews();
  }, []);

  const handleSongTitleChange = (event) => {
    setSongTitle(event.target.value);
  };

  const handleReviewChange = (event) => {
    setReviewText(event.target.value);
  };

  function handleSearch(event) {
    event.preventDefault();
    // Fetch the list of songs from an API or a database based on the song title
    fetch(API_URL + `searchsongs?songtitle=${songTitle}`)
      .then((response) => response.json())
      .then((data) => {
        setSongList(data);
      });
  }

  function handleSongSelect(song) {
    setSelectedSong(song);
  }

  function handleReviewTextChange(event) {
    setReviewText(event.target.value);
  }

  const handleReviewSubmit = async (username, songID, reviewText) => {
    try {
      const response = await fetch(API_URL + 'reviewsong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          songID: songID,
          reviewText: reviewText,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const updatedData = {
          ...data,
          songTitle: selectedSong.title,
          fname: selectedSong.fname,
          lname: selectedSong.lname,
        };
        setReviews([...reviews, updatedData]);
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
    handleReviewSubmit(username, selectedSong.songID, reviewText);
    setSelectedSong(null);
    setReviewText('');
  };

  return (
    <div className="review-rate-container">
      <div className="review-rate">
        <span>Create New Review</span>
        {success && (
          <div className="alert alert-success" role="alert">
            Review added successfully!
          </div>
        )}
        {error && (
          <div className="alert alert-danger" role="alert">
            Invalid song name!
          </div>
        )}

        <Form onSubmit={handleSearch}>
          <label htmlFor="songTitle">
            Song Title:
            <Input
              name="songTitle"
              placeholder="Enter song title here"
              validations={[required]}
              type="text"
              value={songTitle}
              onChange={handleSongTitleChange}
            />
          </label>
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
          <form onSubmit={handleSubmit}>
            <h3>
              {selectedSong.title} by {selectedSong.fname} {selectedSong.lname}
            </h3>
            <label htmlFor="review-text">Review:</label>
            <textarea
              id="review-text"
              value={reviewText}
              onChange={handleReviewTextChange}
              rows="5"
            />
            <button type="submit">Submit Review</button>
          </form>
        )}
        {reviews.length > 0 && (
          <div className="past-reviews">
            <h2>Your Past Reviews</h2>
            <ul>
              {reviews.map((review) => (
                <li key={review.id}>
                  <h3>
                    {review.title}
                    {review.songTitle} by {review.fname} {review.lname}
                  </h3>
                  <p>{review.reviewText}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
