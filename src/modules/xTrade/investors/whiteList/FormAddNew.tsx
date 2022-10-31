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
import {
  customSMSelectStyles,
  pageSizeTable,
  pageSizeTableBranch,
} from "../../types";
import { Form, Input, PaginationProps } from "antd";
import { appStore } from "../../../../stores/appStore";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";

const DealerOption = [
  { value: 2, label: "Đại lý tự do" },
  { value: 1, label: "Đại lý chính thức" },
];

const FormAddNew = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const defaultValue = {
      AgentId: "",
      AgentName: "",
      CustAcc: "",
      CustName: "",
      AgentType: store.dataListAgenType[0],
    };

    const [selectedList, setSelectedList] = useState([]);
    const onAddWhiteList = () => {
      const valueForm = form.getFieldsValue();
      if(valueForm.AccountNo 
        && valueForm.AccountNo.trim() != "" 
        && valueForm.AccountNo.trim().length != 7){
        toast.error(ErrorToast("Hãy điền số tài khoản 7 số"));
        return;
      }
      var param = {
        Id: 0,
        AccountNo: valueForm.CustAcc == undefined ? "" : valueForm.CustAcc.trim(),
        AgentType: valueForm.AgentType.Value,
        AgentId: valueForm.AgentId == undefined ? "" : valueForm.AgentId.trim(),
        UserId: appStore.account.LoginName,
      };
      store.AddNewWhiteList(param);
    };
    const getListDealerType = () => {
      const param = {
        Category: "AGENT",
        Group: "AGENT_TYPE",
        Code: "",
      };
      store.getListAgentType(param);
    };
    const getAccountByID = (event: any) => {
      const value = event.target.value;
      if(value !== null && value !== undefined && value !== "" && value.trim().length === 7) {
        store.getSubAccountNameByID(value);
      }
    };

    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      store.isShowPopup = false;
    };

    useEffect(() => {
      form.setFieldsValue({ CustName: store.AccountNameByID });
    }, [store.AccountNameByID]);
    useEffect(() => {
      getListDealerType();
    }, []);

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={onAddWhiteList}
              style={{ overflowX: "hidden" }}
              requiredMark={false}
            >
              <PerfectScrollbar style={{ maxHeight: "70vh" }}>
                <Form.Item label={t("X_Trade_Dealer_Type")} name="AgentType">
                  {store.dataListAgenType.length > 0 ? (
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      defaultValue={store.dataListAgenType[0]}
                      options={store.dataListAgenType}
                      isClearable={false}
                      styles={customSMSelectStyles}
                      getOptionLabel={(option) => option.Name}
                      getOptionValue={(option) => option.Value}
                    />
                  ) : (
                    <></>
                  )}
                </Form.Item>
                <Form.Item
                  name="AgentId"
                  label={t("X_Trade_Dealer_Id")}
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Mã đại lý không được để trống",
                    },
                    {
                      whitespace: true,
                      message: "Mã đại lý không được để trống",
                    }
                  ]}
                >
                  <Input
                    type="text"
                    placeholder={t("X_Trade_Dealer_Id")}
                    autoComplete="Off"
                  />
                </Form.Item>
                <Form.Item
                  name="CustAcc"
                  label={t("X_Trade_Bank_Account")}
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Số tài khoản không được để trống",
                    },
                    {
                      whitespace: true,
                      message: "Số tài khoản không được để trống",
                    },
                    {
                      min: 7,
                      message: "Số tài khoản chưa đủ 7 kí tự",
                    }
                  ]}
                  help={
                    store.subCustIDValid
                      ? null
                      : "Số tài khoản " +
                      form.getFieldValue("CustAcc") +
                      " không tồn tại hoặc không có dữ liệu!"
                  }
                  validateStatus={store.subCustIDValid ? undefined : "error"}
                  hasFeedback
                >
                  <Input
                    placeholder={t("X_Trade_Bank_Account")}
                    autoComplete="Off"
                    onBlur={(evt) => getAccountByID(evt)}
                    type="number"
                    onChange={(object) => {
                      if (object.target.value.length > 7) {
                        form.setFieldsValue({CustAcc: object.target.value.slice(0, 7)})
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="CustName"
                  label={t("X_Trade_Account_Name")}
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Tên tài khoản không được để trống",
                    },
                    {
                      whitespace: true,
                      message: "Tên tài khoản không được để trống",
                    }
                  ]}
                >
                  <Input
                    type="text"
                    placeholder={t("X_Trade_Account_Name")}
                    autoComplete="Off"
                    disabled
                  />
                </Form.Item>
              </PerfectScrollbar>
              <Form.Item className="text-center mt-2">
                <Button
                  className="btn btn-gradient-secondary"
                  color="gradient-secondary"
                  htmlType="submit"
                >
                  {t("X_Trade_Button_Add")}
                </Button>
                &nbsp;&nbsp;
                <Button
                  className="btn btn-gradient-info"
                  color="gradient-info"
                  onClick={() => ResetForm()}
                >
                  {t("X_Trade_Button_Reset")}
                </Button>
                &nbsp;&nbsp;
                <Button
                  className="btn btn-gradient-primary"
                  color="gradient-primary"
                  onClick={() => ClosePopup()}
                >
                  {t("X_Trade_Button_Close")}
                </Button>
              </Form.Item>
            </Form>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default FormAddNew;
