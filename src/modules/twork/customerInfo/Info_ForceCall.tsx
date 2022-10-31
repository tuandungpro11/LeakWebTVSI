import React, {
  Fragment,
  useState,
  useContext,
  useEffect,
  createRef,
  useRef,
} from "react";
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
import { Item, useContextMenu } from "react-contexify";
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
  Star,
} from "react-feather";
import { customSMSelectStyles, pageSizeTable } from "../types";
import { storeTwork } from "../store/storeTwork";
import { Moment } from "../../../utility/general/Moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import PerfectScrollbar from "react-perfect-scrollbar";
import { PaginationProps, Menu, Form, DatePicker, Input } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { Vietnamese } from "flatpickr/dist/l10n/vn";
import { selectThemeColors } from "../../../utility/Utils";
import { useObserver } from "mobx-react";
import Checkbox, { CheckboxChangeEvent } from "antd/lib/checkbox";
import Rating from "react-rating";
import { ThemeColors } from "@src/utility/context/ThemeColors";
import Avatar from "@components/avatar";
import avatarImg from "@src/assets/images/portrait/small/avatar-s-20.jpg";
import avatarImgMen from "@src/assets/images/portrait/small/avatar-s-5.jpg";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../views/extensions/toastify/ToastTypes";
import { setConstantValue } from "typescript";
import { appStore } from "../../../stores/appStore";
import styled from "@emotion/styled";
import TextArea from "antd/lib/input/TextArea";

declare var StringeeClient: any;
declare var StringeeCall: any;

var stringeeClient: any;
declare var StringeeUtil: any;

var call: any;
var timeout_stats: any;
var authenticatedWithUserId = "";
var id: any;
var time = "00:00";
var timeCall = "00:00";
var callIdStringee = "";
var TVDTGlobal = false;
var HDGDGlobal = false;
var TBLGlobal = false;
var GTDVGlobal = false;
var MTKGlobal = false;
var OtherGlobal = false;
var rateGlobal = 5;

