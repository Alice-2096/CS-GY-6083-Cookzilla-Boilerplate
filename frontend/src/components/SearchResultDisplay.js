import React, { useState } from 'react';

const API_URL = 'http://localhost:3000/';

export default function SearchResultDisplay(props) {
  const [reviewStates, setReviewStates] = useState({});

  const fetchReviews = async (songId) => {
    const response = await fetch(API_URL + `getreviews?songID=${songId}`);
    const data = await response.json();
    return data;
  };
  const fetchRatings = async (songId) => {
    const response = await fetch(API_URL + `getratings?songID=${songId}`);
    const data = await response.json();
    return data[0].rating;
  };
  const handleAccordionClick = (songID) => {
    if (!reviewStates[songID] || !reviewStates[songID].isOpen) {
      console.log('opening');
      Promise.all([fetchRatings(songID), fetchReviews(songID)])
        .then(([ratings, reviews]) => {
          setReviewStates((prevState) => ({
            ...prevState,
            [songID]: { isOpen: true, reviews, rating: ratings },
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log('closing');
      setReviewStates((prevState) => ({
        ...prevState,
        [songID]: { isOpen: false },
      }));
    }
  };

  return (
    <div className="search-result-container">
      {props.results && props.results.length > 0 ? (
        props.results.map((result) => {
          const reviewState = reviewStates[result.songID];
          const isOpen = reviewState && reviewState.isOpen;
          const reviews = reviewState && reviewState.reviews;
          const rating = reviewState && reviewState.rating;
          return (
            <div key={result.id} className="search-result">
              <a href={result.songURL} target="_blank">
                <p className="song-title">
                  {result.title} By {result.fname} {result.lname}{' '}
                </p>
                <p className="song-album">In Album: {result.albumTitle} </p>
              </a>
              <button
                className={isOpen ? 'hide-button' : 'show-button'}
                onClick={() => handleAccordionClick(result.songID)}
              >
                {isOpen
                  ? 'Hide Reviews and Ratings'
                  : 'Show Reviews and Ratings'}
              </button>
              {isOpen && (
                <div className="song-reviews">
                  {reviews &&
                    reviews.map((review) => (
                      <div key={review.id}>
                        <p>{review.reviewText}</p>
                      </div>
                    ))}
                  {rating && <p>Average Rating: {rating}</p>}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div>No Results</div>
      )}
    </div>
  );
}
