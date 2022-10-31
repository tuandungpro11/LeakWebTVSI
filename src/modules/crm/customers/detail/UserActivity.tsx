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
    const [active, setActive] = useState("3");

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
        <Table
          columns={customerAccountColumn}
          dataSource={crmStore.listCustomerActivity}
          size="small"
          scroll={{ x: 800, y: 800 }}
          loading={crmStore.loadingData}
          pagination={{
            showSizeChanger: true,
            onShowSizeChange:
              crmStore.handlePerRowsChangeCustomerActivity,
            pageSizeOptions: pageSizeTable,
            total: crmStore.totalCustomerActivityRows,
            showTotal: showTotal,
            onChange: crmStore.handlePageChangeCustomerActivity,
            className: "mt-1 text-right custom-ant-pagination",
            defaultCurrent: crmStore.pageIndexCustomerActivity,
            locale: { items_per_page: "/ trang" },
          }}
        />

      </Fragment>
    );
  });

export default UserActivity;
