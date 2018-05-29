let accessToken = '';
const urlPrefix = 'https://accounts.spotify.com/authorize';
const client_id = 'dbef46650b42426990d1ab54572d92e1';
const redirect_uri = 'http://basictest-jamming.surge.sh';

const tokenExp = /access_token=([^&]*)/;
const expiresExp = /expires_in=([^&]*)/;

const Spotify =
{
  getAccessToken()
  {

    if(accessToken !== '')
    {
      return accessToken;
    }
    else
    {

      //parse to see if the access token is in the URL already
      const currentURL = window.location.href;

      const foundToken = currentURL.match(tokenExp);
      const foundExpires = currentURL.match(expiresExp);

      if(foundToken && foundExpires)
      {
        accessToken = foundToken[1];
        const expiresIn = foundExpires[1];
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
      }
      else
      {
        const urlToExpand = urlPrefix + '?client_id=' + client_id + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirect_uri ;
        window.location = urlToExpand;

      }
    }
  },

  search(searchTerm)
  {
    const getURL = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;
    return fetch(getURL,
    {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {

      if (jsonResponse.tracks.items) {

        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
      }
      //else
      console.log('jsonResponse.tracks was null');
    });
  },

  savePlaylist(playlistName, trackURIs)
  {
    if(!playlistName)
    {
      return;
    }
    else if(!trackURIs)
    {
      return;
    }
    else
    {
      const getURL = 'https://api.spotify.com/v1/me';
      const postURLprefix = 'https://api.spotify.com/v1/users/'
      const currentToken = this.getAccessToken();
      const headers =
      {Authorization: `Bearer ${currentToken}`};


      return fetch(getURL,
      {headers: headers}).then(
        response => {return response.json()}).then(
          jsonResponse => {
            return jsonResponse.id;
          }
        ).then(userID => {
          const postURLCreatePlaylist = postURLprefix + userID + '/playlists';
          fetch(postURLCreatePlaylist, {
            headers: {
              Authorization: `Bearer ${currentToken}`,
              "Content-Type": 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
              name: playlistName
            })
          }).then(response => {
            return response.json();
          }).then(jsonResponse => {
              return jsonResponse.id;
          }).then(playlistID =>
            {
              const postURLAddTracks = postURLprefix +userID + '/playlists/' + playlistID + '/tracks';
              fetch(postURLAddTracks, {
                headers: {
                  Authorization: `Bearer ${currentToken}`,
                  "Content-Type": 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(
                {
                    uris: trackURIs
                })
              });
            });
          return;
        });
    }
  }
};

export default Spotify;
