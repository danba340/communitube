import React, { useEffect, useState, useRef } from "react";
import useSocket from "./hooks/useSocket";
import ReactPlayer from "react-player";
import "./App.css";

const params = new URLSearchParams(window.location.search);
const sessionId = params.get("s");
const socket = useSocket(
  "https://communitube.herokuapp.com?sessionId=" + sessionId
);

const App: React.FC = () => {
  const player: any = useRef();
  const [playing, setPlaying] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    socket.on("paused", function(msg: {
      time: any;
      numOfUsers: number;
      url: string;
    }) {
      if (Math.abs(player.current.getCurrentTime() - msg.time) > 1.0) {
        player.current.seekTo(msg.time);
      }
      console.log(msg);
      setPlaying(false);
      if (msg.url && msg.url !== url && msg.url.length) {
        setUrl(msg.url);
      }
    });

    socket.on("playing", function(msg: {
      time: any;
      numOfUsers: number;
      url: string;
    }) {
      if (Math.abs(player.current.getCurrentTime() - msg.time) > 1.0) {
        player.current.seekTo(msg.time);
      }
      console.log(msg);
      setPlaying(true);
      if (msg.url && msg.url !== url && msg.url.length) {
        setUrl(msg.url);
      }
    });
  }, []);

  useEffect(() => {}, []);

  const onPause = () => {
    console.log("sending pause");
    socket.emit("paused", {
      time: player.current.getCurrentTime(),
      sessionId,
      url
    });
  };
  const onPlay = () => {
    console.log("sending play");
    socket.emit("playing", {
      time: player.current.getCurrentTime(),
      sessionId,
      url
    });
  };

  const onSeek = () => {
    console.log("seek");
    socket.emit("playing", {
      time: player.current.getCurrentTime(),
      sessionId,
      url
    });
  };

  const handleChange = (e: { target: any }) => {
    setInputValue(e.target.value);
  };
  const buttonClick = () => {
    setUrl(inputValue);
    setPlaying(true);
    socket.emit("playing", {
      time: player.current.getCurrentTime(),
      sessionId,
      url: inputValue
    });
  };

  return (
    <div>
      <h1 className="center">Communitube</h1>
      <div className="center my-md">
        <input
          placeholder="Paste Youtube link..."
          type="text"
          value={inputValue}
          onChange={handleChange}
        />
        <button onClick={buttonClick}>Go</button>
      </div>
      <div className="center w-100">
        <ReactPlayer
          ref={player}
          url={url || undefined}
          onPlay={onPlay}
          onPause={onPause}
          onSeek={onSeek}
          playing={playing}
          controls
        />
      </div>
    </div>
  );
};

export default App;
