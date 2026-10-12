import { reactive } from "vue";
import { showLoading, showToast } from "../utils";
import axiosTools from "./useHttp";
const httpTools = axiosTools();

export default function () {
  const fuliInfoData = reactive({});

  const currentFuliBoxData = reactive({});

  const boxDetailData = reactive({});

  async function apiFuliData() {
    const hideLoading = showLoading();
    try {
      const result = await httpTools.get("box/getFreeBox", {});
      const code = result.data.code;
      if (code != 1) {
        showToast({
          msg: result.data.msg,
        });
      } else {
        //默认选择第0个
        if (result.data.data.box != null) {
          Object.assign(currentFuliBoxData, result.data.data.box[0]);
        }
        Object.assign(fuliInfoData, result.data.data);
      }
    } catch (error) {
      showToast({
        msg: error,
      });
    }
    hideLoading();
  }

  async function apiBoxDetail(id: string) {
    try {
      var result = await httpTools.post("box/boxDetail", {
        box_id: id,
      });
      Object.assign(boxDetailData, result.data.data);
    } catch (error) {}
  }

  async function openBox(box_id: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("box/freeUnBox", {
        box_id: box_id,
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

  async function apiFuliHelp() {
    try {
      return await httpTools.get("rechargeLevel/getList");
    } catch (error) {
      showToast({
        text: error,
        type: "error",
      });
    }
    return null;
  }

  return {
    fuliInfoData,
    apiFuliHelp,
    boxDetailData,
    currentFuliBoxData,
    apiFuliData,
    apiBoxDetail,
    openBox,
  };
}
