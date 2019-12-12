import React, { useEffect, useState, useRef } from "react";
import useSocket from "./hooks/useSocket";
import ReactPlayer from "react-player";
import "./App.css";

const params = new URLSearchParams(window.location.search);
const url = "https://www.youtube.com/embed/" + params.get("v");
const sessionId = params.get("s");
const socket = useSocket(
  "https://communitube.herokuapp.com:8080?sessionId=" + sessionId
);

const App: React.FC = () => {
  const player: any = useRef();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    socket.on("paused", function(msg: { time: any; numOfUsers: number }) {
      if (Math.abs(player.current.getCurrentTime() - msg.time) > 1.0) {
        player.current.seekTo(msg.time);
      }
      console.log(msg);
      setPlaying(false);
    });

    socket.on("playing", function(msg: { time: any; numOfUsers: number }) {
      if (Math.abs(player.current.getCurrentTime() - msg.time) > 1.0) {
        player.current.seekTo(msg.time);
      }
      console.log(msg);
      setPlaying(true);
    });
  }, []);

  useEffect(() => {}, []);

  const onPause = () => {
    console.log("sending pause");
    socket.emit("paused", { time: player.current.getCurrentTime(), sessionId });
  };
  const onPlay = () => {
    console.log("sending play");
    socket.emit("playing", {
      time: player.current.getCurrentTime(),
      sessionId
    });
  };

  const onSeek = () => {
    console.log("seek");
    socket.emit("paused", { time: player.current.getCurrentTime(), sessionId });
  };

  return (
    <div>
      <h1 className="center">Communitube</h1>
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
