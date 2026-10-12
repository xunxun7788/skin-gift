import { createApp, h, render, type App as VueApp } from "vue";
import useClipboard from "vue-clipboard3";
import i18n from "../i18n";
import { pinia } from "../store";
const { toClipboard } = useClipboard();

export const config = {
  cdnUrl: import.meta.env.VITE_APP_CDN_URL,
  apiUrl: import.meta.env.VITE_APP_API_URL,
  socketUrl: import.meta.env.VITE_APP_SOCKET_URL,
  webUrl: import.meta.env.VITE_APP_WEB_RUL,
  appSimpleName: import.meta.env.VITE_APP_APP_NAME,
  companyName: import.meta.env.VITE_APP_COMPANY_NAME,
  ICName: import.meta.env.VITE_APP_ICNAME,
  channel: import.meta.env.VITE_APP_CHANNEL,
};

export const cdnUrl = config.cdnUrl;

export async function copyText(text: string) {
  try {
    await toClipboard(text);
    showToast({ msg: "common.copySuccess", type: "success" });
  } catch (e) {
    showToast({ msg: "common.copyFailed", type: "error" });
  }
}

export function isUsdUnit() {
  const unit = localStorage.getItem("unit") ?? "usd";
  return unit == "usd";
}

export function priceUnit() {
  const unit = localStorage.getItem("unit") ?? "usd";
  return unit == "usd" ? "$" : "₽";
}

export function formatCoin(
  value: number | string | null | undefined,
  maxDecimals = 2,
): string {
  if (value === null || value === undefined || value === "") return "0";
  const num = Number(value);
  if (isNaN(num)) return "0";
  const str = num.toLocaleString("en-US", {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
  });
  return str;
}

export function getGoodsBgByColor(color: string) {
  return `/image/bg_${color}.png`;
}

export function getImageUrl(url: string) {
  if (!url) {
    return url;
  }
  return url.startsWith("http") ? url : `${config.cdnUrl}${url}`;
}

export function getCurrentUrl() {
  return window.location.href;
}

export function getExteriorName(exterior: number): String {
  var name = "";
  switch (exterior) {
    case 1:
      name = "FN";
      break;
    case 2:
      name = "MW";
      break;
    case 3:
      name = "FT";
      break;
    case 4:
      name = "WW";
      break;
    case 5:
      name = "BS";
      break;
    default:
      break;
  }
  return name;
}

export function getGoodsBgColor(color: number): string {
  let color1 = "#3A151066";
  let color2 = "#B54A3C80";
  switch (color) {
    case 2:
      color1 = "#3A2D0E66";
      color2 = "#B8942A80";
      break;
    case 3:
      color1 = "#2C143466";
      color2 = "#8B4A9C80";
      break;
    case 4:
      color1 = "#111E2E66";
      color2 = "#3E6FA080";
      break;
    case 5:
      color1 = "#2d303366";
      color2 = "#a4acb280";
      break;
  }
  return "linear-gradient(180deg, " + color1 + ", " + color2 + ")";
}

export function getGoodsBottomColor(c: number, alpha = "FF"): string {
  let color = "#B54A3C" + alpha;
  switch (c) {
    case 2:
      color = "#B8942A" + alpha;
      break;
    case 3:
      color = "#8B4A9C" + alpha;
      break;
    case 4:
      color = "#3E6FA0" + alpha;
      break;
    case 5:
      color = "#a4acb2" + alpha;
      break;
  }
  return color;
}

import OpDialog from "../components/OpDialog.vue";
import OpenBoxLayout from "../components/OpenBoxLayout.vue";
import OpenBoxResultDialog from "../components/OpenBoxResultDialog.vue";
import OverLoading from "../components/OverLoading.vue";
import OverToast from "../components/OverToast.vue";
import PayQrcode from "../components/PayQrcode.vue";
import SuperLoginDialog from "../components/dialog/SuperLoginDialog.vue";

let renderApp: VueApp | null = null;
export function getRenderApp(): VueApp {
  if (!renderApp) {
    renderApp = createApp({});
    renderApp.use(pinia); // 共享实例，登录状态/余额与主应用同步
    renderApp.use(i18n); // 共享实例，语言切换状态一致
  }
  return renderApp;
}

var isShowLogining = false;

export function showLoginDialog(fromType?: string, phone?: string) {
  if (isShowLogining) {
    return;
  }
  isShowLogining = true;
  const container = document.createElement("div");
  document.body.appendChild(container);
  const destroy = () => {
    isShowLogining = false;
    render(null, container);
    container.remove();
  };

  const vnode = h(SuperLoginDialog, {
    fromType: fromType,
    phone: phone,
    dismiss: () => {
      destroy();
    },
  });

  vnode.appContext = getRenderApp()._context;

  render(vnode, container);
}

