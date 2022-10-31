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
import { Form, Input } from "antd";
import { Moment } from "../../../../../utility/general/Moment";
import { customSMSelectStyles } from "../../../types";
import { appStore } from "../../../../../stores/appStore";

const FormAddNew = (valueUpdate: any) => {
  const [form] = Form.useForm();
  const valueBind = valueUpdate.valueUpdate;
  const [valueDate, setvalueDate] = useState(new Date());
  const { t } = useTranslation();
  const AddNewServiceName = () => {
    const valueForm = form.getFieldsValue();
    if (valueForm.cbxStatus.Value == -1) {
      toast.error(ErrorToast("Bạn chưa chọn trạng thái"));
      return;
    }
    const param = {
      Id: valueBind.ID,
      ServiceName: valueForm.ServiceName == undefined?"":valueForm.ServiceName.trim(),
      Status: valueForm.cbxStatus.Value,
      IsDelete: "",
      Remark: valueForm.Remark == undefined?"":valueForm.Remark.trim(),
      UserId: appStore.account.LoginName,
    };
    store.updateOverDraftService(param);
  };

  const defaultValue = {
    ServiceName: valueBind.ServiceName,
    cbxStatus: store.dataListStatusSecToPurchase.filter(item => (item.Value == valueBind.Status))[0],
    Remark: valueBind.Remark,
  };
  const ResetForm = () => {
    form.resetFields();
  };
  const ClosePopup = () => {
    store.isShowPopupModalUpdate = false;
  };
  const getListStatus = () => {
    var param = {
      Category: "OVERDRAFT_STOCK",
      Group: "STATUS",
      Code:""
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
            onFinish={AddNewServiceName}
            style={{ overflowX: "hidden" }}
            layout={"vertical"}
            form={form}
            initialValues={defaultValue}
            requiredMark={false}
          >
              <Form.Item
                label={t("X_Trade_Overdraft_Service_Name")}
                name="ServiceName"
              >
                <Input
                  type="text"
                  placeholder={t("X_Trade_Overdraft_Service_Name")}
                  autoComplete="Off"
                  disabled
                />
              </Form.Item>
              <Form.Item label={t("X_Trade_Status")} name="cbxStatus">
                {store.dataListStatusSecToPurchase.length > 0 ? (
                  <Select
                    options={store.dataListStatusSecToPurchase.filter(item=>item.Value!=-1)}
                    defaultValue={store.dataListStatusSecToPurchase[0]}
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
              <Form.Item label={t("X_Trade_Note")} name="Remark">
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
          </Form>
      </CardBody>
    </Card>
    </Fragment >
  );
};

export default FormAddNew;
