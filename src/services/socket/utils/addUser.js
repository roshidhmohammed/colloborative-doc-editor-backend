import { documentPresence } from "./presenceManager.js";

export function addUser(documentId, socket) {
  if (!documentPresence.has(documentId)) {
    documentPresence.set(documentId, new Map());
  }

  const users = documentPresence.get(documentId);

  users.set(socket.user, {
    socketId: socket.id,
    joinedAt: Date.now(),
  });
}
