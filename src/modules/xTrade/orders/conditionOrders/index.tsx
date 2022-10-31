import React, { Fragment, useState, useContext, useEffect } from "react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import ListConditionOrders from "./ListConditionOrders";
import "antd/dist/antd.css";


const indexConditionOrder = () => {

  return (
    <Fragment>
        <ListConditionOrders/>
    </Fragment>
  );
};

export default indexConditionOrder;
