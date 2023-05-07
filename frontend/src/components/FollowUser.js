import React, { useEffect, useState } from 'react';

export default function FollowUserSearchResult(props) {
    const [userSearchResult, setUserSearchResult] = useState(props.userSearchResult);
    const [ret, setRet] = useState(0);
    const [userMessage, setUserMessage] = useState(props.userMessage);
    
    useEffect(() => {
        setUserSearchResult(props.userSearchResult);
    }, [props.userSearchResult]);

    useEffect(() => {
        setUserMessage(props.userMessage);
      }, [props.userMessage]);
  
    useEffect(() => {
        let timeoutId;
        if (ret) {
          timeoutId = setTimeout(() => {
            setRet(0);
          }, 5000);
        }
        return () => clearTimeout(timeoutId);
      }, [ret]);

    const handleFollow = (username) => {
        props.onFollowUser(username);
        setRet(1);
    };

    return(
        <div className="search-container">
            <ul>
                {props.userSearchResult.map((user) => (
                    <div key={user}>
                        <h5>{user}</h5>
                        <button type="follow" onClick={() => handleFollow(user)}>Follow</button>
                    </div>
                ))}
            </ul>
            {ret === 1 && <p>{userMessage}</p>}
        </div>
    );
}