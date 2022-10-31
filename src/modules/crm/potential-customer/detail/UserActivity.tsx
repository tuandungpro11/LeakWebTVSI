// ** Custom Components
import Avatar from "@components/avatar";
import Timeline from "@components/timeline";
import React, { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import { Card, CardHeader, CardTitle, CardBody, Media, TabPane, TabContent, Nav, NavItem, NavLink, Button, PaginationProps } from "reactstrap";
import { useObserver } from "mobx-react";
import { crmStore } from "../../store/store";
import { Menu, Tooltip } from "antd";
import { Link } from "react-router-dom";
import Table, { ColumnsType } from "antd/lib/table";
import { Edit, Info, List, Trash } from "react-feather";
import { pageSizeTable } from "../../types";
import { Moment } from "../../../../utility/general/Moment";
import { appStore } from "../../../../stores/appStore";


const UserActivity = (userInfo: any) =>
  useObserver(() => {
    const userDetail = userInfo.userSelected;
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const customerAccountColumn: ColumnsType<any> = [
      {
        title: "STT",
        key: "STT",
        render: (v, s, index) =>
          index +
          1 +
          (crmStore.pageIndexCustomerPotentialActivity - 1) * crmStore.pageSizeCustomerPotentialActivity,
        width: 50,
        align: "center",
      },
      {
        title: "Ngày bắt đầu",
        key: "CreatedDate",
        align: "center",
        render: (v) => {
          return Moment.formatDateNew(v.StartDate, "HH:mm - DD/MM/yyyy")
        }
      },
      {
        title: "Ngày kết thúc",
        key: "CreatedDate",
        align: "center",
        render: (v) => {
          return Moment.formatDateNew(v.EndDate, "HH:mm - DD/MM/yyyy")
        }
      },
      {
        title: "Hành động",
        key: "EventName",
        dataIndex: "EventName",
        align: "left",
      },
      {
        title: "Tên hành động",
        key: "TypeName",
        dataIndex: "TypeName",
        align: "left",
      },
      {
        title: "Trạng thái",
        key: "StatusName",
        align: "right",
        render: (v) => {
          return <span style={{ color: `${v.statusDeadLineColor}` }}>{v.statusDeadLine}</span>
        }
      },
      {
        title: "Action",
        render: (v, record, index) => (
          <Fragment key={index}>
            <Tooltip placement="left" title={"Chi tiết"}>
              <Button.Ripple
                className="btn-icon"
                color="flat-info"
                id="positionLeftActive"
                // onClick={() => detailCustomer(v)}
                size="sm"
              >
                <Link
                  to={`/crm/potential-customer/detail/${v.LeadID}`}
                  className="user-name text-truncate mb-0"
                ><Info size={18} /></Link>
              </Button.Ripple>

            </Tooltip>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={["SubMenu"]}
              className="menu-corg"
            >
              <Menu.SubMenu key="SubMenu" icon={<List size={18} />}>
                <Menu.Item
                  key="two"
                  icon={<Edit size={14} />}
                >
                  <Link
                    to={`/crm/potential-customer/detail/${v.LeadID}`}
                    className="user-name text-truncate mb-0"
                  >Sửa</Link>
                </Menu.Item>
                <Menu.Item
                  key="one"
                  icon={<Trash size={14} />}
                // onClick={() => deleteCustomer(v)}
                >
                  Xóa
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Fragment>
        ),
        width: 100,
        fixed: "right",
        align: "center",
      },
    ];
    const [active, setActive] = useState("1");

    const toggle = (tab: any) => {
      if (active !== tab) {
        setActive(tab);
      }
    };
    useEffect(() => {
      const param = {
        UserName: appStore.account.LoginName,
        LeadID: userDetail.id,
        PageIndex: crmStore.pageIndexCustomerPotentialActivity,
        PageSize: crmStore.pageSizeCustomerPotentialActivity,
      }
      crmStore.getListCustomerPotentialActivity(param);
    }, [crmStore.pageSizeCustomerPotentialActivity,
    crmStore.pageIndexCustomerPotentialActivity,])

    return (
      <Fragment>
        <Table
          columns={customerAccountColumn}
          dataSource={crmStore.listCustomerActivity}
          size="small"
          scroll={{ x: 800, y: 800 }}
          loading={crmStore.loadingData}
          pagination={{
            showSizeChanger: true,
            onShowSizeChange:
              crmStore.handlePerRowsChangeCustomerPotentialActivity,
            pageSizeOptions: pageSizeTable,
            total: crmStore.totalCustomerActivityRows,
            showTotal: showTotal,
            onChange: crmStore.handlePageChangeCustomerPotentialActivity,
            className: "mt-1 text-right custom-ant-pagination",
            defaultCurrent: crmStore.pageIndexCustomerPotentialActivity,
            locale: { items_per_page: "/ trang" },
          }}
        />
        {/* <Nav className="justify-content-center activity-tabs" tabs>

          <NavItem>

            <NavLink
              active={active === "1"}
              onClick={() => {
                toggle("1");
              }}
            >
              Hoạt động
            </NavLink>
          </NavItem>

          <NavItem>

            <NavLink
              active={active === "2"}
              onClick={() => {
                toggle("2");
              }}
            >
              Liên hệ
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent className="py-50" activeTab={active}>

          <TabPane tabId="1">
            <Table
              columns={customerAccountColumn}
              dataSource={crmStore.listCustomerActivity}
              size="small"
              scroll={{ x: 800, y: 800 }}
              loading={crmStore.loadingData}
              pagination={{
                showSizeChanger: true,
                onShowSizeChange:
                  crmStore.handlePerRowsChangeCustomerPotentialActivity,
                pageSizeOptions: pageSizeTable,
                total: crmStore.totalCustomerActivityRows,
                showTotal: showTotal,
                onChange: crmStore.handlePageChangeCustomerPotentialActivity,
                className: "mt-1 text-right custom-ant-pagination",
                defaultCurrent: crmStore.pageIndexCustomerPotentialActivity,
                locale: { items_per_page: "/ trang" },
              }}
            />
          </TabPane>

          <TabPane tabId="2">

            <p>
              Dragée jujubes caramels tootsie roll gummies gummies icing bonbon.
              Candy jujubes cake cotton candy. Jelly-o lollipop oat cake
              marshmallow fruitcake candy canes toffee. Jelly oat cake pudding
              jelly beans brownie lemon drops ice cream halvah muffin. Brownie
              candy tiramisu macaroon tootsie roll danish.
            </p>

            <p>
              Croissant pie cheesecake sweet roll. Gummi bears cotton candy tart
              jelly-o caramels apple pie jelly danish marshmallow. Icing caramels
              lollipop topping. Bear claw powder sesame snaps.
            </p>
          </TabPane>
        </TabContent> */}

      </Fragment>
    );
  });

export default UserActivity;