export function showPayQrCode(type: string, src: string) {
  const mountNode = document.createElement("div");
  const loginInstance = createApp(PayQrcode, {
    type: type,
    src: src,
    close: () => {
      loginInstance.unmount(mountNode);
      document.getElementById("app")!.removeChild(mountNode);
    },
  });
  document.getElementById("app")!.appendChild(mountNode);
  loginInstance.use(pinia);
  loginInstance.use(i18n);
  loginInstance.mount(mountNode);
}

export function showLoading() {
  const mountNode = document.createElement("div");
  const loginInstance = createApp(OverLoading);
  document.getElementById("app")!.appendChild(mountNode);
  loginInstance.use(pinia);
  loginInstance.use(i18n);
  loginInstance.mount(mountNode);
  return () => {
    loginInstance.unmount(mountNode);
    document.getElementById("app")!.removeChild(mountNode);
  };
}

let toastMountNode,
  taostInstance,
  lastId = 0;

export function showToast(props?: Object | null) {
  if (toastMountNode != null && taostInstance != null) {
    taostInstance.unmount(toastMountNode);
    document.getElementById("app")!.removeChild(toastMountNode);
    toastMountNode = null;
    taostInstance = null;
  }
  toastMountNode = document.createElement("div");
  taostInstance = createApp(OverToast, {
    props: props,
    id: ++lastId,
    close: (id: number) => {
      if (id == lastId) {
        taostInstance.unmount(toastMountNode);
        document.getElementById("app")!.removeChild(toastMountNode);
        toastMountNode = null;
        taostInstance = null;
      }
    },
  });
  document.getElementById("app")!.appendChild(toastMountNode);
  taostInstance.use(pinia);
  taostInstance.use(i18n);
  taostInstance.mount(toastMountNode);
}

let opMountNode,
  opInstance,
  oplastId = 0;

export function showOpDialog(onSubmit: Function, props?: Object | null) {
  if (opMountNode != null && opInstance != null) {
    opInstance.unmount(opMountNode);
    document.getElementById("app")!.removeChild(opMountNode);
    opMountNode = null;
    opInstance = null;
  }
  opMountNode = document.createElement("div");
  opInstance = createApp(OpDialog, {
    props: props,
    onSubmit: onSubmit,
    id: ++oplastId,
    close: (id: number) => {
      if (id == oplastId) {
        opInstance.unmount(opMountNode);
        document.getElementById("app")!.removeChild(opMountNode);
        opMountNode = null;
        opInstance = null;
      }
    },
  });
  document.getElementById("app")!.appendChild(opMountNode);
  opInstance.use(pinia);
  opInstance.use(i18n);
  opInstance.mount(opMountNode);
}

//开箱弹框
let openBoxMountNode, openBoxInstance;
export function showOpenBoxDialog(
  dataList: [],
  resultData: any,
  boxData: Object,
  count: number,
  showPrice: any,
  playAgain: Function,
  upUserData: Function,
) {
  if (openBoxMountNode != null) {
    return;
  }
  openBoxMountNode = document.createElement("div");
  openBoxInstance = createApp(OpenBoxLayout, {
    dataList: dataList,
    resultData: resultData,
    count: count,
    boxData: boxData,
    showPrice: showPrice,
    playAgain: playAgain,
    upUserData: upUserData,
    close: () => {
      openBoxInstance.unmount(openBoxMountNode);
      document.getElementById("app")!.removeChild(openBoxMountNode);
      openBoxMountNode = null;
      openBoxInstance = null;
    },
  });
  document.getElementById("app")!.appendChild(openBoxMountNode);
  openBoxInstance.use(pinia);
  openBoxInstance.use(i18n);
  openBoxInstance.mount(openBoxMountNode);
}

//开箱弹框
let openBoxResultMountNode, openBoxResultInstance;
export function showOpenBoxResultDialog(
  resultData: [],
  resultBagIds: [],
  boxData: Object,
  showPrice: any,
  playAgain: Function,
  upUserData: Function,
) {
  if (openBoxResultMountNode != null) {
    return;
  }
  openBoxResultMountNode = document.createElement("div");
  openBoxResultInstance = createApp(OpenBoxResultDialog, {
    resultData: resultData,
    resultBagIds: resultBagIds,
    boxData: boxData,
    showPrice: showPrice,
    playAgain: playAgain,
    upUserData: upUserData,
    close: () => {
      openBoxResultInstance.unmount(openBoxResultMountNode);
      document.getElementById("app")!.removeChild(openBoxResultMountNode);
      openBoxResultMountNode = null;
      openBoxResultInstance = null;
    },
  });
  document.getElementById("app")!.appendChild(openBoxResultMountNode);
  openBoxResultInstance.use(pinia);
  openBoxResultInstance.use(i18n);
  openBoxResultInstance.mount(openBoxResultMountNode);
}

export function shuffleArrayFisherYates<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function toFixedTruncate(num: number, digits = 2): number {
  const base = 10 ** digits;
  return Math.trunc(num * base) / base;
}
