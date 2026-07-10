const registerRoomJoinHandler = (socket) => {

  socket.on('room:join', (roomId, callback) => {
    if (!roomId) {
      callback?.({ success: false, message: 'Room ID is required' });
      return;
    }

    socket.join(roomId);
    socket.to(roomId).emit('room:user-joined', {
      roomId,
      user: socket.user,
    });

    callback?.({ success: true, roomId });
  });
};

export default registerRoomJoinHandler;
