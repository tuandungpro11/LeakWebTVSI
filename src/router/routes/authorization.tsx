import { lazy } from "react";
const authorizationRoutes=[
  {
    path: "/authorization/manage-app",
    component: lazy(() => import("@modules/authorization/mngApp")),
  },
  {
    path: "/authorization/manage-branch",
    component: lazy(() => import("@modules/authorization/mngBranch")),
  },
  {
    path: "/authorization/manage-title",
    component: lazy(() => import("@modules/authorization/mngTitle")),
  },
  {
    path: "/authorization/manage-sale",
    component: lazy(() => import("@modules/authorization/mngSale")),
  },
  {
    path: "/authorization/manage-authorization",
    component: lazy(() => import("@modules/authorization/mngAuthorization")),
  },
  {
    path: "/authorization/authorize",
    component: lazy(() => import("@modules/authorization/authorize")),
  },
  {
    path: "/authorization/tree-level",
    component: lazy(() => import("@modules/authorization/treeLevel")),
  },
  {
    path: "/authorization/function",
    component: lazy(() => import("@modules/authorization/mngFunction")),
  },
  {
    path: "/authorization/level",
    component: lazy(() => import("@modules/authorization/treeLevel")),
  },
  {
    path: "/authorization/group",
    component: lazy(() => import("@modules/authorization/mngGroup")),
  },
  {
    path: "/authorization/position",
    component: lazy(() => import("@modules/authorization/mngPosition")),
  },
  {
    path: "/report-dvdt/custormer-dob",
    component: lazy(() => import("@modules/reportDVDT/dob")),
  },
  {
    path: "/report-dvdt/custormer-reactive",
    component: lazy(() => import("@modules/reportDVDT/reactive")),
  },
  {
    path: "/report-dvdt/custormer-inactive",
    component: lazy(() => import("@modules/reportDVDT/inactive")),
  },
  {
    path: "/report-dvdt/custormer-finance",
    component: lazy(() => import("@modules/reportDVDT/finance")),
  },
  {
    path: "/report-dvdt/custormer-deposit",
    component: lazy(() => import("@modules/reportDVDT/deposit")),
  },
  {
    path: "/report-dvdt/custormer-sec",
    component: lazy(() => import("@modules/reportDVDT/sec")),
  },
  {
    path: "/report-dvdt/custormer-active",
    component: lazy(() => import("@modules/reportDVDT/active")),
  },
  {
    path: "/open-account/mng-account",
    component: lazy(() => import("@modules/openAccount/mngAccount")),
  },
  {
    path: "/open-account/trading-code",
    component: lazy(() => import("@modules/openAccount/tradingCode")),
  },
  {
    path: "/open-account/personal-foreign",
    component: lazy(() => import("@modules/openAccount/personalForeign")),
  },
  {
    path: "/open-account/regist-trading-code",
    component: lazy(() => import("@modules/openAccount/tradingCode/addNew")),
  },
  {
    path: "/open-account/update-trading-code/:Id",
    component: lazy(() => import("@modules/openAccount/tradingCode/update")),
  }

]

export default authorizationRoutes;