import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

export async function startWorker(): Promise<boolean> {
  try {
    await worker.start({
      onUnhandledRequest: "bypass",
    });
    return true;
  } catch {
    return false;
  }
}
