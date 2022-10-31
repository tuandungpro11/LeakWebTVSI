import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import {
  Home,
  Settings,
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
import { store } from "../../store/InvestorStore";
import Prism from "prismjs";
import PassiotHisLogin from "./PassiotHisLogin";
import ITradeHisLogin from "./ITradeHisLogin";

const ListHisLogin = () =>
  useObserver(() => {
    const [activeTab, setActiveTab] = useState("pasiot");
    const { t } = useTranslation();
    const toggle = (tab: any) => {
      if (activeTab !== tab) {
        setActiveTab(tab);
        store.currentHisLoginTab = tab
      }
    };
    useEffect(() => {
      Prism.highlightAll();
    }, []);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_History_Login")}</h4>
          </CardHeader>
          <CardBody>
            <Nav tabs fill={true} pills={true} className="mt-1">
              {/* <NavItem>
                <NavLink
                  active={activeTab === "iTrade"}
                  onClick={() => {
                    toggle("iTrade");
                  }}
                >
                  <Home size={14} />

                  <span className="align-middle">Đăng nhập từ iTrade-Home</span>
                </NavLink>
              </NavItem> */}
              <NavItem>
                <NavLink
                  active={activeTab === "pasiot"}
                  onClick={() => {
                    toggle("pasiot");
                  }}
                >
                  <Settings size={14} />

                  <span className="align-middle">Đăng nhập từ Pasiot</span>
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent className="py-50" activeTab={activeTab}>
              {/* <TabPane tabId="iTrade">
                <ITradeHisLogin />
              </TabPane> */}
              <TabPane tabId="pasiot">
                <PassiotHisLogin />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default ListHisLogin;
