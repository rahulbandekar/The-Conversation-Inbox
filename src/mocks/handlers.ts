import { http, HttpResponse, delay } from "msw";
import { mockConversations } from "./data";
import type { Conversation } from "../types";

let conversations: Conversation[] = [...mockConversations];

const randomDelay = () => delay(Math.floor(Math.random() * 300) + 200);

export const handlers = [
  http.get("/api/conversations", async () => {
    await randomDelay();
    return HttpResponse.json(conversations);
  }),
];
