import { reactive, ref } from "vue";
import { showLoading, showToast } from "../utils";
import axiosTools from "./useHttp";
const httpTools = axiosTools();

export default function () {
  const { t } = useI18n();
  const battleListData = reactive<any[]>([]);

  const battleHistoryData = reactive([]);

  const battleBoxListData = reactive<any[]>([]);

  const battleLoadState = ref(0);

  const battlEmptyText = ref("");

  const boxDetailLoadState = ref(0);

  const boxDetailEmptyText = ref("");

  const boxDetailData = reactive({});

  const battleDetailData = reactive({});

  const battleUserData = reactive([]);

  async function apiBattleBoxList(page: number, size: number) {
    let result;
    try {
      result = await httpTools.get("battle/getBox", {
        params: {
          page: page,
          size: Math.max(size, 20),
        },
      });
      const code = result.data.code;
      if (code == 1) {
        battleBoxListData.length = 0;
        Object.assign(battleBoxListData, result.data.data);
      } else {
        result = null;
      }
    } catch (error) {
      result = null;
    }
    return result;
  }

  async function apiBattleHistoryList(params: BattleListOptions) {
    let hideLoading;
    battleLoadState.value = 1;
    if (params.page == 1) {
      hideLoading = showLoading();
    }
    let url = "battle/historyBattle";
    if (params.type == 2) {
      url = "battle/myBattle";
    }
    let result;
    try {
      result = await httpTools.get(url, {
        params: {
          page: params.page,
          limit: 20,
          room_num: params.room_num,
          order_time: params.order_time,
          order_price: params.order_price,
          my: params.my,
        },
      });
      const code = result.data.code;
      if (code == 1) {
        battleLoadState.value = 0;
        if (params.page == 1) {
          battleHistoryData.length = 0;
        }
        battleHistoryData.push(...result.data.data.result);
      } else {
        battleLoadState.value = 2;
        battlEmptyText.value = result.data.msg;
        result = null;
      }
    } catch (error) {
      result = null;
      battleLoadState.value = 2;
      battlEmptyText.value = error;
    }
    if (hideLoading) {
      hideLoading();
    }
    return result;
  }

  interface BattleListOptions {
    page: number;
    size: number;
    room_num?: string;
    order_time?: string;
    order_price?: string;
    my?: string;
    type?: number;
  }

  async function apiBattleList(params: BattleListOptions) {
    let result;
    try {
      result = await httpTools.get("battle/getBattleList", {
        params: {
          page: params.page,
          limit: Math.max(params.size, 20),
          room_num: params.room_num,
          order_time: params.order_time,
          order_price: params.order_price,
          my: params.my,
        },
      });
      const code = result.data.code;
      if (code == 1) {
        battleLoadState.value = 0;
        if (params.page == 1) {
          battleListData.length = 0;
        }
        battleListData.push(...result.data.data.result);
        if (battleListData.length == 0) {
          battleLoadState.value = 2;
          battlEmptyText.value = t("battle.noBattles");
        }
      } else {
        battleLoadState.value = 2;
        battlEmptyText.value = result.data.msg;
        result = null;
      }
    } catch (error) {
      battleLoadState.value = 2;
      battlEmptyText.value = error;
      result = null;
    }
    return result;
  }

  async function apiBattleBoxDetail(id: string) {
    let result;
    boxDetailLoadState.value = 0;
    try {
      result = await httpTools.post("box/boxDetail", {
        box_id: id,
      });
      const code = result.data.code;
      if (code == 1) {
        boxDetailLoadState.value = 0;
        Object.assign(boxDetailData, result.data.data);
      } else {
        boxDetailLoadState.value = 2;
        boxDetailEmptyText.value = result.data.msg;
        result = null;
      }
    } catch (error) {
      boxDetailLoadState.value = 2;
      boxDetailEmptyText.value = error;
      result = null;
    }
    return result;
  }

  async function apiCreateBattle(box: string, roomNum: number) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("battle/createBattle", {
        box: box,
        room_num: roomNum,
        type: 1,
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

  async function apiBattleDetail(id: string) {
    let result;
    boxDetailLoadState.value = 0;
    try {
      result = await httpTools.post("battle/getBattleDetail", {
        id: id,
      });
      const code = result.data.code;
      if (code == 1) {
        boxDetailLoadState.value = 0;
        Object.assign(battleDetailData, result.data.data.result);
        //提取数据按用户分类
        battleUserData.length = 0;
        for (let index = 0; index < battleDetailData.room_num; index++) {
          let temp;
          for (const key of battleDetailData.user_info) {
            if (key.position == index) {
              temp = key;
              if (battleDetailData.status == 3) {
                //结束的需要处理下 要显示的数据
                temp.curr_amount = temp.winner_income;
                temp.goods_info = temp.winner_goods;
              }
              break;
            }
          }
          battleUserData.push(temp);
        }
      } else {
        boxDetailLoadState.value = 2;
        boxDetailEmptyText.value = result.data.msg;
        result = null;
      }
    } catch (error) {
      boxDetailLoadState.value = 2;
      boxDetailEmptyText.value = error;
      result = null;
    }
    return result;
  }

  async function apiJoinToBattle(id: string, position?: number) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("battle/joinBattle", {
        id: id,
        position: position,
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

  async function apiCancelBattle(id: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("battle/cancelBattle", {
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

  async function apiExitBattle(id: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("battle/quitBattle", {
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

  async function apiCopyBattle(id: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("battle/copyBattle", {
        id: id,
      });
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
          type: "error",
        });
      }
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

  return {
    apiBattleList,
    apiBattleBoxList,
    battleBoxListData,
    battleListData,
    battleLoadState,
    battlEmptyText,
    apiBattleBoxDetail,
    boxDetailData,
    boxDetailEmptyText,
    boxDetailLoadState,
    apiBattleHistoryList,
    battleHistoryData,
    apiCreateBattle,
    battleDetailData,
    apiBattleDetail,
    battleUserData,
    apiJoinToBattle,
    apiExitBattle,
    apiCancelBattle,
    apiCopyBattle,
  };
}
