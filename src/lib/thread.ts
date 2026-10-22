export type ThreadRole = "user" | "assistant";

export interface ThreadMessage {
  id: string;
  role: ThreadRole;
  text: string;
  at: number;
}

const STORAGE_KEY = "threads";

type Store = Record<string, ThreadMessage[]>;

function readStore(): Store {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function loadThread(id: string): ThreadMessage[] {
  return readStore()[id] ?? [];
}

export function saveThread(id: string, messages: ThreadMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readStore(), [id]: messages }));
  } catch {
    // Private mode or a full quota: the conversation just won't survive a reload.
  }
}

export function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

export function createMessage(role: ThreadRole, text: string): ThreadMessage {
  return { id: createId(), role, text, at: Date.now() };
}
