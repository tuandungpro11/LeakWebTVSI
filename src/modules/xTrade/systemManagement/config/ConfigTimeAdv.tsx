import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Moment } from "../../../../utility/general/Moment";
import { storeSystemManagement } from "../../store/SystemManagementStore";
import { pageSizeTable } from "../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import {
  DatePicker,
  Form,
  Input,
  Menu,
  Pagination,
  PaginationProps,
  TimePicker,
} from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useContextMenu } from "react-contexify";
import { List, Edit, Delete } from "react-feather";
import moment from "moment";

const ConfigTimeAdv = (valueUpdate:any) =>
  useObserver(() => {
    const valueBind = valueUpdate.valueUpdate;
    const [form] = Form.useForm();

    const { t } = useTranslation();
    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        AdvTradeBeginTimeAM: valueForm.StartTimeMorning ? valueForm.StartTimeMorning._d == undefined?"":Moment.formatDateNew(valueForm.StartTimeMorning._d, "HH:mm") :"",
        AdvTradeEndTimeAM: valueForm.EndTimeMorning ? valueForm.EndTimeMorning._d == undefined?"":Moment.formatDateNew(valueForm.EndTimeMorning._d, "HH:mm") :"",
        AdvTradeBeginTimePM: valueForm.StartTimeNoon ? valueForm.StartTimeNoon._d == undefined?"":Moment.formatDateNew(valueForm.StartTimeNoon._d, "HH:mm") :"",
        AdvTradeEndTimePM: valueForm.EndTimeNoon ? valueForm.EndTimeNoon._d == undefined?"":Moment.formatDateNew(valueForm.EndTimeNoon._d, "HH:mm") :"",
        
        AdvWithDrawBeginTimeAM: valueForm.StartTimeMorningWithdraw ? valueForm.StartTimeMorningWithdraw._d == undefined?"":Moment.formatDateNew(valueForm.StartTimeMorningWithdraw._d, "HH:mm") :"",
        AdvWithDrawEndTimeAM: valueForm.EndTimeMorningWithdraw  ? valueForm.EndTimeMorningWithdraw._d== undefined?"":Moment.formatDateNew(valueForm.EndTimeMorningWithdraw._d, "HH:mm") :"",
        AdvWithDrawBeginTimePM: valueForm.StartTimeNoonWithdraw ? valueForm.StartTimeNoonWithdraw._d == undefined?"":Moment.formatDateNew(valueForm.StartTimeNoonWithdraw._d, "HH:mm") :"",
        AdvWithDrawEndTimePM: valueForm.EndTimeNoonWithdraw ? valueForm.EndTimeNoonWithdraw._d == undefined?"":Moment.formatDateNew(valueForm.EndTimeNoonWithdraw._d, "HH:mm") :"",
      };
      
      const p = {
        JsonData: JSON.stringify(param),
      };

      storeSystemManagement.UpdateConfigSystem(p);
    };
    const ResetForm = () => {
        form.resetFields();
      };
      const ClosePopup = () => {
        storeSystemManagement.isShowPopup = false;
      };
    const defaultValue = {
      StartTimeMorning: valueBind.filter((item:any) => item.KEY == "AdvTradeBeginTimeAM")[0].VALUE==""?"": moment(Moment.setTimeHHmmss(valueBind.filter((item:any) => item.KEY == "AdvTradeBeginTimeAM")[0].VALUE)),
      EndTimeMorning: valueBind.filter((item:any) => item.KEY == "AdvTradeEndTimeAM")[0].VALUE==""?"": moment(Moment.setTimeHHmmss(valueBind.filter((item:any) => item.KEY == "AdvTradeEndTimeAM")[0].VALUE)),
      StartTimeNoon: valueBind.filter((item:any) => item.KEY == "AdvTradeBeginTimePM")[0].VALUE==""?"": moment(Moment.setTimeHHmmss(valueBind.filter((item:any) => item.KEY == "AdvTradeBeginTimePM")[0].VALUE)),
      EndTimeNoon: valueBind.filter((item:any) => item.KEY == "AdvTradeEndTimePM")[0].VALUE==""?"": moment(Moment.setTimeHHmmss(valueBind.filter((item:any) => item.KEY == "AdvTradeEndTimePM")[0].VALUE)),

      StartTimeMorningWithdraw: valueBind.filter((item:any) => item.KEY == "AdvWithDrawBeginTimeAM")[0].VALUE==""?"": moment(Moment.setTimeHHmmss(valueBind.filter((item:any) => item.KEY == "AdvWithDrawBeginTimeAM")[0].VALUE)),
      EndTimeMorningWithdraw: valueBind.filter((item:any) => item.KEY == "AdvWithDrawEndTimeAM")[0].VALUE==""?"": moment(Moment.setTimeHHmmss(valueBind.filter((item:any) => item.KEY == "AdvWithDrawEndTimeAM")[0].VALUE)),
      StartTimeNoonWithdraw: valueBind.filter((item:any) => item.KEY == "AdvWithDrawBeginTimePM")[0].VALUE==""?"": moment(Moment.setTimeHHmmss(valueBind.filter((item:any) => item.KEY == "AdvWithDrawBeginTimePM")[0].VALUE)),
      EndTimeNoonWithdraw: valueBind.filter((item:any) => item.KEY == "AdvWithDrawEndTimePM")[0].VALUE==""?"": moment(Moment.setTimeHHmmss(valueBind.filter((item:any) => item.KEY == "AdvWithDrawEndTimePM")[0].VALUE)),
    };

    useEffect(()=>{
      
    },[])

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Sec_Place_Order_Title")}</h4>
          </CardHeader>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={onSubmit}
              className="mt-1"
              requiredMark={false}
            >
              <Row>
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("X_Trade_Config_Time_Start_Trade_Morning_Adv")}
                    name="StartTimeMorning"
                    className="ant-picker-small-custom"
                    rules={[
                      {
                        required: true,
                        message: "Giá trị không được để trống",
                      },
                    ]}
                  >
                    {/* <Input
                      size="small"
                      placeholder={t("X_Trade_Config_Time_Start_Trade_Morning_Adv")}
                      autoComplete="Off"
                    /> */}
                    <TimePicker
                    size="small"
                    className="form-control form-control-sm"
                    placeholder={t(
                      "X_Trade_Config_Time_Start_Trade_Morning_Adv"
                    )}
                    autoComplete="Off"/>
                  </Form.Item>
                </Col>
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("X_Trade_Config_Time_End_Trade_Morning_Adv")}
                    name="EndTimeMorning"
                    className="ant-picker-small-custom"
                    rules={[
                      {
                        required: true,
                        message: "Giá trị không được để trống",
                      },
                    ]}
                  >
                    {/* <Input
                      size="small"
                      placeholder={t("X_Trade_Config_Time_End_Trade_Morning_Adv")}
                      autoComplete="Off"
                    /> */}
                    <TimePicker
                    size="small"
                    className="form-control form-control-sm"
                    placeholder={t(
                      "X_Trade_Config_Time_End_Trade_Morning_Adv"
                    )}
                    autoComplete="Off"/>
                  </Form.Item>
                </Col>
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("X_Trade_Config_Time_Start_Trade_Afternoon_Adv")}
                    name="StartTimeNoon"
                    className="ant-picker-small-custom"
                    rules={[
                      {
                        required: true,
                        message: "Giá trị không được để trống",
                      },
                    ]}
                  >
                    {/* <Input
                      size="small"
                      placeholder={t("X_Trade_Config_Time_Start_Trade_Afternoon_Adv")}
                      autoComplete="Off"
                    /> */}
                    <TimePicker
                    size="small"
                    className="form-control form-control-sm"
                    placeholder={t(
                      "X_Trade_Config_Time_Start_Trade_Afternoon_Adv"
                    )}
                    autoComplete="Off"/>
                  </Form.Item>
                </Col>
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("X_Trade_Config_Time_End_Trade_Afternoon_Adv")}
                    name="EndTimeNoon"
                    className="ant-picker-small-custom"
                    rules={[
                      {
                        required: true,
                        message: "Giá trị không được để trống",
                      },
                    ]}
                  >
                    {/* <Input
                      size="small"
                      placeholder={t("X_Trade_Config_Time_End_Trade_Afternoon_Adv")}
                      autoComplete="Off"
                    /> */}
                    <TimePicker
                    size="small"
                    className="form-control form-control-sm"
                    placeholder={t(
                      "X_Trade_Config_Time_End_Trade_Afternoon_Adv"
                    )}
                    autoComplete="Off"/>
                  </Form.Item>
                </Col>
{/* Rut tien */}
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("X_Trade_Config_Time_Start_Trade_Morning_Withdraw")}
                    name="StartTimeMorningWithdraw"
                    className="ant-picker-small-custom"
                    rules={[
                      {
                        required: true,
                        message: "Giá trị không được để trống",
                      },
                    ]}
                  >
                    {/* <Input
                      size="small"
                      placeholder={t("X_Trade_Config_Time_Start_Trade_Morning_Withdraw")}
                      autoComplete="Off"
                    /> */}
                    <TimePicker
                    size="small"
                    className="form-control form-control-sm"
                    placeholder={t(
                      "X_Trade_Config_Time_Start_Trade_Morning_Withdraw"
                    )}
                    autoComplete="Off"/>
                  </Form.Item>
                </Col>
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("X_Trade_Config_Time_End_Trade_Morning_Withdraw")}
                    name="EndTimeMorningWithdraw"
                    className="ant-picker-small-custom"
                    rules={[
                      {
                        required: true,
                        message: "Giá trị không được để trống",
                      },
                    ]}
                  >
                    {/* <Input
                      size="small"
                      placeholder={t("X_Trade_Config_Time_End_Trade_Morning_Withdraw")}
                      autoComplete="Off"
                    /> */}
                    <TimePicker
                    size="small"
                    className="form-control form-control-sm"
                    placeholder={t(
                      "X_Trade_Config_Time_End_Trade_Morning_Withdraw"
                    )}
                    autoComplete="Off"/>
                  </Form.Item>
                </Col>
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("X_Trade_Config_Time_Start_Trade_Afternoon_Withdraw")}
                    name="StartTimeNoonWithdraw"
                    className="ant-picker-small-custom"
                    rules={[
                      {
                        required: true,
                        message: "Giá trị không được để trống",
                      },
                    ]}
                  >
                    {/* <Input
                      size="small"
                      placeholder={t("X_Trade_Config_Time_Start_Trade_Afternoon_Withdraw")}
                      autoComplete="Off"
                    /> */}
                    <TimePicker
                    size="small"
                    className="form-control form-control-sm"
                    placeholder={t(
                      "X_Trade_Config_Time_Start_Trade_Afternoon_Withdraw"
                    )}
                    autoComplete="Off"/>
                  </Form.Item>
                </Col>
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("X_Trade_Config_Time_End_Trade_Afternoon_Withdraw")}
                    name="EndTimeNoonWithdraw"
                    className="ant-picker-small-custom"
                    rules={[
                      {
                        required: true,
                        message: "Giá trị không được để trống",
                      },
                    ]}
                  >
                    {/* <Input
                      size="small"
                      placeholder={t("X_Trade_Config_Time_End_Trade_Afternoon_Withdraw")}
                      autoComplete="Off"
                    /> */}
                    <TimePicker
                    size="small"
                    className="form-control form-control-sm"
                    placeholder={t(
                      "X_Trade_Config_Time_End_Trade_Afternoon_Withdraw"
                    )}
                    autoComplete="Off"/>
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" className="text-center mt-2">
                  <Form.Item>
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
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default ConfigTimeAdv;
