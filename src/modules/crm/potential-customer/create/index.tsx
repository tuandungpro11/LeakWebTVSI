import React, { Fragment, useState, useEffect } from "react";
import {
  Row,
  Col,
} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@customStyle/xtrade.scss";
import { useObserver } from "mobx-react";
import "moment/locale/vi";
import { Link, useParams } from "react-router-dom";
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";
import CreateForm from "./CreateForm";

const indexCreatePotentialCustomer = () =>
  useObserver(() => {
    const user = useParams();

  return (
    <Fragment>
      <CreateForm />
    </Fragment>
  )

})

export default indexCreatePotentialCustomer;