import React, { Fragment, useState, useContext, useEffect } from "react";
import {
  Row,
  Col,
  CustomInput,
  Button,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  CardHeader,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { customSMSelectStyles, pageSizeTable } from "../types";
import { storeTwork } from "../store/storeTwork";
import { Moment } from "../../../utility/general/Moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import PerfectScrollbar from "react-perfect-scrollbar";
import { PaginationProps, Menu, Form, DatePicker, Input } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import Prism from "prismjs";
import { Calendar, PhoneForwarded } from "react-feather";
import HistoryCall from "./HistoryCall";
import HistoryPlan from "./HistoryPlan";

const ListHistory = (valueBind: any) =>
  useObserver(() => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("Call");
    const toggle = (tab: any) => {
      if (activeTab !== tab) {
        setActiveTab(tab);
        storeTwork.currentHisTabDetail = tab
      }
    };
    useEffect(() => {
      Prism.highlightAll();
    }, []);

    return (
      <Fragment>
        <Card>
          <CardBody>
          <Nav tabs fill={true} pills={true} className="mt-1">
              <NavItem>
                <NavLink
                  active={activeTab === "Call"}
                  onClick={() => {
                    toggle("Call");
                  }}
                >
                  <PhoneForwarded size={14} />

                  <span className="align-middle">{t("twork_history_call_title")}</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "Plan"}
                  onClick={() => {
                    toggle("Plan");
                  }}
                >
                  <Calendar size={14} />

                  <span className="align-middle">{t("twork_history_date_title")}</span>
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent className="py-50" activeTab={activeTab}>
              <TabPane tabId="Call">
                <HistoryCall valueBind={valueBind}/>
              </TabPane>
              <TabPane tabId="Plan">
                <HistoryPlan valueBind={valueBind}/>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default ListHistory;
