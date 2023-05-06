import React, { useEffect, useState } from 'react';
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

export default function FollowUser(props) {
    const [newFollow, setNewFollow] = useState('');
    const [ret, setRet] = useState(0);
    const [userMessage, setUserMessage] = useState(props.userMessage);
    
    useEffect(() => {
      setUserMessage(props.userMessage);
    }, [props.userMessage]);

    const handleSearchInputChange = (event) => {
     setNewFollow(event.target.value);
    };

   useEffect(() => {
    let timeoutId;
    if (ret) {
      timeoutId = setTimeout(() => {
        setRet(0);
        setNewFollow('');
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [ret]);

  const handleFollow = (e) => {
    e.preventDefault();
    props.onFollowUser(newFollow);
    console.log('new follow: ' + newFollow);
    setRet(1);
  };

  return (
    <div className="search-container">
      <h4>Follow User: </h4>
      <Form onSubmit={handleFollow}>
        <label htmlFor="username"></label>
        <Input
          type="text"
          placeholder="Search by username"
          value={newFollow}
          onChange={handleSearchInputChange}
          validations={[required]}
        />
        <br/>
        <button> Follow </button>
      </Form>
      {ret === 1 && <p>{userMessage}</p>}
    </div>
  );
}
