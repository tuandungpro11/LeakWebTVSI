import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import DataTable from "react-data-table-component";
import {
  ChevronDown,
  Delete,
  Edit,
  Home,
  List,
  Loader,
  Settings,
} from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  TabContent,
  TabPane,
  UncontrolledButtonDropdown,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Moment } from "../../../../utility/general/Moment";
import { numberUtil } from "../../../../utility/general/NumberUtil";
import {
  ErrorToast,
  SuccessProgressToast,
} from "../../../../views/extensions/toastify/ToastTypes";
import { store } from "../../store/InvestorStore";
import { customSMSelectStyles, pageSizeTable } from "../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Pagination,
  PaginationProps,
  Radio,
  RadioChangeEvent,
  TimePicker
} from "antd";
import Prism from "prismjs";
import { storeSystemManagement } from "../../store/SystemManagementStore";
import ConfigTimeAdv from "./ConfigTimeAdv";
import { isEmptyBindingElement } from "typescript";
import moment from "moment";

const Config = () =>
  useObserver(() => {
    const [formLRP] = Form.useForm();
    const [formFee] = Form.useForm();
    const [formCOO] = Form.useForm();
    const [formRIR] = Form.useForm();
    const [formCashTrans] = Form.useForm();
    const { RangePicker } = DatePicker;

    const [valueDate, setvalueDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState("LRP");
    const { t } = useTranslation();
    const { register, getValues, errors, handleSubmit, control } = useForm();
    const [valueAutoCashTrans, setValueAutoCashTrans] = useState(0);
    const [valueUpdate, setValueUpdate] = useState({});
    const [IDChanel, setIdChanel] = useState("");

    const onSubmitLPR = () => {
      const valueForm = formLRP.getFieldsValue();
      const param = {
        PointValue: valueForm.Price == undefined ?"":valueForm.Price,
        AdvTax: valueForm.TaxAdv == undefined ?"":valueForm.TaxAdv,
        AdvMinFee: valueForm.MinFee == undefined ?"":valueForm.MinFee,
        AdvFeeRatio: valueForm.RatioAdv == undefined ?"":valueForm.RatioAdv,
        AdvLoanRatio: valueForm.RatioFee == undefined ?"":valueForm.RatioFee,
      };
      const p = {
        JsonData: JSON.stringify(param),
      };
      storeSystemManagement.UpdateConfigSystem(p);
    };

    const resetForm = () => {
      formLRP.resetFields();
      getDataConfig();
      //get data tab fee/tax
      getDataFeeTax();
    };
    const defaultValue = {
      Price: "",
      TaxAdv: "",
      MinFee: "",
      RatioFee: "",
      RatioAdv: "",
    };
    const defaultValueFee = {
      cbxChannel: storeSystemManagement.dataListChannel.filter(item=>(item.Source!=""))[0],
      FeeTrade: "",
      FeeTradeMin: "",
    };
    const defaultValueCOO = {
      MaxEffDate: "",
      RatioTP: "",
      RatioSL: "",
      Start: "",
      End: "",
      SendTCO: "",
      cbxMarket: "",
      PRO1: "",
      PRO2: "",
      PRO3: "",
    };
    const defaultValueRIR = {
      TimeRegist: "",
      BranchReport: "",
      CashValue: "",
      DayRegist: "",
    };
    const defaultValueCashTrans = {
      CashMin: "",
      CashMax: "",
      CashMaxInday: "",
      AutoStart: "",
      AutoEnd: "",
      Auto: 0,
    };

    const setTimeAdv = () => {
      setValueUpdate(storeSystemManagement.dataListConfigSystem);
      storeSystemManagement.onShowModalAddNew(true);
    };

    const onSubmitFee = () => {
      const valueForm = formFee.getFieldsValue();
      const param = {
        id: IDChanel,
        feeRatio: valueForm.FeeTrade == undefined ?"":valueForm.FeeTrade,
        minFee: valueForm.FeeTradeMin== undefined ?"": !isNaN(+valueForm.FeeTradeMin) || valueForm.FeeTradeMin == 0 ? valueForm.FeeTradeMin :valueForm.FeeTradeMin.replaceAll(",", ""),
      };

      storeSystemManagement.UpdateChannel(param);
      const paramSys = {
        // json: {
        //   SellTax: valueForm.TaxSell,
        // },
          SellTax: valueForm.TaxSell
      };
      const p = {
        JsonData: JSON.stringify(paramSys),
      };
      storeSystemManagement.UpdateConfigSystem(p);
    };
    const onSubmitCOO = () => {
      const valueForm = formCOO.getFieldsValue();
      if (valueForm.cbxMarket.Value == "") {
        toast.error(ErrorToast("Bạn chưa chọn sàn giao dịch."));
        return;
      } else if (valueForm.cbxMarket.Value == "HNX") {
        const paramSys = {
          // json: {
          //   COOMaxDuration: valueForm.MaxEffDate.replaceAll(",", ""),
          //   ProfitLimitRatio: valueForm.RatioTP == undefined ?"":valueForm.RatioTP,
          //   LossLimitRatio: valueForm.RatioSL == undefined ?"":valueForm.RatioSL,
          //   BeginTime4COO: valueForm.Start ? valueForm.Start._d == undefined ?"":Moment.formatDateNew(valueForm.Start._d, "HH:mm:ss") :"",
          //   EndTime4COO: valueForm.End ? valueForm.End._d == undefined ?"":Moment.formatDateNew(valueForm.End._d, "HH:mm:ss") :"",
          //   TCOTime4COO: valueForm.SendTCO ? valueForm.SendTCO._d == undefined ?"":Moment.formatDateNew(valueForm.SendTCO._d, "HH:mm:ss") :"",
          //   PRO1Param: valueForm.PRO1? valueForm.PRO1._d == undefined ?"":Moment.formatDateNew(valueForm.PRO1._d, "HH:mm:ss") :"",
          //   PRO2Param: valueForm.PRO2? valueForm.PRO2._d == undefined ?"":Moment.formatDateNew(valueForm.PRO2._d, "HH:mm:ss") :"",
          //   PRO3Param: valueForm.PRO3? valueForm.PRO3._d == undefined ?"":Moment.formatDateNew(valueForm.PRO3._d, "HH:mm:ss") :"",
          // },
            COOMaxDuration: !isNaN(+valueForm.MaxEffDate) || valueForm.MaxEffDate==0 ? valueForm.MaxEffDate :valueForm.MaxEffDate.replaceAll(",", ""),
            ProfitLimitRatio: valueForm.RatioTP == undefined ?"":valueForm.RatioTP,
            LossLimitRatio: valueForm.RatioSL == undefined ?"":valueForm.RatioSL,
            BeginTime4COO: valueForm.Start ? valueForm.Start._d == undefined ?"":Moment.formatDateNew(valueForm.Start._d, "HH:mm:ss") :"",
            EndTime4COO: valueForm.End ? valueForm.End._d == undefined ?"":Moment.formatDateNew(valueForm.End._d, "HH:mm:ss") :"",
            TCOTime4COO: valueForm.SendTCO ? valueForm.SendTCO._d == undefined ?"":Moment.formatDateNew(valueForm.SendTCO._d, "HH:mm:ss") :"",
            PRO_HNX_Session1Time: valueForm.PRO1? valueForm.PRO1._d == undefined ?"":Moment.formatDateNew(valueForm.PRO1._d, "HH:mm:ss") :"",
            PRO_HNX_Session2Time: valueForm.PRO2? valueForm.PRO2._d == undefined ?"":Moment.formatDateNew(valueForm.PRO2._d, "HH:mm:ss") :"",
            PRO_HNX_Session3Time: valueForm.PRO3? valueForm.PRO3._d == undefined ?"":Moment.formatDateNew(valueForm.PRO3._d, "HH:mm:ss") :""
        };
        const p = {
          JsonData: JSON.stringify(paramSys),
        };
        storeSystemManagement.UpdateConfigSystem(p);
      } else if (valueForm.cbxMarket.Value == "HOSE") {
        const paramSys = {
            COOMaxDuration: !isNaN(+valueForm.MaxEffDate) || valueForm.MaxEffDate==0 ? valueForm.MaxEffDate :valueForm.MaxEffDate.replaceAll(",", ""),
            ProfitLimitRatio: valueForm.RatioTP == undefined ?"":valueForm.RatioTP,
            LossLimitRatio: valueForm.RatioSL == undefined ?"":valueForm.RatioSL,
            BeginTime4COO: valueForm.Start ? valueForm.Start._d == undefined ?"":Moment.formatDateNew(valueForm.Start._d, "HH:mm:ss") :"",
            EndTime4COO: valueForm.End ? valueForm.End._d == undefined ?"":Moment.formatDateNew(valueForm.End._d, "HH:mm:ss") :"",
            TCOTime4COO: valueForm.SendTCO ? valueForm.SendTCO._d == undefined ?"":Moment.formatDateNew(valueForm.SendTCO._d, "HH:mm:ss") :"",
            PRO_Session1Time: valueForm.PRO1? valueForm.PRO1._d == undefined ?"":Moment.formatDateNew(valueForm.PRO1._d, "HH:mm:ss") :"",
            PRO_Session2Time: valueForm.PRO2? valueForm.PRO2._d == undefined ?"":Moment.formatDateNew(valueForm.PRO2._d, "HH:mm:ss") :"",
            PRO_Session3Time: valueForm.PRO3? valueForm.PRO3._d == undefined ?"":Moment.formatDateNew(valueForm.PRO3._d, "HH:mm:ss") :""
        };
        const p = {
          JsonData: JSON.stringify(paramSys),
        };
        storeSystemManagement.UpdateConfigSystem(p);
      } else if (valueForm.cbxMarket.Value == "UPCOM") {
        const paramSys = {
            COOMaxDuration: !isNaN(+valueForm.MaxEffDate) || valueForm.MaxEffDate==0 ? valueForm.MaxEffDate :valueForm.MaxEffDate.replaceAll(",", ""),
            ProfitLimitRatio: valueForm.RatioTP == undefined ?"":valueForm.RatioTP,
            LossLimitRatio: valueForm.RatioSL == undefined ?"":valueForm.RatioSL,
            BeginTime4COO: valueForm.Start ? valueForm.Start._d == undefined ?"":Moment.formatDateNew(valueForm.Start._d, "HH:mm:ss") :"",
            EndTime4COO: valueForm.End ? valueForm.End._d == undefined ?"":Moment.formatDateNew(valueForm.End._d, "HH:mm:ss") :"",
            TCOTime4COO: valueForm.SendTCO ? valueForm.SendTCO._d == undefined ?"":Moment.formatDateNew(valueForm.SendTCO._d, "HH:mm:ss") :"",
            PRO_UPCOM_Session1Time: valueForm.PRO1? valueForm.PRO1._d == undefined ?"":Moment.formatDateNew(valueForm.PRO1._d, "HH:mm:ss") :"",
            PRO_UPCOM_Session2Time: valueForm.PRO2? valueForm.PRO2._d == undefined ?"":Moment.formatDateNew(valueForm.PRO2._d, "HH:mm:ss") :"",
            PRO_UPCOM_Session3Time: valueForm.PRO3? valueForm.PRO3._d == undefined ?"":Moment.formatDateNew(valueForm.PRO3._d, "HH:mm:ss") :""
        };
        const p = {
          JsonData: JSON.stringify(paramSys),
        };
        storeSystemManagement.UpdateConfigSystem(p);
      }
    };
    const onSubmitRIR = () => {
      const valueForm = formRIR.getFieldsValue();
      const paramSys = {
        // json: {
        //   RIREndTime: valueForm.AutoStart ? valueForm.TimeRegist._d == undefined ?"":Moment.formatDateNew(valueForm.TimeRegist._d, "HH:mm:ss") :"",
        //   ListBranchSignaturesReport: valueForm.BranchReport == undefined ?"":valueForm.BranchReport.trim(),
        //   RIRPrice: valueForm.CashValue == undefined ?"":valueForm.CashValue.replaceAll(",", ""),
        //   RIRConfirmDate4SupperAcc: valueForm.DayRegist == undefined ?"":valueForm.DayRegist.replaceAll(",", ""),
        // },
          RIREndTime: valueForm.TimeRegist ? valueForm.TimeRegist._d == undefined ?"":Moment.formatDateNew(valueForm.TimeRegist._d, "HH:mm:ss") :"",
          ListBranchSignaturesReport: valueForm.BranchReport == undefined ?"":valueForm.BranchReport.trim(),
          RIRPrice: valueForm.CashValue == undefined ?"":!isNaN(+valueForm.CashValue)||valueForm.CashValue==0?valueForm.CashValue:valueForm.CashValue.replaceAll(",", ""),
          RIRConfirmDate4SupperAcc: valueForm.DayRegist == undefined ?"":!isNaN(+valueForm.DayRegist)||valueForm.DayRegist==0?valueForm.DayRegist:valueForm.DayRegist.replaceAll(",", "")
      };
      const p = {
        JsonData: JSON.stringify(paramSys),
      };
      storeSystemManagement.UpdateConfigSystem(p);
    };
    const onSubmitCashTrans = () => {
      const valueForm = formCashTrans.getFieldsValue();
      
      const paramSys = {
        // json: {
        //   MinMoneyTransfer: valueForm.CashMin == undefined ?"":valueForm.CashMin.replaceAll(",", ""),
        //   MaxMoneyTransfer: valueForm.CashMax == undefined ?"":valueForm.CashMax.replaceAll(",", ""),
        //   MTAutoApproveLimit: valueForm.CashMaxInday == undefined ?"":valueForm.CashMaxInday.replaceAll(",", ""),
        //   MTAutoApproveEnable: valueForm.Auto == undefined ?"":valueForm.Auto, //get value radio
        //   MTAutoApproveBeginTime: valueForm.AutoStart ? valueForm.AutoStart._d == undefined ?"":Moment.formatDateNew(valueForm.AutoStart._d, "HH:mm:ss") :"",
        //   MTAutoApproveEndTime: valueForm.AutoEnd ? valueForm.AutoEnd._d == undefined ?"":Moment.formatDateNew(valueForm.AutoEnd._d, "HH:mm:ss") :"",
        // },
          MinMoneyTransfer: valueForm.CashMin == undefined ?"":!isNaN(+valueForm.CashMin)||valueForm.CashMin==0?valueForm.CashMin:valueForm.CashMin.replaceAll(",", ""),
          MaxMoneyTransfer: valueForm.CashMax == undefined ?"":!isNaN(+valueForm.CashMax)||valueForm.CashMax==0?valueForm.CashMax:valueForm.CashMax.replaceAll(",", ""),
          MTAutoApproveLimit: valueForm.CashMaxInday == undefined ?"":!isNaN(+valueForm.CashMaxInday)||valueForm.CashMaxInday==0?valueForm.CashMaxInday:valueForm.CashMaxInday.replaceAll(",", ""),
          MTAutoApproveEnable: valueForm.Auto == undefined ?"":valueForm.Auto, //get value radio
          MTAutoApproveBeginTime: valueForm.AutoStart ? valueForm.AutoStart._d == undefined ?"":Moment.formatDateNew(valueForm.AutoStart._d, "HH:mm:ss") :"",
          MTAutoApproveEndTime: valueForm.AutoEnd ? valueForm.AutoEnd._d == undefined ?"":Moment.formatDateNew(valueForm.AutoEnd._d, "HH:mm:ss") :""
      };
      const p = {
        JsonData: JSON.stringify(paramSys),
      };

      storeSystemManagement.UpdateConfigSystem(p);
    };

    const resetFormFee = () => {
      formFee.resetFields();
      getDataConfig();
      //get data tab fee/tax
      getDataFeeTax();
    };

    const resetFormCOO =()=>{
      formCOO.resetFields();
      getDataConfig();
      //get data tab fee/tax
      getDataFeeTax();
    }
    const resetFormRIR=()=>{
      formRIR.resetFields();
      getDataConfig();
      //get data tab fee/tax
      getDataFeeTax();
    }
    const resetFormCashTrans=()=>{
      formCashTrans.resetFields();
      getDataConfig();
      //get data tab fee/tax
      getDataFeeTax();
    }
    const toggle = (tab: any) => {
      if (activeTab !== tab) {
        setActiveTab(tab);
      }
    };
    const onChange = (e: RadioChangeEvent) => {
      setValueAutoCashTrans(e.target.value);
    };
    const getDataConfig = () => {
      const param = {
        Name: "all",
        PageIndex: 0,
        PageSize: 0,
      };
      storeSystemManagement.getListConfigSystem(param);
    };
    const getDataFeeTax = () => {
      storeSystemManagement.getListChannel();
    };
    const fillDataFeeTaxByChannel = (event: any) => {
      if (event.Source == "") {
        formFee.setFieldsValue({
          FeeTrade: "",
          FeeTradeMin: "",
        });
      } else {
        formFee.setFieldsValue({
          FeeTrade: storeSystemManagement.dataListChannel.filter(
            (item) => item.Source == event.Source
          )[0].FeeRatio ==0?0:storeSystemManagement.dataListChannel.filter(
            (item) => item.Source == event.Source
          )[0].FeeRatio,
          FeeTradeMin: storeSystemManagement.dataListChannel.filter(
            (item) => item.Source == event.Source
          )[0].MinFee == 0?0: storeSystemManagement.dataListChannel.filter(
              (item) => item.Source == event.Source
            )[0].MinFee,
        });
      }
      setIdChanel(event.ID);
    };
    const fillDataCOOByMarket = (event: any) => {
      if (event.Value == -1) {
        formCOO.setFieldsValue({
          PRO1: "",
          PRO21: "",
          PRO3: "",
        });
      } else if (event.Value == "HNX") {
        formCOO.setFieldsValue({
          PRO1: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "PRO_HNX_Session1Time"
          )[0].VALUE)),
          PRO2: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "PRO_HNX_Session2Time"
          )[0].VALUE)),
          PRO3: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "PRO_HNX_Session3Time"
          )[0].VALUE)),
        });
      } else if (event.Value == "HOSE") {
        formCOO.setFieldsValue({
          PRO1: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "PRO_Session1Time"
          )[0].VALUE)),
          PRO2: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "PRO_Session2Time"
          )[0].VALUE)),
          PRO3: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "PRO_Session3Time"
          )[0].VALUE)),
        });
      } else if (event.Value == "UPCOM") {
        formCOO.setFieldsValue({
          PRO1: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "PRO_UPCOM_Session1Time"
          )[0].VALUE)),
          PRO2: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "PRO_UPCOM_Session2Time"
          )[0].VALUE)),
          PRO3: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "PRO_UPCOM_Session3Time"
          )[0].VALUE)),
        });
      }
    };

    const fillData = () => {
      //LRP
      formLRP.setFieldsValue({
        Price: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "PointValue"
        )[0].VALUE == 0 ? 0 :numberUtil.formatNumber(
          storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "PointValue"
          )[0].VALUE
        ),
        TaxAdv: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "AdvTax"
        )[0].VALUE,
        MinFee: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "AdvMinFee"
        )[0].VALUE==0?0: numberUtil.formatNumber(
          storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "AdvMinFee"
          )[0].VALUE
        ),
        RatioFee: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "AdvLoanRatio"
        )[0].VALUE,
        RatioAdv: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "AdvFeeRatio"
        )[0].VALUE == 0? 0 : numberUtil.formatNumber(
          storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "AdvFeeRatio"
          )[0].VALUE
        ),
      });
      //Fee/Tax
      formFee.setFieldsValue({
        TaxSell: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "SellTax"
        )[0].VALUE == 0 ? 0 : storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "SellTax"
        )[0].VALUE,
      });
      //COO
      formCOO.setFieldsValue({
        MaxEffDate: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "COOMaxDuration"
        )[0].VALUE,
        RatioTP: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "ProfitLimitRatio"
        )[0].VALUE,
        RatioSL: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "LossLimitRatio"
        )[0].VALUE,
        Start: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "BeginTime4COO"
        )[0].VALUE)),
        End: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "EndTime4COO"
        )[0].VALUE)),
        SendTCO: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "TCOTime4COO"
        )[0].VALUE)),
      });
      //RIR
      formRIR.setFieldsValue({
        TimeRegist: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "RIREndTime"
        )[0].VALUE == "" ?"": moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "RIREndTime"
        )[0].VALUE)),
        BranchReport: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "ListBranchSignaturesReport"
        )[0].VALUE,
        CashValue: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "RIRPrice"
        )[0].VALUE == 0 || storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "RIRPrice"
        )[0].VALUE == "-" ? 0 : numberUtil.formatNumber(
          storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "RIRPrice"
          )[0].VALUE
        ),
        DayRegist: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "RIRConfirmDate4SupperAcc"
        )[0].VALUE,
      });
      //CashTrans
      formCashTrans.setFieldsValue({
        CashMin: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "MinMoneyTransfer"
        )[0].VALUE == 0 || storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "MinMoneyTransfer"
        )[0].VALUE == "-" ? 0: numberUtil.formatNumber(
          storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "MinMoneyTransfer"
          )[0].VALUE
        ),
        CashMax: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "MaxMoneyTransfer"
        )[0].VALUE == 0 || storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "MaxMoneyTransfer"
        )[0].VALUE == "-"?0: numberUtil.formatNumber(
          storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "MaxMoneyTransfer"
          )[0].VALUE
        ),
        CashMaxInday: storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "MTAutoApproveLimit"
        )[0].VALUE == 0 || storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "MTAutoApproveLimit"
        )[0].VALUE =="-" ?0: numberUtil.formatNumber(
          storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "MTAutoApproveLimit"
          )[0].VALUE
        ),
        AutoStart: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
             (item) => item.KEY == "MTAutoApproveBeginTime")[0].VALUE)),
        AutoEnd: moment(Moment.setTimeHHmmss(storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "MTAutoApproveEndTime"
        )[0].VALUE)),
        Auto: parseInt(storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "MTAutoApproveEnable"
        )[0].VALUE),
      });
    };

    useEffect(() => {
      Prism.highlightAll();
      const param = {
        Category: "STOCK",
        Group: "EXCHANGE",
        Code: "",
      };
      storeSystemManagement.getListMartket(param);
    }, []);

    useEffect(() => {
      getDataConfig();
      //get data tab fee/tax
      getDataFeeTax();
    }, []);
    useEffect(() => {
      if (storeSystemManagement.dataListConfigSystem.length > 0) {
        fillData();
      }
    }, [storeSystemManagement.dataListConfigSystem]);
    useEffect(() => {
      if (storeSystemManagement.getDone) {
        console.log("radio value",storeSystemManagement.dataListConfigSystem.filter(
          (item) => item.KEY == "MTAutoApproveEnable"
        )[0].VALUE);
        
        formCashTrans.setFieldsValue({
          Auto: parseInt(storeSystemManagement.dataListConfigSystem.filter(
            (item) => item.KEY == "MTAutoApproveEnable"
          )[0].VALUE),
        });
      }
    }, [storeSystemManagement.getDone]);
    useEffect(()=>{
      if(storeSystemManagement.dataListChannel.length>0){
        formFee.setFieldsValue({
          cbxChannel: storeSystemManagement.dataListChannel.filter(item=>(item.Source!=""))[0],
        });
        const evt={
          Source:"W"
        }
        fillDataFeeTaxByChannel(evt)
      }
    },[storeSystemManagement.dataListChannel])

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Config")}</h4>
          </CardHeader>
          <CardBody>
            <Nav tabs pills={true}>
              <NavItem>
                <NavLink
                  active={activeTab === "LRP"}
                  onClick={() => {
                    toggle("LRP");
                  }}
                >
                  <span className="align-middle">LRP/CF/WA</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "Fee"}
                  onClick={() => {
                    toggle("Fee");
                  }}
                >
                  <span className="align-middle">Fee/Tax</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "COO"}
                  onClick={() => {
                    toggle("COO");
                  }}
                >
                  <span className="align-middle">COO</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "RIR"}
                  onClick={() => {
                    toggle("RIR");
                  }}
                >
                  <span className="align-middle">RIR</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "CashTrans"}
                  onClick={() => {
                    toggle("CashTrans");
                  }}
                >
                  <span className="align-middle">Chuyển tiền</span>
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent className="py-50" activeTab={activeTab}>
              <TabPane tabId="LRP">
                <Form
                  layout={"vertical"}
                  form={formLRP}
                  initialValues={defaultValue}
                  onFinish={onSubmitLPR}
                  requiredMark={false}
                >
                  <Row>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_LRP_Price")}
                        name="Price"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t("X_Trade_Config_LRP_Price")}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_LRP_Tax_Adv")}
                        name="TaxAdv"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t("X_Trade_Config_LRP_Tax_Adv")}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_Min_Fee")}
                        name="MinFee"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t("X_Trade_Config_Min_Fee")}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_Fee_Ratio_Per_Day")}
                        name="RatioFee"
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t("X_Trade_Config_Fee_Ratio_Per_Day")}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_Fee_Ratio_Adv")}
                        name="RatioAdv"
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t("X_Trade_Config_Fee_Ratio_Adv")}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="24" md="24" className="text-center">
                      <Form.Item>
                        <Button
                          className="btn btn-gradient-info"
                          color="gradient-info"
                          type="submit"
                        >
                          {t("X_Trade_Button_Add")}
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          htmlType="button"
                          className="btn btn-gradient-secondary"
                          color="gradient-secondary"
                          onClick={resetForm}
                        >
                          {t("X_Trade_Button_Reset")}
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          htmlType="button"
                          className="btn btn-gradient-success"
                          color="gradient-success"
                          onClick={setTimeAdv}
                        >
                          {t("X_Trade_Config_Time_Button")}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </TabPane>
              <TabPane tabId="Fee">
                <Form
                  layout={"vertical"}
                  form={formFee}
                  initialValues={defaultValueFee}
                  onFinish={onSubmitFee}
                  requiredMark={false}
                >
                  <Row>
                    <Col lg="6" md="6">
                      <Form.Item label={t("X_Trade_Channel")} name="cbxChannel">
                        {storeSystemManagement.dataListChannel.length > 0 ? (
                          <Select
                            options={storeSystemManagement.dataListChannel.filter(item=>(item.Source!=""))}
                            isClearable={false}
                            control={control}
                            theme={selectThemeColors}
                            className="react-select react-select-sm"
                            classNamePrefix="select"
                            styles={customSMSelectStyles}
                            getOptionLabel={(option: { Name: any; }) => option.Name}
                            getOptionValue={(option: { Source: any; }) => option.Source}
                            onChange={(evt: any) => {
                              fillDataFeeTaxByChannel(evt);
                            }}
                          />
                        ) : (
                          <></>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_Fee_Trade")}
                        name="FeeTrade"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t("X_Trade_Config_Fee_Trade")}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_Fee_Trade_Min")}
                        name="FeeTradeMin"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <InputNumber
                          size="small"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t("X_Trade_Config_Fee_Trade_Min")}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_Sell_Fee")}
                        name="TaxSell"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t("X_Trade_Config_Sell_Fee")}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="24" md="24" className="text-center">
                      <Form.Item>
                        <Button
                          className="btn btn-gradient-info"
                          color="gradient-info"
                          type="submit"
                        >
                          {t("X_Trade_Button_Add")}
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          htmlType="button"
                          className="btn btn-gradient-secondary"
                          color="gradient-secondary"
                          onClick={resetFormFee}
                        >
                          {t("X_Trade_Button_Reset")}
                        </Button>
                        &nbsp;&nbsp;
                        {/* <Button
                          htmlType="button"
                          className="btn btn-gradient-success"
                          color="gradient-success"
                        >
                          {t("X_Trade_Button_Export")}
                        </Button> */}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </TabPane>
              <TabPane tabId="COO">
                <Form
                  layout={"vertical"}
                  form={formCOO}
                  initialValues={defaultValueCOO}
                  onFinish={onSubmitCOO}
                  requiredMark={false}
                >
                  <Row id="filterSection" className="filterSection">
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Eff_Date_Max")}
                        name="MaxEffDate"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t("X_Trade_Eff_Date_Max")}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Ratio_Take_Profit")}
                        name="RatioTP"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <InputNumber
                          size="small"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t("X_Trade_Ratio_Take_Profit")}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Ratio_Stop_Loss")}
                        name="RatioSL"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t("X_Trade_Ratio_Stop_Loss")}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Start")}
                        name="Start"
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
                          placeholder={t("X_Trade_Start")}
                          autoComplete="Off"
                        /> */}
                        <TimePicker
                        className="form-control form-control-sm"
                        size="small"
                        placeholder={t(
                          "X_Trade_Start"
                        )}
                        autoComplete="Off"/>
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_End")}
                        name="End"
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
                          placeholder={t("X_Trade_End")}
                          autoComplete="Off"
                        /> */}
                        <TimePicker
                        size="small"
                        className="form-control form-control-sm"
                        placeholder={t(
                          "X_Trade_End"
                        )}
                        autoComplete="Off"/>
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Send_TCO")}
                        name="SendTCO"
                        className="ant-picker-small-custom"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <TimePicker
                        size="small"
                        className="form-control form-control-sm"
                        placeholder={t(
                          "X_Trade_Send_TCO"
                        )}
                        autoComplete="Off"/>
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item label={t("X_Trade_Market")} name="cbxMarket">
                        {storeSystemManagement.dataListMarket.length > 0 ? (
                          <Select
                            options={storeSystemManagement.dataListMarket.filter(item=>(item.Value!=""))}
                            isClearable={false}
                            control={control}
                            theme={selectThemeColors}
                            className="react-select react-select-sm"
                            classNamePrefix="select"
                            styles={customSMSelectStyles}
                            getOptionLabel={(option: { Name: any; }) => option.Name}
                            getOptionValue={(option: { Value: any; }) => option.Value}
                            onChange={(evt: any) => {
                              fillDataCOOByMarket(evt);
                            }}
                            placeholder="Chọn sàn giao dịch"
                          />
                        ) : (
                          <></>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Send_PRO1")}
                        name="PRO1"
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
                          placeholder={t("X_Trade_Send_PRO1")}
                          autoComplete="Off"
                        /> */}
                        <TimePicker
                        size="small"
                        className="form-control form-control-sm"
                        placeholder={t(
                          "X_Trade_Send_PRO1"
                        )}
                        autoComplete="Off"/>
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Send_PRO2")}
                        name="PRO2"
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
                          placeholder={t("X_Trade_Send_PRO2")}
                          autoComplete="Off"
                        /> */}
                        <TimePicker
                        size="small"
                        className="form-control form-control-sm"
                        placeholder={t(
                          "X_Trade_Send_PRO2"
                        )}
                        autoComplete="Off"/>
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Send_PRO3")}
                        name="PRO3"
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
                          placeholder={t("X_Trade_Send_PRO3")}
                          autoComplete="Off"
                        /> */}
                        <TimePicker
                        size="small"
                        className="form-control form-control-sm"
                        placeholder={t(
                          "X_Trade_Send_PRO3"
                        )}
                        autoComplete="Off"/>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="24" md="24" className="text-center">
                      <Form.Item>
                        <Button
                          className="btn btn-gradient-info"
                          color="gradient-info"
                          type="submit"
                        >
                          {t("X_Trade_Button_Add")}
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          htmlType="button"
                          className="btn btn-gradient-secondary"
                          color="gradient-secondary"
                          onClick={resetFormCOO}
                        >
                          {t("X_Trade_Button_Reset")}
                        </Button>
                        {/* &nbsp;&nbsp;
                        <Button
                          htmlType="button"
                          className="btn btn-gradient-success"
                          color="gradient-success"
                        >
                          {t("X_Trade_Button_Export")}
                        </Button> */}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </TabPane>
              <TabPane tabId="RIR">
                <Form
                  layout={"vertical"}
                  form={formRIR}
                  initialValues={defaultValueRIR}
                  onFinish={onSubmitRIR}
                  requiredMark={false}
                >
                  <Row>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_RIR_Time_Regist")}
                        name="TimeRegist"
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
                          placeholder={t("X_Trade_Config_RIR_Time_Regist")}
                          autoComplete="Off"
                        /> */}
                        <TimePicker
                        size="small"
                        className="form-control form-control-sm"
                        placeholder={t(
                          "X_Trade_Config_RIR_Time_Regist"
                        )}
                        autoComplete="Off"/>
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_RIR_Branch_Report")}
                        name="BranchReport"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <Input
                          size="small"
                          placeholder={t("X_Trade_Config_RIR_Branch_Report")}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_RIR_Cash_Value")}
                        name="CashValue"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t("X_Trade_Config_RIR_Cash_Value")}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_RIR_Day_Regist_Super_Account")}
                        name="DayRegist"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <InputNumber
                          size="small"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t(
                            "X_Trade_Config_RIR_Day_Regist_Super_Account"
                          )}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="24" md="24" className="text-center">
                      <Form.Item>
                        <Button
                          className="btn btn-gradient-info"
                          color="gradient-info"
                          type="submit"
                        >
                          {t("X_Trade_Button_Add")}
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          htmlType="button"
                          className="btn btn-gradient-secondary"
                          color="gradient-secondary"
                          onClick={resetFormRIR}
                        >
                          {t("X_Trade_Button_Reset")}
                        </Button>
                        {/* &nbsp;&nbsp;
                        <Button
                          htmlType="button"
                          className="btn btn-gradient-success"
                          color="gradient-success"
                        >
                          {t("X_Trade_Button_Export")}
                        </Button> */}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </TabPane>
              <TabPane tabId="CashTrans">
                <Form
                  layout={"vertical"}
                  form={formCashTrans}
                  initialValues={defaultValueCashTrans}
                  onFinish={onSubmitCashTrans}
                  requiredMark={false}
                >
                  <Row>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_Cash_Trans_Min")}
                        name="CashMin"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          placeholder={t("X_Trade_Config_Cash_Trans_Min")}
                          controls={false}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_Cash_Trans_Max")}
                        name="CashMax"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                      <InputNumber
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                        placeholder={t("X_Trade_Config_Cash_Trans_Max")}
                        controls={false}
                        autoComplete="Off"
                      />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_Cash_Trans_Max_Inday")}
                        name="CashMaxInday"
                        rules={[
                          {
                            required: true,
                            message: "Giá trị không được để trống",
                          },
                        ]}
                      >
                      <InputNumber
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                        placeholder={t("CashMaxInday")}
                        controls={false}
                        autoComplete="Off"
                      />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6" className="demo-inline-spacing">
                      <Form.Item
                        label={t("X_Trade_Config_Cash_Trans_Auto")}
                        name="Auto"
                      >
                        {storeSystemManagement.dataListConfigSystem.length>0?(
                        <Radio.Group
                          onChange={onChange}
                          value={parseInt(storeSystemManagement.dataListConfigSystem.filter(
                            (item) => item.KEY == "MTAutoApproveEnable"
                          )[0].VALUE)}
                          name="radioAuto"
                        >
                          <Radio value={1}>Có</Radio>
                          <Radio value={0}>Không</Radio>
                        </Radio.Group>):(<></>)}
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_Cash_Trans_Auto_Start")}
                        name="AutoStart"
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
                          placeholder={t(
                            "X_Trade_Config_Cash_Trans_Auto_Start"
                          )}
                          autoComplete="Off"
                        /> */}
                        <TimePicker
                        size="small"
                        className="form-control form-control-sm"
                        placeholder={t(
                          "X_Trade_Config_Cash_Trans_Auto_Start"
                        )}
                        autoComplete="Off"/>
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("X_Trade_Config_Cash_Trans_Auto_End")}
                        name="AutoEnd"
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
                          placeholder={t("X_Trade_Config_Cash_Trans_Auto_End")}
                          autoComplete="Off"
                        /> */}
                        <TimePicker
                        size="small"
                        className="form-control form-control-sm"
                        placeholder={t(
                          "X_Trade_Config_Cash_Trans_Auto_End"
                        )}
                        autoComplete="Off"/>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="24" md="24" className="text-center">
                      <Form.Item>
                        <Button
                          className="btn btn-gradient-info"
                          color="gradient-info"
                          type="submit"
                        >
                          {t("X_Trade_Button_Add")}
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          htmlType="button"
                          className="btn btn-gradient-secondary"
                          color="gradient-secondary"
                          onClick={resetFormCashTrans}
                        >
                          {t("X_Trade_Button_Reset")}
                        </Button>
                        {/* &nbsp;&nbsp;
                        <Button
                          htmlType="button"
                          className="btn btn-gradient-success"
                          color="gradient-success"
                        >
                          {t("X_Trade_Button_Export")}
                        </Button> */}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </TabPane>
            </TabContent>
          </CardBody>
          {/* Cấu hình thời gian ứng trước */}
          <PerfectScrollbar>
            <Modal
              isOpen={storeSystemManagement.isShowPopup}
              toggle={() =>
                (storeSystemManagement.isShowPopup =
                  !storeSystemManagement.isShowPopup)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (storeSystemManagement.isShowPopup =
                    !storeSystemManagement.isShowPopup)
                }
              >
                <Label for="basicInput">
                  <h4>{t("X_Trade_Config_Time_Button")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <ConfigTimeAdv valueUpdate={valueUpdate} />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
        </Card>
      </Fragment>
    );
  });

export default Config;
