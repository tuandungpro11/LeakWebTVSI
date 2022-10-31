import { Fragment } from "react"
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";
import React from "react";
import ListAuthorize from "./ListAuthorize";

const index =()=>{
    return(
        <Fragment>
            <ListAuthorize/>
        </Fragment>
    )
}

export default index;