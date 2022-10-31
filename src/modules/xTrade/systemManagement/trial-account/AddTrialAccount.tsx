import { Form, Input } from "antd";
import { useObserver } from "mobx-react";
import React from "react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import { storeSystemManagement } from "../../store/SystemManagementStore";

const AddTrialAccount = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const ResetForm = () => {
      form.resetFields();
    }
    const onSubmit = () => {
      const formValue = form.getFieldsValue();
      const url = "?custCode=" + formValue.custCode;
      storeSystemManagement.AddTrialUser(url);
    }
    const valueDefault = {
      custCode: ""
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
          initialValues={valueDefault}
          requiredMark={false}>
          <Row>
            <Col sm="24">
              <Form.Item
                label={t("Customer_Code")}
                name="custCode"
                rules={[
                  { required: true, message: 'Số tài khoản không được để trống!' }
                ]}>
                <Input
                  placeholder={t("Customer_Code")}
                  autoComplete="off" />
              </Form.Item>
            </Col>
            <Col sm="24">
              <Form.Item className="text-center mt-2">
                <Button
                  className="btn btn-gradient-secondary mr-1"
                  color="gradient-secondary"
                  htmlType="submit"
                >
                  {t("X_Trade_Button_Add")}
                </Button>
                <Button
                  className="btn btn-gradient-info mr-1"
                  color="gradient-info"
                  htmlType="button"
                  onClick={() => ResetForm()}
                >
                  {t("X_Trade_Button_Reset")}
                </Button>
                <Button
                  className="btn btn-gradient-primary"
                  color="gradient-primary"
                  onClick={() => (storeSystemManagement.isShowAddTrialAccount = !storeSystemManagement.isShowAddTrialAccount)}
                  htmlType="button"
                >
                  {t("X_Trade_Button_Close")}
                </Button>
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Fragment>
    )
  });

export default AddTrialAccount;