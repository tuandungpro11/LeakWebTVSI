import { Col, Form, Input, Row } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import { userStore } from "../store/UserStore";
import Select from "react-select";
import { selectThemeColors } from "../../../utility/Utils";
import { customSMSelectStyles } from "../../xTrade/types";
import { Sex, userType } from "../types";
import Flatpickr from "react-flatpickr";
import { Vietnamese } from "flatpickr/dist/l10n/vn";
import { Moment } from "../../../utility/general/Moment";

const ChangePassword = (data: any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const onSubmit = () => {
      const formValue = form.getFieldsValue();
      const param = {
        "UserId": userStore.userInfoParam.UserId,
        "Password": formValue.Password.trim(),
        "NewPassword": formValue.NewPassword.trim(),
        "ConfirmPassword": formValue.ConfirmPassword.trim()
      }
      userStore.ChangePassword(param);
    }

    return (
      <Fragment>
        <Form
          form={form}
          layout={'vertical'}
          onFinish={onSubmit}
          autoComplete="off"
          size="small"
          colon={false}
          requiredMark={false}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label={t("Password")}
                name="Password"
                rules={[
                  { required: true, message: 'Mật khẩu không được để trống' }
                ]}>
                <Input.Password
                  className="ant-input-affix-custom"
                  placeholder={t("Password")}
                  value={""}
                  autoComplete="new-password" />
              </Form.Item>
              <Form.Item
                label={t("New_Password")}
                name="NewPassword"
                rules={[
                  { required: true, message: 'Mật khẩu không được để trống' }
                ]}>
                <Input.Password
                  className="ant-input-affix-custom"
                  placeholder={t("New_Password")}
                  value={""}
                  autoComplete="new-password" />
              </Form.Item>
              <Form.Item
                label={t("Confirm_Password")}
                name="ConfirmPassword"
                rules={[
                  { required: true, message: 'Mật khẩu không được để trống' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('NewPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Không khớp với mật khẩu mới!'));
                    },
                  })
                ]}>
                <Input.Password
                  className="ant-input-affix-custom"
                  placeholder={t("Confirm_Password")}
                  value={""}
                  autoComplete="new-password" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item className="text-center mt-2">
                <Button
                  className="btn btn-gradient-secondary mr-1"
                  color="gradient-secondary"
                  htmlType="submit"
                >
                  {t("X_Trade_Button_Add")}
                </Button>
                <Button
                  className="btn btn-gradient-primary"
                  color="gradient-primary"
                  onClick={() => (userStore.isShowPopupChangePassword = !userStore.isShowPopupChangePassword)}
                  htmlType="button"
                >
                  {t("X_Trade_Button_Close")}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Fragment >
    )
  })

export default ChangePassword;