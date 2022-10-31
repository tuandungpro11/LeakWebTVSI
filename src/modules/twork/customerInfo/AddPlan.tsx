import React, { Fragment, useState, useContext, useEffect } from "react";
import {
  Row,
  Col,
  CustomInput,
  Button,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  CardHeader,
  Label,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useContextMenu } from "react-contexify";
import {
  ChevronDown,
  Delete,
  Edit,
  File,
  Edit2,
  Home,
  List,
  Loader,
  PhoneCall,
  Search,
  PhoneForwarded,
} from "react-feather";
import {
  customSMSelectStyles,
  pageSizeTable,
  timeNoti,
} from "../types";
import { storeTwork } from "../store/storeTwork";
import { Moment } from "../../../utility/general/Moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  PaginationProps,
  Menu,
  Form,
  DatePicker,
  Input,
  TimePicker,
} from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { Vietnamese } from "flatpickr/dist/l10n/vn";
import { selectThemeColors } from "../../../utility/Utils";
import { useObserver } from "mobx-react";
import Checkbox, { CheckboxChangeEvent } from "antd/lib/checkbox";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../views/extensions/toastify/ToastTypes";
import { RangePickerProps } from "antd/lib/date-picker";
import { appStore } from "../../../stores/appStore";
import { saleStore } from "../../authorization/store/saleStore";
import { object } from "prop-types";
import Item from "antd/lib/list/Item";

