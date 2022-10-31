import { lazy } from "react";

const mangeAccRoutes = [
  {
    path: "/xtrade/investors/investor-account",
    component: lazy(() => import("@modules/xTrade/investors/investorAccountManagement")),
  },
  {
    path: "/xtrade/investors/bank-account",
    component: lazy(() => import("@modules/xTrade/investors/bankAccount")),
  },
  {
    path: "/xtrade/investors/list-bank",
    component: lazy(() => import("@modules/xTrade/investors/listBank")),
  },
  {
    path: "/xtrade/investors/internal-account",
    component: lazy(() => import("@modules/xTrade/investors/internalAccount")),
  },
  {
    path: "/xtrade/function/orders/order-slips",
    component: lazy(() => import("@modules/xTrade/function/orders/orderSlip")),
  },
  {
    path: "/xtrade/function/over-draft/sec-to-purchase",
    component: lazy(() => import("@modules/xTrade/function/overdraft/secToPurchase")),
  },
  {
    path: "/xtrade/function/over-draft/his-sec-to-purchase",
    component: lazy(() => import("@modules/xTrade/function/overdraft/hisSecToPurchase")),
  },
  {
    path: "/xtrade/system-management/sec-place-order",
    component: lazy(() => import("@modules/xTrade/systemManagement/secPlaceOrder")),
  },
  {
    path: "/xtrade/investors/his-login",
    component: lazy(() => import("@modules/xTrade/investors/hisLogin")),
  },
  {
    path: "/xtrade/orders-management/orders/tfos",
    component: lazy(() => import("@modules/xTrade/orders/orderMng/TFOS")),
  },
  {
    path: "/xtrade/orders-management/orders/osht",
    component: lazy(() => import("@modules/xTrade/orders/orderMng/OSHT")),
  },
  {
    path: "/xtrade/orders-management/condition-orders",
    component: lazy(() => import("@modules/xTrade/orders/conditionOrders")),
  },
  {
    path: "/xtrade/orders-management/order-before-date",
    component: lazy(() => import("@modules/xTrade/orders/beforeDateOrder")),
  },
  {
    path: "/xtrade/system-management/price-place-order",
    component: lazy(() => import("@modules/xTrade/systemManagement/pricePlaceOrder")),
  },
  {
    path: "/xtrade/Function/right-buy/right-buy",
    component: lazy(() => import("@modules/xTrade/function/rightBuy/rightBuy")),
  },
  {
    path: "/xtrade/Function/right-buy/his-right-buy",
    component: lazy(() => import("@modules/xTrade/function/rightBuy/hisRightBuy")),
  },
  {
    path: "/xtrade/Function/right-buy/sec-right",
    component: lazy(() => import("@modules/xTrade/function/rightBuy/secRight")),
  },
  {
    path: "/xtrade/investors/super-account",
    component: lazy(() => import("@modules/xTrade/investors/superAccount")),
  },
  {
    path: "/xtrade/investors/white-list",
    component: lazy(() => import("@modules/xTrade/investors/whiteList")),
  },
  {
    path: "/xtrade/function/warning/config",
    component: lazy(() => import("@modules/xTrade/function/warning/config")),
  },
  {
    path: "/xtrade/function/over-draft/overdraft-service",
    component: lazy(() => import("@modules/xTrade/function/overdraft/service")),
  },
  {
    path: "/xtrade/function/over-draft/overdraft-account",
    component: lazy(() => import("@modules/xTrade/function/overdraft/account")),
  },
  {
    path: "/xtrade/orders-management/order-group",
    component: lazy(() => import("@modules/xTrade/orders/orderGroup")),
  },
  {
    path: "/xtrade/system-management/config",
    component: lazy(() => import("@modules/xTrade/systemManagement/config")),
  },
  {
    path: "/xtrade/function/system-management/log",
    component: lazy(() => import("@modules/xTrade/systemManagement/log")),
  },
  {
    path: "/xtrade/investors/asset-management",
    component: lazy(() => import("@modules/xTrade/investors/assetsManagement")),
  },
  {
    path: "/xtrade/system-management/trial-account",
    component: lazy(() => import("@modules/xTrade/systemManagement/trial-account")),
  },
];

export default mangeAccRoutes;