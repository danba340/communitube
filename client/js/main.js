const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("v");
const baseUrl = "https://www.youtube.com/embed/";

const socket = io("http://localhost:3000");

function onPlayerReady(event) {
  player.loadVideoById(videoId);
  event.target.playVideo();
}

let lastState;
function onPlayerStateChange(event) {
  console.log("stateChange:", event);
  if (event.data == YT.PlayerState.PAUSED && event.data !== lastState) {
    socket.emit("paused", { time: player.getCurrentTime() });
  }
  if (event.data == YT.PlayerState.PLAYING && event.data !== lastState) {
    socket.emit("playing", { time: player.getCurrentTime() });
  }
  lastState = event.data;
}

socket.on("paused", function(msg) {
  if (player) {
    if (Math.abs(player.getCurrentTime() - msg.time) > 0.1) {
      player.seekTo(msg.time);
    }
    player.pauseVideo(msg.time);
  }
});

socket.on("playing", function(msg) {
  if (player) {
    if (Math.abs(player.getCurrentTime() - msg.time) > 1) {
      player.seekTo(msg.time);
    }
    player.playVideo(msg.time);
  }
});
