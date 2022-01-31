import { useEffect, useState } from "react";
import axios from "axios";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

const App = () => {
  const [userToken, setUserToken] = useState();
  const [track, setTrack] = useState();

  const handleClick =  () => {
     axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {      
      setUserToken(tokenResponse.data.access_token);
    });
  }

  const handleResponse =  () => {
     axios('https://api.spotify.com/v1/tracks/6kLCHFM39wkFjOuyPGLGeQ?market=US', {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + userToken}
    })
    .then (genreResponse => {        
      setTrack(genreResponse.data.album);
    });
  }

  return (
    <div className="App">
      <button onClick={handleClick}>Spotify</button>
      <br/>
      <br/>
      {userToken}
      <br/>
      <br/>
      <button onClick={handleResponse} disabled={!userToken}>Response</button>
      <hr/>
      {track ? track.name : ""}
    </div>
  );
};

export default App;
