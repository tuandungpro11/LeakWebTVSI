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
import { DatePicker, Form, Input } from "antd";
import { Moment } from "../../../../utility/general/Moment";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { customSMSelectStyles } from "../../types";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const FormAddNew = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueDate, setvalueDate] = useState(new Date());
    const MySwal = withReactContent(Swal);

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
          onSubmitAddSymbol();
        }
      });
    };
    
    const onSubmitAddSymbol = () => {
      const valueForm = form.getFieldsValue();
      if (valueForm.txtEffDate == undefined) {
        toast.error(ErrorToast("Bạn chưa chọn ngày hiệu lực"));
        return;
      }
      var param = {
        Symbol: valueForm.Symbol == undefined ? "" : valueForm.Symbol.trim().toUpperCase(),
        Date: Moment.formatDateNew(valueForm.txtEffDate, "yyyyMMDD"),
        Market: valueForm.Market.Code,
      };
      storeSystemManagement.AddSymbol(param);
    };
    const ResetForm = () => {
      form.resetFields();
    };
    const defaultValue = {
      Symbol: "",
      txtEffDate: moment(new Date()),
      CompanyName: "",
    };
    const ClosePopup = () => {
      storeSystemManagement.isShowPopup = false;
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
              onFinish={popupConfirmCreate}
              style={{ overflowX: "hidden" }}
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <PerfectScrollbar
                style={{ maxHeight: "70vh", overflowX: "hidden" }}
              >
                <Form.Item
                  label={t("X_Trade_Sec_Code")}
                  name="Symbol"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Mã chứng khoán không được để trống",
                    },
                    {
                      whitespace: true,
                      message: "Mã chứng khoán không được để trống",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    placeholder={t("X_Trade_Sec_Code")}
                    id="Symbol"
                    autoComplete="Off"
                  />
                </Form.Item>
                <Form.Item
                  label={t("X_Trade_Market")}
                  name="Market"
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
                <Form.Item label={t("X_Trade_Eff_Date")} name="txtEffDate"
                  rules={[
                    {
                      required: true,
                      message: "Ngày hiệu lực không được để trống",
                    },
                  ]}>
                  <DatePicker
                    locale={locale}
                    format={"DD-MM-yyyy"}
                    size="small"
                    style={{ width: "100%" }}
                    className="ant-picker-small-custom"
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
