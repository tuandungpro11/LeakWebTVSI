import { Form, Input } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { appStore } from "../../../stores/appStore";
import { appAuStore } from "../store/appStore";
import { positionStore } from "../store/positionStore";

const FormUpdate = (valueUpdate: any) =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const valueBind = valueUpdate.valueUpdate;

    const defaultValue = {
      postionName: "",
      descript: "",
    };
    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      positionStore.isShowPopupModalUpdate = false;
    };
    const onUpdatePosition = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        PositionID: valueBind.PositionID,
        PositionName: valueForm.postionName.trim(),
        Description:
          valueForm.descript == undefined ? "" : valueForm.descript.trim(),
        Status: 0,
      };
      positionStore.UpdatePosition(param);
    };
    const getDetailPosition = () => {
      const param = {
        UserName: appStore.account.LoginName,
        PositionID: valueBind.PositionID,
      };
      positionStore.getDetailPosition(param)
    };

    useEffect(() => {
        getDetailPosition();
    }, []);
    useEffect(()=>{        
        if(positionStore.dataListPositionDetail!=null){
            form.setFieldsValue({
                postionName: positionStore.dataListPositionDetail.PositionName,
                descript: positionStore.dataListPositionDetail.Description,
            })
        }
    },[positionStore.dataListPositionDetail])

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onUpdatePosition}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Form.Item
                label={t("authorization_position_name")}
                name="postionName"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Tên vị trí không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Tên vị trí không được để trống",
                  },
                ]}
              >
                <Input
                  placeholder={t("authorization_position_name")}
                  autoComplete="off"
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
