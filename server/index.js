var http = require("http").createServer();
var io = require("socket.io")(http);

const roomCounts = {};

io.on("connection", function(socket) {
  socket.join(socket.handshake.query.sessionId);

  socket.on("paused", function(msg) {
    io.sockets.in(socket.handshake.query.sessionId).emit("paused", msg);
  });

  socket.on("playing", function(msg) {
    io.sockets.in(socket.handshake.query.sessionId).emit("playing", msg);
  });
});

http.listen(80, function() {
  console.log("listening on *:80");
});
