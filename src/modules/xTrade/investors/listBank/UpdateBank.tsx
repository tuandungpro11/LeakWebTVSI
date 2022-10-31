import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { selectThemeColors } from "../../../../utility/Utils";
import { store } from "../../store/InvestorStore";
import Select from "react-select";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Form, Input, InputNumber } from "antd";
import { customSMSelectStyles } from "../../types";
import { appStore } from "../../../../stores/appStore";

const FormUpdateBank = (valueUpdate: any) => {
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
      UserId: appStore.account.LoginName,
      BankNo: valueForm.BankNo == undefined?"":valueForm.BankNo.trim(),
      BankName: valueForm.BankName == undefined?"":valueForm.BankName.trim(),
      BankNameEn: valueForm.BankNameE == undefined?"":valueForm.BankNameE.trim(),
      ShortName: valueForm.BankNameShort == undefined?"":valueForm.BankNameShort.trim(),
      Bankcheqcode: valueForm.Bankcheqcode == undefined?"":valueForm.Bankcheqcode.trim(),
      SecCode: valueForm.SecCode == undefined?"":valueForm.SecCode.trim(),
      WithdrawAccount: valueForm.WithdrawAccount == undefined?"":valueForm.WithdrawAccount.trim(),
      DepositAccount: valueForm.DepositAccount == undefined?"":valueForm.DepositAccount.trim(),
      MinTradingCash: valueForm.MinCash == undefined?"":valueForm.MinTradingCash,
      MaxTradingCash: valueForm.MaxCash == undefined?"":valueForm.MaxCash,
      SecCodeBranch: valueForm.SecBranch == undefined?"":valueForm.SecBranch.trim(),
      Remark: valueForm.Remark == undefined?"":valueForm.Remark.trim(),
      Status: valueForm.cbxStatus.Value,
      TransferFee: valueForm.Fee == undefined?"":valueForm.Fee,
      BranchNo: "",
    };
    store.UpdateBank(param);
  };
  const ResetForm = () => {
    form.resetFields();
  };
  const ClosePopup = () => {
    store.isShowPopupModalUpdate = false;
  };

  const defaultValue = {
    BankNo: valueBind.BankNo,
    BankName: valueBind.BankName,
    BankNameE: valueBind.BankName_E,
    BankNameShort: valueBind.ShortName,
    cbxStatus: store.dataListStatusBank.filter((item) => item.Value == valueBind.Status && item.value!=0)[0],
    Bankcheqcode: valueBind.bankcheqcode,
    SecCode: valueBind.SecCode,
    SecBranch: valueBind.secCodeBranch,
    DepositAccount: valueBind.DepositAccount,
    WithdrawAccount: valueBind.WithdrawAccount,
    MinCash: valueBind.min_trading_cash,
    MaxCash: valueBind.max_trading_cash,
    Fee: valueBind.TransferFee,
    Remark: valueBind.Remark,
  };

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
            layout={"vertical"}
            form={form}
            onFinish={onSubmitUpdateBank}
            initialValues={defaultValue}
            requiredMark={false}
          >
            <PerfectScrollbar
              style={{ maxHeight: "70vh", overflowX: "hidden" }}
            >
              <Form.Item
                label={t("X_Trade_Bank_Code")}
                name="BankNo"
                rules={[
                  {
                    required: true,
                    message: "Mã ngân hàng không được để trống",
                  },
                ]}
              >
                <Input
                  placeholder={t("X_Trade_Bank_Code")}
                  autoComplete="off"
                  disabled
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Bank_Name")}
                name="BankName"
                rules={[
                  {
                    required: true,
                    message: "Tên ngân hàng không được để trống",
                  },
                  {
                    whitespace:true,
                    message: "Tên ngân hàng không được để trống",
                  }
                ]}
              >
                <Input
                  placeholder={t("X_Trade_Bank_Name")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Bank_Name_E")}
                name="BankNameE"
                rules={[
                  {
                    required: true,
                    message: "Tên NH tiếng anh không được để trống",
                  },
                  {
                    whitespace:true,
                    message: "Tên NH tiếng anh không được để trống",
                  }
                ]}
              >
                <Input
                  placeholder={t("X_Trade_Bank_Name_E")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Bank_Name_Short")}
                name="BankNameShort"
                rules={[
                  {
                    required: true,
                    message: "Tên NH viết tắt không được để trống",
                  },
                  {
                    whitespace:true,
                    message: "Tên NH viết tắt không được để trống",
                  }
                ]}
              >
                <Input
                  placeholder={t("X_Trade_Bank_Name_Short")}
                  autoComplete="off"
                />
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
                    options={store.dataListStatusBank.filter(item=>item.Value!=0)}
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
                  />
                ) : (
                  <></>
                )}
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Bank_Cheq_Code")}
                name="Bankcheqcode"
                rules={[
                  {
                    required: true,
                    message: "Mã bank cheq code không được để trống",
                  },
                  {
                    whitespace:true,
                    message: "Mã bank cheq code không được để trống",
                  }
                ]}
              >
                <Input
                  placeholder={t("X_Trade_Bank_Cheq_Code")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_CTCK_Code")}
                name="SecCode"
                rules={[
                  { required: true, message: "Mã CTCK không được để trống" },
                  {
                    whitespace:true,
                    message: "Mã CTCK không được để trống",
                  }
                ]}
              >
                <Input
                  placeholder={t("X_Trade_CTCK_Code")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Sec_Branch")}
                name="SecBranch"
                rules={[
                  {
                    required: true,
                    message: "Mã chi nhánh CTCK không được để trống",
                  },
                  {
                    whitespace:true,
                    message: "Mã chi nhánh CTCK không được để trống",
                  }
                ]}
              >
                <Input
                  placeholder={t("X_Trade_Sec_Branch")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Deposit_Acc")}
                name="DepositAccount"
                rules={[
                  { required: true, message: "TK ghi nợ không được để trống" },
                  {
                    whitespace:true,
                    message: "TK ghi nợ không được để trống",
                  }
                ]}
              >
                <Input
                  placeholder={t("X_Trade_Deposit_Acc")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Withdraw_Acc")}
                name="WithdrawAccount"
                rules={[
                  { required: true, message: "TK ghi có không được để trống" },
                  {
                    whitespace:true,
                    message: "TK ghi có không được để trống",
                  }
                ]}
              >
                <Input
                  placeholder={t("X_Trade_Withdraw_Acc")}
                  autoComplete="off"
                />
              </Form.Item>

              <Form.Item
                label={t("X_Trade_Min_Cash")}
                name="MinCash"
                rules={[
                  {
                    required: true,
                    message: "Số tiền tối thiểu không được để trống",
                  }
                ]}
              >
                <InputNumber
                  defaultValue={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  controls={false}
                  min={0}
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Max_Cash")}
                name="MaxCash"
                rules={[
                  {
                    required: true,
                    message: "Số tiền tối đa không được để trống",
                  }
                ]}
              >
                <InputNumber
                  defaultValue={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  controls={false}
                  min={0}
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Fee")}
                name="Fee"
              >
                <InputNumber
                  defaultValue={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  controls={false}
                  min={0}
                />
              </Form.Item>

              <Form.Item
                label={t("X_Trade_Remark")}
                name="Remark"
              >
                <Input placeholder={t("X_Trade_Remark")} autoComplete="off" />
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

export default FormUpdateBank;
