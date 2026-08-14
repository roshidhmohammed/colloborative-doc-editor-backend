export function isUserOnline(documentId, userId) {
  return documentPresence.get(documentId)?.has(userId) ?? false;
}