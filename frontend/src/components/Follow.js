import React, { useEffect, useState } from 'react';
import AuthService from '../services/auth.service';
import '../css/Follow.css';
import SearchUser from './SearchUser';
import SearchArtist from './SearchArtist';
import FollowUserList from './FollowUserList';
import FollowArtistList from './FollowArtistList';
import FollowUser from './FollowUser';
import FollowArtist from './FollowArtist';


const API_URL = 'http://localhost:3000/';

export default function Follow() {
  const currentUser = AuthService.getCurrentUser();
  const [follows, setFollows] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [artistMessage, setArtistMessage] = useState('');
  const [userSearchResult, setUserSearchResult] = useState([]);
  const [artistSearchResult, setArtistSearchResult] = useState([]);

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
            .then((data) => {setArtists(data);
        })
            .catch((error) => console.log(error));
    }, []);

  // fetch all usernames that matches the input
  const handleSearchUser = (searchInput) => {
    fetch(API_URL + `getusersearchresults?searchData=${searchInput}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUserSearchResult(data);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  };

  // fetch all artists'names that matches the input
  const handleSearchArtist = (searchInput) => {
    fetch(API_URL + `getartistsearchresults?searchData=${searchInput}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setArtistSearchResult(data);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  };

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
        setUserMessage(data.message);
        if (data.message === 'You started to follow ' + newFollow) {
          setFollows((prevFollows) => [...prevFollows, newFollow]);
        }
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
              setArtistMessage(data.message);
              if (data.message === 'You started to follow ' + newArtist) {
              setArtists((prevArtists) => [...prevArtists, newArtist]);
              }
            })
            .catch((error) => console.log(error));
    };


  return (
    <div className="follow-window">
      <SearchUser onSearchUser={handleSearchUser}></SearchUser>
      <FollowUser userSearchResult={userSearchResult} onFollowUser={handleFollowUser} userMessage={userMessage}></FollowUser>
      <FollowUserList follows={follows} followers={followers}></FollowUserList>
      <SearchArtist onSearchArtist={handleSearchArtist}></SearchArtist>
      <FollowArtist artistSearchResult={artistSearchResult} onFollowArtist={handleFollowArtist} artistMessage={artistMessage}></FollowArtist>
      <FollowArtistList artists={artists}></FollowArtistList>
    </div>
  );
}