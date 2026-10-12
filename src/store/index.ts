import { createPinia } from "pinia";

// 全局共享的 pinia 实例
// 主应用与动态挂载的弹窗应用（utils 中 createApp 创建）共用同一个实例，
// 保证 useUserStore 等 store 状态在所有应用间同步（如登录状态、余额）。
export const pinia = createPinia();
