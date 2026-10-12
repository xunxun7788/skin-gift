import { h, render } from "vue";
import BattleAddCastDialog from "../components/battle/BattleAddCastDialog.vue";
import BattleHelpDialog from "../components/BattleHelpDialog.vue";
import BoxHelpDialog from "../components/BoxHelpDialog.vue";
import MessageDialog from "../components/dialog/MessageDialog.vue";
import PayQrcodeDialog from "../components/dialog/PayQrcodeDialog.vue";
import PopupDialog from "../components/dialog/PopupDialog.vue";
import RewardHelpDialog from "../components/dialog/RewardHelpDialog.vue";
import RollHelpDialog from "../components/dialog/RollHelpDialog.vue";
import RollPwdDialog from "../components/dialog/RollPwdDialog.vue";
import SetDialog from "../components/dialog/SetDialog.vue";
import SuperOpDialog from "../components/dialog/SuperOpDialog.vue";
import { getRenderApp } from "./index.ts";

interface SetDialogOptions {
  sx: number;
  sy: number;
}

interface BattleAddCastOptions {
  onSelect: (data: any) => void;
  selectData: any[];
}

interface SuperOpOptions {
  type?: string;
  agreeKey?: string;
  text?: string;
  price?: string;
  onConfirm?: () => void;
}

export function showBoxHelpDialog() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const destroy = () => {
    render(null, container);
    container.remove();
  };
  const vnode = h(BoxHelpDialog, {
    dismiss: () => {
      destroy();
    },
  });
  vnode.appContext = getRenderApp()._context;
  render(vnode, container);
}

export function showSetDialog(op: SetDialogOptions) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const destroy = () => {
    render(null, container);
    container.remove();
  };
  const vnode = h(SetDialog, {
    op: op,
    dismiss: () => {
      destroy();
    },
  });
  vnode.appContext = getRenderApp()._context;
  render(vnode, container);
}

export function showBattleHelpDialog() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const destroy = () => {
    render(null, container);
    container.remove();
  };
  const vnode = h(BattleHelpDialog, {
    dismiss: () => {
      destroy();
    },
  });
  vnode.appContext = getRenderApp()._context;
  render(vnode, container);
}

export function showBattleAddCastDialog(op: BattleAddCastOptions) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const destroy = () => {
    render(null, container);
    container.remove();
  };
  const vnode = h(BattleAddCastDialog, {
    onSelect: op.onSelect,
    selectData: op.selectData,
    dismiss: () => {
      destroy();
    },
  });
  vnode.appContext = getRenderApp()._context;
  render(vnode, container);
}

export function showSuperOpDialog(op: SuperOpOptions) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const destroy = () => {
    render(null, container);
    container.remove();
  };
  const vnode = h(SuperOpDialog, {
    type: op.type,
    text: op.text,
    agreeKey: op.agreeKey,
    price: op.price,
    onConfirm: op.onConfirm,
    dismiss: () => {
      destroy();
    },
  });
  vnode.appContext = getRenderApp()._context;
  render(vnode, container);
}

export function showRewadHelpDialog() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const destroy = () => {
    render(null, container);
    container.remove();
  };
  const vnode = h(RewardHelpDialog, {
    dismiss: () => {
      destroy();
    },
  });
  vnode.appContext = getRenderApp()._context;
  render(vnode, container);
}

export function showNoticeDialog() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const destroy = () => {
    render(null, container);
    container.remove();
  };
  const vnode = h(MessageDialog, {
    dismiss: () => {
      destroy();
    },
  });
  vnode.appContext = getRenderApp()._context;
  render(vnode, container);
}

export function showRollPwdDialog(onPwd: Function) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const destroy = () => {
    render(null, container);
    container.remove();
  };
  const vnode = h(RollPwdDialog, {
    onPwd: onPwd,
    dismiss: () => {
      destroy();
    },
  });
  vnode.appContext = getRenderApp()._context;
  render(vnode, container);
}

export function showRollHelpDialog() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const destroy = () => {
    render(null, container);
    container.remove();
  };
  const vnode = h(RollHelpDialog, {
    dismiss: () => {
      destroy();
    },
  });
  vnode.appContext = getRenderApp()._context;
  render(vnode, container);
}

export function showQrCodeDialog(url: string) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const destroy = () => {
    render(null, container);
    container.remove();
  };
  const vnode = h(PayQrcodeDialog, {
    url: url,
    dismiss: () => {
      destroy();
    },
  });
  vnode.appContext = getRenderApp()._context;
  render(vnode, container);
}

export function showPopupDialog() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const destroy = () => {
    render(null, container);
    container.remove();
  };
  const vnode = h(PopupDialog, {
    dismiss: () => {
      destroy();
    },
  });
  vnode.appContext = getRenderApp()._context;
  render(vnode, container);
}
