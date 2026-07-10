

const disconnectHandler = (socket) => {
      socket.on("disconnect", () => {
      console.log(socket.id, "Disconnected");
    });
};
export default disconnectHandler;
