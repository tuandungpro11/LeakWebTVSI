// ** Routes Imports

import AppRoutes from "./Apps";
import FormRoutes from "./Forms";

import PagesRoutes from "./Pages";
import TablesRoutes from "./Tables";
import ChartMapsRoutes from "./ChartsMaps";
import DashboardRoutes from "./Dashboards";
import UiElementRoutes from "./UiElements";
import ExtensionsRoutes from "./Extensions";
import PageLayoutsRoutes from "./PageLayouts";
import mangeAccRoutes from "./mngAcc";
import tworkRoutes from "./twork";
import authorizationRoutes from "./authorization";
import { MenuMapping } from "./types";

interface MenuItem {
  id?: string;
  title?: string;
  children?: Array<any>;
  navLink?: string;
  icon?: any;
}
// ** Document title
const TemplateTitle = "TVSI";

// const DefaultRoute = "/dashboard/user-management";
var defaultMenu1: string = "";
const buildMenuTree = (originMenu: Array<MenuItem>) => {
  // let defaultMenu = "";
  for (let menu of originMenu) {
    if (!menu.children) {
      type ObjectKey = keyof typeof MenuMapping;
      const urlPath = MenuMapping[menu.id as ObjectKey];
      defaultMenu1 = defaultMenu1 !== "" ? defaultMenu1 : urlPath;
    } else {
      buildMenuTree(menu.children)
    }
  } 
  return defaultMenu1;
}

const getMenusDefault = () => {
  let menuArray = localStorage.getItem('userData') ? (JSON.parse(localStorage.getItem('userData')).Menus ?? []) : [];
  let menuFirst = null;
  if(menuArray !== null) {
    defaultMenu1 = "";
    menuFirst = buildMenuTree(menuArray);
  } else {
    menuFirst = null
  }
  return menuFirst;
}



// ** Default Route
const DefaultRoute = getMenusDefault();

// ** Merge Routes
const Routes = [
  ...DashboardRoutes,
  // ...AppRoutes,
  // ...PagesRoutes,
  // ...UiElementRoutes,
  // ...ExtensionsRoutes,
  // ...PageLayoutsRoutes,
  // ...FormRoutes,
  // ...TablesRoutes,
  // ...ChartMapsRoutes,
  ...mangeAccRoutes,
  ...tworkRoutes,
  ...authorizationRoutes,
  ...PagesRoutes,
];

export { DefaultRoute, TemplateTitle, Routes };
