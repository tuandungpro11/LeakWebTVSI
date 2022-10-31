import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { selectThemeColors } from "../../../../../utility/Utils";
import { store } from "../../../store/InvestorStore";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../../views/extensions/toastify/ToastTypes";
import { Moment } from "../../../../../utility/general/Moment";
import { DatePicker, Form, Input } from "antd";
import { customSMSelectStyles } from "../../../types";
import { appStore } from "../../../../../stores/appStore";
import locale from 'antd/es/date-picker/locale/vi_VN';
import moment from "moment";

const FormUpdate = (valueUpadate: any) => {
  const [form] = Form.useForm();
  const valueBind = valueUpadate.valueUpdate;
  const [valueDate, setvalueDate] = useState(new Date());
  const { t } = useTranslation();
  const UpdateOrderSlip = () => {
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
      ExTraderID: valueBind.ExTraderID,
      TraderID:
        valueForm.TraderID == undefined ? "" : valueForm.TraderID,
      TraderType: valueForm.cbxType.Value,
      Status: valueForm.cbxStatus.Value,
      EffDate: valueForm.txtEffDate ? Moment.formatDateNew(valueForm.txtEffDate, "yyyy-MM-DD") : "",
      ExpDate: valueForm.txtExpDate ? Moment.formatDateNew(valueForm.txtExpDate, "yyyy-MM-DD") : "",
      Remark: valueForm.Remark == undefined ? "" : valueForm.Remark.trim(),
      UserId: appStore.account.LoginName,
    };
    store.UpdateOrderSlip(param);
  };
  const ResetForm = () => {
    form.resetFields();
  };
  const defaultValue = {
    ExTraderID: valueBind.ExTraderID,
    TraderID: valueBind.TraderID,
    cbxType: store.dataListTypeOrderSlip.filter(
      (item) => item.Value == valueBind.TraderType
    )[0],
    cbxStatus: store.dataListActiveOrderSlip.filter(
      (item) => item.Value == valueBind.Status
    )[0],
    txtEffDate: moment(valueBind.EffDate),
    txtExpDate: moment(valueBind.ExpDate),
    Remark: valueBind.Remark,
  };
  const ClosePopup = () => {
    store.isShowPopupModalUpdate = false;
  };

  const getListType = () => {
    var param = {
      Category: "EXTRADER",
      Group: "TRADER_TYPE",
      Code: "",
    };
    store.getListTypeOrderSlip(param);
  };
  const getListActive = () => {
    var param = {
      Category: "EXTRADER",
      Group: "STATUS",
      Code: "",
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
            onFinish={UpdateOrderSlip}
            style={{ overflowX: "hidden" }}
            layout={"vertical"}
            form={form}
            initialValues={defaultValue}
            requiredMark={false}
          >
            <PerfectScrollbar
              style={{ maxHeight: "70vh", overflowX: "hidden" }}
            >
              <Form.Item label={t("X_Trade_Trader_Id")} name="TraderID">
                <Input
                  type="text"
                  placeholder="TraderID"
                  id="TraderID"
                  disabled
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Type")}
                name="cbxType"
                rules={[
                  {
                    required: true,
                    message: "Loại không được để trống",
                  },
                ]}
              >
                {store.dataListTypeOrderSlip.length > 0 ? (
                  <Select
                    options={store.dataListTypeOrderSlip.filter(
                      (item) => item.Value != -1
                    )}
                    defaultValue={store.dataListTypeOrderSlip.filter(
                      (item) => item.Value == valueBind.TraderType
                    )}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    getOptionLabel={(option) => option.Name}
                    getOptionValue={(option) => option.Value}
                    styles={customSMSelectStyles}
                    placeholder="Chọn Loại"
                  />
                ) : (
                  <></>
                )}
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Status")}
                name="cbxStatus"
                rules={[
                  {
                    required: true,
                    message: "Trạng thái không được để trống",
                  },
                ]}
              >
                {store.dataListActiveOrderSlip.length > 0 ? (
                  <Select
                    options={store.dataListActiveOrderSlip.filter(
                      (item) => item.Value != -1
                    )}
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
            </PerfectScrollbar>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default FormUpdate;
