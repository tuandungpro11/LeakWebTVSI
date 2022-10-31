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
  const AddNewAccount = () => {
    const valueForm = form.getFieldsValue();

    if (valueForm.txtEffDate==null) {
      toast.error(ErrorToast("Ngày hiệu lực không được để trống"));
      return;
    }
    if (valueForm.txtExpDate==null) {
      toast.error(ErrorToast("Ngày hết hạn không được để trống"));
      return;
    }
    if (valueForm.AccountId.endsWith("1") == false) {
      toast.error(ErrorToast("Vui lòng nhập tài khoản đuôi 1"));
      return;
    }
    if (valueForm.cbxStatus.Value == -1) {
      toast.error(ErrorToast("Bạn chưa chọn trạng thái"));
      return;
    }
    if (valueForm.ServiceName == undefined || valueForm.ServiceName.ID == -1) {
      toast.error(ErrorToast("Bạn chưa chọn dịch vụ"));
      return;
    }
    const param = {
      AccountId: valueForm.AccountId == undefined ?"": valueForm.AccountId.trim(),
      OverdraftServiceId: valueForm.ServiceName.ID== undefined ?"": valueForm.ServiceName.ID,
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
      Remark: valueForm.Remark== undefined ?"": valueForm.Remark.trim(),
      UserId: appStore.account.LoginName,
    };
    store.addNewOverDraftAccount(param);
  };

  const defaultValue = {
    AccountId: "",
    ServiceName: store.dataService[2],
    txtEffDate: moment(new Date()),
    txtExpDate: moment(new Date()),
    cbxStatus: store.dataListStatusSecToPurchase[2],
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
    const param = {
      Id: -1,
      ServiceName: "",
      Status: -1,
      PageIndex: 1,
      PageSize: 9999,
    };
    store.getListService(param);
  }, []);
  useEffect(() => {
    if (store.dataService.length > 0) {
      form.setFieldsValue({ ServiceName: store.dataService[0] });
    }
  }, [store.dataService]);

  return (
    <Fragment>
      <Card>
        <CardBody>
          <Form
            onFinish={AddNewAccount}
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
                label={t("X_Trade_Account_Id")}
                name="AccountId"
                rules={[
                  {
                    required: true,
                    message: "Mã tài khoản không được để trống",
                  },
                  {
                    whitespace:true,
                    message: "Mã tài khoản không được để trống",
                  }
                ]}
              >
                <Input
                  type="number"
                  placeholder={t("X_Trade_Account_Id")}
                  autoComplete="Off"
                  onChange={(object) => {
                    if (object.target.value.length > 7) {
                      form.setFieldsValue({AccountId: object.target.value.slice(0, 7)})
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Overdraft_Service_Name")}
                name="ServiceName"
              >
                {store.dataService.length > 0 ? (
                  <Select
                    options={store.dataService}
                    defaultValue={store.dataService[0]}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    getOptionLabel={(option) => option.ServiceName}
                    getOptionValue={(option) => option.ID}
                  />
                ) : (
                  <></>
                )}
              </Form.Item>
              <Form.Item label={t("X_Trade_Status")} name="cbxStatus">
                {store.dataListStatusSecToPurchase.length > 0 ? (
                  <Select
                    options={store.dataListStatusSecToPurchase.filter(item=>item.Value!=-1)}
                    defaultValue={store.dataListStatusSecToPurchase[2]}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    getOptionLabel={(option) => option.Name}
                    getOptionValue={(option) => option.Value}
                    placeholder="Chọn trạng thái"
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
              <Form.Item label={t("X_Trade_Note")} name="Remark">
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
