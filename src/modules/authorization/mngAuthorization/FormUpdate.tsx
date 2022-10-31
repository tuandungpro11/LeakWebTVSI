import { Form, Input } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { selectThemeColors } from "../../../utility/Utils";
import { titleStore } from "../store/titleStore";
import { bankAccountStatusOption, customSMSelectStyles } from "../type";
import Select from "react-select";
import { authorizationStore } from "../store/authorizationStore";
import { appStore } from "../../../stores/appStore";

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
      authorizationStore.isShowPopupModalUpdate = false;
    };
    const onUpdateAuthorization = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        RightID: valueBind.RightID,
        RightCode: valueForm.authorCode.trim(),
        RightName: valueForm.authorName.trim(),
        Description: valueForm.descript == undefined?"":valueForm.descript.trim(),
        Status: valueForm.cbxStatus.value,
      };
      authorizationStore.UpdateRight(param);
    };
    const getDetailAuthor = () => {
      const param = {
        UserName: appStore.account.LoginName,
        RightID: valueBind.RightID,
      };
      authorizationStore.getDetailRight(param);
    };

    useEffect(() => {
      getDetailAuthor();
    }, []);
    useEffect(()=>{
      if(Object.keys(authorizationStore.dataListAuthorizationDetail).length>0){
        form.setFieldsValue({
          authorCode: authorizationStore.dataListAuthorizationDetail.RightCode,
          authorName: authorizationStore.dataListAuthorizationDetail.RightName,
          descript: authorizationStore.dataListAuthorizationDetail.Description,
          cbxStatus: bankAccountStatusOption.filter(
            (item) => (item.value === authorizationStore.dataListAuthorizationDetail.Status)
          )[0],
        });
      }
    },[authorizationStore.dataListAuthorizationDetail])

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onUpdateAuthorization}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Form.Item
                label={t("authorization_code")}
                name="authorCode"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Mã quyền không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Mã quyền năng không được để trống",
                  },
                ]}
              >
                <Input
                  placeholder={t("authorization_code")}
                  autoComplete="off"
                  disabled
                />
              </Form.Item>
              <Form.Item
                label={t("authorization_name")}
                name="authorName"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Tên quyền không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Tên quyền năng không được để trống",
                  },
                ]}
              >
                <Input
                  placeholder={t("authorization_name")}
                  autoComplete="off"
                  disabled
                />
              </Form.Item>
              <Form.Item
                label={t("authorization_list_app_descript")}
                name="descript"
              >
                <Input
                  placeholder={t("authorization_list_app_descript")}
                  autoComplete="off"
                />
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
                  placeholder={"Chọn trạng thái..."}
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
