import React, { useState, useEffect } from 'react';

export default function PlaylistDisplay(props) {
    const [showSongs, setShowSongs] = useState({});
    const [deleteSuccess, setDeleteSuccess] = useState(false);
 
    useEffect(() => {
    console.log('props.deleteSuccess changed:', props.deleteSuccess);
    if (props.deleteSuccess) {
        setDeleteSuccess(true);
        // Hide the success message after 3 seconds
        setTimeout(() => {
        setDeleteSuccess(false);
        }, 3000);
    }
    }, [props.deleteSuccess]);

    return (
    <div className="playlist">
    {props.playlists.length === 0 ? (
      <h4>You do not have any playlist for now</h4>
    ) : (
      <h2>My Playlists</h2>
    )}
    {deleteSuccess && (
      <div className="alert alert-success" role="alert">
        Playlist deleted successfully!
      </div>
      )}
    <ul>
      {props.playlists.map((playlist) => (
        <div key={playlist.playlistName}>
          <h4>{playlist.playlistName}</h4>
          <button type="show" onClick={() => 
            setShowSongs({
                ...showSongs,
                [playlist.playlistName]: !showSongs[playlist.playlistName],
              })
            }
          >
            {showSongs[playlist.playlistName] ? 'Hide songs' : 'Show songs'}
          </button>
          <button type="delete" onClick={() => props.handleDelete(playlist.playlistName)}>Delete</button>
          {showSongs[playlist.playlistName] && (
              <ul className="songs-list">
                {playlist.songsInPlaylist.map((song) => (
                  <li key={song}>{song}</li>
                ))}
              </ul>
            )}
        </div>
      ))}
    </ul>
    </div>
    );
}