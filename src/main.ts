import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import mitt from "mitt";
import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import { pinia } from "./store";
import { useWebSocketStore } from "./store/websocket";
import "./style.css";
import { config } from "./utils";
const emitter = mitt();

let app = createApp(App);

app.config.globalProperties.$cdnUrl = config.cdnUrl;

const websocketStore = useWebSocketStore(pinia);
app.config.globalProperties.$webSocket = websocketStore;
app.provide("emitter", emitter);
app.use(pinia);
app.use(router);
app.use(i18n);
app.mount("#app");
