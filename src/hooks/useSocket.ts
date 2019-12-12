import io from "socket.io-client";

function UseSocket(url: string) {
  const socket = io(url);

  return socket;
}

export default UseSocket;
