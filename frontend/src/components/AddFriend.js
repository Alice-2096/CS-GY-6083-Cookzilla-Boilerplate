import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';

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

export default function AddFriend(props) {
  const [searchText, setSearchText] = useState('');
  const [selectedFriend, setSelectedFriend] = useState('');
  const [matchingUsers, setMatchingUsers] = useState([]);
  const form = useRef();
  const [message, setMessage] = useState(props.message);
  const [ret, setRet] = useState(0);

  useEffect(() => {
    setMessage(props.message);
  }, [props.message]);

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSelectUser = (user) => {
    setSelectedFriend(user.username);
  };

  function handleSearch(event) {
    event.preventDefault();
    // Fetch all users that matches the search text
    fetch(API_URL + `searchusers?username=${searchText}`)
      .then((response) => response.json())
      .then((data) => {
        setMatchingUsers(data);
      });
  }

  useEffect(() => {
    let timeoutId;
    if (ret) {
      timeoutId = setTimeout(() => {
        setRet(0);
        setSelectedFriend('');
        setMessage('');
        setMatchingUsers([]);
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [ret]);

  const handleAdd = (e) => {
    e.preventDefault();
    form.current.validateAll();
    props.onAddFriend(selectedFriend);
    setRet(1);
  };

  return (
    <div className="search-container">
      <h4>Add New Friends: </h4>
      <Form onSubmit={handleSearch} ref={form}>
        <label htmlFor="username"></label>
        <Input
          type="text"
          placeholder="Enter username here"
          value={searchText}
          onChange={handleSearchInputChange}
          validations={[required]}
        />
        <br />
        <button type="submit">Search</button>
      </Form>
      {matchingUsers.length > 0 ? (
        <ul>
          {matchingUsers.map((user) => (
            <li key={user.id}>
              <p
                type="button"
                classname="userinfo"
                onClick={() => handleSelectUser(user)}
              >
                Username: {user.username} | Nickname: {user.nickname} | First
                name: {user.fname} | Last name: {user.lname}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
      {selectedFriend && (
        <Form onSubmit={handleAdd}>
          <button type="submit">Add {selectedFriend} as friend</button>
        </Form>
      )}
      {ret === 1 && <p>{message}</p>}
    </div>
  );
}
