import React, { Fragment, useState, useContext, useEffect } from "react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import ListOrderBeforeDate from "./ListOrderBeforeDate";
import "antd/dist/antd.css";


const indexOrderBeforeDate = () => {

  return (
    <Fragment>
        <ListOrderBeforeDate/>
    </Fragment>
  );
};

export default indexOrderBeforeDate;
