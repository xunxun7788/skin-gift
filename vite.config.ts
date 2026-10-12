import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vueSetupExtend from "vite-plugin-vue-setup-extend";
//自动导入Element Plus 和 图标
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";

// https://vite.dev/config/
export default ({ mode }) =>
  defineConfig({
    esbuild: {
      drop: mode == "production" ? ["console", "debugger"] : [],
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    plugins: [
      vue(),
      // basicSsl(),
      vueSetupExtend(),
      AutoImport({
        imports: ["vue", "vue-router", "pinia", "vue-i18n"],
        resolvers: [
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            prefix: "Icon",
          }),
        ],
      }),
      Components({
        resolvers: [
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ["ep"],
          }),
          ElementPlusResolver(),
        ],
      }),
      Icons({
        autoInstall: true,
      }),
    ],
  });
