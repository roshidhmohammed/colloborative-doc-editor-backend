const registerRoomLeaveHandler = (socket) => {
  socket.on("disconnect", () => {
  console.log(socket.id, "Disconnected");
});
};

export default registerRoomLeaveHandler;
