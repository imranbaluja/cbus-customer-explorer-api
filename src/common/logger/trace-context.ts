import { AsyncLocalStorage } from "async_hooks";

const asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>();

export class TraceContext {
  static run(traceId: string, callback: () => void) {
    const store = new Map<string, string>();
    store.set("traceId", traceId);
    asyncLocalStorage.run(store, callback);
  }

  static getTraceId(): string | undefined {
    const store = asyncLocalStorage.getStore();
    return store?.get("traceId");
  }
}
