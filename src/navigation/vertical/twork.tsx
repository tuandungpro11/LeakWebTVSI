import React from "react";
import {
  Minus,
} from "react-feather";

import {
  CustomerServiceOutlined,
  CopyrightOutlined
} from '@ant-design/icons';

export default [
  {
    id: "twork",
    title: "CRM",
    icon: <CopyrightOutlined style={{ fontSize: '20px' }} />,
    children: [
      {
        id: "cust-potentail-info",
        title: "Khách hàng tiềm năng",
        icon: <Minus size={12} />,
        navLink: "/crm/potential-customer",
      },
      {
        id: "cust-info",
        title: "Khách hàng",
        icon: <Minus size={12} />,
        navLink: "/crm/customer",
      },
    ]
  }
]