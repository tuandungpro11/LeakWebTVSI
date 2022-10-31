import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  CustomInput,
  FormFeedback,
  FormGroup,
  Label,
  Row,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { selectThemeColors } from "../../../../utility/Utils";
import { store } from "../../store/InvestorStore";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import { pageSizeTable, pageSizeTableBranch } from "../../types";
import { Form, Input, PaginationProps } from "antd";
import { appStore } from "../../../../stores/appStore";

const FormUpdate = (valueUpdate: any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const valueBind = valueUpdate.valueUpdate;
    const { t } = useTranslation();
    store.custIDValid = true;
    const [selectedList, setSelectedList] = useState([]);
    const branchTVSIColumn: ColumnsType<any> = [
      {
        title: "STT",
        key: "STT",
        //   dataindex: "id",
        render: (v, s, index) =>
          index + 1 + (store.pageIndex - 1) * store.pageSize,
        width: 50,
        align: "center",
      },
      {
        title: "Mã chi nhánh",
        dataIndex: "BRANCHID",
        key: "BRANCHID",
        width: 80,
      },
      {
        title: "Chi nhánh",
        dataIndex: "BRANCHNAME",
        key: "BRANCHNAME",
        width: 150,
      },
      Table.SELECTION_COLUMN,
    ];

    const defaultValue = {
      CustomerID: valueBind.Customerid,
    };

    const rowSelection = {
      selectedRowKeys: selectedList,
      onChange: (selectedRowKeys: any, seletedRow: any) => {
        setSelectedList(selectedRowKeys);
      },
      getCheckboxProps: (record: any) => ({
        name: record.BRANCHID,
      }),
    };

    const onUpdateSuperAccount = () => {
      const valueForm = form.getFieldsValue();
      var param = {
        CustomerId: valueForm.Customerid == undefined ? "" : valueForm.Customerid.trim(),
        BranchId: valueBind.BranchID,
        ChangeBranchId: selectedList[0],
        UserId: appStore.account.LoginName,
      };
      store.onUpdateSuperAccount(param);
    };

    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      store.isShowPopupModalUpdate = false;
    };

    useEffect(() => {
      form.setFieldsValue({ Customerid: valueBind.Customerid });
      const param = {
        BranchId: "",
        // UserId: appStore.account.LoginName,
        Active: 1,
        // IsLike: 1,
        PageNumber: 1,
        PageSize: 9999,
      };
      store.getListBranch(param);
    }, []);

    useEffect(() => {
      if (store.dataListBranchOrderSlip.length > 0) {
        const selectKey = [valueBind.BranchID]
        setSelectedList(selectKey);
      }
    }, [store.dataListBranchOrderSlip])

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={onUpdateSuperAccount}
              style={{ overflowX: "hidden" }}
              requiredMark={false}
            >
              <Row className="filterSection">
                <Col md="24" sm="24" lg="24">
                  <Form.Item
                    name="Customerid"
                    label={t("X_Trade_Customer_Id")}
                    validateTrigger="onBlur"
                    rules={[
                      {
                        required: true,
                        message: "Mã khách hàng không được để trống",
                      },
                    ]}
                    help={
                      store.custIDValid
                        ? null
                        : "Mã khách hàng " +
                        form.getFieldValue("Customerid") +
                        " không tồn tại hoặc không có dữ liệu!"
                    }
                    validateStatus={store.custIDValid ? undefined : "error"}
                    hasFeedback
                  >
                    <Input
                      type="text"
                      placeholder={t("X_Trade_Customer_Id")}
                      autoComplete="Off"
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col sm="24" md="24">
                  <Table
                    columns={branchTVSIColumn}
                    dataSource={store.dataListBranchOrderSlip.filter(
                      (item) => item.BRANCHID != -1
                    )}
                    size="small"
                    scroll={{ y: 400 }}
                    loading={store.loadingData}
                    pagination={false}
                    rowKey="BRANCHID"
                    rowSelection={{
                      type: "radio",
                      ...rowSelection,
                    }}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md="24" sm="24" style={{ textAlign: "center" }}>
                  <Button
                    className="btn btn-gradient-secondary"
                    color="gradient-secondary"
                    type="submit"
                  >
                    {t("X_Trade_Button_Add")}
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    className="btn btn-gradient-primary"
                    color="gradient-primary"
                    onClick={() => ClosePopup()}
                  >
                    {t("X_Trade_Button_Close")}
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default FormUpdate;
