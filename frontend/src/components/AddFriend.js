import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';

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
  const [newFriend, setNewFriends] = useState('');
  const form = useRef();
  const [message, setMessage] = useState(props.message);

  useEffect(() => {
    setMessage(props.message);
  }, [props.message]);

  const handleSearchInputChange = (event) => {
    setNewFriends(event.target.value);
  };

  const [ret, setRet] = useState(0);

  useEffect(() => {
    let timeoutId;
    if (ret) {
      timeoutId = setTimeout(() => {
        setRet(0);
        setNewFriends('');
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [ret]);

  const handleAdd = (e) => {
    e.preventDefault();
    form.current.validateAll();
    props.onAddFriend(newFriend);
    setRet(1);
  };

  return (
    <div className="search-container">
      <h4>Add New Friends: </h4>
      <Form onSubmit={handleAdd} ref={form}>
        <label htmlFor="username"></label>
        <Input
          type="text"
          placeholder="Search by username"
          value={newFriend}
          onChange={handleSearchInputChange}
          validations={[required]}
        />
        <br />
        <button type="submit">Submit </button>
      </Form>
      {ret === 1 && <p>{message}</p>}
    </div>
  );
}
