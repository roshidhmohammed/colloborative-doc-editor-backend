export const documentPresence = new Map();

export function getDocumentPresence(documentId) {
  return documentPresence.get(documentId) ?? new Map();
}

export function removeUserFromAllDocuments(socket) {
  for (const [documentId, users] of documentPresence.entries()) {
    users.delete(socket.user);

    if (users.size === 0) {
      documentPresence.delete(documentId);
    }
  }
}
