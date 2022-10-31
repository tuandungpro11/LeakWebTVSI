import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody
} from "reactstrap";
import { selectThemeColors } from "../../../../utility/Utils";
import { store } from "../../store/InvestorStore";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  ErrorToast
} from "../../../../views/extensions/toastify/ToastTypes";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Form, Input, InputNumber } from "antd";
import { customSMSelectStyles } from "../../types";
import { numberUtil } from "../../../../utility/general/NumberUtil";

const FormDeatail = (valueUpdate: any) => {
  const valueBind = valueUpdate.valueUpdate;
  const { t } = useTranslation();

  const [form] = Form.useForm();

  const onSubmitUpdateBank = () => {
    const valueForm = form.getFieldsValue();
    if (valueForm.MinCash >= valueForm.MaxCash) {
      toast.error(ErrorToast("Số tiền tối thiểu phải nhỏ hơn số tiền tối đa!"));
      return;
    }
    const param = {
      Id: valueBind.Id,
      UserId: "1234",
      BankNo: valueForm.BankNo,
      BankName: valueForm.BankName,
      BankNameEn: valueForm.BankNameE,
      ShortName: valueForm.BankNameShort,
      Bankcheqcode: valueForm.Bankcheqcode,
      SecCode: valueForm.SecCode,
      WithdrawAccount: valueForm.WithdrawAccount,
      DepositAccount: valueForm.DepositAccount,
      MinTradingCash: valueForm.MinCash,
      MaxTradingCash: valueForm.MaxCash,
      SecCodeBranch: valueForm.SecBranch,
      Remark: valueForm.Remark,
      Status: valueForm.cbxStatus.Value,
      TransferFee: valueForm.Fee,
      BranchNo: ""
    };
    store.UpdateBank(param);
  };
  const ResetForm = () => {
    form.resetFields();
  };
  const ClosePopup = () => {
    store.isShowPopupModalDetail = false;
  };

  const defaultValue = {
    BankNo: valueBind.BankNo,
    BankName: valueBind.BankName,
    BankNameE: valueBind.BankName_E,
    BankNameShort: valueBind.ShortName,
    cbxStatus: store.dataListStatusBank.filter(item => item.Value == valueBind.Status),
    Bankcheqcode: valueBind.bankcheqcode,
    SecCode: valueBind.SecCode,
    SecBranch: valueBind.secCodeBranch,
    DepositAccount: valueBind.DepositAccount,
    WithdrawAccount: valueBind.WithdrawAccount,
    MinCash: numberUtil.formatNumber(valueBind.min_trading_cash), 
    MaxCash: numberUtil.formatNumber(valueBind.max_trading_cash),
    Fee: numberUtil.formatNumber(valueBind.TransferFee),
    Remark: valueBind.Remark
  }

  useEffect(() => {
    const param = {
      Category: "BANK",
      Group: "STATUS",
      Code: "",
    };
    store.getListStatusBank(param);
  }, []);
  return (
    <Fragment>
      <Card>
        <CardBody>
            <Form
              layout={'vertical'}
              form={form}
            //   onFinish={onSubmitUpdateBank}
              initialValues={defaultValue}
            >
              <PerfectScrollbar style={{ maxHeight: "70vh", overflowX: "hidden" }}>
              <Form.Item
                label={t("X_Trade_Bank_Code")}
                name="BankNo"
                rules={[
                  { required: true, message: 'Mã ngân hàng không được để trống' }
                ]}>
                <Input
                  placeholder={t("X_Trade_Bank_Code")}
                  autoComplete="off" disabled/>
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Bank_Name")}
                name="BankName"
                rules={[
                  { required: true, message: 'Tên ngân hàng không được để trống' }
                ]}>
                <Input placeholder={t("X_Trade_Bank_Name")} autoComplete="off" disabled/>
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Bank_Name_E")}
                name="BankNameE"
                rules={[
                  { required: true, message: 'Tên NH tiếng anh không được để trống' }
                ]}>
                <Input placeholder={t("X_Trade_Bank_Name_E")} autoComplete="off" disabled/>
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Bank_Name_Short")}
                name="BankNameShort"
                rules={[
                  { required: true, message: 'Tên NH viết tắt không được để trống' }
                ]}>
                <Input placeholder={t("X_Trade_Bank_Name_Short")} autoComplete="off" disabled/>
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Status")}
                name="cbxStatus"
                rules={[
                  { required: true, message: "Trạng thái chưa được chọn!" },
                ]}
                hasFeedback
              >
                {store.dataListStatusBank.length > 0 ? (
                  <Select
                    options={store.dataListStatusBank}
                    defaultValue={store.dataListStatusBank[0]}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    getOptionLabel={(option) => option.Name}
                    getOptionValue={(option) => option.Value}
                    placeholder={"Chọn trạng thái..."}
                    noOptionsMessage={() => "Không có dữ liệu...."}
                    isDisabled={true}
                  />
                ) : (
                  <></>
                )}
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Bank_Cheq_Code")}
                name="Bankcheqcode"
                rules={[
                  { required: true, message: 'Mã bank cheq code không được để trống' }
                ]}>
                <Input placeholder={t("X_Trade_Bank_Cheq_Code")} autoComplete="off" disabled/>
              </Form.Item>
              <Form.Item
                label={t("X_Trade_CTCK_Code")}
                name="SecCode"
                rules={[
                  { required: true, message: 'Mã CTCK không được để trống' }
                ]}>
                <Input placeholder={t("X_Trade_CTCK_Code")} autoComplete="off" disabled/>
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Sec_Branch")}
                name="SecBranch"
                rules={[
                  { required: true, message: 'Mã chi nhánh CTCK không được để trống' }
                ]}>
                <Input placeholder={t("X_Trade_Sec_Branch")} autoComplete="off" disabled/>
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Deposit_Acc")}
                name="DepositAccount"
                rules={[
                  { required: true, message: 'TK ghi nợ không được để trống' }
                ]}>
                <Input placeholder={t("X_Trade_Deposit_Acc")} autoComplete="off" disabled/>
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Withdraw_Acc")}
                name="WithdrawAccount"
                rules={[
                  { required: true, message: 'TK ghi có không được để trống' }
                ]}>
                <Input placeholder={t("X_Trade_Withdraw_Acc")} autoComplete="off" disabled/>
              </Form.Item>

              <Form.Item
                label={t("X_Trade_Min_Cash")}
                name="MinCash"
                rules={[
                  { required: true, message: 'Số tiền tối thiểu không được để trống' }
                ]}>
                <Input
                  disabled
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Max_Cash")}
                name="MaxCash"
                rules={[
                  { required: true, message: 'Số tiền tối đa không được để trống' }
                ]}>
                <Input
                  disabled
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Fee")}
                name="Fee"
                rules={[
                  { required: true, message: 'Phí chuyển tiền không được để trống' }
                ]}>
                <Input
                  disabled
                />
              </Form.Item>

              <Form.Item
                label={t("X_Trade_Remark")}
                name="Remark"
                rules={[
                  { required: true, message: 'Ghi chú không được để trống' }
                ]}>
                <Input placeholder={t("X_Trade_Remark")} autoComplete="off" disabled/>
              </Form.Item>
              </PerfectScrollbar>
              <Form.Item className="text-center mt-2">
                <Button
                  className="btn btn-gradient-primary"
                  color="gradient-primary"
                  htmlType="button"
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
};

export default FormDeatail;
