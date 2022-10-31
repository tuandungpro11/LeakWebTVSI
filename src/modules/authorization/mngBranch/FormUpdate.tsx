import { Form, Input } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { appStore } from "../../../stores/appStore";
import { branchStore } from "../store/branchStore";

const FormUpdate = (valueUpdate: any) =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const valueBind = valueUpdate.valueUpdate;

    const defaultValue = {
      appName: "",
      descript: "",
    };
    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      branchStore.isShowPopupModalUpdate = false;
    };
    const getDetailBranch = () => {
      const param = {
        UserName: appStore.account.LoginName,
        BranchID: valueBind.BranchID,
      };
      branchStore.getDetailBranch(param);
    };
    const onUpdateBranch = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        BranchID: valueBind.BranchID,
        BranchCode: valueForm.branchCode.trim(),
        BranchName: valueForm.branchName.trim(),
        Address: valueForm.branchAddress.trim(),
        Email: valueForm.Email.trim(),
        Phone: valueForm.Phone.trim(),
        Manager: valueForm.mngName.trim(),
        Status: 1,
      };
      branchStore.UpdateBranch(param);
    };

    useEffect(() => {
      getDetailBranch();
    }, []);
    useEffect(() => {
      if (branchStore.dataListBranchDetail.length > 0) {
        form.setFieldsValue({
          branchCode: branchStore.dataListBranchDetail[0].BranchCode,
          branchName: branchStore.dataListBranchDetail[0].BranchName,
          branchAddress: branchStore.dataListBranchDetail[0].Address,
          Email: branchStore.dataListBranchDetail[0].Email,
          Phone: branchStore.dataListBranchDetail[0].Phone,
          mngName: branchStore.dataListBranchDetail[0].Manager,
        });
      }
    }, [branchStore.dataListBranchDetail]);

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onUpdateBranch}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Form.Item
                label={t("X_Trade_Branch_Bank_No")}
                name="branchCode"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Mã chi nhánh không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Mã chi nhánh không được để trống",
                  },
                ]}
              >
                <Input
                  placeholder={t("X_Trade_Branch_Bank_No")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Branch_Bank_Name")}
                name="branchName"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Tên chi nhánh không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Tên chi nhánh không được để trống",
                  },
                ]}
              >
                <Input
                  placeholder={t("X_Trade_Branch_Bank_Name")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("authorization_list_branch_address")}
                name="branchAddress"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Địa chỉ không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Địa chỉ không được để trống",
                  },
                ]}
              >
                <Input
                  placeholder={t("authorization_list_branch_address")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("Email")}
                name="Email"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Email không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Email không được để trống",
                  },
                ]}
              >
                <Input placeholder={t("Email")} autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("Phone")}
                name="Phone"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Số điện thoại không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Số điện thoại không được để trống",
                  },
                ]}
              >
                <Input placeholder={t("Phone")} autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("authorization_list_branch_manager")}
                name="mngName"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Tên quản lý không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Tên quản lý không được để trống",
                  },
                ]}
              >
                <Input
                  placeholder={t("authorization_list_branch_manager")}
                  autoComplete="off"
                />
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
