import React, { useEffect, useState } from 'react';

export default function FollowUserSearchResult(props) {
    const [artistSearchResult, setArtistSearchResult] = useState(props.artistSearchResult);
    const [ret, setRet] = useState(0);
    const [artistMessage, setArtistMessage] = useState(props.artistMessage);
    
    useEffect(() => {
        setArtistSearchResult(props.artistSearchResult);
    }, [props.artistSearchResult]);

    useEffect(() => {
        setArtistMessage(props.artistMessage);
      }, [props.artistMessage]);
  
    useEffect(() => {
        let timeoutId;
        if (ret) {
          timeoutId = setTimeout(() => {
            setRet(0);
          }, 5000);
        }
        return () => clearTimeout(timeoutId);
      }, [ret]);

    const handleFollow = (artistName) => {
        props.onFollowArtist(artistName);
        setRet(1);
    };

    return(
        <div className="search-container">
            <ul>
                {props.artistSearchResult.map((artistName) => (
                    <div key={artistName}>
                        <h5>{artistName}</h5>
                        <button type="follow" onClick={() => handleFollow(artistName)}>Follow</button>
                    </div>
                ))}
            </ul>
            {ret === 1 && <p>{artistMessage}</p>}
        </div>
    );
}