import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";

export const useUserStore = defineStore("user", () => {
  const isLogin = ref((localStorage.getItem("token") || "").length > 0);

  let isVisible = true;

  const isUpDateBalance = ref(false);

  const unitValue = ref(localStorage.getItem("unit") ?? "usd");

  watch(unitValue, (v) => {
    localStorage.setItem("unit", v);
  });

  const userInfo = reactive(
    JSON.parse(localStorage.getItem("userInfo") as string) || {},
  );

  function cacheUserInfo(data: Object) {
    if (data != null) {
      localStorage.setItem("token", data.token);
      isLogin.value = true;
      Object.assign(userInfo, data);
      //存储用户数据
      localStorage.setItem("userInfo", JSON.stringify(data));
    }
  }

  function upDateUserInfo(data: Object) {
    //目前就 只同步 头像 和 币
    userInfo.avatar = data.avatar;
    if (data.amount) {
      userInfo.amount = data.amount;
    }
    //保存到本地
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    isLogin.value = false;
    for (const key in userInfo) {
      delete userInfo[key];
    }
  }

  function upUserBalance() {
    isUpDateBalance.value = !isUpDateBalance.value;
  }

  return {
    isVisible,
    isLogin,
    cacheUserInfo,
    userInfo,
    logout,
    upDateUserInfo,
    isUpDateBalance,
    upUserBalance,
    unitValue,
  };
});
