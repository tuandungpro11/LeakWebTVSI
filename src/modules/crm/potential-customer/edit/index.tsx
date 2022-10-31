import React, { Fragment, useState, useEffect } from "react";
import {
  Row,
  Col,
} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@customStyle/xtrade.scss";
import { useObserver } from "mobx-react";
import "moment/locale/vi";
import { Link, useLocation, useParams } from "react-router-dom";
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";
import EditForm from "./EditForm";

const indexEditPotentialCustomer = () =>
  useObserver(() => {
    const user = useParams();
    const location = useLocation();

    return (
      <Fragment>
        <EditForm userSelected={user} location={location} />
      </Fragment>
    )

  })

export default indexEditPotentialCustomer;