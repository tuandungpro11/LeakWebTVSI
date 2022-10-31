import { lazy } from "react";
const tworkRoutes=[
  {
    path: "/twork/customer-info",
    component: lazy(() => import("@modules/twork/customerInfo")),
  },
  {
    path: "/twork/history",
    component: lazy(() => import("@modules/twork/history")),
  },
]

export default tworkRoutes;