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
import { bankAccountManageAtOption, bankAccountStatusOption, customSMSelectStyles } from "../../types";
import { Form, Input } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";
import { appStore } from "../../../../stores/appStore";

const FormUpdate = (valueUpdate: any) =>
  useObserver(() => {
    const valueBind = valueUpdate.valueUpdate;
    const [form] = Form.useForm();
    const { t } = useTranslation();

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

    const getListBranch = () => {
      const param = {
        BankNo: valueBind.BANKNO,
        BranchNo: "",
        BranchName: "",
        BranchNameEn: "",
        ShortBranchName: "",
        Status: 1,
        PageIndex: 1,
        PageSize: 10000,
      };
      store.getListBranchBank(param);

    };
    const getListBranchChange = (event: any) => {
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

    const UpdateBankAccount = () => {
      const valueForm = form.getFieldsValue();
      var param = {
        BankAccountId: valueBind.BANKACCOUNTID,
        BankAccount: valueForm.BankAccount == undefined ?"":valueForm.BankAccount.trim(),
        CustomerId: valueForm.CustomerId == undefined ?"":valueForm.CustomerId.trim(),
        Beneficiary: valueForm.Beneficiary == undefined ?"":valueForm.Beneficiary.trim(),
        BankName: valueForm.cbxBank.BankName == undefined ?"":valueForm.cbxBank.BankName,
        Province: "",
        Remark: valueForm.Remark == undefined ?"":valueForm.Remark.trim(),
        Priority: valueForm.cbxManageAt.value,
        Status: valueForm.cbxStatus.value,
        URLPath: "",
        BankNo: valueForm.cbxBank.BankNo,
        BranchNo: valueForm.cbxBranch.BranchNo,
        UserId: appStore.account.LoginName,
        BankType:valueForm.cbxManageAt.value,
        Reason: "",
      };
      store.UpdateBankAccount(param, valueForm.CustName);
    };
    const ClosePopup = () => {
      store.isShowPopupModalUpdate = false;
    };
    useEffect(() => {
      getListBank();
    }, []);
    useEffect(() => {
      getListBranch();
    }, []);
    useEffect(() => {
      if(store.dataListBank.length > 0) {
        const bank = store.dataListBank.filter(item => item.BankNo === valueBind.BANKNO);
        form.setFieldsValue({cbxBank: bank[0]});
      }
    }, [store.dataListBank])
    useEffect(() => {
      if(store.dataListBranchBank.length > 0) {
        const branch = store.dataListBranchBank.filter(item => item.BranchNo === valueBind.BranchNo);
        form.setFieldsValue({cbxBranch: branch[0]});
      }
    }, [store.dataListBranchBank]);

    const defaultValue = {
      CustomerId: valueBind.CUSTOMERID,
      CustName: valueBind.CUSTOMERNAME,
      BankAccount: valueBind.BANKACCOUNT,
      cbxBank: store.dataListBank.filter(item => item.BankNo === valueBind.BANKNO)[0],
      cbxBranch: store.dataListBranchBank.filter(item=>item.BranchNo == valueBind.BranchNo)[0],
      Beneficiary: valueBind.BENEFICIARY,
      Remark: valueBind.REMARK,
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
              onFinish={UpdateBankAccount}
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
                  { required: true, message: 'Mã khách hàng không được để trống' }
                ]}
                help={store.custIDValid ? null : "Mã khách hàng " + form.getFieldValue("CustomerId") + " không tồn tại hoặc không có dữ liệu!"}
                validateStatus={store.custIDValid ? undefined : "error"}
                hasFeedback>
                <Input
                  placeholder={t("X_Trade_Customer_Id")}
                  autoComplete="off"
                  disabled />
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
                {store.dataListBank.length > 0 ? (
                  <Select
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    options={store.dataListBank}
                    isClearable={false}
                    getOptionLabel={(option) => option.BankName}
                    getOptionValue={(option) => option.BankNo}
                    onChange={(evt: any) => { getListBranchChange(evt) }}
                    styles={customSMSelectStyles}
                    placeholder={"Chọn Ngân hàng..."}
                    noOptionsMessage={() => "Không có dữ liệu...."}
                    defaultValue={store.dataListBank.filter(item => item.BankNo === valueBind.BANKNO)}
                  />
                ) : null
                }
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Branch_Name")}
                name="cbxBranch"
                rules={[
                  { required: true, message: 'Chi nhánh chưa được chọn!' }
                ]}
                hasFeedback>
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
                  noOptionsMessage={() => "Không có dữ liệu"}
                />
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
                  { required: true, message: 'Trường dữ liệu chưa được chọn!' }
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
