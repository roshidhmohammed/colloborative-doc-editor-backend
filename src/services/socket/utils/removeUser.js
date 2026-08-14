import { documentPresence } from "./presenceManager.js";

export function removeUser(documentId, socket) {
  const users = documentPresence.get(documentId);

  if (!users) return;

  users.delete(socket.user);

  if (users.size === 0) {
    documentPresence.delete(documentId);
  }
}
