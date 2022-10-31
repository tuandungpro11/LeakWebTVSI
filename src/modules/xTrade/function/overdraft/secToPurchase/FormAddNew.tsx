import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { selectThemeColors } from "../../../../../utility/Utils";
import { store } from "../../../store/FunctionStore";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../../views/extensions/toastify/ToastTypes";
import { DatePicker, Form, Input } from "antd";
import { Moment } from "../../../../../utility/general/Moment";
import { customSMSelectStyles } from "../../../types";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { appStore } from "../../../../../stores/appStore";

const FormAddNew = () => {
  const [form] = Form.useForm();
  const [valueDate, setvalueDate] = useState(new Date());
  const { t } = useTranslation();
  const AddNewSecCode = () => {
    const valueForm = form.getFieldsValue();
    if (valueForm.txtEffDate == undefined) {
      toast.error(ErrorToast("Ngày hiệu lực không được để trống"));
      return;
    }
    if (valueForm.txtExpDate == undefined) {
      toast.error(ErrorToast("Ngày hết hạn không được để trống"));
      return;
    }
    const param = {
      Symbol: valueForm.Symbol== undefined?"":valueForm.Symbol.trim().toUpperCase(),
      Status: valueForm.cbxStatus.Value,
      EffectDate: valueForm.txtEffDate
      ? valueForm.txtEffDate._d == undefined
        ? ""
        : Moment.formatDateNew(valueForm.txtEffDate._d, "yyyy-MM-DD")
      : "",
      ExpireDate: valueForm.txtExpDate
      ? valueForm.txtExpDate._d == undefined
        ? ""
        : Moment.formatDateNew(valueForm.txtExpDate._d, "yyyy-MM-DD")
      : "",
      Remark: valueForm.Remark== undefined?"":valueForm.Remark.trim(),
      UserId: appStore.account.LoginName,
    };
    store.AddNewOverDraft(param);
  };

  const defaultValue = {
    Symbol: "",
    cbxStatus: store.dataListStatusSecToPurchase.filter(item=>item.Value != -1)[0],
    txtEffDate: moment(new Date()),
    txtExpDate: moment(new Date()),
    Remark: "",
  };
  const ResetForm = () => {
    form.resetFields();
  };
  const ClosePopup = () => {
    store.isShowPopup = false;
  };
  const getListStatus = () => {
    var param = {
      Category: "OVERDRAFT_STOCK",
      Group: "STATUS",
      Code: "",
    };
    store.getListStatusSecToPurchase(param);
  };

  useEffect(() => {
    getListStatus();
  }, []);

  return (
    <Fragment>
      <Card>
        <CardBody>
          <Form
            onFinish={AddNewSecCode}
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
                    whitespace:true,
                    message: "Mã chứng khoán không được để trống",
                  }
                ]}
                help={
                  store.custIDValid
                    ? null
                    : "Mã chứng khoán " +
                      form.getFieldValue("Symbol") +
                      " không tồn tại hoặc không có dữ liệu!"
                }
                validateStatus={store.custIDValid ? undefined : "error"}
                hasFeedback
              >
                <Input
                  type="text"
                  placeholder={t("X_Trade_Sec_Code")}
                  id="Symbol"
                  autoComplete="Off"
                />
              </Form.Item>
              <Form.Item label={t("X_Trade_Status")} name="cbxStatus">
                {store.dataListStatusSecToPurchase.length > 0 ? (
                  <Select
                    options={store.dataListStatusSecToPurchase.filter(item=>item.Value != -1)}
                    defaultValue={store.dataListStatusSecToPurchase[0]}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    getOptionLabel={(option) => option.Name}
                    getOptionValue={(option) => option.Value}
                  />
                ) : (
                  <></>
                )}
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
              <Form.Item label={t("X_Trade_Exp_Date")} name="txtExpDate"
                rules={[
                  {
                    required: true,
                    message: "Ngày hết hạn không được để trống",
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
              <Form.Item
                label={t("X_Trade_Note")}
                name="Remark"
              >
                <Input
                  type="text"
                  placeholder={t("X_Trade_Note")}
                  id="Remark"
                  autoComplete="Off"
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
};

export default FormAddNew;
