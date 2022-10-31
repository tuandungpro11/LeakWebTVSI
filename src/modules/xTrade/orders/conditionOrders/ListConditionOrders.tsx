import { useObserver } from "mobx-react";
import React, { useState } from "react";
import { Fragment } from "react";
import {
  Activity,
  Clock,
} from "react-feather";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { storeOrder } from "../../store/OrdersStore";
import TimeConditionOrders from "./TimeConditionOrders";
import PriceConditionOrders from "./PriceConditionOrders";

const ListConditionOrders = () =>
  useObserver(() => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("Time");
    const toggle = (tab: any) => {
      storeOrder.dataListCondition=[];
      if (activeTab !== tab) {
        setActiveTab(tab);
        storeOrder.currentConditionOrderTab = tab;
      }
    };

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Condition_Order")}</h4>
          </CardHeader>
          <CardBody>
            <Nav tabs fill={true} pills={true} className="mt-1">
              <NavItem>
                <NavLink
                  active={activeTab === "Time"}
                  onClick={() => {
                    toggle("Time");
                  }}
                >
                  <Clock size={14} />

                  <span className="align-middle">LĐK thời gian</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "Price"}
                  onClick={() => {
                    toggle("Price");
                  }}
                >
                  <Activity size={14} />

                  <span className="align-middle">LĐK giá</span>
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent className="py-50" activeTab={activeTab}>
              <TabPane tabId="Time">
                <TimeConditionOrders />
              </TabPane>
              <TabPane tabId="Price">
                <PriceConditionOrders />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default ListConditionOrders;
