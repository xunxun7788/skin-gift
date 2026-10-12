import axios from "axios";
import { useUserStore } from "../store/user";
import { showLoginDialog, showToast } from "../utils";

export default function () {
  const httpTools = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
  });
  httpTools.interceptors.request.use((config) => {
    config.headers.token = localStorage.getItem("token");
    config.headers.lang = localStorage.getItem("lang");
    config.headers.currency = localStorage.getItem("unit");
    return config;
  });
  httpTools.interceptors.response.use(
    (response) => {
      const code = response.data.code;
      switch (code) {
        case 401:
          useUserStore().logout();
          showLoginDialog();
          break;
      }
      if (code != 1) {
        showToast({
          msg: response.data.msg,
        });
      }
      return response;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
  return httpTools;
}
