import * as Y from "yjs";



class DocumentManager {
   documents = new Map();

  get(documentId) {
    let managed = this.documents.get(documentId);

    if (!managed) {
      managed = {
        ydoc: new Y.Doc(),
        initialized: false,
      };

      this.documents.set(documentId, managed);
    }

    return managed;
  }

  remove(documentId) {
    const managed = this.documents.get(documentId);

    if (!managed) return;

    managed.ydoc.destroy();

    this.documents.delete(documentId);
  }
}

export const documentManager = new DocumentManager();