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
import { bankAccountStatusOption, customSMSelectStyles } from "../type";

const FormAddNew = () =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const animatedComponents = makeAnimated();

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
      titleStore.isShowPopup = false;
    };
    const onAddFunction = () => {};

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onAddFunction}
              initialValues={defaultValue}
              requiredMark={false}
            >
            <Form.Item label={t("authorization_list_app_name")} name="cbxAppName">
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
              <Form.Item
                label={t("authorize_function_name")}
                name="funcName"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "T??n ch???c n??ng kh??ng ???????c ????? tr???ng",
                  },
                  {
                    whitespace: true,
                    message: "T??n ch???c n??ng kh??ng ???????c ????? tr???ng",
                  },
                ]}
              >
                <Input placeholder={t("authorize_function_name")} autoComplete="off" />
              </Form.Item>
              <Form.Item label={t("authorize_function_code")} name="codeName"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "M?? ch???c n??ng kh??ng ???????c ????? tr???ng",
                  },
                  {
                    whitespace: true,
                    message: "M?? ch???c n??ng kh??ng ???????c ????? tr???ng",
                  },
                ]}>
                <Input placeholder={t("authorize_function_code")} autoComplete="off" />
              </Form.Item>
              <Form.Item label={t("authorize_function_order_by")} name="orderNumber"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Th??? t??? hi???n th??? kh??ng ???????c ????? tr???ng",
                  },
                  {
                    whitespace: true,
                    message: "Th??? t??? hi???n th??? kh??ng ???????c ????? tr???ng",
                  },
                ]}>
                <Input placeholder={t("authorize_function_order_by")} autoComplete="off" />
              </Form.Item>
              <Form.Item label={t("authorize_function_url")} name="orderNumber"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Url kh??ng ???????c ????? tr???ng",
                  },
                  {
                    whitespace: true,
                    message: "Url kh??ng ???????c ????? tr???ng",
                  },
                ]}>
                <Input placeholder={t("authorize_function_url")} autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Status")}
                name="cbxStatus"
                hasFeedback
              >
                <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={bankAccountStatusOption}
                  isClearable={false}
                  styles={customSMSelectStyles}
                  placeholder={"Ch???n tr???ng th??i..."}
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
