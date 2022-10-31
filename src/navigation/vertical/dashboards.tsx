import React from "react";
import { Circle, XOctagon, PhoneCall, Minus, Plus, Home, User } from "react-feather";
import { SettingOutlined } from '@ant-design/icons';
import { MenuMapping } from "../../router/routes/types";
import {
  CustomerServiceOutlined,
} from '@ant-design/icons';

interface MenuItem {
  id?: string;
  title?: string;
  children?: Array<any>;
  navLink?: string;
  icon?: any;
}

const getMenus = () => {
  let menuArray = localStorage.getItem('userData') ? (JSON.parse(localStorage.getItem('userData')).Menus ?? []) : [];
  if(menuArray !== null) {
    menuArray = buildMenuTree(menuArray);
  } else {
    menuArray = []
  }
  return menuArray;
}

const buildMenuTree = (originMenu: Array<MenuItem>) => {
  const sortedMenu: Array<MenuItem> = [];
  for (let menu of originMenu) {
    menu.icon = getMenuIcon(menu.id);
    menu.navLink = getMenuPath(menu.id);
    if (menu.children && menu.children.length > 0) {
      menu.children = buildMenuTree(menu.children);
    }
    sortedMenu.push(menu);
  }
  return sortedMenu;
}

const getMenuIcon = (id?: string) => {
  let icon;
  switch (id) {
    case 'XT_BO':
      icon = <XOctagon />;
      break;
    case 'IW':
      icon = <CustomerServiceOutlined style={{ fontSize: '20px' }} />;
      break;
    case 'XT_BO_CM':
    case 'XT_BO_RM':
    case 'XT_BO_OM':
    case 'XT_BO_SM':
    case 'EMS_SETTING':
      icon = <Circle />;
      break;
    case 'XT_BO_RM_XD':
    case 'XT_BO_RM_NO':
    case 'XT_BO_RM_OR':
    case 'XT_BO_RM_OD':
    case 'XT_BO_OM_OR':
      icon = <Plus />;
      break;
    case 'EMS':
      icon = <SettingOutlined />;
      break;
    default:
      icon = <Minus />;
  }
  return icon;
}

const getMenuPath = (id?: string) => {
  type ObjectKey = keyof typeof MenuMapping;
  const urlPath = MenuMapping[id as ObjectKey];
  return urlPath;
}

// const MenuMapping = {
//   //Xtrade BO
//   XT_BO: '',
//   XT_BO_CM: '',
//   XT_BO_CM_LO: '/xtrade/investors/his-login',
//   XT_BO_CM_CI: '/xtrade/investors/investor-account',
//   XT_BO_CM_IA: '/xtrade/investors/internal-account',
//   XT_BO_CM_BA: '/xtrade/investors/bank-account',
//   XT_BO_CM_BL: '/xtrade/investors/list-bank',
//   XT_BO_CM_SAM: '/xtrade/investors/super-account',
//   XT_BO_CM_AU: '/xtrade/investors/white-list',
//   XT_BO_CM_ASSET: '/xtrade/investors/asset-management',
//   XT_BO_RM: '',
//   XT_BO_RM_XD: '',
//   XT_BO_RM_XD_STATUS: '/xtrade/function/right-buy/right-buy',
//   XT_BO_RM_XD_HIST: '/xtrade/function/right-buy/his-right-buy',
//   XT_BO_RM_XD_SYM: '/xtrade/function/right-buy/sec-right',
//   XT_BO_RM_NO: '',
//   XT_BO_RM_NO_CONFIG: '/xtrade/function/warning/config',
//   XT_BO_RM_OR: '',
//   XT_BO_RM_OR_TRADEID: '/xtrade/function/orders/order-slips',
//   XT_BO_RM_OD: '',
//   XT_BO_RM_OD_SVL: '/xtrade/function/over-draft/overdraft-service',
//   XT_BO_RM_OD_ACL: '/xtrade/function/over-draft/overdraft-account',
//   XT_BO_RM_OD_SYM: '/xtrade/function/over-draft/sec-to-purchase',
//   XT_BO_RM_OD_SYMHIST: '/xtrade/function/over-draft/his-sec-to-purchase',
//   XT_BO_OM: '',
//   XT_BO_OM_OR: '',
//   XT_BO_OM_OR_STATUS: '/xtrade/orders-management/orders/tfos',
//   XT_BO_OM_OR_HIST: '/xtrade/orders-management/orders/osht',
//   XT_BO_OM_COO: '/xtrade/orders-management/condition-orders',
//   XT_BO_OM_BOO: '/xtrade/orders-management/order-before-date',
//   XT_BO_OM_BAO: '/xtrade/orders-management/order-group',
//   XT_BO_SM: '',
//   XT_BO_SM_SYM: '/xtrade/system-management/sec-place-order',
//   XT_BO_SM_PRICE: '/xtrade/system-management/price-place-order',
//   XT_BO_SM_CONF: '/xtrade/system-management/config',
//   XT_BO_SM_PIL: '/xtrade/system-management/trial-account',
//   //IWork
//   IW: '',
//   IW_CA: '',
//   IW_CA_Customer: '/twork/customer-info',
//   IW_CA_CallHist: '/twork/history',
//   //EMS
//   EMS: '',
//   EMS_SETTING: '',
//   EMS_AUTH_GROUP: '/authorization/group',
//   EMS_AUTH_USERPER: '/authorization/authorize',
//   EMS_AUTH_FUNC: '/authorization/function',
//   EMS_AUTH_RIGHT: '/authorization/manage-authorization',
//   EMS_AUTH_SYSLEVEL: '/authorization/tree-level',
//   EMS_AUTH_SALEINF: '/authorization/manage-sale',
//   EMS_AUTH_POS: '/authorization/position',
//   EMS_AUTH_BRANCH: '/authorization/manage-branch',
//   EMS_AUTH_APPINFO: '/authorization/manage-app',
//   EMS_AUTH_UM: '/authorization/user-management',
//   //Report DVDT
//   IW_RPT_DVDT_01:"/report-dvdt/custormer-dob",
//   IW_RPT_DVDT_02:"/report-dvdt/custormer-reactive",
//   IW_RPT_DVDT_03:"/report-dvdt/custormer-inactive",
//   IW_RPT_DVDT_04:"/report-dvdt/custormer-finance",
//   IW_RPT_DVDT_05:"/report-dvdt/custormer-deposit",
//   IW_RPT_DVDT_06:"/report-dvdt/custormer-sec",
//   IW_RPT_DVDT_07:"/report-dvdt/custormer-active",
// }

const menus = getMenus();

export default menus;

// export default [
//   {
//     id: "dashboards",
//     title: "Dashboards",
    
//     icon: <Home size={20} />,
    
//     badge: "light-warning",
    
//     badgeText: "1",
    
//     children: [
//       {
//         id: "userManagement",
//         title: "Quản lý tài khoản",
        
//         icon: <User size={12} />,
        
//         navLink: "/dashboard/user-management",
//       }
//     ],
//   },
// ]


