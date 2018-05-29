import React, { Component } from 'react';

import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';

class App extends Component {


  constructor(props)
  {
    super(props);

    Spotify.getAccessToken();
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatedPlaylistName = this.updatedPlaylistName.bind(this);

    this.search = this.search.bind(this);
    this.onSave = this.onSave.bind(this);

    this.state = {searchResults: [
      {
        name: 'Girl in Stilettos',
        artist: 'Annah Mac',
        album: 'Little Stranger',
        id: '0EXKzm0M2sXkLrTufKiRZu'
      }
    ],
    playlistName: 'My playlist',
    playlistTracks: [
      {
        name: 'Celia',
        artist: 'Annah Mac',
        album: 'Little Stranger',
        id: '66VjlJMe31dtsZtH22JpQM'
      }
    ]};

  }

  search(searchTerm)
  {

    Spotify.search(searchTerm).then(results => {
      this.setState(
        {
          searchResults: results
        }
      );
    });

  }

  onSave()
  {
    const trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.updatedPlaylistName('My Playlist');
    this.setState(
      { playlistTracks: []}
    );
  }

  updatedPlaylistName(name)
  {
    this.setState(
      {
        playlistName: name
      }
    );
  }

  addTrack(track)
  {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id))
    {
      return;
    }
    else
    {
      const newPlaylist = this.state.playlistTracks;

      newPlaylist.push(track);
      this.setState(
        { playlistTracks: newPlaylist}
      );


    }
  }

  removeTrack(track)
  {
      let updatedPlaylist = this.state.playlistTracks.filter(currentTrack => currentTrack.id !== track.id);
      this.setState(
        {
          playlistTracks: updatedPlaylist
        }
      );
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />

          <div className="App-playlist">
            <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults} />
            <Playlist onSave={this.onSave} onNameChange={this.updatedPlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
