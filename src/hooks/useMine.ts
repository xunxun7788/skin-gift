import { reactive, ref } from "vue";
import { showLoading, showToast } from "../utils";
import axiosTools from "./useHttp";
const httpTools = axiosTools();

export default function () {
  const userInfo = reactive({});

  const avatar = ref(null);

  const isReview = ref(false);

  const bagDataList = reactive([]);

  const bagGoodsTotal = ref(0);

  const total_amount = ref("0");

  const typeConfigData: any = reactive({});

  const balanceLogList = reactive([]);

  const balanceLogTotal = ref(0);

  const goodsLogData = reactive([]);

  const goodsLogTotal = ref(0);

  const shareLogData = reactive([]);

  const shareLogTotal = ref(0);

  const shareInfoData = reactive({});

  const msgDataList = reactive<any[]>([]);

  const msgTotal = ref(0);

  const rechargeInfo = reactive({});

  const userInfoLoadState = ref(0);

  const userInfoEmptyText = ref("");

  const rechargeLoadState = ref(0);

  const rechargeEmptyText = ref("");

  const bagLoadState = ref(0);

  const bagEmptyText = ref("");

  const balanceLoadState = ref(0);

  const balanceEmptyText = ref("");

  const goodsLoadState = ref(0);

  const goodsEmptyText = ref("");

  const shareLoadState = ref(0);

  const shareEmptyText = ref("");

  const msgLoadState = ref(0);

  const msgEmptyText = ref("");

  async function apiUserInfo() {
    let result;
    userInfoLoadState.value = 1;
    try {
      result = await httpTools.get("userinfo/personalDetails");
      const code = result.data.code;
      if (code != 1) {
        userInfoEmptyText.value = result.data.msg;
        userInfoLoadState.value = 2;
        return null;
      } else {
        userInfoLoadState.value = 0;
        Object.assign(userInfo, result.data.data.list);
        if (userInfo.ava_status != null && userInfo.ava_status != "") {
          avatar.value = userInfo.ava_status;
          isReview.value = true;
        } else {
          avatar.value = userInfo.avatar;
          isReview.value = false;
        }
      }
    } catch (error) {
      userInfoEmptyText.value = error;
      userInfoLoadState.value = 2;
      return null;
    }
    return result;
  }

  async function apiUpUserInfo(key: string, value: string, msg?: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("userinfo/updateInfo", {
        key: key,
        value: value,
      });
      const code = result.data.code;
      showToast({
        msg: code == 1 ? (msg ?? "mine.modifySuccess") : result.data.msg,
        type: code != 1 ? "error" : "success",
      });
      if (code != 1) {
        result = null;
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
    return result;
  }

  async function apiUpLoadFile(file: any, err?: string) {
    const hideLoading = showLoading();
    let result;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("scene", "1");
      result = await httpTools.post("app/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const code = result.data.code;
      showToast({
        msg: code == 1 ? (err ?? "mine.uploadSuccess") : result.data.msg,
        type: code != 1 ? "error" : "success",
      });
      if (code != 1) {
        result = null;
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
    return result;
  }

  async function apiRealNameAuth(
    name: string,
    idCard: string,
    front: string,
    back: string,
  ) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("userinfo/identityCard", {
        real_name: name,
        identification: idCard,
        front: front,
        back: back,
      });
      const code = result.data.code;
      showToast({
        msg: code == 1 ? "mine.submitSuccess" : result.data.msg,
        type: code != 1 ? "error" : "success",
      });
      if (code != 1) {
        result = null;
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
    return result;
  }

  async function apiRealNameAuthInfo() {
    let result;
    try {
      result = await httpTools.get("userinfo/getIdentity");
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
          type: "error",
        });
        return null;
      }
    } catch (error) {
      result = null;
      showToast({
        msg: error,
      });
    }
    return result;
  }

  async function apiPayInfo() {
    let result;
    try {
      result = await httpTools.get("payx/methods");
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
          type: "error",
        });
        return null;
      }
    } catch (error) {
      result = null;
      showToast({
        msg: error,
      });
    }
    return result;
  }

  async function apiPayCodeVerfy(promocode: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("payx/verify", {
        promocode: promocode,
      });
      hideLoading();
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
          type: "error",
        });
        return null;
      }
    } catch (error) {
      hideLoading();
      result = null;
      showToast({
        msg: error,
      });
    }
    return result;
  }

  async function apiPayOrder(
    method_id: string,
    amount: string,
    pay_amount: string,
    promocode: string,
  ) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("payx/order", {
        promocode: promocode,
        method_id: method_id,
        pay_amount: pay_amount,
        amount: amount,
      });
      const code = result.data.code;
      hideLoading();
      if (code != 1) {
        showToast({
          msg: result.data.msg,
          type: "error",
        });
        return null;
      }
    } catch (error) {
      hideLoading();
      result = null;
      showToast({
        msg: error,
      });
    }
    return result;
  }

  async function apiThirdLogin(openid: string) {
    let result;
    try {
      result = await httpTools.post("userauth/third_login", {
        platform: "Steam",
        openid: openid,
        channel_code: localStorage.getItem("channel_code"),
        invite_code: localStorage.getItem("invite_code"),
      });
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
          type: "error",
        });
        return null;
      }
    } catch (error) {
      result = null;
      showToast({
        msg: error,
      });
    }
    return result;
  }

  async function apiBagDataList(page: number) {
    bagLoadState.value = 1;
    try {
      const result = await httpTools.get("userinfo/getBagList", {
        params: {
          // order_by: order_by,
          // order_sort: order_sort,
          type: 1,
          page: page,
          limit: "20",
        },
      });
      const code = result.data.code;
      if (code != 1) {
        bagLoadState.value = 2;
        bagEmptyText.value = result.data.msg;
      } else {
        bagLoadState.value = 0;
        bagDataList.length = 0;
        bagGoodsTotal.value = result.data.data.count;
        total_amount.value = result.data.data.total_amount;
        Object.assign(bagDataList, result.data.data.list);
        if (bagDataList.length == 0) {
          bagLoadState.value = 2;
          bagEmptyText.value = "mine.noItems";
        }
      }
    } catch (error) {
      bagLoadState.value = 2;
      bagEmptyText.value = error;
    }
  }

  async function apiBagTakeLog(status: number, page: number) {
    bagLoadState.value = 1;
    try {
      const result = await httpTools.get("userinfo/getRetrieveRecords", {
        params: {
          status: status,
          page: page,
          limit: "20",
        },
      });
      const code = result.data.code;
      if (code != 1) {
        bagLoadState.value = 2;
        bagEmptyText.value = result.data.msg;
      } else {
        bagLoadState.value = 0;
        bagDataList.length = 0;
        bagGoodsTotal.value = result.data.data.count;
        total_amount.value = result.data.data.total_amount;
        Object.assign(bagDataList, result.data.data.list);
        if (bagDataList.length == 0) {
          bagLoadState.value = 2;
          bagEmptyText.value = "mine.noItems";
        }
      }
    } catch (error) {
      bagLoadState.value = 2;
      bagEmptyText.value = error;
    }
  }

  async function apiResolveGoods(bagIds: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("userinfo/resolve", {
        bag_ids: bagIds,
      });
      const code = result.data.code;
      showToast({
        msg: code == 1 ? "mine.decomposeSuccess" : result.data.msg,
        type: code != 1 ? "error" : "success",
      });
      if (code != 1) {
        result = null;
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
    return result;
  }

  async function apiGetGoods(bagIds: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("userinfo/retrieveProduct", {
        bag_ids: bagIds,
      });
      const code = result.data.code;
      showToast({
        msg: code == 1 ? "mine.extractSuccess" : result.data.msg,
        type: code != 1 ? "error" : "success",
      });
      if (code != 1) {
        result = null;
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
    return result;
  }

  async function apiCancelGetGoods(bagIds: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("userinfo/retrieveCancel", {
        bag_ids: bagIds,
      });
      const code = result.data.code;
      showToast({
        msg: result.data.msg,
        type: code != 1 ? "error" : "success",
      });
      if (code != 1) {
        result = null;
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
    return result;
  }

  async function apiTypeConfig() {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("config/enum");
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
          type: "error",
        });
        result = null;
      } else {
        Object.assign(typeConfigData, result.data.data.bill_from);
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
    return result;
  }

  async function apiBalanceLog(page: number, from: string, sortBy: string) {
    let result;
    balanceLoadState.value = 1;
    try {
      result = await httpTools.get("userinfo/billRecord", {
        params: {
          page: page,
          from: from,
          order_by: "create_time",
          order_sort: sortBy,
        },
      });
      const code = result.data.code;
      if (code != 1) {
        balanceLoadState.value = 2;
        balanceEmptyText.value = result.data.msg;
        result = null;
      } else {
        balanceLoadState.value = 0;
        balanceLogList.length = 0;
        balanceLogTotal.value = result.data.data.count;
        Object.assign(balanceLogList, result.data.data.list);
      }
    } catch (error) {
      balanceLoadState.value = 2;
      balanceEmptyText.value = error;
    }
    return result;
  }

  async function apiMineGoodsLog(page: number, sortBy: string) {
    let result;
    goodsLoadState.value = 1;
    try {
      result = await httpTools.get("userinfo/goods_log", {
        params: {
          page: page,
          limit: 20,
          order_by: "create_time",
          order_sort: sortBy,
        },
      });
      const code = result.data.code;
      if (code != 1) {
        goodsLoadState.value = 2;
        goodsEmptyText.value = result.data.msg;
        result = null;
      } else {
        goodsLoadState.value = 0;
        goodsLogTotal.value = result.data.data.count;
        goodsLogData.length = 0;
        Object.assign(goodsLogData, result.data.data.list);
      }
    } catch (error) {
      goodsLoadState.value = 2;
      goodsEmptyText.value = error;
    }
    return result;
  }

  async function apiMineShareLog(page: number) {
    let result;
    try {
      result = await httpTools.get("invite/invite_log", {
        params: {
          page: page,
          size: 20,
        },
      });
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
          type: "error",
        });
        result = null;
      } else {
        shareLogTotal.value = result.data.data.count;
        shareLogData.push(...result.data.data.list);
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    return result;
  }

  async function apiMineShareInfo() {
    let result;
    shareLoadState.value = 1;
    try {
      result = await httpTools.get("invite/my_info");
      const code = result.data.code;
      if (code != 1) {
        shareLoadState.value = 2;
        shareEmptyText.value = result.data.msg;
        result = null;
      } else {
        shareLoadState.value = 0;
        Object.assign(shareInfoData, result.data.data);
      }
    } catch (error) {
      shareLoadState.value = 2;
      shareEmptyText.value = error;
    }
    return result;
  }

  async function apiMineMessageList(page: number) {
    let result;
    if (page == 1) {
      msgLoadState.value = 1;
    }
    try {
      result = await httpTools.get("notice/messageList", {
        params: {
          page: page,
          size: 20,
        },
      });
      const code = result.data.code;
      if (code != 1) {
        msgLoadState.value = 2;
        msgEmptyText.value = result.data.msg;
        result = null;
      } else {
        msgLoadState.value = 0;
        msgTotal.value = result.data.data.count;
        if (page == 1) {
          msgDataList.length = 0;
        }
        msgDataList.push(...result.data.data.list);
      }
    } catch (error) {
      msgLoadState.value = 2;
      msgEmptyText.value = error;
    }
    return result;
  }

  async function apiDelMessage(ids: string) {
    let result;
    const hideLoading = showLoading();
    try {
      result = await httpTools.post("notice/messageDelete", {
        ids: ids,
      });
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
          type: "error",
        });
        result = null;
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
    return result;
  }

  async function apiRechargeInfo() {
    let result;
    rechargeLoadState.value = 1;
    try {
      result = await httpTools.get("payment/item");
      const code = result.data.code;
      if (code != 1) {
        rechargeLoadState.value = 2;
        rechargeEmptyText.value = result.data.msg;
        result = null;
      } else {
        rechargeLoadState.value = 0;
      }
    } catch (error) {
      result = null;
      rechargeLoadState.value = 2;
      rechargeEmptyText.value = error;
    }
    return result;
  }

  async function apiPay(item_id: string, system: string, sign: string) {
    let result;
    const hideLoading = showLoading();
    try {
      result = await httpTools.post("payment/order", {
        item_id: item_id,
        system: system,
        sign: sign,
      });
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
          type: "error",
        });
        result = null;
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
    return result;
  }

  async function apiMessageRed(id: number) {
    try {
      httpTools.post("notice/messageRead", {
        ids: id,
      });
    } catch (error) {}
  }

  return {
    apiUserInfo,
    apiUpUserInfo,
    isReview,
    userInfo,
    apiUpLoadFile,
    avatar,
    apiRealNameAuth,
    apiRealNameAuthInfo,
    bagDataList,
    apiBagDataList,
    bagGoodsTotal,
    total_amount,
    apiResolveGoods,
    apiGetGoods,
    apiCancelGetGoods,
    apiTypeConfig,
    typeConfigData,
    apiBalanceLog,
    balanceLogList,
    balanceLogTotal,
    apiMineGoodsLog,
    goodsLogData,
    goodsLogTotal,
    apiMineShareLog,
    shareLogData,
    shareLogTotal,
    apiMineShareInfo,
    shareInfoData,
    msgDataList,
    apiMineMessageList,
    msgTotal,
    apiDelMessage,
    apiRechargeInfo,
    rechargeInfo,
    apiPay,
    apiBagTakeLog,
    userInfoEmptyText,
    userInfoLoadState,
    rechargeLoadState,
    rechargeEmptyText,
    bagLoadState,
    bagEmptyText,
    balanceLoadState,
    balanceEmptyText,
    goodsLoadState,
    goodsEmptyText,
    shareLoadState,
    shareEmptyText,
    msgLoadState,
    msgEmptyText,
    apiMessageRed,
    apiThirdLogin,
    apiPayInfo,
    apiPayCodeVerfy,
    apiPayOrder,
  };
}
