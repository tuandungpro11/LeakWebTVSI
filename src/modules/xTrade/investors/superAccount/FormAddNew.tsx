import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  CustomInput,
  FormFeedback,
  Label,
  Row,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { selectThemeColors } from "../../../../utility/Utils";
import { store } from "../../store/InvestorStore";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import { pageSizeTable, pageSizeTableBranch } from "../../types";
import { Form, Input, PaginationProps } from "antd";
import { appStore } from "../../../../stores/appStore";

const FormAddNew = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [validState, setValidState] = useState(false);

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
      CustomerID: "",
    };

    const [selectedList, setSelectedList] = useState([]);

    const rowSelection = {
      selectedRowKeys: selectedList,
      onChange: (selectedRowKeys: any) => {
        setSelectedList(selectedRowKeys);
      },
      getCheckboxProps: (record: any) => ({
        name: record.BRANCHID,
      }),
    };

    const onAddSuperAccount = () => {
      const valueForm = form.getFieldsValue();
      let lstBranch = "";
      selectedList.forEach(function (value) {
        if (lstBranch == "") {
          lstBranch = value;
        } else {
          lstBranch = lstBranch + "," + value;
        }
      });
      var param = {
        CustomerId:
          valueForm.CustomerId == undefined ? "" : valueForm.CustomerId.trim(),
        BranchIdList: lstBranch,
        UserId: appStore.account.LoginName,
      };
      store.onAddNewSuperAccount(param);
    };
    const getAccountByID = (event: any) => {
      const value = event.target.value;
      store.getAccountNameByID(value);
    };

    const ResetForm = () => {
      form.resetFields();
      store.custIDValid = true;
      setSelectedList([]);
    };
    const ClosePopup = () => {
      store.isShowPopup = false;
    };

    useEffect(() => {
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

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              onFinish={onAddSuperAccount}
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Row className="filterSection">
                <Col md="24" sm="24" lg="24">
                  <Form.Item
                    name="CustomerId"
                    label={t("X_Trade_Customer_Id") }
                    validateTrigger="onBlur"
                    rules={[
                      {
                        required: true,
                        message: "Mã khách hàng không được để trống",
                      },
                      {
                        whitespace:true,
                        message: "Mã khách hàng không được để trống",
                      }
                    ]}
                    help={
                      store.custIDValid
                        ? null
                        : "Mã khách hàng " +
                          form.getFieldValue("CustomerId") +
                          " không tồn tại hoặc không có dữ liệu!"
                    }
                    validateStatus={store.custIDValid ? undefined : "error"}
                    hasFeedback
                  >
                    <Input
                      placeholder={t("X_Trade_Customer_Id")}
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 6) {
                          form.setFieldsValue({CustomerId: object.target.value.slice(0, 6)})
                        }
                      }}
                      onBlur={(evt) => getAccountByID(evt)}
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
                    onClick={() => onAddSuperAccount}
                  >
                    {t("X_Trade_Button_Add")}
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    className="btn btn-gradient-info"
                    color="gradient-info"
                    type="button"
                    onClick={() => ResetForm()}
                  >
                    {t("X_Trade_Button_Reset")}
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    className="btn btn-gradient-primary"
                    color="gradient-primary"
                    type="button"
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

export default FormAddNew;
