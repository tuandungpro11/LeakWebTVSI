import { DatePicker, DatePickerProps, Form, Input } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import locale from "antd/es/date-picker/locale/vi_VN";
import Checkbox, { CheckboxChangeEvent } from "antd/lib/checkbox/Checkbox";
import { selectThemeColors } from "../../../../utility/Utils";
import { customSMSelectStyles } from "../../types";
import Select from "react-select";
import { useHistory, useParams } from "react-router-dom";
import { appStore } from "../../../../stores/appStore";
import { mngAccountStore } from "../../store/mngAccountStore";
import { tradingCodeStore } from "../../store/tradingCodeStore";
import forms from "../../../../navigation/vertical/forms";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Moment } from "../../../../utility/general/Moment";
import moment from "moment";

const FormUpdate = (prop: any) =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const history = useHistory();
    const paramBind = useParams();
    const [valueGender, setValueGender] = useState(true);
    const [valueContract, setValueContract] = useState(false);
    const [valueAmerica, setValueAmerica] = useState(false);
    const [valueSMS, setvValueSMS] = useState(true);
    const [valueEmail, setValueEmail] = useState(false);
    const [valueBIDV, setValueBIDV] = useState(false);
    const [valueLiveInUSA, setValueLiveInUSA] = useState(false);
    const [valueAddInUSA, setValueAddInUSA] = useState(false);
    const [valueAccUSA, setValueAccUSA] = useState(false);
    const [valueMessUSA, setValueMessUSA] = useState(false);
    const [valueBondUSA, setValueBondUSA] = useState(false);
    const [valuePhoneUSA, setValuePhoneUSA] = useState(false);
    const [valueUQUSA, setValueUQUSA] = useState(false);

    const defaultValue = {};
    const disabledDate: DatePickerProps["disabledDate"] = (current) => {
      // Can not select days before today and today
      return current > moment().startOf("day");
    };
    const onChangeGenderMale = (e: CheckboxChangeEvent) => {
      setValueGender(true);
    };
    const onChangeGenderFemale = (e: CheckboxChangeEvent) => {
      setValueGender(false);
    };
    const onChangeSetValueContract = (e: CheckboxChangeEvent) => {
      setValueContract(e.target.checked);
    };
    const onChangeAmericaYes = (e: CheckboxChangeEvent) => {
      setValueAmerica(true);
    };
    const onChangeAmericaNo = (e: CheckboxChangeEvent) => {
      setValueAmerica(false);
    };
    const onChangeValueSMS = (e: CheckboxChangeEvent) => {
      setvValueSMS(e.target.checked);
    };
    const onChangeValueEmail = (e: CheckboxChangeEvent) => {
      setValueEmail(e.target.checked);
    };
    const onChangeBIDV = (e: CheckboxChangeEvent) => {
      setValueBIDV(e.target.checked);
    };
    const onChangeLiveInUSA = (e: CheckboxChangeEvent) => {
      setValueLiveInUSA(e.target.checked);
    };
    const onChangeAddInUSA = (e: CheckboxChangeEvent) => {
      setValueAddInUSA(e.target.checked);
    };
    const onChangeAccUSA = (e: CheckboxChangeEvent) => {
      setValueAccUSA(e.target.checked);
    };
    const onChangeMessUSA = (e: CheckboxChangeEvent) => {
      setValueMessUSA(e.target.checked);
    };
    const onChangeBondUSA = (e: CheckboxChangeEvent) => {
      setValueBondUSA(e.target.checked);
    };
    const onChangePhoneUSA = (e: CheckboxChangeEvent) => {
      setValuePhoneUSA(e.target.checked);
    };
    const onChangeUQUSA = (e: CheckboxChangeEvent) => {
      setValueUQUSA(e.target.checked);
    };
    const getSaleInfo = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        FunctionCode: "IW_CA_Customer", //tam thoi de function code la man hinh gan lich hen
        SaleID: valueForm.saleID,
      };
      mngAccountStore.getSaleInfo(param);
    };
    const getTvsiList = () => {
      const param = {
        UserName: appStore.account.LoginName,
      };
      mngAccountStore.getTvsiList(param);
    };
    const getTvsiDetail = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        ManCode: valueForm.tvsi ? valueForm.tvsi.ManCode : "",
      };
      mngAccountStore.getTvsiDetail(param);
    };
    const getNational = () => {
      const param = {
        UserName: appStore.account.LoginName,
      };
      mngAccountStore.getNational(param);
    };

    const UpdateTradingCode = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        Id: paramBind.Id,
        FullName: valueForm.custName ? valueForm.custName:"",
        BirthDay: valueForm.dob ? Moment.formatDateNew(valueForm.dob._d, "YY/MM/yyyy"):"",
        Gender: valueGender === true ? 1 : 0,
        CardId: valueForm.cardId ? valueForm.cardId :"",
        IssueDate: valueForm.passportDate ? Moment.formatDateNew(
          valueForm.passportDate._d,
          "DD/MM/yyyy"
        ):"",
        IssuePlace: valueForm.passportPlace ? valueForm.passportPlace:"",
        Address: valueForm.addressPermanent ? valueForm.addressPermanent:"",
        AddressVn: valueForm.addressPermanentVn ? valueForm.addressPermanentVn:"",
        NationalityCode: valueForm.national.NationalityCode ? valueForm.national.NationalityCode:"",
        NationalityName: valueForm.national.NationalityName ? valueForm.national.NationalityName:"",
        ManTvsi: valueForm.tvsi.ManCode ? valueForm.tvsi.ManCode:"",
        ManPosition: valueForm.tvsiPosition ? valueForm.tvsiPosition:"",
        ManAnPower: valueForm.tvsiAuthorityNo ? valueForm.tvsiAuthorityNo:"",
        ManDateAnPower: valueForm.tvsiAuthorDate ? valueForm.tvsiAuthorDate:"",
        ManCardId: valueForm.tvsiIdentity ? valueForm.tvsiIdentity:"",
        ManIssueDate: valueForm.tvsiIdentityDate ? valueForm.tvsiIdentityDate:"",
        ManIssuePlace: valueForm.tvsiIdentityPlace ? valueForm.tvsiIdentityPlace:"",
        SaleID: valueForm.saleID ? valueForm.saleID:"",
        TradingResultSms: valueSMS,
        TradingResultEmail: valueEmail,
        Phone01: valueForm.phone1 ? valueForm.phone1:"",
        Phone02: valueForm.phone2 ? valueForm.phone2:"",
        Email: valueForm.email ? valueForm.email:"",
        BidvService: valueBIDV,
        BankAccountNo: valueForm.bankAccountNo ? valueForm.bankAccountNo:"",
        BankAccountName: valueForm.bankAccountName ? valueForm.bankAccountName:"",
        BankNo: valueForm.bankNo ? valueForm.bankNo:"",
        SubBranchNo: valueForm.bankBranch ? valueForm.bankBranch:"",
      };
      tradingCodeStore.UpdateTradingCode(param);
      // history.replace("/open-account/trading-code");
    };

    useEffect(() => {
      getTvsiList();
      getNational();
      const param = {
        UserName: appStore.account.LoginName,
        Id: parseInt(paramBind.Id),
      };
      tradingCodeStore.getDetailTradingCode(param);
    }, []);
    useEffect(() => {
      if (Object.keys(mngAccountStore.dataTvsiDetail).length > 0) {
        form.setFieldsValue({
          tvsiPosition: mngAccountStore.dataTvsiDetail.ManPosition,
          tvsiAuthorityNo: mngAccountStore.dataTvsiDetail.ManAnPower,
          tvsiAuthorDate: mngAccountStore.dataTvsiDetail.ManDateAnPower,
          tvsiIdentity: mngAccountStore.dataTvsiDetail.ManCardId,
          tvsiIdentityPlace: mngAccountStore.dataTvsiDetail.ManIssuePlace,
          tvsiIdentityDate: mngAccountStore.dataTvsiDetail.ManIssueDate,
        });
      }
    }, [mngAccountStore.dataTvsiDetail]);
    useEffect(() => {
      if (Object.keys(tradingCodeStore.dataDetailTradingCode).length > 0) {
        form.setFieldsValue({
          custName:
            tradingCodeStore.dataDetailTradingCode.FullName == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.FullName,
          dob: tradingCodeStore.dataDetailTradingCode.BirthDay == null ? "": moment(new Date(tradingCodeStore.dataDetailTradingCode.BirthDay)),
          cardId:
            tradingCodeStore.dataDetailTradingCode.CardId == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.CardId,
          passportDate: tradingCodeStore.dataDetailTradingCode.IssueDate == null ? "": moment(new Date(tradingCodeStore.dataDetailTradingCode.IssueDate)),
          passportExpDate: "",
          passportPlace:
            tradingCodeStore.dataDetailTradingCode.IssuePlace == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.IssuePlace,
          addressPermanent:
            tradingCodeStore.dataDetailTradingCode.Address == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.Address,
          addressPermanentVn:
            tradingCodeStore.dataDetailTradingCode.AddressVn == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.AddressVn,
          saleID:
            tradingCodeStore.dataDetailTradingCode.SaleID == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.SaleID,
          tvsi: mngAccountStore.dataTvsiList.filter(
            (item) =>
              item.ManCode == tradingCodeStore.dataDetailTradingCode.ManTvsi
          )[0],
          tvsiPosition:
            tradingCodeStore.dataDetailTradingCode.ManPosition == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.ManPosition,
          tvsiAuthorityNo:
            tradingCodeStore.dataDetailTradingCode.ManAnPower == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.ManAnPower,
          tvsiAuthorDate:
            tradingCodeStore.dataDetailTradingCode.ManDateAnPower == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.ManDateAnPower == null,
          tvsiIdentity:
            tradingCodeStore.dataDetailTradingCode.ManCardId == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.ManCardId,
          tvsiIdentityDate: tradingCodeStore.dataDetailTradingCode.ManIssueDate == null ? "": moment(new Date(tradingCodeStore.dataDetailTradingCode.ManIssueDate)),
          tvsiIdentityPlace:
            tradingCodeStore.dataDetailTradingCode.ManIssuePlace == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.ManIssuePlace,
          phone1:
            tradingCodeStore.dataDetailTradingCode.Phone01 == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.Phone01,
          phone2:
            tradingCodeStore.dataDetailTradingCode.Phone02 == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.Phone02,
          email:
            tradingCodeStore.dataDetailTradingCode.Email == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.Email,
          bankAccountNo:
            tradingCodeStore.dataDetailTradingCode.BankAccountNo == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.BankAccountNo,
          bankAccountName:
            tradingCodeStore.dataDetailTradingCode.BankAccountName == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.BankAccountNam,
          bankNo:
            tradingCodeStore.dataDetailTradingCode.BankNo == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.BankNo,
          bankBranch:
            tradingCodeStore.dataDetailTradingCode.SubBranchNo == null
              ? ""
              : tradingCodeStore.dataDetailTradingCode.SubBranchNo,
          national: mngAccountStore.dataNationList.filter(item => item.NationalityCode === tradingCodeStore.dataDetailTradingCode.NationalityCode)[0],
        });
        setValueGender(
          tradingCodeStore.dataDetailTradingCode.Gender == 1 ? true : false
        );
        setValueContract(false);
        setValueAmerica(false);
        setvValueSMS(tradingCodeStore.dataDetailTradingCode.TradingResultSms);
        setValueEmail(
          tradingCodeStore.dataDetailTradingCode.TradingResultEmail
        );
        setValueBIDV(tradingCodeStore.dataDetailTradingCode.BidvService);
      }
    }, [tradingCodeStore.dataDetailTradingCode]);
    useEffect(() => {
      if (Object.keys(mngAccountStore.dataSaleInfo).length > 0) {
        form.setFieldsValue({
          nameSale:
            mngAccountStore.dataSaleInfo.SaleName == null
              ? ""
              : mngAccountStore.dataSaleInfo.SaleName,
        });
      }
    }, [mngAccountStore.dataSaleInfo]);
    return (
      <Fragment>
        <Card>
          <CardHeader>
            <h4>{t("Update_Trading_Code_Block")}</h4>
          </CardHeader>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={UpdateTradingCode}
              colon={false}
            >
              <Row>
                <Col lg="24" md="24" xs="24">
                  <h4>
                    <b>{t("Regist_Trading_Code_Block")}</b>
                  </h4>
                </Col>
                <Col lg="24" md="24" xs="24">
                  <div className="divider divider-info divider-left">
                    <div className="divider-text">{t("Basic_Infor")}</div>
                  </div>
                </Col>

                <Col lg="12" md="12">
                  <Form.Item
                    label={t("FullName")}
                    name="custName"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Họ và tên không được để trống",
                      },
                      {
                        whitespace: true,
                        message: "Họ và tên không được để trống",
                      },
                    ]}
                  >
                    <Input
                      size="small"
                      placeholder={t("FullName")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("Birthday")}
                    name="dob"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Ngày sinh không được để trống",
                      },
                    ]}
                  >
                    <DatePicker
                      locale={locale}
                      format={"DD-MM-yyyy"}
                      size="small"
                      style={{ width: "100%" }}
                      className="ant-picker-small-custom"
                      placeholder={t("Birthday")}
                      disabledDate={disabledDate}
                    />
                  </Form.Item>
                </Col>

                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Passport_input")}
                    name="cardId"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Số hộ chiếu không được để trống",
                      },
                      {
                        whitespace: true,
                        message: "Số hộ chiếu không được để trống",
                      },
                    ]}
                  >
                    <Input
                      size="small"
                      placeholder={t("Passport_input")}
                      autoComplete="Off"
                      type="number"
                      // onChange={(object) => {
                      //   if (object.target.value.length > 6) {
                      //     form.setFieldsValue({
                      //       CustomerID: object.target.value.slice(0, 6),
                      //     });
                      //   }
                      // }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Sex")}
                    name="Gender"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Checkbox
                      onChange={onChangeGenderMale}
                      checked={valueGender}
                      className="twork-check-box"
                    >
                      Nam
                    </Checkbox>
                    &nbsp;
                    <Checkbox
                      onChange={onChangeGenderFemale}
                      checked={!valueGender}
                      className="twork-check-box"
                    >
                      Nữ
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("National")}
                    name="national"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Quốc tịch không được để trống",
                      },
                    ]}
                  >
                    {mngAccountStore.dataNationList.length > 0 ? (
                      <Select
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        options={mngAccountStore.dataNationList}
                        isClearable={false}
                        styles={customSMSelectStyles}
                        placeholder={t("National")}
                        getOptionLabel={(option: any) => option.NationalityName}
                        getOptionValue={(option: any) => option.NationalityCode}
                        noOptionsMessage={() => "Không có dữ liệu...."}
                        // onChange={getTvsiDetail}
                      />
                    ) : (
                      <Select
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        // options={SaleTypeOption}
                        // defaultValue={SaleTypeOption[0]}
                        isClearable={false}
                        styles={customSMSelectStyles}
                        placeholder={t("National")}
                        noOptionsMessage={() => "Không có dữ liệu...."}
                      />
                    )}
                  </Form.Item>
                </Col>

                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Passport_Date")}
                    name="passportDate"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Ngày cấp không được để trống",
                      },
                    ]}
                  >
                    <DatePicker
                      locale={locale}
                      format={"DD-MM-yyyy"}
                      size="small"
                      style={{ width: "100%" }}
                      className="ant-picker-small-custom"
                      placeholder={t("Passport_Date")}
                      disabledDate={disabledDate}
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("X_Trade_Exp_Date")}
                    name="passportExpDate"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Ngày cấp không được để trống",
                      },
                    ]}
                  >
                    <DatePicker
                      locale={locale}
                      format={"DD-MM-yyyy"}
                      size="small"
                      style={{ width: "100%" }}
                      className="ant-picker-small-custom"
                      placeholder={t("X_Trade_Exp_Date")}
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Passport_Place")}
                    name="passportPlace"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Nơi cấp không được để trống",
                      },
                      {
                        whitespace: true,
                        message: "Nơi cấp không được để trống",
                      },
                    ]}
                  >
                    <Input
                      size="small"
                      placeholder={t("Passport_Place")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>

                <Col lg="24" md="24">
                  <Form.Item
                    label={t("Address_Permanent")}
                    name="addressPermanent"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Địa chỉ thường trú không được để trống",
                      },
                      {
                        whitespace: true,
                        message: "Địa chỉ thường trú không được để trống",
                      },
                    ]}
                  >
                    <Input
                      size="small"
                      placeholder={t("Address_Permanent")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>

                <Col lg="24" md="24">
                  <Form.Item
                    label={t("Address_Contact")}
                    name="addressPermanentVn"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("Address_Contact")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>

                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Contract_Include")}
                    name="Gender"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Checkbox
                      onChange={onChangeSetValueContract}
                      checked={valueContract}
                      className="twork-check-box"
                    >
                      HĐ thường
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" xs="24">
                  &nbsp;
                </Col>

                <Col lg="12" md="12">
                  <Form.Item
                    label={t("SaleId")}
                    name="saleID"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("SaleId")}
                      autoComplete="Off"
                      type="text"
                      onBlur={getSaleInfo}
                    />
                  </Form.Item>
                </Col>
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("FullName_Sale")}
                    name="nameSale"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("FullName_Sale")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>

                <Col lg="12" md="12">
                  <Form.Item
                    label={t("X_Trade_Branch_Bank_No")}
                    name="branchCodeSale"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Branch_Bank_No")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("X_Trade_Branch_Bank_Name")}
                    name="branchNameSale"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Branch_Bank_Name")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>

                <Col lg="24" md="24">
                  <Form.Item
                    label={t("Is_American")}
                    name="Gender"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Checkbox
                      onChange={onChangeAmericaYes}
                      checked={valueAmerica}
                      className="twork-check-box"
                    >
                      Có
                    </Checkbox>
                    &nbsp;
                    <Checkbox
                      onChange={onChangeAmericaNo}
                      checked={!valueAmerica}
                      className="twork-check-box"
                    >
                      Không
                    </Checkbox>
                  </Form.Item>
                </Col>
                {/* Chi hien thi neu tick vao hoa ky */}
                <Col lg="24" md="24" hidden={!valueAmerica}>
                  <Form.Item
                    label={t("Is_American")}
                    name="Gender"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Checkbox
                      // onChange={onChangeGTDV}
                      checked={valueLiveInUSA}
                      className="twork-check-box"
                      onChange={onChangeLiveInUSA}
                    >
                      CD/ đối tượng cư trú tại Hoa Kỳ
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" hidden={!valueAmerica}>
                  <Form.Item
                    label={t("Is_American")}
                    name="Gender"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Checkbox
                      // onChange={onChangeGTDV}
                      checked={valueAddInUSA}
                      className="twork-check-box"
                      onChange={onChangeAddInUSA}
                    >
                      Có địa chỉ nhận thư/ địa chỉ lưu ký tại Hoa Kỳ
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" hidden={!valueAmerica}>
                  <Form.Item
                    label={t("Is_American")}
                    name="Gender"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Checkbox
                      // onChange={onChangeGTDV}
                      checked={valueAccUSA}
                      className="twork-check-box"
                      onChange={onChangeAccUSA}
                    >
                      Có lệnh định kỳ chuyển khoản vào một TK mở tại Hoa Kỳ/
                      nhận chỉ thị thường xuyên từ một địa chỉ tại Hoa Kỳ
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" hidden={!valueAmerica}>
                  <Form.Item
                    label={t("Is_American")}
                    name="Gender"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Checkbox
                      // onChange={onChangeGTDV}
                      checked={valueMessUSA}
                      className="twork-check-box"
                      onChange={onChangeMessUSA}
                    >
                      Có SD địa chỉ nhận thư hộ/ giữ thư tại Hoa Kỳ
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" hidden={!valueAmerica}>
                  <Form.Item
                    label={t("Is_American")}
                    name="Gender"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Checkbox
                      // onChange={onChangeGTDV}
                      checked={valueBondUSA}
                      className="twork-check-box"
                      onChange={onChangeBondUSA}
                    >
                      Nơi sinh tại Hoa Kỳ
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" hidden={!valueAmerica}>
                  <Form.Item
                    label={t("Is_American")}
                    name="Gender"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Checkbox
                      // onChange={onChangeGTDV}
                      checked={valuePhoneUSA}
                      className="twork-check-box"
                      onChange={onChangePhoneUSA}
                    >
                      Có SĐT liên lạc tại Hoa Kỳ
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" hidden={!valueAmerica}>
                  <Form.Item
                    label={t("Is_American")}
                    name="Gender"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Checkbox
                      // onChange={onChangeGTDV}
                      checked={valueUQUSA}
                      className="twork-check-box"
                      onChange={onChangeUQUSA}
                    >
                      Có giấy UQ/ đơn UQ ký còn hiệu lực cấp cho một đối tượng
                      có địa chỉ tại Hoa Kỳ liên quan tới TK của KH
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Col lg="24" md="24" xs="24">
                  <div className="divider divider-info divider-left">
                    <div className="divider-text">{t("Advanced_Infor")}</div>
                  </div>
                </Col>

                <Col lg="8" md="8">
                  <Form.Item
                    label={t("TVSI")}
                    name="tvsi"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    {mngAccountStore.dataTvsiList.length > 0 ? (
                      <Select
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        options={mngAccountStore.dataTvsiList}
                        isClearable={false}
                        styles={customSMSelectStyles}
                        placeholder={"Chọn đại diện TVSI..."}
                        getOptionLabel={(option: any) =>
                          option.ManCode + " - " + option.ManName
                        }
                        getOptionValue={(option: any) => option.ManCode}
                        onChange={getTvsiDetail}
                        noOptionsMessage={() => "Không có dữ liệu...."}
                      />
                    ) : (
                      <Select
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        // options={SaleTypeOption}
                        // defaultValue={SaleTypeOption[0]}
                        isClearable={false}
                        styles={customSMSelectStyles}
                        placeholder={"Chọn đại diện TVSI..."}
                        noOptionsMessage={() => "Không có dữ liệu...."}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Position_office")}
                    name="tvsiPosition"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("Position_office")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  &nbsp;
                </Col>

                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Authority_No")}
                    name="tvsiAuthorityNo"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("Authority_No")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Passport_Date")}
                    name="tvsiAuthorDate"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <DatePicker
                      locale={locale}
                      format={"DD-MM-yyyy"}
                      size="small"
                      style={{ width: "100%" }}
                      className="ant-picker-small-custom"
                      placeholder={t("Passport_Date")}
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  &nbsp;
                </Col>

                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Identity_Number")}
                    name="tvsiIdentity"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("Identity_Number")}
                      autoComplete="Off"
                      type="number"
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Passport_Date")}
                    name="tvsiIdentityDate"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <DatePicker
                      locale={locale}
                      format={"DD-MM-yyyy"}
                      size="small"
                      style={{ width: "100%" }}
                      className="ant-picker-small-custom"
                      placeholder={t("Passport_Date")}
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Passport_Place")}
                    name="tvsiIdentityPlace"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("Passport_Place")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>

                <Col lg="24" md="24" xs="24">
                  <h4>
                    <b>{t("Regist_Service")}</b>
                  </h4>
                </Col>

                <Col lg="24" md="24">
                  <Form.Item
                    label={t("Receive_By_sms")}
                    name="Gender"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Checkbox
                      onChange={onChangeValueSMS}
                      checked={valueSMS}
                      className="twork-check-box"
                    >
                      Qua SMS(8.800đ/tháng)
                    </Checkbox>
                    &nbsp;
                    <Checkbox
                      onChange={onChangeValueEmail}
                      checked={valueEmail}
                      className="twork-check-box"
                    >
                      Qua Email
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Email")}
                    name="email"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("Email")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label="Số điện thoại 1"
                    name="phone1"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Số điện thoại không được để trống",
                      },
                    ]}
                  >
                    <Input
                      size="small"
                      placeholder="Số điện thoại 1"
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 10) {
                          form.setFieldsValue({
                            CustomerID: object.target.value.slice(0, 10),
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label="Số điện thoại 2"
                    name="phone2"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder="Số điện thoại 2"
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 10) {
                          form.setFieldsValue({
                            CustomerID: object.target.value.slice(0, 10),
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col lg="24" md="24">
                  <Form.Item
                    label={t("BIDV_Service")}
                    name="Gender"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Checkbox
                      onChange={onChangeBIDV}
                      checked={valueBIDV}
                      className="twork-check-box"
                    >
                      TK có đăng ký dịch vụ @BIDV
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Account_Bank_Name")}
                    name="bankAccountName"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("Account_Bank_Name")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("X_Trade_Bank_Name")}
                    name="bankNo"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Bank_Name")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8" xs="8">
                  &nbsp;
                </Col>

                <Col lg="8" md="8">
                  <Form.Item
                    label={t("X_Trade_Bank_Account")}
                    name="bankAccountNo"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Bank_Account")}
                      autoComplete="Off"
                      type="number"
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("X_Trade_Branch_Name")}
                    name="bankBranch"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Branch_Name")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col>

                <Col lg="24" md="24" className="text-center">
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      className="btn btn-gradient-info"
                      color="gradient-info"
                    >
                      {t("X_Trade_Button_Add")}
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
export default FormUpdate;
