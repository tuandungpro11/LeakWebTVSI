// ** Custom Components
import Avatar from "@components/avatar";
import Timeline from "@components/timeline";
import React, { Fragment, useState } from "react";
// ** Images
import ceo from "@src/assets/images/avatars/12-small.png";
import pdf from "@src/assets/images/icons/file-icons/pdf.png";

// ** Third Party Components
import { Card, CardHeader, CardTitle, CardBody, Media, TabPane, TabContent, Nav, NavItem, NavLink } from "reactstrap";
import { useObserver } from "mobx-react";
import UserActivity from "./UserActivity";
import UserRating from "./UserRating";
import { Col, Row } from "antd";
import { crmStore } from "../../store/store";
import {
  DatabaseOutlined,
  StarOutlined,
  DollarCircleOutlined,
  UserOutlined
} from "@ant-design/icons"
import UserAccount from "./UserAccount";
import UserBalance from "./Balance";


const UserTimeline = (userInfo: any) =>
  useObserver(() => {
    const userDetail = userInfo.userSelected;
    const [active, setActive] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const toggle = (tab: any) => {
      setActive(tab);
      crmStore.activeTabPotential = tab;
    };
    return (
      <Fragment>

        <Card>
          <CardBody>
            <Nav pills className="mb-0">

              <NavItem>

                <NavLink
                  active={active === 1}
                  onClick={() => {
                    toggle(1);
                  }}
                >
                  <UserOutlined /> Tài khoản
                </NavLink>
              </NavItem>
              <NavItem>

                <NavLink
                  active={active === 2}
                  onClick={() => {
                    toggle(2);
                  }}
                >
                  <DollarCircleOutlined /> Số dư
                </NavLink>
              </NavItem>
              <NavItem>

                <NavLink
                  active={active === 3}
                  onClick={() => {
                    toggle(3);
                  }}
                >
                  <DatabaseOutlined /> Hoạt động
                </NavLink>
              </NavItem>

              <NavItem>

                <NavLink
                  active={active === 4}
                  onClick={() => {
                    toggle(4);
                  }}
                >
                  <StarOutlined /> Đánh giá
                </NavLink>
              </NavItem>
            </Nav>
          </CardBody>
        </Card>

        <TabContent className="py-50" activeTab={active}>

          <TabPane tabId={1}>

            <Card>
              {/* <CardHeader>
                <CardTitle>Tài khoản</CardTitle>
              </CardHeader> */}
              <CardBody>
                <UserAccount userSelected={userDetail} />
              </CardBody>
            </Card>
          </TabPane>

          <TabPane tabId={2}>

            <Card>
              {/* <CardHeader>
                <CardTitle>Số dư</CardTitle>
              </CardHeader> */}
              <CardBody>
                <UserBalance userSelected={userDetail} />
              </CardBody>
            </Card>
          </TabPane>

          <TabPane tabId={3}>

            <Card>
              {/* <CardHeader>
                <CardTitle>Danh sách hoạt động</CardTitle>
              </CardHeader> */}
              <CardBody>
                <UserActivity userSelected={userDetail} />
              </CardBody>
            </Card>
          </TabPane>

          <TabPane tabId={4}>

            <Card>
              {/* <CardHeader>
                <CardTitle>Đánh giá</CardTitle>
              </CardHeader> */}
              <CardBody>
                <UserRating userSelected={userDetail} />
              </CardBody>
            </Card>
          </TabPane>
        </TabContent>
      </Fragment>
    );
  });

export default UserTimeline;
