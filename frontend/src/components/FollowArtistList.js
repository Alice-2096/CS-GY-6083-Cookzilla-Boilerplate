import React from 'react';

export default function FollowArtistList(props) {
  return (
    <div className="follow-container">
      <h5>Your Following: </h5>
      <ul className="follow-list">
        {props.artists.map((artist) => (
          <li className="follower">
            <div className="follow-info">
              <div className="follow-name">{artist}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}