const Info_ForceCall = (valueBind: any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueCallType, setValueCallType] = useState(false);
    const [valueTVDT, setValueTVDT] = useState(false);
    const [valueHDGD, setValueHGD] = useState(false);
    const [valueTBL, setValueTBL] = useState(false);
    const [valueGTDV, setValueGTDV] = useState(false);
    const [valueMTK, setValueMTK] = useState(false);
    const [valueOther, setValueOther] = useState(false);
    const [valueRate, setValueRate] = useState(false);
    const [changeCheckDevices, setCheckDevices] = useState(false);
    const [valueShowButtonEndCall, setValueShowButtonEndCall] = useState(false);
    const [valueShowRate, setValueShowRate] = useState(false);
    const [valueTimeTick, setValueTimeTick] = useState(false);
    const [valueShowTime, setValueShowTime] = useState("00:00");
    const [valueRatePoint, setValueRatePoint] = useState(5);
    const [valueEnableButtonCall, setValueEnableButtonCall] = useState(false);
    const [currentStreamRemote, setCurrentStreamRemote] = useState();
    const [currentStreamLocal, seccurrentStreamLocal] = useState();
    const MySwal = withReactContent(Swal);

    const defaultValue = {
      CustomerID: "",
      FullName: "",
      Phone: "",
    };
    const themeColors = useContext(ThemeColors);
    const resetForm = () => {
      form.resetFields();
    };
    const onChangeType = (e: CheckboxChangeEvent) => {
      setValueCallType(e.target.checked);
    };
    const onChangeTVDT = (e: CheckboxChangeEvent) => {
      setValueTVDT(e.target.checked);
      TVDTGlobal = e.target.checked;
    };
    const onChangeHDGD = (e: CheckboxChangeEvent) => {
      setValueHGD(e.target.checked);
      HDGDGlobal = e.target.checked;
    };
    const onChangeTBL = (e: CheckboxChangeEvent) => {
      setValueTBL(e.target.checked);
      TBLGlobal = e.target.checked;
    };
    const onChangeGTDV = (e: CheckboxChangeEvent) => {
      setValueGTDV(e.target.checked);
      GTDVGlobal = e.target.checked;
    };
    const onChangeMTK = (e: CheckboxChangeEvent) => {
      setValueMTK(e.target.checked);
      MTKGlobal = e.target.checked;
    };
    const onChangeOther = (e: CheckboxChangeEvent) => {
      setValueOther(e.target.checked);
      OtherGlobal = e.target.checked;
    };
    const onChangeRate = (e: CheckboxChangeEvent) => {
      setValueRate(e.target.checked);
    };

    const checkDevice = () => {
      var checkmic;
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        checkmic = devices.filter((x) => x.kind == "audioinput");
        if (checkmic.length > 0) {
          setCheckDevices(true);
        } else {
          setCheckDevices(false);
        }
      });
    };
    const loginStringee = () => {
      console.log(
        "StringeeUtil.isWebRTCSupported: " + StringeeUtil.isWebRTCSupported()
      );
      stringeeClient = new StringeeClient();
      settingClientEvents(stringeeClient);
      stringeeClient.connect(storeTwork.accessToken);
    };
    const settingClientEvents = (client: any) => {
      client.on("connect", function () {
        console.log("connected to StringeeServer");
      });

      client.on("authen", function (res: any) {
        console.log("on authen: ", res);
        if (res.r === 0) {
          //check goi ngay
          if (valueBind.valueBind.forceCall == true) {
            //goi ngay
            makeCall(valueBind.valueBind.numberForceCall);
          }
        } else {
        }
      });

      client.on("disconnect", function () {
        console.log("disconnected");
      });

      client.on("incomingcall", function (incomingcall: any) {
        call = incomingcall;
        settingCallEvents(incomingcall);

        console.log("incomingcall: ", incomingcall);
      });

      client.on("requestnewtoken", function () {
        console.log(
          "request new token; please get new access_token from YourServer and call client.connect(new_access_token)"
        );
        //please get new access_token from YourServer and call:
        //client.connect(new_access_token);
      });
    };
    const settingCallEvents = (call1: any) => {
      console.log("call1 ", call1);
      call1.on("error", function (info: any) {
        console.log("on error: " + JSON.stringify(info));
      });

      call1.on("addlocalstream", function (stream: any) {
        console.log("on addlocalstream", stream);
        document.getElementById("localVideo")?.append(stream);
        // document.getElementById("localVideo")?.srcObject = stream;
        seccurrentStreamLocal(stream);
      });

      call1.on("addremotestream", function (stream: any) {
        console.log("on addremotestream", stream);
        // document.getElementById("remoteVideo")?.srcObject = stream;
        setCurrentStreamRemote(stream);
        //remoteAudio.srcObject = stream;
        // reset srcObject to work around minor bugs in Chrome and Edge
      });

      call1.on("signalingstate", function (state: any) {
        console.log("signalingstate", state);
        if (state.code == 3) {
          //Khach hang nghe may
          setValueTimeTick(true);
        }

        if (state.code == 6) {
          //call ended
          // callStopped();

          callIdStringee = call.callId;
          updateCallInfo(callIdStringee);
          setValueTimeTick(false); //ngat dem thoi gian cuoc goi
          setValueEnableButtonCall(false);
          setValueShowButtonEndCall(false);
          storeTwork.isInCall = false;
          // getHistoryCall();
        }

        if (state.code == 5) {
          //busy here
          // callStopped();
          setValueTimeTick(false);
          setValueShowButtonEndCall(false);
          setValueEnableButtonCall(false);
          getHistoryCall();
          storeTwork.isInCall = false;
        }

        var reason = state.reason;
        console.log("reason: ", reason);
      });

      call1.on("mediastate", function (state: any) {
        console.log("mediastate ", state);
      });

      call1.on("info", function (info: any) {
        console.log("on info", info);
      });

      call1.on("otherdevice", function (data: any) {
        console.log("on otherdevice:" + JSON.stringify(data));

        if (
          (data.type === "CALL_STATE" && data.code >= 200) ||
          data.type === "CALL_END"
        ) {
        }
      });
    };
    const makeCall = (phoneNumber: any) => {
      //clear dữ liệu để tạo call mới
      timeCall = "00:00";
      setValueShowRate(true);
      setValueCallType(true);
      setValueRate(true);

      setValueTVDT(false);
      TVDTGlobal = false;

      setValueHGD(false);
      HDGDGlobal = false;

      setValueTBL(false);
      TBLGlobal = false;

      setValueGTDV(false);
      GTDVGlobal = false;

      setValueMTK(false);
      MTKGlobal = false;

      setValueOther(false);
      OtherGlobal = false;

      setValueRatePoint(5);
      rateGlobal = 5;

      // form.setFieldsValue({ Note: "" });
      form.setFieldsValue({ rateNote: "" });
      //check thiết bị
      var checkmic;
      if (changeCheckDevices == false) {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          checkmic = devices.filter((x) => x.kind == "audioinput");
          if (checkmic.length > 0) {
            if (phoneNumber == "") {
              toast.error(ErrorToast("Số điện thoại không hợp lệ"));
              return;
            }
            storeTwork.isInCall = true;
            //tạo call
            const fromNumber = "ADAPTIVENUMBER";
            const toNumber = phoneNumber;
            // const toNumber = "0968349472";

            call = new StringeeCall(
              stringeeClient,
              fromNumber,
              toNumber,
              false
            );
            settingCallEvents(call);
            call.makeCall(function (res: any) {
              console.log("make call callback: " + JSON.stringify(res));
              if (res.r !== 0) {
                toast.error(ErrorToast(res.message));
              } else {
                //make call success
                //tao ban ghi vao lich su
                callIdStringee = call.callId;
                createCall(callIdStringee, toNumber);
                setValueShowButtonEndCall(true);
                setValueShowRate(true);
                setValueEnableButtonCall(true);
              }
            });
          } else {
            if (changeCheckDevices == false) {
              toast.error(ErrorToast("Không tìm thấy thiết bị Micro"));
              return;
            }
          }
        });
      }
    };
    const endCall = () => {
      MySwal.fire({
        html: "Bạn có muốn kết thúc cuộc gọi này không?",
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
          call.hangup(function (res: any) {
            console.log("hangup res", res);
            storeTwork.isInCall = false;

            setValueEnableButtonCall(false);
            setValueShowButtonEndCall(false);
            callIdStringee = call.callId;
            updateCallInfo(callIdStringee);
            setValueTimeTick(false);
            // getHistoryCall();
          });
        }
      });
    };

    const createCall = (callId: any, phone: any) => {
      const valueForm = form.getFieldsValue();
      storeTwork.isCallApiSuccess = false;
      const param = {
        UserName: appStore.account?.LoginName,
        UserRole: "CRM_SALE",
        CallId: callId,
        CustCode: valueForm.customerId,
        LeadId: valueBind.valueBind.valueUpdate.LeadId,
        OpenAccId: valueBind.valueBind.valueUpdate.OpenAccId,
        CustName: "Mr. Bùi Đình Đức",
        Direction: 0,
        Status: 1, //gọi nhỡ.
        Mobile: phone,
      };
      storeTwork.addCallInfo(param);
    };
    const updateCallInfo = (callId: any) => {
      const valueForm = form.getFieldsValue();
      storeTwork.isCallApiSuccess = false;
      var callType = "";
      if (TVDTGlobal) {
        if (callType == "") {
          callType = "1"; //tam thoi de gia tri la 1
        } else {
          callType = callType + ",1";
        }
      }
      if (HDGDGlobal) {
        if (callType == "") {
          callType = "2"; //tam thoi de gia tri la 2
        } else {
          callType = callType + ",2";
        }
      }
      if (TBLGlobal) {
        if (callType == "") {
          callType = "3"; //tam thoi de gia tri la 3
        } else {
          callType = callType + ",3";
        }
      }
      if (GTDVGlobal) {
        if (callType == "") {
          callType = "4"; //tam thoi de gia tri la 4
        } else {
          callType = callType + ",4";
        }
      }
      if (MTKGlobal) {
        if (callType == "") {
          callType = "5"; //tam thoi de gia tri la 4
        } else {
          callType = callType + ",5";
        }
      }
      if (OtherGlobal) {
        if (callType == "") {
          callType = "6"; //tam thoi de gia tri la 6
        } else {
          callType = callType + ",6";
        }
      }
      const param = {
        UserName: appStore.account?.LoginName,
        UserRole: "CRM_SALE",
        CallId: callId,
        Note: valueForm.Note == undefined ? "" : valueForm.Note,
        Comment: valueForm.rateNote == undefined ? "" : valueForm.rateNote,
        Rate: rateGlobal,
        CallAppTypeList: callType,
        Status: valueShowTime == "00:00" ? 1 : 2, //đã nghe máy
        TimeCall: timeCall,
      };
      storeTwork.updateCallInfo(param);

      // setValueTimeTick(false);
      // setValueShowButtonEndCall(false);
      // setValueShowRate(false);
    };

    const onSubmitInfoCust = () => {
      // callIdStringee = call.callId;
      if (callIdStringee == undefined || callIdStringee == "") {
        toast(ErrorToast("Call Id không tồn tại"));
        return;
      }
      updateCallInfo(callIdStringee);
      if (!valueTimeTick && !valueShowButtonEndCall) {
        setValueShowRate(false); //an phan danh gia
        setValueCallType(false); //an phan danh gia
        setValueRate(false); //an phan danh gia
        setValueCallType(false); //an danh gia
        setValueRate(false); //an danh gia
        //clear thong tin cho cuoc goi moi
        setValueTVDT(false);
        TVDTGlobal = false;
        setValueHGD(false);
        HDGDGlobal = false;
        setValueTBL(false);
        TBLGlobal = false;
        setValueGTDV(false);
        GTDVGlobal = false;
        setValueMTK(false);
        MTKGlobal = false;
        setValueOther(false);
        OtherGlobal = false;
        setValueRatePoint(5);
        rateGlobal = 5;
        // form.setFieldsValue({ Note: "" });
        callIdStringee = "";
      }
      // getHistoryCall();
    };
    const getHistoryCall = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account?.LoginName,
        UserRole: "CRM_SALE",
        CustCode: valueForm.customerId,
        SaleId: "",
        CustType: -1,
        FromDate: "",
        ToDate: "",
        LeadId: 0,
        PageIndex: storeTwork.pageIndexHistoryCallDetail,
        PageSize: storeTwork.pageSizeHistoryCallDetail,
      };
      storeTwork.getHistoryCallDetail(param);
    };

    const encodePhoneNumber = (phoneNumber: string) => {
      return phoneNumber.substring(0, 5) + "*****";
    };
    const getCommentByAccount = () => {
      const param = {
        UserName: appStore.account?.LoginName,
        CustCode: valueBind.valueBind.valueUpdate.TypeCustomerName === "Khách hàng" ? valueBind.valueBind.valueUpdate.CustCode : "",
        LeadID: valueBind.valueBind.valueUpdate.TypeCustomerName === "Khách hàng tiềm năng" ? valueBind.valueBind.valueUpdate.LeadId : 0,
        OpenAccId: valueBind.valueBind.valueUpdate.TypeCustomerName !=="Khách hàng" && valueBind.valueBind.valueUpdate.TypeCustomerName !== "Khách hàng tiềm năng" ? valueBind.valueBind.valueUpdate.OpenAccId : 0
      };
      storeTwork.getCommentByAccount(param);
    };

    const addComment = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account?.LoginName,
        CustCode: valueForm.customerId,
        LeadID: valueBind.valueBind.valueUpdate.LeadId,
        Content: valueForm.Note,
        FullName:valueBind.valueBind.valueUpdate.CustName,
        OpenAccId: valueBind.valueBind.valueUpdate.OpenAccId,
        Rate: 0,
      };
      storeTwork.addCommentByAccount(param);
    };

    useEffect(() => {
      // checkDevice();
      //connect tringee
      // var param = { UserID: valueBind.valueBind.valueUpdate.CustCode, Phone: valueBind.valueBind.valueUpdate.PhoneNumber_01 };
      var param = { UserID: "900157", Phone: "0354822436" }; //tam fix hardcode
      storeTwork.getAccessToken(param);
    }, []);
    useEffect(() => {
      if (storeTwork.accessToken != "") {
        loginStringee();
      }
    }, [storeTwork.accessToken]);

    useEffect(() => {
      if (valueTimeTick == true) {
        var start = 0;
        id = setInterval(() => {
          start += 1;
          var min = Math.floor(start / 60).toString();
          var sec = (start % 60).toString();
          var minShow, secShow;
          min.length == 1 ? (minShow = "0" + min) : (minShow = min);
          sec.length == 1 ? (secShow = "0" + sec) : (secShow = sec);

          time = minShow + ":" + secShow;
          timeCall = time;
          setValueShowTime(time);
        }, 1000);
      } else {
        window.clearInterval(id);
        setValueShowTime("00:00");
        timeCall = time;
        time = "00:00";
      }
    }, [valueTimeTick]);

    useEffect(() => {
      // storeTwork.dataCallInfo = [];
      form.setFieldsValue({
        custtype: valueBind.valueBind.valueUpdate.TypeCustomerName,
      });
      form.setFieldsValue({
        dob: Moment.formatDateNew(
          valueBind.valueBind.valueUpdate.BirthDay,
          "DD/MM/yyyy"
        ),
      });
      form.setFieldsValue({ saleId: valueBind.valueBind.valueUpdate.SaleId });
      form.setFieldsValue({
        FullName_Sale: valueBind.valueBind.valueUpdate.SaleName,
      });
      form.setFieldsValue({ Sex: valueBind.valueBind.valueUpdate.Gender });
      form.setFieldsValue({
        customerId: valueBind.valueBind.valueUpdate.CustCode,
      });
      //call api lay thong tin ghi chu
      getCommentByAccount();
    }, []);

    //su kien khi an nut chi tiet tu table man hinh chi tiet
    useEffect(() => {
      const dataBind = storeTwork.dataCallInfo;
      if (dataBind.length > 0) {
        setValueShowRate(true);
        setValueCallType(true);
        setValueRate(true);
        form.setFieldsValue({
          customerId: dataBind[0].CustCode,
        });
        //binding phan loai
        if (dataBind[0].CallAppTypeList != null) {
          const tempType = dataBind[0].CallAppTypeList.split(",");
          if (tempType.length > 0) {
            tempType.map((Item) => {
              if (Item == "1") {
                setValueTVDT(true);
                TVDTGlobal = true;
              }
              if (Item == "2") {
                setValueHGD(true);
                HDGDGlobal = true;
              }
              if (Item == "3") {
                setValueTBL(true);
                TBLGlobal = true;
              }
              if (Item == "4") {
                setValueGTDV(true);
                GTDVGlobal = true;
              }
              if (Item == "5") {
                setValueMTK(true);
                MTKGlobal = true;
              }
              if (Item == "6") {
                setValueOther(true);
                OtherGlobal = true;
              }
            });
          } else {
            setValueCallType(false);
          }
        }
        // form.setFieldsValue({
        //   Note: dataBind[0].Note,
        // });
        callIdStringee = dataBind[0].CallId;
        timeCall = dataBind[0].TimeCall;
        //binding danh gia
        form.setFieldsValue({
          rateNote: dataBind[0].Comment,
        });
        //binding danh gia
        setValueRatePoint(dataBind[0].Rate);
        rateGlobal = dataBind[0].Rate;
      }
    }, [storeTwork.dataCallInfo]);
    useEffect(() => {
      if (storeTwork.isCallApiSuccess == true) {
        getHistoryCall();
      }
    }, [storeTwork.isCallApiSuccess]);
    useEffect(() => {
      if (Object.keys(storeTwork.dataCommentByAccount).length > 0) {
        if (storeTwork.dataCommentByAccount.length > 0){
          form.setFieldsValue({
            Note: `${storeTwork.dataCommentByAccount[0].Content} ${"\n"} ${appStore.account?.LoginName} ${Moment.formatDateNew(new Date(),"DD/MM/yyyy HH:mm:ss")}: `,
          });
        }
        else{
          form.setFieldsValue({
            Note: `${appStore.account?.LoginName} ${Moment.formatDateNew(new Date(),"DD/MM/yyyy HH:mm:ss")}: `,
          });
        }
      }
      else{
        form.setFieldsValue({
          Note: `${appStore.account?.LoginName} ${Moment.formatDateNew(new Date(),"DD/MM/yyyy HH:mm:ss")}: `,
        });
      }
    }, [storeTwork.dataCommentByAccount]);

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              // initialValues={defaultValue}
              onFinish={onSubmitInfoCust}
              requiredMark={false}
            >
              {currentStreamRemote && (
                <video
                  hidden
                  autoPlay
                  id=""
                  ref={(ref) => {
                    if (ref) ref.srcObject = currentStreamRemote;
                  }}
                ></video>
              )}
              {/* {currentStreamLocal && <video autoPlay id="" ref={currentStreamLocal}></video>} */}
              {/* <video hidden id="localVideo" playsinline autoplay muted style={{width: "350px",background: "#424141"}}></video> */}
              {/* <video hidden id="remoteVideo" playsinline autoplay style={{width: "350px",background: "#424141"}}></video> */}
              <Row id="filterSection" className="filterSection">
                {!valueShowButtonEndCall ? (
                  <>
                    <Col lg="24" md="24">
                      <Avatar img={avatarImg} size="xl" status="online" />
                      <Label className="ml-1">
                        {valueBind.valueBind.valueUpdate.CustName}
                      </Label>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col lg="12" md="12">
                      <Avatar img={avatarImg} size="xl" status="online" />
                      <Label className="ml-1">
                        {valueBind.valueBind.valueUpdate.CustName}
                      </Label>
                    </Col>
                    <Col lg="12" md="12" hidden={!valueShowButtonEndCall}>
                      <Col lg="12" md="12" style={{ display: "inline-block" }}>
                        <Label style={{ fontSize: "16px", color: "#ff9f43" }}>
                          <b>Đang gọi: </b>
                        </Label>{" "}
                        &nbsp;
                        <Label style={{ fontSize: "16px", color: "#ff9f43" }}>
                          <b> {valueShowTime} </b>
                        </Label>
                      </Col>
                      <Col lg="12" md="12" style={{ display: "inline-block" }}>
                        <Button
                          className="btn-sm btn-gradient-primary"
                          color="gradient-primary"
                          htmlType="button"
                          onClick={endCall}
                        >
                          Kết thúc
                        </Button>
                      </Col>
                    </Col>
                  </>
                )}
                <Col lg="8" md="8">
                  <Label>Chọn số điện thoại</Label>
                </Col>
                {valueBind.valueBind.valueUpdate.PhoneNumber_01 == "" ||
                valueBind.valueBind.valueUpdate.PhoneNumber_01 == null ? (
                  <></>
                ) : (
                  <Col lg="8" md="8">
                    <Label>
                      {encodePhoneNumber(
                        valueBind.valueBind.valueUpdate.PhoneNumber_01
                      )}
                    </Label>{" "}
                    &nbsp;
                    <Button.Ripple
                      className="btn-sm"
                      color="primary"
                      onClick={() =>
                        makeCall(valueBind.valueBind.valueUpdate.PhoneNumber_01)
                      }
                      disabled={valueEnableButtonCall}
                    >
                      <PhoneForwarded size={12} />
                      <span className="align-middle ml-25">Gọi</span>
                    </Button.Ripple>
                  </Col>
                )}
                {valueBind.valueBind.valueUpdate.PhoneNumber_02 == "" ||
                valueBind.valueBind.valueUpdate.PhoneNumber_02 == null ? (
                  <></>
                ) : (
                  <Col lg="8" md="8">
                    <Label>
                      {encodePhoneNumber(
                        valueBind.valueBind.valueUpdate.PhoneNumber_02
                      )}
                    </Label>{" "}
                    &nbsp;
                    <Button.Ripple
                      className="btn-sm"
                      color="primary"
                      onClick={() =>
                        makeCall(valueBind.valueBind.valueUpdate.PhoneNumber_02)
                      }
                      disabled={valueEnableButtonCall}
                    >
                      <PhoneForwarded size={12} />
                      <span className="align-middle ml-25">Gọi</span>
                    </Button.Ripple>
                  </Col>
                )}
                <Col lb="24" md="24">
                  &nbsp;
                </Col>
                <Col lg="8" md="8">
                  <Form.Item label={t("twork_cust_type")} name="custtype">
                    <Input
                      placeholder={t("twork_cust_type")}
                      autoComplete="off"
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item label={t("twork_dob")} name="dob">
                    <Input
                      placeholder={t("twork_dob")}
                      autoComplete="off"
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item label={t("twork_sale_id")} name="saleId">
                    <Input
                      placeholder={t("twork_sale_id")}
                      autoComplete="off"
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item label={t("Customer_ID")} name="customerId">
                    <Input
                      placeholder={t("Customer_ID")}
                      autoComplete="off"
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item label={t("Sex")} name="Sex">
                    <Input placeholder={t("Sex")} autoComplete="off" disabled />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item label={t("FullName_Sale")} name="FullName_Sale">
                    <Input
                      placeholder={t("FullName_Sale")}
                      autoComplete="off"
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" xs="24">
                  <Form.Item label={t("X_Trade_Note")} name="Note">
                    <TextArea rows={4} placeholder={t("X_Trade_Note")} autoComplete="off" />
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" xs="24" hidden={!valueShowRate}>
                  <Form.Item name="chkChangeType">
                    <Checkbox
                      onChange={onChangeType}
                      className="twork-check-box"
                      defaultChecked={true}
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
                    >
                      {t("twork_other")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" xs="24" hidden={!valueShowRate}>
                  <Form.Item name="chkChangeType">
                    <Checkbox
                      onChange={onChangeRate}
                      className="twork-check-box"
                      defaultChecked={true}
                    >
                      {t("twork_rate")}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" xs="24" hidden={!valueRate}>
                  <Form.Item name="rate" label={t("twork_rate")}>
                    <Rating
                      emptySymbol={
                        <Star size={32} fill="#babfc7" stroke="#babfc7" />
                      }
                      fullSymbol={
                        <Star
                          size={32}
                          fill={themeColors.colors.warning.main}
                          stroke={themeColors.colors.warning.main}
                        />
                      }
                      initialRating={valueRatePoint}
                      direction="ltr"
                      onChange={(value) => {
                        setValueRatePoint(value);
                        rateGlobal = value;
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" xs="24" hidden={!valueRate}>
                  <Form.Item name="rateNote">
                    <TextArea
                      autoSize={true}
                      placeholder={t("twork_rate")}
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Col lg="24" md="24" className="text-center">
                <Form.Item className="text-center mt-2">
                  <Button
                    className="btn btn-gradient-info"
                    color="gradient-info"
                    htmlType="submit"
                    hidden={!valueShowRate}
                  >
                    {t("X_Trade_Button_Add_Rate")}
                  </Button>
                  &nbsp;
                  <Button
                    className="btn btn-gradient-info"
                    color="gradient-info"
                    htmlType="button"
                    onClick={addComment}
                  >
                    {t("X_Trade_Button_Add_Comment")}
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default Info_ForceCall;
