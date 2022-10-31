import Select from "react-select";
import React, { useEffect, useRef, useState } from "react";
import { Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  Col,
  Label,
  Row,
} from "reactstrap";
import { selectThemeColors } from "@utils";
import { store } from "../../store/InvestorStore";
import { useObserver } from "mobx-react";
import { Form, Input } from "antd";
import { bankAccountManageAtOption, bankAccountStatusOption, customSMSelectStyles } from "../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import { appStore } from "../../../../stores/appStore";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";

const FormAddNewUpdate = () =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const getAccountById = (event: any) => {
      const value = event.target.value;
      store.getAccountNameByID(value);
    };
    const getListBank = () => {
      const param = {
        UserId: appStore.account.LoginName,
        BankNo: "",
        BankName: "",
        BankNameEn: "",
        ShortName: "",
        Status: 1,
        Bankcheqcode: "",
        SecCode: "",
        SecCodeBranch: "",
        PageIndex: 1,
        PageSize: 9999,
      };
      store.onSubmitListBank(param);
    };
    const getListBranch = (event: any) => {
      const param = {
        BankNo: event.BankNo,
        BranchNo: "",
        BranchName: "",
        BranchNameEn: "",
        ShortBranchName: "",
        Status: 1,
        PageIndex: 1,
        PageSize: 9999,
      };
      store.getListBranchBank(param);
    };

    const AddBankAccount = () => {
      const valueForm = form.getFieldsValue();
      
      if(valueForm.CustomerId && valueForm.CustomerId.trim() != "" && valueForm.CustomerId.trim().length <6){
        toast.error(ErrorToast("Hãy điền số tài khoản 6 số"));
        return;
      }
      if (valueForm.CustName && valueForm.CustName !== null && valueForm.CustName.trim() !== "") {
        var param = {
          BankAccount: valueForm.BankAccount == undefined?"":valueForm.BankAccount.trim(),
          CustomerId: valueForm.CustomerId==undefined?"":valueForm.CustomerId,
          Beneficiary: valueForm.Beneficiary == undefined?"":valueForm.Beneficiary.trim(),
          BankName: valueForm.cbxBank.BankName,
          Province: "",
          Remark: valueForm.Remark == undefined?"":valueForm.Remark.trim(),
          Priority: valueForm.cbxManageAt.value,
          Status: valueForm.cbxStatus.value,
          URLPath: "",
          BankNo: valueForm.cbxBank.BankNo,
          BranchNo: valueForm.cbxBranch.BranchNo,
          UserId: appStore.account.LoginName,
          BankType: valueForm.cbxManageAt.value,
        };
        store.AddNewBankAccount(param, valueForm.CustName);
      }
    };

    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      store.isShowPopup = false;
    };
    useEffect(() => {
      store.custIDValid= true;
      store.AccountNameByID = null;
      getListBank();
    }, []);

    useEffect(() => {
      const formValue = form.getFieldValue("CustomerId");      
      if (formValue && formValue !== null && formValue.trim() !== "") {
        if (store.AccountNameByID && store.AccountNameByID !== null && store.AccountNameByID.trim() !== "") {
          form.setFieldsValue({ CustName: store.AccountNameByID });
        }
      } else {
        form.setFieldsValue({ CustName: "" });
      }
    }, [store.AccountNameByID, store.custIDValid]);

    const defaultValue = {
      CustomerId: "",
      CustName: "",
      BankAccount: "",
      cbxBank: null,
      cbxBranch: null,
      Beneficiary: "",
      Remark: "",
      cbxStatus: bankAccountStatusOption[0],
      cbxManageAt: bankAccountManageAtOption[0]
    }

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={'vertical'}
              form={form}
              onFinish={AddBankAccount}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <PerfectScrollbar
              style={{ maxHeight: "70vh", overflowX: "hidden" }}
            >
              <Form.Item
                label={t("X_Trade_Customer_Id")}
                name="CustomerId"
                validateTrigger="onBlur"
                rules={[
                  { required: true, message: 'Mã khách hàng không được để trống' },
                  {
                    whitespace:true,
                    message: "Mã khách hàng không được để trống",
                  }
                ]}
                help={store.custIDValid ? null : "Mã khách hàng " + form.getFieldValue("CustomerId") + " không tồn tại hoặc không có dữ liệu!"}
                validateStatus={store.custIDValid ? undefined : "error"}
                // hasFeedback
                >
                <Input
                  placeholder={t("X_Trade_Customer_Id")}
                  autoComplete="off"
                  type="number"
                  onChange={(object) => {
                    if (object.target.value.length > 6) {
                      form.setFieldsValue({CustomerId: object.target.value.slice(0, 6)})
                    }
                  }}
                  onBlur={(evt) => getAccountById(evt)} />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Customer_Name")}
                name="CustName">
                <Input placeholder={t("X_Trade_Customer_Name")} autoComplete="off" disabled />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Bank_Account_Acc")}
                name="BankAccount"
                rules={[
                  { required: true, message: 'Số tài khoản không được để trống!' },
                  {
                    whitespace:true,
                    message: "Số tài khoản không được để trống",
                  }
                ]}
                hasFeedback>
                <Input
                  placeholder={t("X_Trade_Bank_Account_Acc")}
                  autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Bank_Name")}
                name="cbxBank"
                rules={[
                  { required: true, message: 'Ngân hàng chưa được chọn!' }
                ]}
                hasFeedback>
                {store.dataListBank.length>0?(<Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={store.dataListBank}
                  isClearable={false}
                  getOptionLabel={(option) => option.BankName}
                  getOptionValue={(option) => option.BankNo}
                  onChange={(evt: any) => { getListBranch(evt) }}
                  styles={customSMSelectStyles}
                  placeholder={"Chọn Ngân hàng..."}
                />):(<Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={store.dataListBank}
                  isClearable={false}
                  styles={customSMSelectStyles}
                  placeholder={"Chọn Ngân hàng..."}
                  noOptionsMessage={() => "Không có dữ liệu...."}
                />)}
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Branch_Name")}
                name="cbxBranch"
                rules={[
                  { required: true, message: 'Chi nhánh chưa được chọn!' }
                ]}
                hasFeedback>
                  {store.dataListBranchBank.length>0?(
                <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={store.dataListBranchBank}
                  isClearable={false}
                  getOptionLabel={(option) => option.BranchName}
                  getOptionValue={(option) => option.BranchNo}
                  styles={customSMSelectStyles}
                  placeholder={"Chọn chi nhánh..."}
                />):(
                  <Select
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    options={store.dataListBranchBank}
                    isClearable={false}
                    styles={customSMSelectStyles}
                    placeholder={"Chọn chi nhánh..."}
                  />)}
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Benefiery_Name")}
                name="Beneficiary"
                rules={[
                  { required: true, message: 'Người thụ hưởng không được để trống!' },
                  {
                    whitespace:true,
                    message: "Người thụ hưởng không được để trống",
                  }
                ]}
                hasFeedback>
                <Input
                  placeholder={t("X_Trade_Benefiery_Name")}
                  autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Note")}
                name="Remark">
                <Input
                  placeholder={t("X_Trade_Note")}
                  autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Status")}
                name="cbxStatus"
                hasFeedback>
                <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={bankAccountStatusOption}
                  isClearable={false}
                  styles={customSMSelectStyles}
                  placeholder={"Chọn trạng thái..."}
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Regist_Add")}
                name="cbxManageAt"
                rules={[
                  { required: true, message: 'Chi nhánh chưa được chọn!' }
                ]}
                hasFeedback>
                <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={bankAccountManageAtOption}
                  isClearable={false}
                  styles={customSMSelectStyles}
                  placeholder={"Chọn..."}
                  menuPosition={"fixed"}
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
                  htmlType="button"
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

export default FormAddNewUpdate;
