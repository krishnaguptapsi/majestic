import { createConsola } from "consola";

const consola = createConsola();

export function debugLog(tag: string, ...args: any[]) {
  if (process.env.DEBUG_LOG) {
    const timestamp = new Date().toISOString();
    const message = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    console.log(`🐛 [${timestamp}] [${tag}] ${message}`);
  }
}

export function createLogger(tag: string) {
  return (...args: any[]) => debugLog(tag, ...args);
}

export function logOperation(operation: string, details?: any) {
  if (process.env.DEBUG_LOG) {
    const timestamp = new Date().toISOString();
    const detailsStr = details ? ` | ${JSON.stringify(details)}` : '';
    console.log(`⚙️  [${timestamp}] ${operation}${detailsStr}`);
  }
}

export function logError(error: string, details?: any) {
  if (process.env.DEBUG_LOG) {
    const timestamp = new Date().toISOString();
    const detailsStr = details ? ` | ${JSON.stringify(details)}` : '';
    console.error(`❌ [${timestamp}] ERROR: ${error}${detailsStr}`);
  }
}

export function logSuccess(message: string, details?: any) {
  if (process.env.DEBUG_LOG) {
    const timestamp = new Date().toISOString();
    const detailsStr = details ? ` | ${JSON.stringify(details)}` : '';
    console.log(`✅ [${timestamp}] ${message}${detailsStr}`);
  }
}
