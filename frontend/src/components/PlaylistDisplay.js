import React, { useState } from 'react';

export default function PlaylistDisplay(props) {
  const [showSongs, setShowSongs] = useState({});

  return (
    <div className="playlist-container">
      {props.playlists.length == 0 ? (
        <h4>You do not have any playlist for now</h4>
      ) : (
        <h4>My Playlists</h4>
      )}

      <ul>
        {props.playlists.map((playlist) => (
          <div key={playlist.playlistName} className="playlist">
            <h5>{playlist.playlistName}</h5>
            {playlist.songsInPlaylist.length > 0 &&
              playlist.songsInPlaylist[0] != '' && (
                <p className="list-len">
                  {playlist.songsInPlaylist.length} song
                  {playlist.songsInPlaylist.length > 1 ? 's' : ''} in this
                  playlist
                </p>
              )}
            <button
              className="songs-button"
              onClick={() =>
                setShowSongs({
                  ...showSongs,
                  [playlist.playlistName]: !showSongs[playlist.playlistName],
                })
              }
            >
              {showSongs[playlist.playlistName] ? 'Hide songs' : 'Show songs'}
            </button>
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
