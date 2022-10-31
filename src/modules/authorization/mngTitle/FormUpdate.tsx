import { Form, Input } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { titleStore } from "../store/titleStore";

const FormAddNew = (valueUpdate: any) =>
useObserver(()=>{
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const valueBind = valueUpdate.valueUpdate;

    const defaultValue={
        appName:"",
        descript:""
    }
    const ResetForm=()=>{
        form.resetFields();
    }
    const ClosePopup=()=>{
        titleStore.isShowPopup = false;
    }
    const onUpdateTitle=()=>{}

    return (
        <Fragment>
          <Card>
            <CardBody>
              <Form
                layout={"vertical"}
                form={form}
                onFinish={onUpdateTitle}
                initialValues={defaultValue}
                requiredMark={false}
              >
                <Form.Item
                  label={t("authorization_list_title_name")}
                  name="appName"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Tên chức năng không được để trống",
                    },
                    {
                      whitespace:true,
                      message: "Tên chức năng không được để trống",
                    }
                  ]}
                >
                  <Input
                    placeholder={t("authorization_list_title_name")}
                    autoComplete="off"
                    disabled
                  />
                </Form.Item>
                <Form.Item label={t("authorization_list_app_descript")} name="descript"
                >
                  <Input
                    placeholder={t("authorization_list_app_descript")}
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

export default FormAddNew