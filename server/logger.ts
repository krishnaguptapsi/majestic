import { createConsola } from "consola";

const consola = createConsola();

export function debugLog(tag: string, ...args: any[]) {
  if (process.env.DEBUG_LOG) {
    consola.info({ tag, args });
  }
}

export function createLogger(tag: string) {
  return (...args: any[]) => debugLog(tag, ...args);
}
