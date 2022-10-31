import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Button, Card, CardBody, Col } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { selectThemeColors } from "../../../../utility/Utils";
import { store } from "../../store/InvestorStore";
import { useObserver } from "mobx-react";
import { Form, Input } from "antd";
import { customSMSelectStyles } from "../../types";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";
import { appStore } from "../../../../stores/appStore";

const FormChangeStatus = (valueUpdate: any) =>
  useObserver(() => {
    const valueBind = valueUpdate.valueUpdate;
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const [valueReason, setValueReason] = useState(true);

    const onSelectStatusChange = () => {
      const valueForm = form.getFieldsValue();
      if (valueForm.cbxStatus.Value == 4) {
        setValueReason(false);
      } else {
        setValueReason(true);
      }
    };
    const changeStatsusInternalAccount = () => {
      if (store.custInternalIDValid && store.custIDValid) {
        const valueForm = form.getFieldsValue();
        const paramDel = {
          CustomerId: valueBind.CustomerId,
          InternalAccountNo: valueBind.InternalAccountNo,
          internalStatus: parseInt(valueForm.cbxStatus.Value),
          Reason: valueReason == true ?"":valueForm.Reason,
          modifiedBy: appStore.account.LoginName,
        };
        store.UpdateStatusInternalAccount(paramDel);
      }
    };
    const ClosePopup = () => {
      store.isShowPopupModalDetail = false;
    };

    const defaultValue = {};

    const getListStatus = () => {
      var param = {
        Category: "INTERNAL_ACCOUNT",
        Group: "STATUS",
        Code: "",
      };
      store.getListStatusInternalAccount(param);
    };

    useEffect(() => {
      getListStatus();
    }, []);

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              onFinish={changeStatsusInternalAccount}
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
                {valueBind.InternalStatus == -1 ? (
                  <Select
                    options={store.dataListInternalAccountStatus.filter(
                      (item) => item.Value == 2 || item.Value == 4
                    )}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    placeholder="Chọn trạng thái"
                    onChange={onSelectStatusChange}
                    menuPosition={"fixed"}
                    getOptionLabel={(option) => option.Name}
                    getOptionValue={(option) => option.Value}
                  />
                ) : valueBind.InternalStatus == 2 ? (
                  <Select
                    options={store.dataListInternalAccountStatus.filter(
                      (item) => item.Value == 3 || item.Value == 4
                    )}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    placeholder="Chọn trạng thái"
                    onChange={onSelectStatusChange}
                    menuPosition={"fixed"}
                    getOptionLabel={(option) => option.Name}
                    getOptionValue={(option) => option.Value}
                  />
                ) : valueBind.InternalStatus == 3 ? (
                  <Select
                    options={store.dataListInternalAccountStatus.filter(
                      (item) => item.Value == 5 || item.Value == 1
                    )}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    placeholder="Chọn trạng thái"
                    onChange={onSelectStatusChange}
                    menuPosition={"fixed"}
                    getOptionLabel={(option) => option.Name}
                    getOptionValue={(option) => option.Value}
                  />
                ) : valueBind.InternalStatus == 1 ? (
                  <Select
                    options={store.dataListInternalAccountStatus.filter(
                      (item) => item.Value == 4 || item.Value == 0
                    )}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    placeholder="Chọn trạng thái"
                    onChange={onSelectStatusChange}
                    menuPosition={"fixed"}
                    getOptionLabel={(option) => option.Name}
                    getOptionValue={(option) => option.Value}
                  />
                ) : valueBind.InternalStatus == 0 ? (
                  <Select
                    options={store.dataListInternalAccountStatus.filter(
                      (item) => item.Value == 4 || item.Value == -1
                    )}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    placeholder="Chọn trạng thái"
                    onChange={onSelectStatusChange}
                    menuPosition={"fixed"}
                    getOptionLabel={(option) => option.Name}
                    getOptionValue={(option) => option.Value}
                  />
                ) : valueBind.InternalStatus == 2 ? (
                  <Select
                    options={store.dataListInternalAccountStatus.filter(
                      (item) => item.Value == 3 || item.Value == 4
                    )}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select react-select-sm"
                    classNamePrefix="select"
                    styles={customSMSelectStyles}
                    placeholder="Chọn trạng thái"
                    onChange={onSelectStatusChange}
                    menuPosition={"fixed"}
                    getOptionLabel={(option) => option.Name}
                    getOptionValue={(option) => option.Value}
                  />
                ): (
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
