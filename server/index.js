const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { addUser, removeUser, getUser, getUserInRoom } = require("./users");
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const PORT = process.env.PORT || 5000;
const router = require("./router");

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    console.log({ error });
    if (error) return callback(error);
    socket.join(user.room);
    socket.emit("message", {
      user: "admin",
      text: `Welcome! ${user.name},You have joined ${user.room} `,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name}, has joined` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });
    callback();
  });
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left the room.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUserInRoom(user.room),
      });
    }
  });
});

app.use(router);
server.listen(PORT, () => console.log(`Server is running on port-${PORT}`));
