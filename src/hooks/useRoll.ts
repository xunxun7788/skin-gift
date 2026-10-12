import { reactive, ref } from "vue";
import { showLoading, showToast } from "../utils";
import axiosTools from "./useHttp";
const httpTools = axiosTools();

export default function () {
  const rollListData = reactive([]);

  let rollTotal = ref(0);

  const rollDetailData = reactive({});

  const rollGoodsList = reactive([]);

  const rollJoined = reactive([]);

  const rollLucky = reactive([]);

  //加载状态  0=隐藏 1=加载中 2=显示错误或者空数据
  let rollListLoadState = ref(0);

  async function apiRollList(
    index: number,
    url: string,
    status: string,
    type: string,
    page: number,
    size: number,
  ) {
    rollListLoadState.value = 1;
    try {
      const result = await httpTools.post(url, {
        status: status,
        type: type,
        page: page,
        size: size,
      });
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
        });
      } else {
        rollListData.length = 0;
        if (index == 0 && result.data.data.count) {
          rollTotal.value = result.data.data.count;
        }
        Object.assign(rollListData, result.data.data.list);
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    if (rollListData.length > 0) {
      rollListLoadState.value = 0;
    } else {
      rollListLoadState.value = 2;
    }
  }

  async function apiRollDetail(id: string) {
    const hideLoading = showLoading();
    try {
      const result = await httpTools.get("roll/rollDetail", {
        params: {
          roll_id: id,
        },
      });
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
        });
      } else {
        Object.assign(rollDetailData, result.data.data);
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
  }

  async function apiRollGoods(id: string) {
    const hideLoading = showLoading();
    try {
      const result = await httpTools.get("roll/rollGoodsDetail", {
        params: {
          roll_id: id,
          page: 1,
          size: 1000,
        },
      });
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
        });
      } else {
        Object.assign(rollGoodsList, result.data.data.list);
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
  }

  async function apiRollJoined(id: string) {
    const hideLoading = showLoading();
    try {
      const result = await httpTools.get("roll/rollUserDetail", {
        params: {
          roll_id: id,
          page: 1,
          size: 1000,
        },
      });
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
        });
      } else {
        Object.assign(rollJoined, result.data.data.list);
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
  }

  async function apiRollLucky(id: string) {
    const hideLoading = showLoading();
    try {
      const result = await httpTools.get("roll/rollWinUser", {
        params: {
          roll_id: id,
          page: 1,
          size: 1000,
        },
      });
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
        });
      } else {
        Object.assign(rollLucky, result.data.data.list);
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
  }

  async function apiJoinToRoll(id: string, pwd?: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("roll/joinRoom", {
        roll_id: id,
        pwd: pwd,
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
    }
    hideLoading();
    return result;
  }

  return {
    apiRollList,
    apiRollDetail,
    apiRollGoods,
    apiRollJoined,
    apiJoinToRoll,
    apiRollLucky,
    rollListLoadState,
    rollListData,
    rollTotal,
    rollDetailData,
    rollGoodsList,
    rollJoined,
    rollLucky,
  };
}
