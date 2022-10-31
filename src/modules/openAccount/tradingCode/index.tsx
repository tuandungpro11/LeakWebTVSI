import React, { Fragment, useState, useContext, useEffect } from "react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";
import ListTradingCode from "./ListTradingCode";

const index = () => {

  return (
    <Fragment>
      <ListTradingCode/>
    </Fragment>
  );
};

export default index;
