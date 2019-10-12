var http = require("http").createServer();
var io = require("socket.io")(http);

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("paused", function(msg) {
    console.log("paused", msg);
    io.emit("paused", msg);
  });

  socket.on("playing", function(msg) {
    console.log("playing", msg);
    io.emit("playing", msg);
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
