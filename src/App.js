import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import "./index.css";
import { useDataLayerValue } from "./DataLayer";
import Logo from "./images/logo.png";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
// const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const SPOTIFY_ENDPOINT = "https://accounts.spotify.com/authorize?";
const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
];
const redirect_uri = "http://localhost:3000/";

const spotify = new SpotifyWebApi();

const App = () => {
  const [{ user, token }, dispatch] = useDataLayerValue();

  const getTokenFromUrl = () => {
    return window.location.hash
      .substring(1)
      .split("&")
      .reduce((initial, item) => {
        let parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});
  };

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";
    const _token = hash.access_token;
    if (_token) {
      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });
      console.log("[token]", token);
      spotify.setAccessToken(_token);
      spotify.getMe().then((user) => {
        dispatch({
          type: "SET_USER",
          user,
        });
      });
      spotify.getUserPlaylists().then((playlists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists,
        });
      });
      spotify.getPlaylist("37i9dQZF1E34Ucml4HHx1w").then((playlist) => {
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: playlist,
        });
      });
    }
  }, [token, dispatch]);

  console.log(user);

  return (
    <div className="App fullW fullH">
      {user ? (
        `Hoş geldin ${user.display_name}`
      ) : (
        <div className="login__wrapper fullW fullH">
          <img src={Logo} alt="logo" id="logo" />
          <a
            className="btn"
            href={`${SPOTIFY_ENDPOINT}client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&scope=${scopes.join(
              "%20"
            )}&response_type=token&show_dialog=true`}
            style={{
              textDecoration: "none",
              color: "white",
              backgroundColor: "#1DB954",
              padding: ".6em .8em",
              borderRadius: "10px",
              marginTop: "10px",
              fontSize: "15px",
            }}
          >
            Login to Spotify
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
