import { Form, Input } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { appStore } from "../../../stores/appStore";
import { branchStore } from "../store/branchStore";

const FormAddNew = () =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const defaultValue = {
      branchCode: "",
      branchName: "",
      branchAddress: "",
      Email: "",
      Phone: "",
      mngName: "",
    };
    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      branchStore.isShowPopup = false;
    };
    const onAddBranch = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        BranchCode: valueForm.branchCode.trim(),
        BranchName: valueForm.branchName.trim(),
        Address: valueForm.branchAddress.trim(),
        Email: valueForm.Email.trim(),
        Phone: valueForm.Phone.trim(),
        Manager: valueForm.mngName.trim(),
        Status: 1,
      };
      branchStore.AddNewBranch(param);
    };

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onAddBranch}
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
