import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Button, Card, CardBody, Col, Label, Row } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { selectThemeColors } from "../../../../utility/Utils";
import { store } from "../../store/InvestorStore";
import { useObserver } from "mobx-react";
import { Form, Input } from "antd";
import { customSMSelectStyles } from "../../types";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";
import { appStore } from "../../../../stores/appStore";

const StatusOption = [{ value: -1, label: "Tất cả" }];
const FormAddNew = () =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const getAccountByID = (event: any) => {
      const value = event.target.value;
      store.getAccountNameByID(value);
    };
    const onAddInternalAccount = () => {
      const valueForm = form.getFieldsValue();
      if (valueForm.cbxInternalAccountNo.ACCOUNTNO === "Tất cả") {
        toast.error(ErrorToast("Bạn chưa chọn tài khoản"));
        return;
      }
      if (
        valueForm.InternalCustName &&
        valueForm.InternalCustName !== null &&
        valueForm.InternalCustName.trim() !== "" &&
        valueForm.CustName &&
        valueForm.CustName !== null &&
        valueForm.CustName.trim() !== ""
      ) {
        var param = {
          CustomerId: valueForm.CustID == undefined?"":valueForm.CustID.trim(),
          InternalAccountNo: "",
          NewInternalAccountNo: valueForm.cbxInternalAccountNo.ACCOUNTNO,
          InternalCustomerId: valueForm.InternalCustId == undefined?"":valueForm.InternalCustId.trim(),
          InternalCustomerName: valueForm.InternalCustName == undefined?"":valueForm.InternalCustName.trim(),
          InternalCustomerNo: store.dataListAccountNameByID.CUSTOMERNO,
          InternalIdentityCard: store.dataListAccountNameByID.IDENTITYCARD, //store.internalAccountIdentityCard
          InternalAddress: store.dataListAccountNameByID.ADDRESS, //store.internalAccountIdentityAddress
          InternalStatus: -1,
          InternalScanURL: "",
          Remark: "",
          Reason: "create new info",
          Date: new Date(),
          UserId: appStore.account.LoginName,
        };
        store.AddNewInternalAccount(param);
      }
    };
    const getInternalCusName = (evt: any) => {
      const value = evt.target.value;
      const custName = form.getFieldValue("CustID");
      if (custName === value && custName != "" && value != "") {
        toast.error(
          ErrorToast("Tài khoản và tài khoản nội bộ không được trùng nhau")
        );
        return;
      }
      store.getInternalCusNamebyID(value);
      var paramListAccount = {
        CustomerID: value,
      };
      store.getListAccountByID(paramListAccount);
    };
    const ResetForm = () => {
      store.dataListAccountByID = []
      form.resetFields();
    };
    const ClosePopup = () => {
      store.isShowPopup = false;
    };
    useEffect(() => {
      const formValue = form.getFieldValue("CustID");
      if (formValue && formValue !== null && formValue.trim() !== "") {
        if (
          store.AccountNameByID &&
          store.AccountNameByID !== null &&
          store.AccountNameByID.trim() !== ""
        ) {
          form.setFieldsValue({ CustName: store.AccountNameByID });
        }
      } else {
        form.setFieldsValue({ CustName: "" });
      }
    }, [store.AccountNameByID, store.custIDValid]);
    useEffect(() => {
      const formValue = form.getFieldValue("InternalCustId");
      if (formValue && formValue !== null && formValue !== "") {
        if (
          store.AccountNameByID &&
          store.AccountNameByID !== null &&
          store.AccountNameByID.trim() !== ""
        ) {
          form.setFieldsValue({ InternalCustName: store.InternalAccountName });

          form.setFieldsValue({
            cbxInternalAccountNo: store.dataListAccountByID[0],
          });
        }
      } else {
        form.setFieldsValue({ InternalAccountName: "" });
      }
    }, [store.InternalAccountName, store.custInternalIDValid]);
    useEffect(() => {
      if (store.isLoadListAccount) {
        form.setFieldsValue({
          cbxInternalAccountNo: store.dataListAccountByID[0],
        });
      }
      store.isLoadListAccount = false;
    }, [store.isLoadListAccount]);
    useEffect(()=>{
      store.custIDValid= true;
      store.dataListAccountByID=[];
    },[])

    const defaultValue = {
      CustID: "",
      CustName: "",
      InternalCustId: "",
      cbxInternalAccountNo:"",
      InternalAccountName: "",
    };

    const onFinishFailed = () => {};

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onAddInternalAccount}
              onFinishFailed={onFinishFailed}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Form.Item
                label={t("X_Trade_Customer_Id")}
                name="CustID"
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
                      form.getFieldValue("CustID") +
                      " không tồn tại hoặc không có dữ liệu!"
                }
                validateStatus={store.custIDValid ? undefined : "error"}
                hasFeedback
              >
                <Input
                  placeholder={t("X_Trade_Customer_Id")}
                  autoComplete="off"
                  type="number"
                  onChange={(object) => {
                    if (object.target.value.length > 6) {
                      form.setFieldsValue({CustID: object.target.value.slice(0, 6)})
                    }
                  }}
                  onBlur={(evt) => getAccountByID(evt)}
                />
              </Form.Item>
              <Form.Item label={t("X_Trade_Customer_Name")} name="CustName">
                <Input
                  placeholder={t("X_Trade_Customer_Name")}
                  autoComplete="off"
                  disabled
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Customer_Id_Internal")}
                name="InternalCustId"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Mã khách hàng nội bộ không được để trống",
                  },
                  {
                    whitespace:true,
                    message: "Mã khách hàng nội bộ không được để trống",
                  }
                ]}
                help={
                  store.custInternalIDValid || form.getFieldValue("InternalCustId") == ""
                    ? null
                    : "Mã khách hàng nội bộ " +
                      form.getFieldValue("InternalCustId") +
                      " không tồn tại hoặc không có dữ liệu!"
                }
                validateStatus={store.custInternalIDValid || form.getFieldValue("InternalCustId") == "" ? undefined : "error"}
                hasFeedback
              >
                <Input
                  placeholder={t("X_Trade_Customer_Id_Internal")}
                  autoComplete="off"
                  onBlur={(evt) => getInternalCusName(evt)}
                  type="number"
                  onChange={(object) => {
                    if (object.target.value.length > 6) {
                      form.setFieldsValue({InternalCustId: object.target.value.slice(0, 6)})
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Customer_Name_Internal")}
                name="InternalCustName"
              >
                <Input
                  placeholder={t("X_Trade_Customer_Name_Internal")}
                  autoComplete="off"
                  disabled
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Customer_No_Internal_Account")}
                name="cbxInternalAccountNo"
              >
                {store.dataListAccountByID.length > 0 ? (
                  <Select
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    options={store.dataListAccountByID}
                    defaultValue={store.dataListAccountByID[0]}
                    isClearable={false}
                    styles={customSMSelectStyles}
                    getOptionLabel={(option) => option.ACCOUNTNO}
                    getOptionValue={(option) => option.ACCOUNTNO}
                    placeholder={t("X_Trade_Customer_No_Internal_Account")}
                  />
                ) : (
                  <Select
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    isClearable={false}
                    styles={customSMSelectStyles}
                    placeholder={t("X_Trade_Customer_No_Internal_Account")}
                  />
                )}
              </Form.Item>
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
                  htmlType="button"
                  onClick={() => ResetForm()}
                >
                  {t("X_Trade_Button_Reset")}
                </Button>
                &nbsp;&nbsp;
                <Button
                  className="btn btn-gradient-primary"
                  color="gradient-primary"
                  onClick={() => ClosePopup()}
                  htmlType="button"
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
