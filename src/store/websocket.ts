// src/store/websocket.ts
import { defineStore } from "pinia";
import socket from "../utils/socket";

export const useWebSocketStore = defineStore("websocket", {
  state: () => ({
    onMessageListeners: [] as Function[],
    webSocket: socket,
  }),
  actions: {
    initializeWebSocket(userId: string) {
      this.onMessageListeners = [];
      this.webSocket = socket(userId, (event) => {
        this.onMessageListeners.forEach((listener) => {
          listener(event);
        });
      });
    },
    addMessageListener(listener: Function) {
      this.onMessageListeners.push(listener);
    },
    removeMessageListener(listener: Function) {
      this.onMessageListeners = this.onMessageListeners.filter(
        (l) => l !== listener
      );
    },
    sendMessage(msg: string) {
      if (this.webSocket.readyState == 1) {
        this.webSocket.send(msg);
      }
    },
    disConnect() {
      this.webSocket.close(1000);
    },
  },
});
