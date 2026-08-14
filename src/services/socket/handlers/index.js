import registerRoomLeaveHandler from './roomLeave.js';
import registerUpdateDocumentHandler from './updateDocument.js';
import documentJoinHandler from "./documentJoin.js"
import disconnectHandler from "./disconnect.js"
import collaboratorOnlineStatusHandler from './collaboratorOnlineStatus.js';

const registerSocketHandlers = (io, socket) => {
  documentJoinHandler(io, socket);
  disconnectHandler(io, socket);
  registerRoomLeaveHandler(io, socket);
  registerUpdateDocumentHandler(socket);
  collaboratorOnlineStatusHandler(io, socket)
};

export default registerSocketHandlers;