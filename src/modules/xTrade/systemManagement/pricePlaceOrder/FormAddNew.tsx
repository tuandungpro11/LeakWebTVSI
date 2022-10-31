import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import {
  Button,
  Card,
  CardBody,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { selectThemeColors } from "../../../../utility/Utils";
import { storeSystemManagement } from "../../store/SystemManagementStore";
import { useObserver } from "mobx-react";
import { Form, Input, InputNumber } from "antd";
import { customSMSelectStyles } from "../../types";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const FormAddNew = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const MySwal = withReactContent(Swal);
    const defaultValue = {
      Symbol: "",
      FloorPrice: "",
      CellingPrice: "",
      RefPrice: "",
      Market: "",
    };

    const onSubmitAddSymbolPriceToPurchase = () => {
      const valueForm = form.getFieldsValue();
      var param = {
        Symbol: valueForm.Symbol == undefined ? "" : valueForm.Symbol.trim().toUpperCase(),
        FloorPrice: valueForm.Floor == undefined ? "" : valueForm.Floor,
        CellingPrice: valueForm.Ceiling == undefined ? "" : valueForm.Ceiling,
        RefPrice: valueForm.Ref == undefined ? "" : valueForm.Ref,
        Market: valueForm.Market.Code
      };
      storeSystemManagement.AddymbolPriceToPurchase(param);
    };
    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      storeSystemManagement.isShowPopup = false;
    };

    const popupConfirmCreate = (value: any) => {
      MySwal.fire({
        html: "Vui lòng kiểm tra kĩ lại mã chứng khoán trước khi tạo",
        customClass: {
          confirmButton: "btn btn-gradient-primary mr-1",
          cancelButton: "btn btn-gradient-secondary",
        },
        showClass: {
          popup: "animate__animated animate__flipInX",
        },
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          onSubmitAddSymbolPriceToPurchase();
        }
      });
    };

    useEffect(() => {
      const param = {
        "category": "STOCK",
        "group": "EXCHANGE",
        "code": ""
      }
      storeSystemManagement.GetSysConfigList(param);
    }, [])

    return (
      <Fragment>
        <Card>
          <CardBody>

            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={popupConfirmCreate}
              style={{ overflowX: "hidden" }}
              requiredMark={false}
            >
              <PerfectScrollbar style={{ maxHeight: "70vh" }}>
                <Form.Item
                  name="Symbol"
                  label={t("X_Trade_Sec_Code")}
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Mã chứng khoán không được để trống",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    placeholder={t("X_Trade_Sec_Code")}
                    autoComplete="Off"
                    maxLength={4}
                  />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Floor_Price")}
                  name="Floor"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Giá sàn không được để trống",
                    },
                  ]}>
                  <InputNumber
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    controls={false}
                    min={0}
                    placeholder="Giá sàn"
                  />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Ceiling_Price")}
                  name="Ceiling"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Giá trần không được để trống",
                    },
                  ]}>
                  <InputNumber
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    controls={false}
                    min={0}
                    placeholder="Giá trần"
                  />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Ref_Price")}
                  name="Ref"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Giá tham chiếu không được để trống",
                    },
                  ]}>
                  <InputNumber
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    controls={false}
                    min={0}
                    placeholder="Giá tham chiếu"
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

export default FormAddNew;
