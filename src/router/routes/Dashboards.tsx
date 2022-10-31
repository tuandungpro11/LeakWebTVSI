import { lazy } from "react";

const DashboardRoutes = [
  // Dashboards
  {
    path: "/authorization/user-management",
    component: lazy(() => import("@modules/dashboard/user-management")),
  },
  // {
  //   path: "/dashboard/user-management",
  //   component: lazy(() => import("@modules/dashboard/user-management")),
  // },
  {
    path: "/verify-account/:userId/:token",
    component: lazy(() => import("@modules/dashboard/user-management/VerifyUser")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  // {
  //   path: '/dashboard/ecommerce',
  //   component: lazy(() => import('../../views/dashboard/ecommerce')),
  //   exact: true
  // }
];

export default DashboardRoutes;
