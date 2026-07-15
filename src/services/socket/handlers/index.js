import registerConnectedHandler from './connected.js';
import registerFetchDocumentHandler from './fetchDocument.js';
import registerRoomLeaveHandler from './roomLeave.js';
import registerUpdateDocumentHandler from './updateDocument.js';
import documentJoinHandler from "./documentJoin.js"
import disconnectHandler from "./disconnect.js"
import documentUpdateHandler from "./documentUpdate.js"

const registerSocketHandlers = (io, socket) => {
  registerConnectedHandler(socket);
  documentJoinHandler(socket);
  disconnectHandler(socket);
  documentUpdateHandler(socket);
  registerRoomLeaveHandler(socket);
  registerFetchDocumentHandler(socket);
  registerUpdateDocumentHandler(socket);
};

export default registerSocketHandlers;