import { openDB } from "idb";

const DB_NAME = "document-upload-db";
const STORE_NAME = "documents";

export const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME);
    }
  },
});

export async function saveFile(category: string, file: File) {
  const db = await dbPromise;
  await db.put(STORE_NAME, file, category);
  // Mark in sessionStorage
  sessionStorage.setItem(`doc-${category}-saved`, "true");
}

export async function getFile(category: string): Promise<File | undefined> {
  const savedThisSession = sessionStorage.getItem(`doc-${category}-saved`);
  if (!savedThisSession) return undefined;

  const db = await dbPromise;
  return db.get(STORE_NAME, category);
}


export async function removeFile(category: string) {
  const db = await dbPromise;
  await db.delete(STORE_NAME, category);
}