var bookID = "";
const AddPlan = (valueBind: any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const { RangePicker } = DatePicker;
    const [valueCallType, setValueCallType] = useState(true);
    const [valueTVDT, setValueTVDT] = useState(false);
    const [valueHDGD, setValueHGD] = useState(false);
    const [valueTBL, setValueTBL] = useState(false);
    const [valueGTDV, setValueGTDV] = useState(false);
    const [valueMTK, setValueMTK] = useState(false);
    const [valueOther, setValueOther] = useState(false);
    const [valueNoti, setValueNoti] = useState(false);
    const [valueDate, setvalueDate] = useState(new Date());
    const [valueRemind, setValueRemind] = useState(true);
    const [valueDisableButtonAdd, setValueDisableButtonAdd] = useState(false);
    const [valueCbxStatusBookingCall, setValueCbxStatusBookingCall] =
      useState(true);
    const [valueIsDisableOtherControl, setValueIsDisableOtherControl] =
      useState(false);
    const [hasAssignSale,setHasAssignSale] = useState(false);
    const MySwal = withReactContent(Swal);

    var startTime,
      endTime,
      remindTime = "";
    const defaultValue = {
      CustomerID: "",
      FullName: "",
      Phone: "",
      txtDate: [moment(new Date()), moment(new Date())],
      txtTimeStart: moment(
        Moment.setTimeHHmmss(Moment.formatDateNew(new Date(), "HH:mm:ss"))
      ),
      txtTimeEnd: moment(
        Moment.setTimeHHmmss(Moment.formatDateNew(new Date(), "HH:mm:ss"))
      ),
      cbxTime: timeNoti[0],
      cbxStatusBookingCall: storeTwork.dataListStatusBookingCall[0],
      txtCreateBy: saleStore.dataListSale.length > 0 ? saleStore.dataListSale[0] : ""
    };
    const resetForm = () => {
      form.resetFields();
      setValueTVDT(false);
      setValueHGD(false);
      setValueTBL(false);
      setValueGTDV(false);
      setValueMTK(false);
      setValueOther(false);
      setValueDisableButtonAdd(false);
      setValueCbxStatusBookingCall(true);
      setValueIsDisableOtherControl(false);
    };
    const onChangeType = (e: CheckboxChangeEvent) => {
      setValueCallType(e.target.checked);
    };
    const onChangeTVDT = (e: CheckboxChangeEvent) => {
      setValueTVDT(e.target.checked);
    };
    const onChangeHDGD = (e: CheckboxChangeEvent) => {
      setValueHGD(e.target.checked);
    };
    const onChangeTBL = (e: CheckboxChangeEvent) => {
      setValueTBL(e.target.checked);
    };
    const onChangeGTDV = (e: CheckboxChangeEvent) => {
      setValueGTDV(e.target.checked);
    };
    const onChangeMTK = (e: CheckboxChangeEvent) => {
      setValueMTK(e.target.checked);
    };
    const onChangeOther = (e: CheckboxChangeEvent) => {
      setValueOther(e.target.checked);
    };
    const onChangeNoti = (e: CheckboxChangeEvent) => {
      setValueRemind(e.target.checked);
    };
    const onAddPlan = () => {
      console.log(form.getFieldsValue());
    };

    const addPlan = () => {
      storeTwork.isCallApiSuccess = false;
      const valueForm = form.getFieldsValue();
      if(valueForm.txtDate[0] ==null || valueForm.txtDate[1] == null){
        toast(
          ErrorToast("Thời gian từ ngày -  đến ngày không được để trống")
        );
        return;
      }
      const startDateCheck =
        Moment.formatDateNew(valueForm.txtDate[0], "yyyy-MM-DD") +
        " " +
        Moment.formatDateNew(valueForm.txtTimeStart._d, "HH:mm");
      const endDateCheck =
        Moment.formatDateNew(valueForm.txtDate[1], "yyyy-MM-DD") +
        " " +
        Moment.formatDateNew(valueForm.txtTimeEnd._d, "HH:mm:ss");
      if (new Date(startDateCheck) < new Date()) {
        toast(
          ErrorToast("Thời gian bắt đầu không được nhỏ hơn thời gian hiện tại")
        );
        return;
      }
      if (new Date(endDateCheck) < new Date()) {
        toast(
          ErrorToast("Thời gian kết thúc không được nhỏ hơn thời gian hiện tại")
        );
        return;
      }
      if (new Date(startDateCheck) > new Date(endDateCheck)) {
        toast(
          ErrorToast("Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu")
        );
        return;
      }
      MySwal.fire({
        html: "Bạn có chắc chắn thêm lịch đặt cuộc gọi này không?",
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
          var callType = "";
          if (valueTVDT) {
            if (callType == "") {
              callType = "1"; //tam thoi de gia tri la 1
            } else {
              callType = callType + ",1";
            }
          }
          if (valueHDGD) {
            if (callType == "") {
              callType = "2"; //tam thoi de gia tri la 2
            } else {
              callType = callType + ",2";
            }
          }
          if (valueTBL) {
            if (callType == "") {
              callType = "3"; //tam thoi de gia tri la 3
            } else {
              callType = callType + ",3";
            }
          }
          if (valueGTDV) {
            if (callType == "") {
              callType = "4"; //tam thoi de gia tri la 4
            } else {
              callType = callType + ",4";
            }
          }
          if (valueMTK) {
            if (callType == "") {
              callType = "5"; //tam thoi de gia tri la 4
            } else {
              callType = callType + ",5";
            }
          }
          if (valueOther) {
            if (callType == "") {
              callType = "6"; //tam thoi de gia tri la 6
            } else {
              callType = callType + ",6";
            }
          }
          startTime =
            Moment.formatDateNew(valueForm.txtDate[0], "yyyy-MM-DD") +
            " " +
            Moment.formatDateNew(valueForm.txtTimeStart._d, "HH:mm:ss");
          endTime =
            Moment.formatDateNew(valueForm.txtDate[1], "yyyy-MM-DD") +
            " " +
            Moment.formatDateNew(valueForm.txtTimeEnd._d, "HH:mm:ss");
          if (valueRemind) {
            const date = new Date(startTime);
            remindTime = remindTime =
              Moment.formatDateNew(
                new Date(
                  date.setMinutes(date.getMinutes() - valueForm.cbxTime.value)
                ),
                "yyyy-MM-DD HH:mm:ss"
              ) || "";
          } else {
            remindTime = "";
          }
          const param = {
            UserName: appStore.account?.LoginName,
            UserRole: "CRM_SALE",
            CallAppTypeList: callType,
            StartTime: startTime,
            EndTime: endTime,
            RemindTime: remindTime,
            Description: valueForm.Note == undefined ? "" : valueForm.Note,
            BookCallType: 1,
            AssignUser: valueForm.txtCreateBy == undefined? appStore.account.LoginName: valueForm.txtCreateBy.LoginName,
            CustCode: valueBind.valueBind.CustCode,
            LeadId: valueBind.valueBind.LeadId,
            OpenAccId: valueBind.valueBind.OpenAccId,
            CustName: valueBind.valueBind.CustName,
            Mobile: valueBind.valueBind.PhoneNumber_01,
          };
          storeTwork.addPlan(param);
        }
      });
    };

    const getHistoryPlan = () => {
      const param = {
        UserName: appStore.account?.LoginName,
        UserRole: "CRM_SALE",
        CustCode: valueBind.valueBind.CustCode,
        SaleId: "",
        CustType: -1,
        FromDate: "",
        ToDate: "",
        StateStatus: 0,
        PageIndex: storeTwork.pageIndexHistoryPlanDetail,
        PageSize: storeTwork.pageSizeHistoryPlanDetail,
      };
      storeTwork.getHistoryPlanDetail(param);
    };

    const updatePlan = () => {
      const valueForm = form.getFieldsValue();
      storeTwork.isCallApiSuccess = false;
      if(valueForm.txtDate == undefined){
        toast(
        ErrorToast(
          "Từ ngày đến ngày không được để trống"
        )
      );
        return;
      }
      if(valueForm.txtTimeStart == undefined){
        toast(
        ErrorToast(
          "Thời gian bắt đầu không được để trống"
        )
      );
        return;
      }
      if(valueForm.txtTimeEnd == undefined){
        toast(
          ErrorToast(
            "Thời gian kết thúc không được để trống"
          )
        );
        return;
      }

      if (storeTwork.dataPlanInfo == null) {
        toast.error(ErrorToast("Không có bản ghi nào để cập nhật"));
      }
      if (storeTwork.dataPlanInfo[0].StatusState == "Chưa đến hạn") {
        const startDateCheck =
          Moment.formatDateNew(valueForm.txtDate[0], "yyyy-MM-DD") +
          " " +
          Moment.formatDateNew(valueForm.txtTimeStart._d, "HH:mm");
        const endDateCheck =
          Moment.formatDateNew(valueForm.txtDate[1], "yyyy-MM-DD") +
          " " +
          Moment.formatDateNew(valueForm.txtTimeEnd._d, "HH:mm:ss");
        if (new Date(startDateCheck) < new Date()) {
          toast(
            ErrorToast(
              "Thời gian bắt đầu không được nhỏ hơn thời gian hiện tại"
            )
          );
          return;
        }
        if (new Date(endDateCheck) < new Date()) {
          toast(
            ErrorToast(
              "Thời gian kết thúc không được nhỏ hơn thời gian hiện tại"
            )
          );
          return;
        }
        if (new Date(startDateCheck) > new Date(endDateCheck)) {
          toast(
            ErrorToast(
              "Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu"
            )
          );
          return;
        }
      }
      var callType = "";
      if (valueTVDT) {
        if (callType == "") {
          callType = "1"; //tam thoi de gia tri la 1
        } else {
          callType = callType + ",1";
        }
      }
      if (valueHDGD) {
        if (callType == "") {
          callType = "2"; //tam thoi de gia tri la 2
        } else {
          callType = callType + ",2";
        }
      }
      if (valueTBL) {
        if (callType == "") {
          callType = "3"; //tam thoi de gia tri la 3
        } else {
          callType = callType + ",3";
        }
      }
      if (valueGTDV) {
        if (callType == "") {
          callType = "4"; //tam thoi de gia tri la 4
        } else {
          callType = callType + ",4";
        }
      }
      if (valueMTK) {
        if (callType == "") {
          callType = "5"; //tam thoi de gia tri la 4
        } else {
          callType = callType + ",5";
        }
      }
      if (valueOther) {
        if (callType == "") {
          callType = "6"; //tam thoi de gia tri la 6
        } else {
          callType = callType + ",6";
        }
      }
      startTime =
        Moment.formatDateNew(valueForm.txtDate[0], "yyyy-MM-DD") +
        " " +
        Moment.formatDateNew(valueForm.txtTimeStart._d, "HH:mm:ss");
      endTime =
        Moment.formatDateNew(valueForm.txtDate[1], "yyyy-MM-DD") +
        " " +
        Moment.formatDateNew(valueForm.txtTimeEnd._d, "HH:mm:ss");
      if (valueRemind) {
        const date = new Date(startTime);
        remindTime =
          Moment.formatDateNew(
            new Date(
              date.setMinutes(date.getMinutes() - valueForm.cbxTime.value)
            ),
            "yyyy-MM-DD HH:mm:ss"
          ) || "";
      } else {
        remindTime = "";
      }
      const param = {
        UserName: appStore.account?.LoginName,
        UserRole: "CRM_SALE",
        BookApptCallId: bookID,
        CallAppTypeList: callType,
        StartTime: startTime,
        EndTime: endTime,
        RemindTime: remindTime,
        Description: valueForm.Note == undefined ? "" : valueForm.Note,
        BookCallType: 1,
        AssignUser: valueForm.txtCreateBy == undefined? appStore.account.LoginName: valueForm.txtCreateBy.LoginName,
        Status: valueForm.cbxStatusBookingCall.Value,
      };
      storeTwork.UpdPlan(param);
      storeTwork.dataPlanInfo = [];
    };

    const disabledDate: RangePickerProps["disabledDate"] = (current) => {
      // Can not select days before today and today
      return current < moment().startOf("day");
    };

    useEffect(() => {
      if (storeTwork.isCallApiSuccess == true) {
        getHistoryPlan();
        form.resetFields();
        resetForm();
      }
    }, [storeTwork.isCallApiSuccess]);
    useEffect(() => {    

      if(appStore.account?.HasAssignSale>0){
        setHasAssignSale(true);
      }
      //lấy danh sách sale thuộc quyền quản lý
      const paramSale ={
        UserName: appStore.account?.LoginName,
        FunctionCode: "IW_CA_Customer"
      }
      saleStore.getAllUserInfosForMakePlan(paramSale);
      //lay danh sách booking
      const param = {
        UserName: appStore.account?.LoginName,
        UserRole: "CRM_SALE",
      };
      storeTwork.getListStatusBookingCall(param);
    }, []);
    useEffect(() => {
      if (storeTwork.dataListStatusBookingCall.length > 0) {
        if (storeTwork.dataPlanInfo.length > 0) {
          form.setFieldsValue({
            cbxStatusBookingCall: storeTwork.dataListStatusBookingCall.filter(
              (item) => item.Value == storeTwork.dataPlanInfo[0].Status
            )[0],
          });
        } else {
          form.setFieldsValue({
            cbxStatusBookingCall: storeTwork.dataListStatusBookingCall[0],
          });
        }
      }
    }, [storeTwork.dataListStatusBookingCall]);

    //su kien khi an nut chi tiet tu table
    useEffect(() => {
      const dataBind = storeTwork.dataPlanInfo;

      if (dataBind.length > 0) {
        if(Object.keys(saleStore.dataListSale).length > 0){
          if(appStore.account?.HasAssignSale>0){
            setHasAssignSale(true);
          }
        }else{
          setHasAssignSale(false)
        }
        setValueCallType(true);
        //binding phan loai
        if (dataBind[0].CallAppTypeList != null) {
          const tempType = dataBind[0].CallAppTypeList.split(",");
          if (tempType.length > 0) {
            tempType.map((Item) => {
              if (Item == "1") {
                setValueTVDT(true);
              }
              if (Item == "2") {
                setValueHGD(true);
              }
              if (Item == "3") {
                setValueTBL(true);
              }
              if (Item == "4") {
                setValueGTDV(true);
              }
              if (Item == "5") {
                setValueMTK(true);
              }
              if (Item == "6") {
                setValueOther(true);
              }
            });
          } else {
            setValueCallType(false);
          }
        }
        //binding danh gia
        form.setFieldsValue({
          Note: dataBind[0].Description,
        });
        form.setFieldsValue({
          txtCreateBy: dataBind[0].CreatedName,
        });
        form.setFieldsValue({
          txtDate: [moment(dataBind[0].StartTime), moment(dataBind[0].EndTime)],
        });
        form.setFieldsValue({
          txtTimeStart: moment(
            Moment.setTimeHHmmss(
              Moment.formatDateNew(dataBind[0].StartTime, "HH:mm:ss")
            )
          ),
        });
        form.setFieldsValue({
          txtTimeEnd: moment(
            Moment.setTimeHHmmss(
              Moment.formatDateNew(dataBind[0].EndTime, "HH:mm:ss")
            )
          ),
        });
        if (dataBind[0].RemindTime != "") {
          setValueRemind(true);
          const remind =
            (new Date(dataBind[0].StartTime).getTime() -
              new Date(dataBind[0].RemindTime).getTime()) /
            60000;
          form.setFieldsValue({
            cbxTime: timeNoti.filter(
              (item) => parseInt(item.value) == remind
            )[0],
          });
        }
        console.log(storeTwork.dataListStatusBookingCall);

        form.setFieldsValue({
          cbxStatusBookingCall: storeTwork.dataListStatusBookingCall.filter(
            (item) => item.Value == dataBind[0].Status
          )[0],
        });
        bookID = dataBind[0].BookApptCallId;
        //disable cac control
        if (
          dataBind[0].Status == 0 &&
          dataBind[0].StatusState == "Chưa đến hạn"
        ) {
          setValueIsDisableOtherControl(false);
          setValueCbxStatusBookingCall(false);
        }
        if (dataBind[0].Status == 1 || dataBind[0].StatusState == "Quá hạn") {
          setValueIsDisableOtherControl(true);
          setValueCbxStatusBookingCall(false);
        }

        setValueDisableButtonAdd(true);
        setValueCbxStatusBookingCall(false);
      }
    }, [storeTwork.dataPlanInfo]);

    useEffect(()=>{
      if(Object.keys(saleStore.dataListSale).length > 0){
        form.setFieldsValue({
          txtCreateBy: saleStore.dataListSale.filter(item => item.LoginName === appStore.account.LoginName)[0],
        });
      }
    },[saleStore.dataListSale])

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("twork_plan_title")}</h4>
          </CardHeader>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={addPlan}
              requiredMark={false}
            >
              <Row id="filterSection" className="filterSection">
                <Col lg="24" md="24" xs="24">
                  <Form.Item name="chkChangeType">
                    <Checkbox
                      onChange={onChangeType}
                      defaultChecked={true}
                      className="twork-check-box"
                      disabled={valueIsDisableOtherControl}
                    >
                      {t("twork_call_type")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="8" md="8" hidden={!valueCallType}>
                  <Form.Item name="chkTVDT">
                    <Checkbox
                      onChange={onChangeTVDT}
                      checked={valueTVDT}
                      className="twork-check-box"
                      disabled={valueIsDisableOtherControl}
                    >
                      {t("twork_tvdt")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="8" md="8" hidden={!valueCallType}>
                  <Form.Item name="chkHDGD">
                    <Checkbox
                      onChange={onChangeHDGD}
                      checked={valueHDGD}
                      className="twork-check-box"
                      disabled={valueIsDisableOtherControl}
                    >
                      {t("twork_hdgd")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="8" md="8" hidden={!valueCallType}>
                  <Form.Item name="chkTBL">
                    <Checkbox
                      onChange={onChangeTBL}
                      checked={valueTBL}
                      className="twork-check-box"
                      disabled={valueIsDisableOtherControl}
                    >
                      {t("twork_tbl")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="8" md="8" hidden={!valueCallType}>
                  <Form.Item name="chkGTDV">
                    <Checkbox
                      onChange={onChangeGTDV}
                      checked={valueGTDV}
                      className="twork-check-box"
                      disabled={valueIsDisableOtherControl}
                    >
                      {t("twork_gtdv")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="8" md="8" hidden={!valueCallType}>
                  <Form.Item name="chkMTK">
                    <Checkbox
                      onChange={onChangeMTK}
                      checked={valueMTK}
                      className="twork-check-box"
                      disabled={valueIsDisableOtherControl}
                    >
                      {t("twork_mkt")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="8" md="8" hidden={!valueCallType}>
                  <Form.Item name="chkOther">
                    <Checkbox
                      onChange={onChangeOther}
                      checked={valueOther}
                      className="twork-check-box"
                      disabled={valueIsDisableOtherControl}
                    >
                      {t("twork_other")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" xs="24">
                  <Form.Item label={t("X_Trade_Note")} name="Note">
                    <Input
                      placeholder={t("X_Trade_Note")}
                      autoComplete="off"
                      disabled={valueIsDisableOtherControl}
                    />
                  </Form.Item>
                </Col>
                <Col lg="24" md="24">
                  <Form.Item
                    label={t("X_Trade_Date_Range")}
                    name="txtDate"
                    labelCol={{ span: 16 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Từ ngày đến ngày không được để trống",
                      },
                    ]}
                  >
                    <RangePicker
                      locale={locale}
                      allowEmpty={[true, true]}
                      format={"DD-MM-yyyy"}
                      size="small"
                      style={{ width: "100%" }}
                      className="ant-picker-small-custom"
                      disabledDate={disabledDate}
                      disabled={valueIsDisableOtherControl}
                    />
                  </Form.Item>
                </Col>
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("twork_time_start")}
                    name="txtTimeStart"
                    className="ant-picker-small-custom"
                    labelCol={{ span: 16 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Thời gian bắt đầu không được để trống",
                      },
                    ]}
                  >
                    <TimePicker
                      className="form-control form-control-sm"
                      size="small"
                      placeholder={t("twork_time_start")}
                      autoComplete="Off"
                      disabled={valueIsDisableOtherControl}
                    />
                  </Form.Item>
                </Col>
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("twork_time_end")}
                    name="txtTimeEnd"
                    className="ant-picker-small-custom"
                    labelCol={{ span: 16 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Thời gian kết thúc không được để trống",
                      },
                    ]}
                  >
                    <TimePicker
                      className="form-control form-control-sm"
                      size="small"
                      placeholder={t("twork_time_end")}
                      autoComplete="Off"
                      disabled={valueIsDisableOtherControl}
                    />
                  </Form.Item>
                </Col>
                <Col lg="7" md="7" xs="7" style={{ paddingRight: "0" }}>
                  <Form.Item name="chkNoti">
                    <Checkbox
                      onChange={onChangeNoti}
                      checked={valueRemind}
                      style={{ width: "50% !important" }}
                      className="twork-check-box"
                      disabled={valueIsDisableOtherControl}
                    >
                      {t("twork_noti_remind")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="5" md="5" xs="5">
                  <Form.Item name="cbxTime">
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      options={timeNoti}
                      defaultValue={timeNoti[0]}
                      isClearable={false}
                      styles={customSMSelectStyles}
                      isDisabled={valueIsDisableOtherControl}
                    />
                  </Form.Item>
                </Col>
                <Col lg="5" md="5" style={{ paddingRight: "0" }}>
                  <Form.Item
                    label={t("X_Trade_Status")}
                    labelAlign="left"
                    className="twork-check-box"
                    style={{ paddingTop: "0.5vh" }}
                  ></Form.Item>
                </Col>
                <Col lg="7" md="7" xs="7">
                  <Form.Item name="cbxStatusBookingCall">
                    {storeTwork.dataListStatusBookingCall.length > 0 ? (
                      <Select
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        options={storeTwork.dataListStatusBookingCall}
                        defaultValue={storeTwork.dataListStatusBookingCall[0]}
                        getOptionLabel={(option) => option.Text}
                        getOptionValue={(option) => option.Value}
                        isClearable={false}
                        styles={customSMSelectStyles}
                        placeholder={"Chọn trạng thái..."}
                        noOptionsMessage={() => "Không có dữ liệu...."}
                        isDisabled={valueCbxStatusBookingCall}
                      />
                    ) : (
                      <></>
                    )}
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" xs="24">
                  <Form.Item
                    label={t("t_work_work_by")}
                    name="txtCreateBy"
                    rules={[
                      {
                        required: true,
                        message: "Người thực hiện không được để trống",
                      },
                    ]}
                  >
                    {saleStore.dataListSale.length>0 ?(
                    <Select
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        options={saleStore.dataListSale}
                        getOptionLabel={(option) => option.LoginName + " - " + option.DisplayName}
                        getOptionValue={(option) => option.LoginName}
                        isClearable={false}
                        styles={customSMSelectStyles}
                        placeholder={"Chọn SaleID..."}
                        isDisabled={!hasAssignSale} 
                      />):(
                        <Select
                            theme={selectThemeColors}
                            className="react-select react-select-sm"
                            classNamePrefix="select"
                            options={saleStore.dataListSale}
                            isClearable={false}
                            styles={customSMSelectStyles}
                            placeholder={"Chọn SaleID..."}
                            isDisabled={!hasAssignSale} 
                          />)}
                  </Form.Item>
                </Col>
              </Row>
              <Col lg="24" md="24" className="text-center">
                <Form.Item className="text-center mt-2">
                  <Button
                    className="btn btn-gradient-info"
                    color="gradient-info"
                    htmlType="submit"
                    hidden={valueDisableButtonAdd}
                    // onClick={addPlan}
                  >
                    {t("X_Trade_Button_Add_New")}
                  </Button>{" "}
                  <Button
                    className="btn btn-gradient-info"
                    color="gradient-info"
                    htmlType="button"
                    hidden={!valueDisableButtonAdd}
                    onClick={updatePlan}
                  >
                    {t("Button_Update")}
                  </Button>{" "}
                  <Button
                    htmlType="button"
                    className="btn btn-gradient-secondary"
                    color="gradient-secondary"
                    onClick={resetForm}
                  >
                    {t("X_Trade_Button_Reset")}
                  </Button>{" "}
                </Form.Item>
              </Col>
            </Form>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default AddPlan;
