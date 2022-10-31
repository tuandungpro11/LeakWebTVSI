// ** Custom Components
import Avatar from "@components/avatar";
import Timeline from "@components/timeline";
import React, { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import { Card, CardHeader, CardTitle, CardBody, Media, TabPane, TabContent, Nav, NavItem, NavLink, Button, PaginationProps } from "reactstrap";
import { useObserver } from "mobx-react";
import { crmStore } from "../../store/store";
import { appStore } from "../../../../stores/appStore";
import {
  DatabaseOutlined,
  StarOutlined,
  DollarCircleOutlined,
  UserOutlined
} from "@ant-design/icons"
import UserBasicInfo from "./user-info/BasicInfo";
import ExtendInfo from "./user-info/ExtendInfo";
import KYCInfo from "./user-info/KYCInfo";

const UserAccount = (userInfo: any) =>
  useObserver(() => {
    const userDetail = userInfo.userSelected;
    const [active, setActive] = useState(1);

    const toggle = (tab: any) => {
      if (active !== tab) {
        setActive(tab);
      }
    };

    const initData = () => {
      const param = {
        UserName: appStore.account.LoginName,
        CustCode: userDetail.id,
        PageIndex: crmStore.pageIndexCustomerActivity,
        PageSize: crmStore.pageSizeCustomerActivity,
      }
      crmStore.getListCustomerActivity(param);
    }

    useEffect(() => {
      if (crmStore.activeTabPotential === 3) {
        initData();
      }
    }, [crmStore.pageSizeCustomerActivity,
    crmStore.pageIndexCustomerActivity,
    crmStore.activeTabPotential])

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Nav pills className="mb-0 justify-content-center">

              <NavItem>

                <NavLink
                  active={active === 1}
                  onClick={() => {
                    toggle(1);
                  }}
                >
                  <UserOutlined /> {'Cơ bản & Dịch vụ'}
                </NavLink>
              </NavItem>
              {/* <NavItem>

                <NavLink
                  active={active === 2}
                  onClick={() => {
                    toggle(2);
                  }}
                >
                  <DollarCircleOutlined /> Dịch vụ
                </NavLink>
              </NavItem> */}
              <NavItem>

                <NavLink
                  active={active === 3}
                  onClick={() => {
                    toggle(3);
                  }}
                >
                  <DatabaseOutlined /> Mở rộng
                </NavLink>
              </NavItem>

              <NavItem>

                <NavLink
                  active={active === 4}
                  onClick={() => {
                    toggle(4);
                  }}
                >
                  <StarOutlined /> KYC
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent className="py-50" activeTab={active}>

              <TabPane tabId={1}>

                <Card>
                  <CardBody>
                    <UserBasicInfo userSelected={userDetail} />
                  </CardBody>
                </Card>
              </TabPane>

              <TabPane tabId={3}>

                <Card>
                  {/* <CardHeader>
                    <CardTitle>Danh sách hoạt động</CardTitle>
                  </CardHeader> */}
                  <CardBody>
                  <ExtendInfo userSelected={userDetail} />
                  </CardBody>
                </Card>
              </TabPane>

              <TabPane tabId={4}>

                <Card>
                  <CardBody>
                    <KYCInfo userSelected={userDetail} />
                  </CardBody>
                </Card>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default UserAccount;
