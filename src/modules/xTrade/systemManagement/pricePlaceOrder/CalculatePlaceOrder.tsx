import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Button, Card, CardBody, Col, Label, Row } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { selectThemeColors } from "../../../../utility/Utils";
import { store } from "../../store/InvestorStore";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import { storeSystemManagement } from "../../store/SystemManagementStore";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";
import { useObserver } from "mobx-react";
import { Form, Input, InputNumber } from "antd";
import { defaultValueCalulatePriceOrder } from "../../types";

const FormCalculate = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueDate, setvalueDate] = useState(new Date());
    const onSubmitCalculatePrice = () => {
      const valueForm = form.getFieldsValue();
      var param = {
        HNXPercent: valueForm.HNX == undefined?"":valueForm.HNX.trim(),
        HOSEPercent: valueForm.HOSE == undefined?"":valueForm.HOSE.trim(),
        UPCOMPercent: valueForm.UPCOM == undefined?"":valueForm.UPCOM.trim(),
      };
      storeSystemManagement.CalculatePriceToPurchase(param);
    };
    const ResetForm = () => {
      form.resetFields();
    };
    const defaultValue = {
      HNX: defaultValueCalulatePriceOrder[0],
      HOSE: defaultValueCalulatePriceOrder[1],
      UPCOM: defaultValueCalulatePriceOrder[2],
    };
    const ClosePopup = () => {
      storeSystemManagement.isShowPopupModalCalculate = false;
    };
    useEffect(() => {
      form.setFieldsValue({ CompanyName: storeSystemManagement.companyName });
    }, [storeSystemManagement.companyName]);
    useEffect(() => {
      form.setFieldsValue({ Market: storeSystemManagement.market });
    }, [storeSystemManagement.market]);

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              onFinish={onSubmitCalculatePrice}
              style={{ overflowX: "hidden" }}
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Form.Item
                label={t("X_Trade_HNX")}
                name="HNX"
                rules={[
                  {
                    required: true,
                    message: "HNX không được để trống",
                  },
                ]}
              >
                <InputNumber
                  size="small"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  placeholder={t("X_Trade_HNX")}
                  controls={false}
                  autoComplete="Off"
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_HOSE")}
                name="HOSE"
                rules={[
                  {
                    required: true,
                    message: "HOSE không được để trống",
                  },
                ]}
              >
              <InputNumber
                size="small"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                placeholder={t("X_Trade_HOSE")}
                controls={false}
                autoComplete="Off"
              />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_UPCOM")}
                name="UPCOM"
                rules={[
                  {
                    required: true,
                    message: "HOSE không được để trống",
                  },
                ]}
              >
              <InputNumber
                size="small"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                placeholder={t("X_Trade_UPCOM")}
                controls={false}
                autoComplete="Off"
              />
              </Form.Item>
              <Form.Item className="text-center mt-2">
                <Button
                  className="btn btn-gradient-secondary"
                  color="gradient-secondary"
                  type="submit"
                >
                  {t("X_Trade_Button_Add")}
                </Button>
                &nbsp;&nbsp;
                <Button
                  className="btn btn-gradient-info"
                  color="gradient-info"
                  onClick={() => ResetForm()}
                >
                  {t("X_Trade_Button_Reset")}
                </Button>
                &nbsp;&nbsp;
                <Button
                  className="btn btn-gradient-primary"
                  color="gradient-primary"
                  onClick={() => ClosePopup()}
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

export default FormCalculate;
