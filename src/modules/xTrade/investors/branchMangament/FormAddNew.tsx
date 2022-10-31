import Select from "react-select";
import React, { useEffect, useRef, useState } from "react";
import { Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
} from "reactstrap";
import { selectThemeColors } from "@utils";
import { store } from "../../store/InvestorStore";
import { useObserver } from "mobx-react";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";
import { Form, Input } from "antd";
import { customSMSelectStyles } from "../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import { appStore } from "../../../../stores/appStore";

const FormAddNew = () =>
  useObserver(() => {
    const StatusOption = [
      { value: 1, label: "Kích hoạt" },
      { value: 2, label: "Chưa kích hoạt" },
    ];

    const { t } = useTranslation();
    const [form] = Form.useForm();

    const AddBankBranch = () => {
      const valueForm = form.getFieldsValue();

      var param = {
        BankNo: valueForm.BankNo == undefined?"":valueForm.BankNo.trim(),
        BranchNo: valueForm.BranchNo == undefined?"":valueForm.BranchNo.trim(),
        BranchName: valueForm.BranchName == undefined?"":valueForm.BranchName.trim(),
        BranchNameEn: valueForm.BranchName_E == undefined?"":valueForm.BranchName_E.trim(),
        ShortBranchName: valueForm.BranchName_Short == undefined?"":valueForm.BranchName_Short.trim(),
        Status: valueForm.Status.value,
        Remark: valueForm.Remark == undefined?"":valueForm.Remark.trim(),
        UserId: appStore.account.LoginName,
      };
      store.onAddNewBranchBank(param);
    };

    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      store.isShowPopupModalAddNewBranchList = false;
    };

    const defaultValue = {
      BankNo: "",
      BranchNo: "",
      BranchName: "",
      BranchName_E: "",
      BranchName_Short: "",
      Status: StatusOption[0],
      Remark: ""
    }

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={'vertical'}
              form={form}
              onFinish={AddBankBranch}
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
                    { required: true, message: 'Mã ngân hàng không được để trống' },
                    {
                      whitespace:true,
                      message: "Mã ngân hàng không được để trống",
                    }
                  ]}>
                  <Input
                    placeholder={t("X_Trade_Bank_Code")}
                    autoComplete="off" />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Branch_Bank_No")}
                  name="BranchNo"
                  rules={[
                    { required: true, message: 'Mã chi nhánh không được để trống' },
                    {
                      whitespace:true,
                      message: "Mã chi nhánh không được để trống",
                    }
                  ]}>
                  <Input
                    placeholder={t("X_Trade_Branch_Bank_No")}
                    autoComplete="off" />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Branch_Bank_Name")}
                  name="BranchName"
                  rules={[
                    { required: true, message: 'Tên chi nhánh không được để trống' },
                    {
                      whitespace:true,
                      message: "Tên chi nhánh không được để trống",
                    }
                  ]}>
                  <Input
                    placeholder={t("X_Trade_Branch_Bank_Name")}
                    autoComplete="off" />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Branch_Bank_Name_E")}
                  name="BranchName_E"
                  rules={[
                    { required: true, message: 'Tên CN tiếng Anh không được để trống' },
                    {
                      whitespace:true,
                      message: "Tên CN tiếng Anh không được để trống",
                    }
                  ]}>
                  <Input
                    placeholder={t("X_Trade_Branch_Bank_Name_E")}
                    autoComplete="off" />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Branch_Bank_Name_Short")}
                  name="BranchName_Short"
                  rules={[
                    { required: true, message: 'Tên CN viết tắt không được để trống' },
                    {
                      whitespace:true,
                      message: "Tên CN viết tắt không được để trống",
                    }
                  ]}>
                  <Input
                    placeholder={t("X_Trade_Branch_Bank_Name_Short")}
                    autoComplete="off" />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Status")}
                  name="Status">
                  <Select
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    options={StatusOption}
                    isClearable={false}
                    styles={customSMSelectStyles}
                    placeholder={"Chọn trạng thái..."}
                    noOptionsMessage={() => "Không có dữ liệu...."}
                  />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Note")}
                  name="Remark">
                  <Input
                    placeholder={t("X_Trade_Note")}
                    autoComplete="off" />
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

export default FormAddNew;
