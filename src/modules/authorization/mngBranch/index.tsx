import { Fragment } from "react"
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";
import React from "react";
import ListBranch from "./ListBranch";

const index =()=>{
    return(
        <Fragment>
            <ListBranch/>
        </Fragment>
    )
}

export default index;