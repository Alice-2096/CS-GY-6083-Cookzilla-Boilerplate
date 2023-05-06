import React from 'react';
import '../css/Follow.css';

export default function FollowUserList(props) {
  return (
    <div className="follow-container">
      <h5>Your Following: </h5>
      <ul className="follow-list">
        {props.follows.map((follow) => (
          <li className="follower">
            <div className="follow-info">
              <div className="follow-name">{follow}</div>
            </div>
          </li>
        ))}
      </ul>
      <h5>Your Follower: </h5>
      <ul className="follow-list">
        {props.followers.map((follower) => (
          <li className="follower">
            <div className="follow-info">
              <div className="follow-name">{follower}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}