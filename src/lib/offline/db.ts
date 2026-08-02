'use client';

import type { OfflineBundle, QueuedAttempt } from './types';

const DB_NAME = 'miftah-offline';
const DB_VERSION = 1;
const BUNDLE_STORE = 'bundle';
const QUEUE_STORE = 'pendingAttempts';
const BUNDLE_KEY = 'current';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(BUNDLE_STORE)) db.createObjectStore(BUNDLE_STORE);
      if (!db.objectStoreNames.contains(QUEUE_STORE)) db.createObjectStore(QUEUE_STORE, { keyPath: 'localId' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore<T>(storeName: string, mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const req = fn(store);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

export async function saveBundle(bundle: OfflineBundle): Promise<void> {
  await withStore(BUNDLE_STORE, 'readwrite', (store) => store.put(bundle, BUNDLE_KEY));
}

export async function loadBundle(): Promise<OfflineBundle | null> {
  if (typeof indexedDB === 'undefined') return null;
  const result = await withStore<OfflineBundle | undefined>(BUNDLE_STORE, 'readonly', (store) => store.get(BUNDLE_KEY));
  return result ?? null;
}

export async function clearBundle(): Promise<void> {
  await withStore(BUNDLE_STORE, 'readwrite', (store) => store.delete(BUNDLE_KEY));
}

export async function enqueueAttempt(attempt: QueuedAttempt): Promise<void> {
  await withStore(QUEUE_STORE, 'readwrite', (store) => store.put(attempt));
}

export async function listQueuedAttempts(): Promise<QueuedAttempt[]> {
  if (typeof indexedDB === 'undefined') return [];
  return withStore<QueuedAttempt[]>(QUEUE_STORE, 'readonly', (store) => store.getAll());
}

export async function removeQueuedAttempt(localId: string): Promise<void> {
  await withStore(QUEUE_STORE, 'readwrite', (store) => store.delete(localId));
}
