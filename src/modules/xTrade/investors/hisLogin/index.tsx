import React, { Fragment, useState, useContext, useEffect } from "react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import ListHisLogin from "./HisLogin";
import "antd/dist/antd.css";

const indexHisLogin = () => {

  return (
    <Fragment>
      <ListHisLogin/>
    </Fragment>
  );
};

export default indexHisLogin;
