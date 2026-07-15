const registerConnectedHandler = (socket) => {
  socket.emit("connected", {
    socketId: socket.id,
    user: socket.user,
  });
};

export default registerConnectedHandler;
