import { inject } from "vue";
import { config } from ".";

export default (userId: string, onMessage: Function) => {
  const socketUrl = config.socketUrl; // 替换为你的WebSocket服务器地址
  let socket: WebSocket;
  let lockReconnect = false;
  let timer: ReturnType<typeof setTimeout>;

  const CMD_RECHARGE = 2020; //充值成功
  const CMD_PUSH_BATTLE_INFO_UPDATE = 4203; //推送房间内信息更新
  const CMD_PUSH_BATTLE_START_UPDATE = 4208; //对战开奖
  const CMD_PUSH_BATTLE_FINISH_UPDATE = 4209; //对战结束
  const CMD_BALANCE = 2010; //余额变化

  const emitter = inject("emitter");

  const createSocket = () => {
    try {
      const time = new Date().getTime();
      const url = `${socketUrl}?sign=27312${time}&cmd=2001&timestamp=${time}&user_id=${userId}`;
      socket = new WebSocket(url);
      init();
    } catch (e) {
      console.log("catch", e);
      reconnect();
    }
  };

  const reconnect = () => {
    if (lockReconnect) return;
    lockReconnect = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      createSocket();
    }, 4000); // 重连间隔
  };

  const init = () => {
    socket.onopen = function (event) {};

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      const cmd = data.cmd;
      let isNeedCall = false;
      console.log(data);
      switch (cmd) {
        case 1000:
          socket.send(JSON.stringify({ cmd: 1000 }));
          break;
        case 2001:
          emitter.emit("socketOpen", true);
          break;
        case CMD_RECHARGE:
        case CMD_PUSH_BATTLE_INFO_UPDATE:
        case CMD_PUSH_BATTLE_START_UPDATE:
        case CMD_PUSH_BATTLE_FINISH_UPDATE:
        case CMD_BALANCE:
          isNeedCall = true;
          break;
      }
      if (onMessage && isNeedCall) {
        onMessage.call(null, event);
      }
    };

    socket.onerror = function (event) {
      console.log("WebSocket:发生错误");
      reconnect();
    };

    socket.onclose = function (event) {
      console.log("WebSocket:已关闭 ", event.code, event.reason);
      // 心跳检测停止
      // 这里可以添加心跳检测停止的逻辑
      if (event.code == 1001 || event.code == 1006) {
        reconnect();
      }
    };
  };

  createSocket();

  return socket;
};
