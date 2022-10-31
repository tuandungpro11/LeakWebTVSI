import React, { Fragment, useState, useContext, useEffect } from "react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";
import AssetDetail from "./AssetDetail";

const IndexAssetsManagement = () => {
  return (
    <Fragment>
      <AssetDetail />
    </Fragment>
  );
};

export default IndexAssetsManagement;
