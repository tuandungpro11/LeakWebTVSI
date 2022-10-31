import React, { Fragment, useState, useContext, useEffect } from "react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import HisListSecToPurChase from "./HisListSecToPurchase";
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";

const indexSecToPurchase = () => {

  return (
    <Fragment>
      <HisListSecToPurChase/>
    </Fragment>
  );
};

export default indexSecToPurchase;
