import React from "react";
import {
  Box,
  Mail,
  MessageSquare,
  CheckSquare,
  Calendar,
  FileText,
  Circle,
  ShoppingCart,
  User,
  Minus,
  Plus,
  XOctagon,
} from "react-feather";

export default [
  {
    id: "XT_BO",
    title: "Quản lý X-Trade",
    icon: <XOctagon size={20} />,
    children: [
      {
        id: "ManageAcc",
        title: "Quản lý Tài khoản nhà đầu tư",

        icon: <Circle size={12} />,

        // navLink: "/apps/invoice/list",
        children: [
          {
            title: "Quản lý đăng nhập",
            id:"AM_LI",
            icon: <Minus size={12} />,
            navLink: "/xtrade/investors/his-login",
          },
          {
            title: "Quản lý tài khoản nhà đầu tư",
            id:"AM_AI",
            icon: <Minus size={12} />,
            navLink: "/xtrade/investors/investor-account",
          },
          {
            title: "Quản lý tài khoản chuyển tiền nội bộ",
            id:"AM_ITL",
            icon: <Minus size={12} />,
            navLink: "/xtrade/investors/internal-account",
          },
          {
            title: "Quản lý tài khoản ngân hàng",
            id:"AM_BA",
            icon: <Minus size={12} />,
            navLink: "/xtrade/investors/bank-account",
          },
          {
            title: "Quản lý danh mục ngân hàng",
            id:"AM_BlankList",
            icon: <Minus size={12} />,
            navLink: "/xtrade/investors/list-bank",
          },
          {
            title: "Super Account Management",
            id:"SAM",
            icon: <Minus size={12} />,
            navLink: "/xtrade/investors/super-account",
          },
          {
            title: "Quản lý ủy quyền cho KH",
            id:"SAMWHITE",
            icon: <Minus size={12} />,
            navLink: "/xtrade/investors/white-list",
          },
          {
            title: "Quản lý tài sản",
            id:"Asset_Management",
            icon: <Minus size={12} />,
            navLink: "/xtrade/investors/asset-management",
          },
        ],
      },
      {
        id: "ManageFunc",
        title: "Quản lý chức năng",
        icon: <Circle size={12} />,
        children: [
          {
            title: "Quản lý đăng ký quyền mua",
            icon: <Plus size={12} />,
            id: "UF_RIR",
            children: [
              {
                title: "Quản lý trạng thái đăng ký quyền mua",
                icon: <Minus size={12} />,
                id: "UF_RIR_C",
                navLink:"/xtrade/function/right-buy/right-buy"
              },
              {
                title: "Quản lý lịch sử hưởng quyền",
                icon: <Minus size={12} />,
                id: "UF_RIR_HIS",
                navLink:"/xtrade/function/right-buy/his-right-buy"
              },
              {
                title: "Quản lý thông tin cổ phiếu hưởng quyền",
                icon: <Minus size={12} />,
                id: "RIR_R",
                navLink:"/xtrade/function/right-buy/sec-right"
              },
            ],
          },
          {
            title: "Quản lý cảnh báo",
            id:"WarningManagement",
            icon: <Plus size={12} />,
            children: [
              {
                title: "Quản lý cấu hình",
                icon: <Minus size={12} />,
                id: "UF_AS",
                navLink:"/xtrade/function/warning/config"
              },
            ],
          },
          {
            title: "Quản lý danh sách ký phiếu",
            icon: <Plus size={12} />,
            id: "UF_OC",
            children: [
              {
                title: "Quản lý danh sách TraderID không phát sinh phiếu lệnh",
                icon: <Minus size={12} />,
                id: "UF_OC_P",
                navLink: "/xtrade/function/orders/order-slips",
              },
            ],
          },
          {
            title: "Quản lý thấu chi",
            icon: <Plus size={12} />,
            id: "UF_ODF",
            children: [
              {
                title: "Danh sách dịch vụ thấu chi",
                icon: <Minus size={12} />,
                id: "UF_ODF_SL",
                navLink: "/xtrade/function/over-draft/overdraft-service",
              },
              {
                title: "Quản lý danh sách tài khoản thấu chi",
                icon: <Minus size={12} />,
                id: "UF_ODF_AL",
                navLink: "/xtrade/function/over-draft/overdraft-account",
              },
              {
                title: "Quản lý mã chứng khoán được mua",
                icon: <Minus size={12} />,
                id: "UF_ODF_IS",
                navLink: "/xtrade/function/over-draft/sec-to-purchase",
              },
              {
                title: "Quản lý lịch sử mã chứng khoán được mua",
                icon: <Minus size={12} />,
                id: "UF_ODF_ISH",
                navLink: "/xtrade/function/over-draft/his-sec-to-purchase",
              },
            ],
          },
        ],
      },
      {
        id: "ManageOrder",
        title: "Quản lý lệnh",
        icon: <Circle size={12} />,
        children: [
          {
            title: "Quản lý lệnh đặt",
            id:"TF_OS",
            icon: <Plus size={12} />,
            children: [
              {
                title: "Quản lý trạng thái lệnh",
                icon: <Minus size={10} />,
                id: "OS_ST",
                navLink:"/xtrade/orders-management/orders/tfos"
              },
              {
                title: "Quản lý lịch sử lệnh đặt",
                icon: <Minus size={10} />,
                id: "OS_HT",
                navLink:"/xtrade/orders-management/orders/osht"
              },
          ],
          },
          {
            title: "Quản lý lệnh điều kiện",
            icon: <Minus size={12} />,
            id:"TF_CCO",
            navLink:"/xtrade/orders-management/condition-orders"
          },
          {
            title: "Quản lý lệnh đặt trước ngày",
            id:"TF_CCO_NO",
            icon: <Minus size={12} />,
            navLink:"/xtrade/orders-management/order-before-date"
          },
          {
            title: "Quản lý danh sách nhóm lệnh hàng loạt",
            id:"TF_BAO",
            icon: <Minus size={12} />,
            navLink:"/xtrade/orders-management/order-group"
          }
        ],
      },
      {
        id: "ManageSys",
        title: "Quản trị hệ thống",
        icon: <Circle size={12} />,
        children: [
          {
            title: "Quản lý mã CK loại trừ đặt lệnh trước ngày",
            id:"AD_NO_ES",
            icon: <Minus size={12} />,
            navLink: "/xtrade/system-management/sec-place-order",
          },
          {
            title: "Quản lý thông tin giá trước ngày",
            id:"AD_NO_NDP",
            icon: <Minus size={12} />,
            navLink: "/xtrade/system-management/price-place-order",
          },
          {
            title: "Quản lý cấu hình hệ thống",
            id:"AD_SC",
            icon: <Minus size={12} />,
            navLink: "/xtrade/system-management/config",
          },
          {
            title: "Quản lý tài khoản trải nghiệm XTrade",
            id:"XTRADE_TRIAL_ACCOUNT",
            icon: <Minus size={12} />,
            navLink: "/xtrade/system-management/trial-account",
          },
        ],
      },
    ],
  },
];
