import { createRouter, createWebHistory } from "vue-router";

import About from "../views/About.vue";
import AboutAbout from "../views/AboutAbout.vue";
import AboutProblem from "../views/AboutProblem.vue";
import AboutYhxy from "../views/AboutYhxy.vue";
import AboutYszc from "../views/AboutYszc.vue";
import AuthCallBack from "../views/AuthCallBack.vue";
import BattleDetail from "../views/BattleDetail.vue";
import Box from "../views/Box.vue";
import Contact from "../views/Contact.vue";
import CreateBattle from "../views/CreateBattle.vue";
import Fuli from "../views/Fuli.vue";
import Main from "../views/Main.vue";
import MineBag from "../views/MineBag.vue";
import MineShare from "../views/MineShare.vue";
import NewBattle from "../views/NewBattle.vue";
import OpenBlind from "../views/OpenBlind.vue";
import Recharge from "../views/Recharge.vue";
import Roll from "../views/Roll.vue";
import RollDetail from "../views/RollDetail.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Main,
      meta: { keepAlive: true },
      children: [
        {
          name: "home",
          path: "",
          component: Box,
        },
        {
          name: "about",
          path: "about",
          component: About,
        },
        {
          name: "roll",
          path: "roll",
          component: Roll,
        },
        {
          name: "boxDetail",
          path: "openBlind/:id",
          component: OpenBlind,
          props: true,
        },
        {
          name: "rollDetail",
          path: "rollDetail/:id",
          component: RollDetail,
          props: true,
        },
        {
          name: "battle",
          path: "battle",
          component: NewBattle,
        },
        {
          name: "create",
          path: "battle/create",
          component: CreateBattle,
        },
        {
          name: "battleDetail",
          path: "battleDetail/:id",
          component: BattleDetail,
          props: true,
        },
        {
          name: "bag",
          path: "bag",
          component: MineBag,
        },
        {
          name: "profile",
          path: "profile",
          component: MineShare,
        },
        {
          name: "recharge",
          path: "recharge",
          component: Recharge,
        },
        {
          name: "reward",
          path: "reward",
          component: Fuli,
        },
        {
          name: "help",
          path: "help",
          component: About,
          children: [
            {
              path: "about",
              name: "about",
              component: AboutAbout,
            },
            {
              path: "contact",
              name: "contact",
              component: Contact,
            },
            {
              path: "privacy",
              name: "privacy",
              component: AboutYszc,
            },
            {
              path: "agreement",
              name: "agreement",
              component: AboutYhxy,
            },
            {
              path: "problem",
              name: "problem",
              component: AboutProblem,
            },
          ],
        },

        {
          path: "/",
          redirect: "home",
        },
      ],
    },
    {
      name: "auth",
      path: "/auth",
      component: AuthCallBack,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
