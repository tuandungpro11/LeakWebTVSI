import React, { Fragment, useState, useContext, useEffect } from "react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import InvestorAccount from "./InvestorAccount";
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";

const IndexInvestorAccount = () => {
  return (
    <Fragment>
      <InvestorAccount />
    </Fragment>
  );
};

export default IndexInvestorAccount;
