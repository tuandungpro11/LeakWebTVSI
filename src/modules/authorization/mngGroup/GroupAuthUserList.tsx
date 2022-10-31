import { Table } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { groupStore } from "../store/groupAuthStore";

const GroupAuthUserList = () =>
  useObserver(() => {
    const { t } = useTranslation();

    const columns = [
        {
            title: "Tên đăng nhập",
            dataIndex: "LoginName",
            key: "LoginName"
        },
        {
            title: "Họ và tên",
            dataIndex: "DisplayName",
            key: "DisplayName"
        },
        {
            title: "Chức vụ",
            dataIndex: "PositionName",
            key: "PositionName"
        },
        {
            title: "Tên cấp độ",
            dataIndex: "SystemLevelName",
            key: "SystemLevelName"
        }
    ]

    return (
      <Fragment>
        <Card>
          <CardHeader>
            <Col>
              <span>Nhóm quyền: <strong>{groupStore.selectedGroupInfo.GroupName}</strong></span>
            </Col>
            <Col>
              <span>Mã nhóm quyền: <strong>{groupStore.selectedGroupInfo.GroupCode}</strong></span>
            </Col>
          </CardHeader>
          <CardBody>
            <Table 
                columns={columns} 
                dataSource={groupStore.groupAuthUserList}
                title={() => "Danh sách người sử dụng"}
                rowKey="UserID"
            />
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default GroupAuthUserList;
