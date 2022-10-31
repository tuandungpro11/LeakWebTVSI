import { Form, Input, PaginationProps, Table } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { selectThemeColors } from "../../../utility/Utils";
import { treeLevelStore } from "../store/treeLevelStore";
import {
  bankAccountStatusOption,
  customSMSelectStyles,
  pageSizeTable,
} from "../type";
import Select from "react-select";
import { ColumnsType } from "antd/lib/table";
import { appStore } from "../../../stores/appStore";

const FormDetail = (valueUpdate: any) =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const valueBind = valueUpdate.valueUpdate;
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const listLevelColumn: ColumnsType<any> = [
      {
        title: "Tên đăng nhập",
        dataIndex: "LoginName",
        key: "LoginName",
      },
      {
        title: "Họ và tên",
        dataIndex: "DisplayName",
        key: "DisplayName",
      },
      {
        title: "Chức vụ",
        dataIndex: "PositionName",
        key: "PositionName",
      },
      {
        title: "Tên cấp độ",
        dataIndex: "SystemLevelName",
        key: "SystemLevelName",
      },
    ];

    const defaultValue = {
      appName: "",
      descript: "",
    };
    const ClosePopup = () => {
      treeLevelStore.isShowPopupModalDetail = false;
    };
    const onSubmit = () => {};

    useEffect(()=>{
      const param = {
        UserName: appStore.account.LoginName,
        SysLevelID: valueBind.SysLevelID,
      };
      treeLevelStore.getUserBySystemLevel(param);
    },[])
    return (
      <Fragment>
        <Card>
          <CardHeader>
            <Col>
              <span>Mã cấp độ: <strong>{valueBind.Code}</strong></span>
            </Col>
            <Col>
              <span>Tên cấp độ: <strong>{valueBind.Name}</strong></span>
            </Col>
          </CardHeader>
          <CardBody>
            <Row>
              <Col sm="24" md="24">
                <Table
                  columns={listLevelColumn}
                  dataSource={treeLevelStore.dataListUserBySysLevel}
                  size="small"
                  scroll={{ y: 800 }}
                  loading={treeLevelStore.loadingData}
                  // rowKey="UserID"
                  // pagination={{
                  //   showSizeChanger: true,
                  //   onShowSizeChange: treeLevelStore.handlePerRowsListTreeLevel,
                  //   pageSizeOptions: pageSizeTable,
                  //   total: treeLevelStore.totalRowsListTreeLevel,
                  //   showTotal: showTotal,
                  //   onChange: treeLevelStore.handlePageChangeListTreeLevel,
                  //   className: "mt-1 text-right custom-ant-pagination",
                  //   defaultCurrent: treeLevelStore.pageIndexListTreeLevel,
                  //   locale: { items_per_page: "/ trang" },
                  //   current: treeLevelStore.pageIndexListTreeLevel,
                  // }}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default FormDetail;
