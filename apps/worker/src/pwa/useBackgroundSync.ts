const SYNC_TAG = "gigai-background-sync";
const QUEUE_KEY = "gigai-sync-queue";

export interface SyncQueueItem {
  id: string;
  url: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
  createdAt: number;
}

function readQueue(): SyncQueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as SyncQueueItem[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(items: SyncQueueItem[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

export async function enqueueBackgroundSync(item: Omit<SyncQueueItem, "id" | "createdAt">) {
  const queue = readQueue();
  queue.push({
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  });
  writeQueue(queue);

  if ("serviceWorker" in navigator && "SyncManager" in window) {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(SYNC_TAG);
  }
}

export async function flushBackgroundSyncQueue() {
  const queue = readQueue();
  if (!queue.length) return [];

  const remaining: SyncQueueItem[] = [];
  const completed: string[] = [];

  for (const item of queue) {
    try {
      await fetch(item.url, {
        method: item.method,
        body: item.body,
        headers: item.headers,
      });
      completed.push(item.id);
    } catch {
      remaining.push(item);
    }
  }

  writeQueue(remaining);
  return completed;
}

export function useBackgroundSync() {
  return {
    enqueue: enqueueBackgroundSync,
    flush: flushBackgroundSyncQueue,
    pendingCount: readQueue().length,
  };
}
