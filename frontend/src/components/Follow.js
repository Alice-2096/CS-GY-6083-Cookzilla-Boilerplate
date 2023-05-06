import React, { useEffect, useState } from 'react';
import AuthService from '../services/auth.service';
import '../css/Follow.css';
import FollowUser from './FollowUser';
import FollowArtist from './FollowArtist';
import FollowUserList from './FollowUserList';
import FollowArtistList from './FollowArtistList';


const API_URL = 'http://localhost:3000/';

export default function Follow() {
  const currentUser = AuthService.getCurrentUser();
  const [follows, setFollows] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [artists, setArtists] = useState([]);

  // fetch following and follower lists from backend
  useEffect(() => {
    fetch(API_URL + `getfollows?username=${currentUser.username}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        // extract follows and followers from the data tuple
        const [followsList, followersList] = data;
        setFollows(followsList);
        setFollowers(followersList);
      })
      .catch((error) => console.log(error));
  }, []);

  //fetch following artists from backend
    useEffect(() => {
        fetch(API_URL + `getfollowingArtists?username=${currentUser.username}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => { setArtists(data);
        })
            .catch((error) => console.log(error));
    }, []);

  // handle following new user
  const handleFollowUser = (newFollow) => {
    fetch(API_URL + 'followUser', {
      method: 'POST',
      body: JSON.stringify({
        usr_follower: currentUser.username,
        usr_follows: newFollow,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  };

  //handle following new artist
    const handleFollowArtist = (newArtist) => {
        fetch(API_URL + 'followArtist', {
            method: 'POST',
            body: JSON.stringify({
                usr_follower: currentUser.username,
                artist_followed: newArtist,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.log(error));
    };


  return (
    <div className="follow-window">
      <FollowUser onFollowUser={handleFollowUser}></FollowUser>
      <FollowUserList 
      follows={follows}
      followers={followers}
      >
      </FollowUserList>
      <FollowArtist onFollowArtist={handleFollowArtist}></FollowArtist>
      <FollowArtistList artists={artists}></FollowArtistList>
    </div>
  );
}