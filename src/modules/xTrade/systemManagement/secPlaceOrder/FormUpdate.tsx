import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Button, Card, CardBody, Col, Label, Row } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { Moment } from "../../../../utility/general/Moment";
import { useObserver } from "mobx-react";
import { storeSystemManagement } from "../../store/SystemManagementStore";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";
import { DatePicker, Form, Input } from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import Select from "react-select";
import { customSMSelectStyles } from "../../types";
import { selectThemeColors } from "../../../../utility/Utils";

const FormUpdate = (valueUpdate: any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const valueBind = valueUpdate.valueUpdate;
    const { t } = useTranslation();
    const [valueDate, setvalueDate] = useState(new Date());
    const onSubmitUpdateSymbol = () => {
      const valueForm = form.getFieldsValue();
      if (valueForm.txtEffDate == undefined) {
        toast.error(ErrorToast("Bạn chưa chọn ngày hiệu lực"));
        return;
      }
      var param = {
        Id: valueBind.ID,
        Symbol: valueForm.Symbol,
        Date: Moment.formatDateNew(valueForm.txtEffDate, "yyyyMMDD"),
        Market: valueForm.Market.Code,
      };
      storeSystemManagement.UpdateSymbol(param);
    };
    const defaultValue = {
      Symbol: valueBind.StockSymbol,
      txtEffDate: moment(new Date(valueBind.Date.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1'))),
      CompanyName: valueBind.CompanyName,
      Market: valueBind.Market,
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
              onFinish={onSubmitUpdateSymbol}
              style={{ overflowX: "hidden" }}
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <PerfectScrollbar
                style={{ maxHeight: "70vh", overflowX: "hidden" }}
              >
                <Form.Item label={t("X_Trade_Customer_Id")} name="Symbol">
                  <Input
                    type="text"
                    placeholder={t("X_Trade_Customer_Id")}
                    id="Symbol"
                    disabled
                  />
                </Form.Item>
                <Form.Item label={t("X_Trade_Market")} name="Market">
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
                    isDisabled={true}
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
