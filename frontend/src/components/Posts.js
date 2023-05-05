import React, { useState, useEffect } from 'react';
import AuthService from '../services/auth.service';
import Post from './Post';
const API_URL = 'http://localhost:3000/';

export default function Posts() {
  const [data, setData] = useState([]);
  const [newSongs, setNewSongs] = useState([]);
  const [songslastlogin, setSongsLastLogin] = useState([]);
  const currentUser = AuthService.getCurrentUser();
  const username = currentUser.username;
  const lastlogin = currentUser.lastlogin;

  //fetch new posts from friends -- added lastlogin to only fetch posts after last login
  const fetchData = async (username, lastlogin) => {
    try {
      const response = await fetch(
        API_URL + `newitems?username=${username}&lastlogin=${lastlogin}`,
        {
          method: 'GET',
        }
      );
      const result = await response.json();
      setData(result['reviews']);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSongs = async (username) => {
    try {
      const response = await fetch(API_URL + `newsongs?username=${username}`, {
        method: 'GET',
      });
      const result = await response.json();
      setNewSongs(result);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSongsAfterLogin = async (username, lastlogin) => {
    try {
      const response = await fetch(
        API_URL +
          `newsongsafterlogin?username=${username}&lastlogin=${lastlogin}`,
        {
          method: 'GET',
        }
      );
      const result = await response.json();
      setSongsLastLogin(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData(username, lastlogin);
    fetchSongsAfterLogin(username, lastlogin);
    fetchSongs(username);
  }, []);

  return (
    <div className="newitems">
      {data.length === 0 && (
        <h4>It looks like you are all caught up with new reviews! </h4>
      )}

      {data.length !== 0 &&
        data.map((item) => (
          <Post
            reviewedItem={item.reviewedItem}
            author={item.username}
            date={item.reviewDate}
            body={item.reviewText}
          ></Post>
        ))}

      {newSongs.length !== 0 && (
        <div className="new-songs">
          <h4>
            Here are some new songs you might like based on your favorite
            artists:
          </h4>
          {newSongs.map((item) => (
            <div>
              <span>
                <a href={item.songURL} target="_blank">
                  {item.title} By {item.fname} {item.lname}
                </a>
              </span>
            </div>
          ))}
        </div>
      )}

      {songslastlogin.length !== 0 && (
        <div className="new-songs">
          <h4>Don't miss out on these new songs by your favorite artist:</h4>
          {songslastlogin.map((item) => (
            <div>
              <span>
                <a href={item.songURL} target="_blank">
                  {item.title} By {item.fname} {item.lname} Released on:{' '}
                  {item.releaseDate}
                </a>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
