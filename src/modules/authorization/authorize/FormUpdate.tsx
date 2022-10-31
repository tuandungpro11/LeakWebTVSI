import { Form, Input } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { selectThemeColors } from "../../../utility/Utils";
import { titleStore } from "../store/titleStore";
import Select, { components } from "react-select";
import makeAnimated from "react-select/animated";

const FormUpdate = (valueUpdate:any) =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const animatedComponents = makeAnimated();
    const valueBind = valueUpdate.valueUpdate;

    const demoOption = [
        { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: false },
        { value: "blue", label: "Blue", color: "#0052CC", isFixed: false },
        { value: "purple", label: "Purple", color: "#5243AA", isFixed: false },
        { value: "red", label: "Red", color: "#FF5630", isFixed: false },
        { value: "orange", label: "Orange", color: "#FF8B00", isFixed: false },
        { value: "yellow", label: "Yellow", color: "#FFC400", isFixed: false },
      ];

    const defaultValue = {
      appName: "",
      descript: "",
    };
    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      authorizeStore.isShowPopup = false;
    };
    const onAddAuthorize = () => {};

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onAddAuthorize}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Form.Item
                label={t("Login_Name")}
                name="loginName"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Tên chức năng không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Tên chức năng không được để trống",
                  },
                ]}
              >
                <Input placeholder={t("Login_Name")} autoComplete="off" disabled/>
              </Form.Item>
              <Form.Item label={t("FullName")} name="fullName"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Tên chức năng không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Tên chức năng không được để trống",
                  },
                ]}>
                <Input placeholder={t("FullName")} autoComplete="off" disabled/>
              </Form.Item>
              <Form.Item label={t("authorize_group")} name="groupAuthorize">
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  defaultValue={[demoOption[4], demoOption[5]]}
                  isMulti
                  options={demoOption}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
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
