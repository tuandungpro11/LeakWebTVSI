import React, { Fragment, useState, useContext, useEffect } from "react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import ListOrderTFOS from "./ListOrder";
import "antd/dist/antd.css";

const indexListOrder = () => {

  return (
    <Fragment>
        <ListOrderTFOS/>
    </Fragment>
  );
};

export default indexListOrder;
