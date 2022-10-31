import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Label,
  Row,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { selectThemeColors } from "../../../../../utility/Utils";
import { store } from "../../../store/InvestorStore";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../../views/extensions/toastify/ToastTypes";
import { DatePicker, Form, Input } from "antd";
import { Moment } from "../../../../../utility/general/Moment";
import { customSMSelectStyles } from "../../../types";
import 'moment/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';
import moment from "moment";
import { appStore } from "../../../../../stores/appStore";

const FormAddNew = () => {
  const [form] = Form.useForm();
  const [valueDate, setvalueDate] = useState(new Date());
  const { t } = useTranslation();
  const AddNewTraderID = () => {
    const valueForm = form.getFieldsValue();
    if (valueForm.txtEffDate == undefined) {
      toast.error(ErrorToast("Ngày hiệu lực không được để trống"));
      return;
    }
    if (valueForm.txtExpDate == undefined) {
      toast.error(ErrorToast("Ngày hiệu lực không được để trống"));
      return;
    }
    const param = {
      TraderID: valueForm.TraderID==undefined?"": valueForm.TraderID.trim(),
      TraderType: valueForm.cbxType.Value,
      Status: valueForm.cbxStatus.Value,
      EffDate: valueForm.txtEffDate ? Moment.formatDateNew(valueForm.txtEffDate, "yyyy-MM-DD") : "",
      ExpDate: valueForm.txtExpDate ? Moment.formatDateNew(valueForm.txtExpDate, "yyyy-MM-DD") : "",
      Remark: valueForm.Remark==undefined?"": valueForm.Remark.trim(),
      UserId: appStore.account.LoginName,
    };
    store.AddNewOrderSlip(param);
  };
  const defaultValue = {
    TraderID: "",
    cbxType: store.dataListTypeOrderSlip.filter(item=>item.Value != -1)[0],
    cbxStatus: store.dataListActiveOrderSlip.filter(item=>item.Value != -1)[0],
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
  const getListType = () => {
    var param = {
      Category: "EXTRADER",
      Group: "TRADER_TYPE",
      Code: ""
    };
    store.getListTypeOrderSlip(param);
  };
  const getListActive = () => {
    var param = {
      Category: "EXTRADER",
      Group: "STATUS",
      Code: ""
    };
    store.getListActiveOrderSlip(param);
  };

  useEffect(() => {
    getListType();
    getListActive();
  }, []);

  return (
    <Fragment>
      <Card>
        <CardBody>
          <Form
            onFinish={AddNewTraderID}
            style={{ overflowX: "hidden" }}
            layout={"vertical"}
            form={form}
            initialValues={defaultValue}
            requiredMark={false}
          >
            <PerfectScrollbar style={{ maxHeight: "70vh", overflowX: "hidden" }}>
              <Form.Item
                label={t("X_Trade_Trader_Id")}
                name="TraderID"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "TraderID không được để trống",
                  },
                  {
                    whitespace:true,
                    message: "Loại không được để trống",
                  }
                ]}
              >
                <Input
                  type="text"
                  placeholder={t("X_Trade_Trader_Id")}
                  autoComplete="Off"
                />
              </Form.Item>
              <Form.Item label={t("X_Trade_Type")} name="cbxType"
              rules={[
                  {
                    required: true,
                    message: "Loại không được để trống",
                  },
                ]}>
                {store.dataListTypeOrderSlip.length > 0 ? (
                  <Select
                    options={store.dataListTypeOrderSlip.filter(item=>item.Value!=-1)}
                    defaultValue={store.dataListTypeOrderSlip[0]}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    getOptionLabel={(option) => option.Name}
                    getOptionValue={(option) => option.Value}
                    placeholder="Chọn Loại"
                  />) : (<></>)}
              </Form.Item>
              <Form.Item label={t("X_Trade_Status")} name="cbxStatus"
              rules={[
                {
                  required: true,
                  message: "Trạng thái không được để trống",
                },
              ]}>
                {store.dataListActiveOrderSlip.length > 0 ? (
                  <Select
                    options={store.dataListActiveOrderSlip.filter(item=>item.Value!=-1)}
                    defaultValue={store.dataListActiveOrderSlip[0]}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    getOptionLabel={(option) => option.Name}
                    getOptionValue={(option) => option.Value}
                    styles={customSMSelectStyles}
                    placeholder="Chọn trạng thái"
                  />) : (<></>)}
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
                  style={{ width: '100%' }}
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
                  style={{ width: '100%' }}
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
    </Fragment >
  );
};

export default FormAddNew;
