import React, { useEffect } from "react";
import { Fragment } from "react";
import { Button, Card, CardBody, Col } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { selectThemeColors } from "../../../../utility/Utils";
import { store } from "../../store/InvestorStore";
import { useObserver } from "mobx-react";
import { Form, Input } from "antd";
import { customSMSelectStyles } from "../../types";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";
import { appStore } from "../../../../stores/appStore";

const FormUpdate = (valueUpdate: any) =>
  useObserver(() => {
    const valueBind = valueUpdate.valueUpdate;
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const onUpdateInternalAccount = () => {
      
      if (store.custInternalIDValid && store.custIDValid) {
        const valueForm = form.getFieldsValue();
        var param = {
          CustomerId:
            valueForm.CustomerId == undefined
              ? ""
              : valueForm.CustomerId,
          InternalAccountNo: valueBind.InternalAccountNo,
          NewInternalAccountNo: valueForm.cbxInternalAccountNo.ACCOUNTNO,
          InternalCustomerId:
            valueForm.InternalCustomerId == undefined
              ? ""
              : valueForm.InternalCustomerId,
          InternalCustomerName: valueBind.InternalCustomerName,
          InternalCustomerNo: valueBind.InternalCustomerNo,
          InternalIdentityCard: valueBind.InternalIdentityCard,
          InternalAddress: valueBind.InternalAddress,
          InternalStatus: valueBind.InternalStatus,
          InternalScanURL: "",
          Remark: "",
          Reason: "",
          Date: new Date(),
          UserId: appStore.account.LoginName,
        };
        store.UpdateInternalAccount(param, valueBind.InternalCustomerName);
      }
    };
    const ClosePopup = () => {
      store.isShowPopupModalUpdate = false;
    };

    const defaultValue = {
      CustomerId: valueBind.CustomerId,
      CUSTOMERNAME: valueBind.CUSTOMERNAME,
      InternalCustomerId: valueBind.InternalAccountNo.substring(0, 6),
      cbxInternalAccountNo: store.dataListAccountByID.filter(
        item => item.ACCOUNTNO === valueBind.InternalAccountNo
      )[0],
      InternalCustomerName: valueBind.InternalCustomerName,
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
      form.resetFields();
    };

    useEffect(() => {
      const formValue = form.getFieldValue("InternalCustomerId");
      if (formValue && formValue !== null && formValue !== "") {
        if(store.InternalAccountName===""){
          form.setFieldsValue({
            InternalCustomerName: valueBind.InternalCustomerName,
          });
        }
        else{
          form.setFieldsValue({
            InternalCustomerName: store.InternalAccountName,
          });
        }
        
        // form.setFieldsValue({
        //   cbxInternalAccountNo: store.dataListAccountByID[0],
        // });
      } else {
        form.setFieldsValue({ InternalCustomerName: "" });
      }
    }, [store.InternalAccountName, store.custInternalIDValid]);

    useEffect(() => {
      store.custIDValid = true;
      store.InternalAccountName = valueBind.InternalCustomerName;
      store.dataListAccountByID=[];
      var paramListAccount = {
        CustomerID: valueBind.InternalAccountNo.substring(0, 6),
      };
      store.getInternalCusNamebyID(valueBind.InternalAccountNo.substring(0, 6));
      store.getListAccountByID(paramListAccount);
    }, []);
    useEffect(() => {
      
      if (store.isLoadListAccount && store.InternalAccountName!=="") {
        form.setFieldsValue({
          cbxInternalAccountNo: store.dataListAccountByID.filter(
            (item) => item.ACCOUNTNO == valueBind.InternalAccountNo
          )[0],
        });
      }else{
        form.setFieldsValue({
          cbxInternalAccountNo: store.dataListAccountByID[0],
        });
      }
      store.isLoadListAccount = false;
    }, [store.isLoadListAccount]);

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onUpdateInternalAccount}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Form.Item
                label={t("X_Trade_Customer_Id")}
                name="CustomerId"
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
                      form.getFieldValue("CustomerId") +
                      " không tồn tại hoặc không có dữ liệu!"
                }
                validateStatus={store.custIDValid ? undefined : "error"}
                hasFeedback
              >
                <Input
                  placeholder={t("X_Trade_Customer_Id")}
                  autoComplete="off"
                  disabled
                />
              </Form.Item>
              <Form.Item label={t("X_Trade_Customer_Name")} name="CUSTOMERNAME">
                <Input
                  placeholder={t("X_Trade_Customer_Name")}
                  autoComplete="off"
                  disabled
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Customer_Id_Internal")}
                name="InternalCustomerId"
                rules={[
                  {
                    required: true,
                    message: "Mã khách hàng nội bộ không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Mã khách hàng nội bộ không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input
                  placeholder={t("X_Trade_Customer_Id_Internal")}
                  autoComplete="off"
                  onBlur={(evt) => getInternalCusName(evt)}
                  type="number"
                  onChange={(object) => {
                    if (object.target.value.length > 6) {
                      form.setFieldsValue({InternalCustomerId: object.target.value.slice(0, 6)})
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Customer_Name_Internal")}
                name="InternalCustomerName"
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
                    isClearable={false}
                    styles={customSMSelectStyles}
                    getOptionLabel={(option) => option.ACCOUNTNO}
                    getOptionValue={(option) => option.ACCOUNTNO}
                  />
                ) : (
                  <></>
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
                {/* &nbsp;&nbsp;
                <Button
                  className="btn btn-gradient-info"
                  color="gradient-info"
                  htmlType="button"
                  onClick={() => ResetForm()}
                >
                  {t("X_Trade_Button_Reset")}
                </Button> */}
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

export default FormUpdate;
