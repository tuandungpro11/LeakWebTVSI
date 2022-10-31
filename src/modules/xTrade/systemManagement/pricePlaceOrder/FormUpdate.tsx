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
import { customSMSelectStyles } from "../../types";

const FormUpdate = (valueUpdate: any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const valueBind = valueUpdate.valueUpdate;
    const { t } = useTranslation();

    const onSubmitUpdSymbol = () => {
      const valueForm = form.getFieldsValue();
      var param = {
        // Id: valueBind.ID,
        Symbol: valueForm.Symbol == undefined ? "" : valueForm.Symbol.trim().toUpperCase(),
        FloorPrice: valueForm.Floor == undefined ? "" : valueForm.Floor,
        CellingPrice: valueForm.Ceiling == undefined ? "" : valueForm.Ceiling,
        RefPrice: valueForm.Ref == undefined ? "" : valueForm.Ref,
        Market: valueForm.Market.Code
      };
      storeSystemManagement.UpdateSymbolPriceToPurchase(param);
    };

    const defaultValue = {
      Symbol: valueBind.Symbol,
      Floor: valueBind.FloorPrice,
      Ceiling: valueBind.CeilingPrice,
      Ref: valueBind.RefPrice,
    };

    const ClosePopup = () => {
      storeSystemManagement.isShowPopupModalUpdate = false;
    };

    useEffect(() => {
      const param = {
        "category": "STOCK",
        "group": "EXCHANGE",
        "code": ""
      }
      storeSystemManagement.GetSysConfigList(param);
    }, []);

    useEffect(() => {
      form.setFieldsValue({
        Market: storeSystemManagement.sysConfigList[storeSystemManagement.sysConfigList.findIndex(item => item.Code === valueBind.Market)]
      });
    }, [storeSystemManagement.sysConfigList])

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              onFinish={onSubmitUpdSymbol}
              style={{ overflowX: "hidden" }}
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <PerfectScrollbar
                style={{ maxHeight: "70vh", overflowX: "hidden" }}
              >
                <Form.Item label={t("X_Trade_Sec_Code")} name="Symbol">
                  <Input
                    type="text"
                    placeholder="Mã chứng khoán"
                    id="Symbol"
                    autoComplete="Off"
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Floor_Price")}
                  name="Floor"
                  rules={[
                    {
                      required: true,
                      message: "Giá sàn không được để trống",
                    },
                  ]}
                >
                  <InputNumber
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    controls={false}
                    min={0}
                  />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Ceiling_Price")}
                  name="Ceiling"
                  rules={[
                    {
                      required: true,
                      message: "Giá trần không được để trống",
                    },
                  ]}
                >
                  <InputNumber
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    controls={false}
                    min={0}
                  />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Ref_Price")}
                  name="Ref"
                  rules={[
                    {
                      required: true,
                      message: "Giá tham chiếu không được để trống",
                    },
                  ]}
                >
                  <InputNumber
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    controls={false}
                    min={0}
                  />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Market")}
                  name="Market"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Thị trường không được để trống",
                    },
                  ]}
                >
                  <Select
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    options={storeSystemManagement.sysConfigList}
                    isClearable={false}
                    styles={customSMSelectStyles}
                    noOptionsMessage={() => "Không có dữ liệu...."}
                    getOptionLabel={(option) => option.Name}
                    getOptionValue={(option) => option.Value}
                    placeholder={"Chọn thị trường..."}
                    menuPosition={"fixed"}

                  />
                </Form.Item>
              </PerfectScrollbar>
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

export default FormUpdate;
