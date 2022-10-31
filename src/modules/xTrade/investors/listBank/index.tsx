import React, { Fragment, useState, useContext, useEffect } from "react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import ListBank from "./ListBank";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";

const indexListBank = () => {

  return (
    <Fragment>
      <ListBank />
    </Fragment>
  );
};

export default indexListBank;
