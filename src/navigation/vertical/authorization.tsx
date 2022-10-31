import React from "react";
import { Layers, Minus, Smartphone } from "react-feather";

export default [
    {
        id:"mtkNN",
        title:"Mở tài khoản",
        icon: <Layers size={20}/>,
        children:[
            {
                id:"mng-open-acc",
                title:"Quản lý mở tài khoản NĐT",
                icon: <Minus size={12} />,
                children:[
                    {
                        title:"NĐT cá nhân nước ngoài",
                        icon: <Minus size={20}/>,
                        navLink: "/open-account/personal-foreign",
                    }
                ]
            },
            {
                id:"mng-branch",
                title:"Nghiệp vụ Trading code",
                icon: <Minus size={12} />,
                children:[
                    {
                        title:"Đăng ký mã số giao dịch",
                        icon: <Minus size={20}/>,
                        navLink: "/open-account/trading-code",
                    }
                ]
            },
            {
                id:"mng-title",
                title:"Quản lý hồ sơ MTK",
                icon: <Minus size={12} />,
                children:[
                    {
                        title:"Quản lý tài khoản",
                        icon: <Minus size={20}/>,
                        navLink: "/open-account/mng-account",
                    }
                ]
            }
            // 
            // {
            //     id:"mng-function-authorizaton",
            //     title:"Quản lý chức năng",
            //     icon: <Minus size={12} />,
            //     navLink: "/authorization/function",
            // },
            // {
            //     id:"mng-level",
            //     title:"Quản lý cấp độ",
            //     icon: <Minus size={12} />,
            //     navLink: "/authorization/level",
            // },
            // {
            //     id:"mng-group-authorization",
            //     title:"Nhóm quyền",
            //     icon: <Minus size={12} />,
            //     navLink: "/authorization/group",
            // },
            // {
            //     id:"mng-position-authorization",
            //     title:"Quản lý vị trí",
            //     icon: <Minus size={12} />,
            //     navLink: "/authorization/position",
            // }
        ]
    }
]