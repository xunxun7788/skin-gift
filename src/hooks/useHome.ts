import { reactive, ref } from "vue";
import { showLoading, showToast } from "../utils";
import axiosTools from "./useHttp";
const httpTools = axiosTools();

export default function () {
  let homeBoxData = reactive({});

  let bannerList = reactive<any[]>([]);

  let boxDetailData = reactive<any>({});

  let boxDetailDropped = reactive([]);

  const homeLoadState = ref(0);

  const homeEmptyText = ref("");

  const redPacketNoticeData = reactive([]);

  const redPacketLog = reactive([]);

  async function getHomeBox() {
    homeLoadState.value = 1;
    try {
      var result = await httpTools.get("index/getIndexBox");
      const code = result.data.code;
      if (code != 1) {
        homeLoadState.value = 2;
        homeEmptyText.value = result.data.msg;
      } else {
        homeLoadState.value = 0;
        Object.assign(homeBoxData, result.data.data);
      }
    } catch (error) {
      showToast({
        msg: error,
        type: "error",
      });
      homeLoadState.value = 2;
      homeEmptyText.value = error;
    }
  }

  async function getBannerData() {
    try {
      var result = await httpTools.get("index/getBanner");
      Object.assign(bannerList, result.data.data);
    } catch (error) {}
  }

  async function getHomeHistory() {
    let result;
    try {
      result = await httpTools.get("index/getLastBoxLog");
    } catch (error) {}
    return result;
  }

  async function getBoxDetailDropped(id: string) {
    try {
      var result = await httpTools.post("box/RecentlyDropped", {
        box_id: id,
      });
      Object.assign(boxDetailDropped, result.data.data);
    } catch (error) {}
  }

  async function getBoxDetail(id: string) {
    try {
      var result = await httpTools.post("box/boxDetail", {
        box_id: id,
      });
      Object.assign(boxDetailData, result.data.data);
    } catch (error) {}
  }

  async function getCode(phone: string, event: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("sms/send", {
        mobile: phone,
        event: event,
      });
      const code = result.data.code;
      showToast({
        msg: result.data.msg,
        type: code == 1 ? "success" : "error",
      });
      if (code != 1) {
        result = null;
      }
    } catch (error) {
      showToast({
        msg: error,
      });
      result = null;
    }
    hideLoading();
    return result;
  }

  async function openBox(
    box_id: string,
    pay_price: number | string,
    frequency: number,
  ) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("box/unBox", {
        box_id: box_id,
        pay_price: pay_price,
        frequency: frequency,
      });
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
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

  //分解饰品
  async function resoleGoods(bag_ids: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("userinfo/resolve", {
        bag_ids: bag_ids,
      });
      const code = result.data.code;

      if (code != 1) {
        showToast({
          msg: result.data.msg,
        });
        result = null;
      } else {
        showToast({
          msg: result.data.msg,
          type: "success",
        });
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
    return result;
  }

  async function apiRedPacketNotice() {
    try {
      var result = await httpTools.get("redpacket/log");
      const code = result.data.code;
      if (code == 1) {
        redPacketNoticeData.length = 0;
        Object.assign(redPacketNoticeData, result.data.data);
      }
    } catch (error) {}
  }

  async function apiRedPacketLog() {
    try {
      var result = await httpTools.get("redpacket/rechargeRedPacket");
      const code = result.data.code;
      if (code == 1) {
        redPacketLog.length = 0;
        Object.assign(redPacketLog, result.data.data);
      } else {
        showToast({
          msg: result.data.msg,
          type: "error",
        });
      }
    } catch (error) {
      showToast({
        msg: error,
        type: "error",
      });
    }
  }

  async function apiGetRedPacket(id: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("redpacket/rechargeTaskReward", {
        id: id,
      });
      const code = result.data.code;
      showToast({
        msg: result.data.msg,
        type: code == 1 ? "success" : "error",
      });
      if (code != 1) {
        result = null;
      }
    } catch (error) {
      result = null;
      showToast({
        msg: error,
        type: "error",
      });
    }
    hideLoading();
    return result;
  }

  async function apiOpenRedPacket(codeStr: string) {
    const hideLoading = showLoading();
    let resultData;
    try {
      const result = await httpTools.post("redpacket/openRedPacket", {
        code: codeStr,
      });
      const code = result.data.code;
      if (code == 1) {
        resultData = result.data.data.amount;
      } else {
        showToast({
          msg: result.data.msg,
          type: "error",
        });
        return null;
      }
    } catch (error) {
      showToast({
        msg: error,
        type: "error",
      });
    }
    hideLoading();
    return resultData;
  }

  return {
    homeBoxData,
    getHomeBox,
    bannerList,
    getBannerData,
    getHomeHistory,
    boxDetailData,
    getBoxDetail,
    boxDetailDropped,
    getBoxDetailDropped,
    getCode,
    openBox,
    resoleGoods,
    homeLoadState,
    homeEmptyText,
    redPacketNoticeData,
    apiRedPacketNotice,
    apiRedPacketLog,
    redPacketLog,
    apiGetRedPacket,
    apiOpenRedPacket,
  };
}
