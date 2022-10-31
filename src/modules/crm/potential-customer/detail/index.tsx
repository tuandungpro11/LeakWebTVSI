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
import UserInfoCard from "./UserInfoCard";
import UserTimeline from "./UserTimeline";
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";

const indexDetailPotentialCustomer = () =>
  useObserver(() => {
    const user = useParams();

    return (
      <div className="app-user-view">

        <Row>

          <Col xl="7" lg="9" md="9">

            <UserInfoCard userSelected={user} />
          </Col>

          <Col xl="17" lg="15" md="15">

            <UserTimeline userSelected={user} />
          </Col>
        </Row>
      </div>
    )

  })

export default indexDetailPotentialCustomer;