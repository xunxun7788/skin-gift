import { reactive, ref } from "vue";
import { showLoading, showToast } from "../utils";
import axiosTools from "./useHttp";
const httpTools = axiosTools();

export default function () {
  const { t } = useI18n()
  const shopListData = reactive([]);

  let shopTotal = ref(0);

  const shopLoadState = ref(0);

  const shopLoadEmpty = ref("");

  async function apiShopList(
    page: number,
    min_price: string,
    max_price: string,
    keyword: string,
    order_sort: string
  ) {
    shopLoadState.value = 1;
    try {
      const result = await httpTools.get("shoppingmall/getShoppingGoods", {
        params: {
          page: page,
          size: 24,
          min_price: min_price,
          max_price: max_price,
          keyword: keyword,
          order_by: "show_price",
          order_sort: order_sort,
        },
      });
      const code = result.data.code;
      if (code != 1) {
        shopLoadState.value = 2;
        shopLoadEmpty.value = result.data.msg;
      } else {
        shopLoadState.value = 0;
        shopTotal.value = result.data.data.count;
        shopListData.length = 0;
        Object.assign(shopListData, result.data.data.list);
        if (shopListData.length == 0) {
          shopLoadState.value = 2;
          shopLoadEmpty.value = t('common.noMore');
        }
      }
    } catch (error) {
      shopLoadState.value = 2;
      shopLoadEmpty.value = error;
    }
  }

  async function apiExShop(id: string) {
    const hideLoading = showLoading();
    let result;
    try {
      result = await httpTools.post("shoppingmall/MallBuy", {
        id: id,
        nums: 1,
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
    apiShopList,
    shopListData,
    apiExShop,
    shopTotal,
    shopLoadState,
    shopLoadEmpty,
  };
}
