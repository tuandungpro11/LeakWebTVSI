import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { selectThemeColors } from "../../../../../utility/Utils";
import { store } from "../../../store/FunctionStore";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../../views/extensions/toastify/ToastTypes";
import { Moment } from "../../../../../utility/general/Moment";
import { DatePicker, Form, Input } from "antd";
import { customSMSelectStyles } from "../../../types";
import { appStore } from "../../../../../stores/appStore";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { useObserver } from "mobx-react";

const FormChangeStatus = (valueUpadate: any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const valueBind = valueUpadate.valueUpdate;
    const [valueDate, setvalueDate] = useState(new Date());
    const [valueReason, setValueReason] = useState(true);
    const { t } = useTranslation();

    const listStatus = [
      { value: -1, label: "Tất cả" },
      { value: 1, label: "Chờ xử lý" },
      { value: 2, label: "Đang xử lý" },
      { value: 3, label: "Đã xử lý" },
      { value: 4, label: "Bị từ chối" },
      { value: 5, label: "Hủy" },
    ];

    const onSelectStatusChange = () => {
      const valueForm = form.getFieldsValue();
      if (valueForm.cbxStatus.value == 4) {
        setValueReason(false);
      } else {
        setValueReason(true);
      }
    };

    const ChangeStatusRightBuy = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        Id: valueBind.id,
        Status: valueForm.cbxStatus.value,
        Reason: valueReason == true ?"":valueForm.Reason,
        UpdatedBy: appStore.account.LoginName,
      };
      store.updateChangeStatusRightBuy(param);
    };

    const defaultValue = {
      cbxStatus: "",
      Remark: "",
    };
    const ClosePopup = () => {
      store.isShowPopupModalUpdate = false;
    };

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              onFinish={ChangeStatusRightBuy}
              style={{ overflowX: "hidden" }}
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              requiredMark={false}
            >
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
                {valueBind.Status == 1 ? (
                  <Select
                    options={listStatus.filter(
                      (item) => item.value == 2 || item.value == 4
                    )}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    placeholder="Chọn trạng thái"
                    onChange={onSelectStatusChange}
                    menuPosition={"fixed"}
                  />
                ) : valueBind.Status == 2 ? (
                  <Select
                    options={listStatus.filter(
                      (item) =>
                        item.value == 1 || item.value == 3 || item.value == 4
                    )}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    placeholder="Chọn trạng thái"
                    onChange={onSelectStatusChange}
                    menuPosition={"fixed"}
                  />
                ) : valueBind.Status == 3 ? (
                  <Select
                    options={listStatus.filter((item) => item.value == 5)}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    placeholder="Chọn trạng thái"
                    onChange={onSelectStatusChange}
                    menuPosition={"fixed"}
                  />
                ) : (
                  <></>
                )}
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Reason")}
                name="Reason"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: !valueReason,
                    message: "Lý do không được để trống",
                  },
                  {
                    whitespace: !valueReason,
                    message: "Lý do không được để trống",
                  },
                ]}
                hidden={valueReason}
              >
                <Input
                  type="text"
                  placeholder={t("X_Trade_Reason")}
                  id="Reason"
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
            </Form>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default FormChangeStatus;
