import { DatePicker, DatePickerProps, Form, Input } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import locale from "antd/es/date-picker/locale/vi_VN";
import Checkbox, { CheckboxChangeEvent } from "antd/lib/checkbox/Checkbox";
import Select from "react-select";
import { selectThemeColors } from "../../../utility/Utils";
import { customSMSelectStyles, othersContractOpenAccount } from "../types";
import { use } from "i18next";
import makeAnimated from "react-select/animated";
import { appStore } from "../../../stores/appStore";
import { mngAccountStore } from "../store/mngAccountStore";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Moment } from "../../../utility/general/Moment";
import moment from "moment";

const FormUpdate = (prop: any) =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const valueBind = prop.prop;
    const animatedComponents = makeAnimated();
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

    const UpdateAccount = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        Id: valueBind.Id,
        ProfileType: 1,
        CustomerCode: valueForm.custCode,
        TradingCode: valueForm.tradingCode,
        TradingCodeIssueDate: Moment.formatDateNew(valueForm.dateTradingCode._d,"DD/MM/yyyy"),
        TradingCodeIssuePlace: valueForm.placeTradingCode,
        FullName: valueForm.custName,
        BirthDay: Moment.formatDateNew(valueForm.dob._d,"DD/MM/yyyy"),
        Gender: valueGender === true ? 1 : 0,
        CardId: valueForm.cardId,
        IssueDate: Moment.formatDateNew(valueForm.passportDate._d,"DD/MM/yyyy"),
        IssuePlace: valueForm.passportPlace,
        Address: valueForm.addressPermanent,
        AddressVn: valueForm.addressPermanentVn,
        NationalityCode: valueForm.national.NationalityCode,
        NationalityName: valueForm.national.NationalityName,
        ManTvsi: valueForm.tvsi.ManCode,
        ManPosition: valueForm.tvsiPosition,
        ManAnPower: valueForm.tvsiAuthorityNo,
        ManDateAnPower: valueForm.tvsiAuthorDate,
        ManCardId: valueForm.tvsiIdentity,
        ManIssueDate: valueForm.tvsiIdentityDate,
        ManIssuePlace: valueForm.tvsiIdentityPlace,
        SaleID: valueForm.saleID,
        TradingResultSms: valueSMS,
        TradingResultEmail: valueEmail,
        Phone01: valueForm.phone1,
        Phone02: valueForm.phone2,
        Email: valueForm.email,
        BidvService: valueBIDV,
        BankAccountNo: valueForm.bankAccountNo,
        BankAccountName: valueForm.bankAccountName,
        BankNo: valueForm.bankNo,
        SubBranchNo: valueForm.bankBranch,
        SourceAccount: 0,
      };
      // mngAccountStore.addNewAccount(param);
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
    const getSaleInfo = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        FunctionCode: "IW_CA_Customer", //tam thoi de function code la man hinh gan lich hen
        SaleID: valueForm.saleID,
      };
      mngAccountStore.getSaleInfo(param);
    };

    useEffect(() => {
      getTvsiList();
      getNational();
      const param = {
        UserName: appStore.account.LoginName,
        Id: valueBind.Id,
      };
      mngAccountStore.getDetailAccount(param);
    }, []);
    useEffect(()=>{
      if(Object.keys(mngAccountStore.dataDetailAccount).length>0){
        form.setFieldsValue({
          custCode: mngAccountStore.dataDetailAccount.CustomerCode == null ? "": mngAccountStore.dataDetailAccount.CustomerCode,
          dateTradingCode: mngAccountStore.dataDetailAccount.TradingCodeIssueDate == null ? "": moment(new Date(mngAccountStore.dataDetailAccount.TradingCodeIssueDate)),
          placeTradingCode: mngAccountStore.dataDetailAccount.TradingCodeIssuePlace == null ? "": mngAccountStore.dataDetailAccount.TradingCodeIssuePlace,
          custName: mngAccountStore.dataDetailAccount.FullName == null ? "": mngAccountStore.dataDetailAccount.FullName,
          dob: mngAccountStore.dataDetailAccount.BirthDay == null ? "": moment(new Date(mngAccountStore.dataDetailAccount.BirthDay)),
          cardId: mngAccountStore.dataDetailAccount.CardId == null ? "": mngAccountStore.dataDetailAccount.CardId,
          passportDate: mngAccountStore.dataDetailAccount.IssueDate == null ? "": moment(new Date(mngAccountStore.dataDetailAccount.IssueDate)),
          passportPlace: mngAccountStore.dataDetailAccount.IssuePlace == null ? "": mngAccountStore.dataDetailAccount.IssuePlace,
          addressPermanent: mngAccountStore.dataDetailAccount.Address == null ? "": mngAccountStore.dataDetailAccount.Address,
          addressPermanentVn: mngAccountStore.dataDetailAccount.AddressVn == null ? "": mngAccountStore.dataDetailAccount.AddressVn,
          national: mngAccountStore.dataNationList.filter(item => item.NationalityCode === mngAccountStore.dataDetailAccount.NationalityCode)[0],
          // NationalityName: mngAccountStore.dataDetailAccount[0].NationalityName,
          tvsi: mngAccountStore.dataTvsiList.filter(item => item.ManCode === mngAccountStore.dataDetailAccount.ManTvsi)[0],
          tvsiPosition: mngAccountStore.dataDetailAccount.ManPosition == null ? "": mngAccountStore.dataDetailAccount.ManPosition,
          tvsiAuthorityNo: mngAccountStore.dataDetailAccount.ManAnPower == null ? "": mngAccountStore.dataDetailAccount.ManAnPower,
          tvsiAuthorDate: mngAccountStore.dataDetailAccount.ManDateAnPower == null ? "": mngAccountStore.dataDetailAccount.ManDateAnPower == null,
          tvsiIdentity: mngAccountStore.dataDetailAccount.ManCardId == null ? "": mngAccountStore.dataDetailAccount.ManCardId,
          tvsiIdentityDate: mngAccountStore.dataDetailAccount.ManIssueDate == null ? "": moment(new Date(mngAccountStore.dataDetailAccount.ManIssueDate)),
          tvsiIdentityPlace: mngAccountStore.dataDetailAccount.ManIssuePlace == null ? "": mngAccountStore.dataDetailAccount.ManIssuePlace,
          saleID: mngAccountStore.dataDetailAccount.SaleID == null ? "": mngAccountStore.dataDetailAccount.SaleID,
          phone1: mngAccountStore.dataDetailAccount.Phone01 == null ? "": mngAccountStore.dataDetailAccount.Phone01,
          phone2: mngAccountStore.dataDetailAccount.Phone02 == null ? "": mngAccountStore.dataDetailAccount.Phone02,
          email: mngAccountStore.dataDetailAccount.Email == null ? "": mngAccountStore.dataDetailAccount.Email,
          bankAccountNo: mngAccountStore.dataDetailAccount.BankAccountNo == null ? "": mngAccountStore.dataDetailAccount.BankAccountNo,
          bankAccountName: mngAccountStore.dataDetailAccount.BankAccountName == null ? "": mngAccountStore.dataDetailAccount.BankAccountNam,
          bankNo: mngAccountStore.dataDetailAccount.BankNo == null ? "": mngAccountStore.dataDetailAccount.BankNo == null,
          bankBranch: mngAccountStore.dataDetailAccount.SubBranchNo == null ? "": mngAccountStore.dataDetailAccount.SubBranchNo,
        })
        setValueGender(mngAccountStore.dataDetailAccount.Gender == 1 ? true : false)
        setValueContract(false);
        setValueAmerica(false);
        setvValueSMS(mngAccountStore.dataDetailAccount.TradingResultSms)
        setValueEmail(mngAccountStore.dataDetailAccount.TradingResultEmail)
        setValueBIDV(mngAccountStore.dataDetailAccount.BidvService)
      }
    },[mngAccountStore.dataDetailAccount])
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
      if (Object.keys(mngAccountStore.dataSaleInfo).length > 0) {
        form.setFieldsValue({
          nameSale:mngAccountStore.dataSaleInfo.SaleName == null ? "": mngAccountStore.dataSaleInfo.SaleName,
        });
      }
    }, [mngAccountStore.dataSaleInfo]);

    return (
      <Fragment>
        <PerfectScrollbar style={{ maxHeight: "80vh" }}>
          <Card>
            <CardHeader>
              <h4>{t("Open_Account_Personal_Foreign_Title")}</h4>
            </CardHeader>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={UpdateAccount}
              colon={false}
            >
              <Row>
                <Col lg="24" md="24" xs="24">
                  <h4>
                    <b>{t("Regist_Account_Block")}</b>
                  </h4>
                </Col>
                <Col lg="24" md="24" xs="24">
                  <div className="divider divider-info divider-left">
                    <div className="divider-text">{t("Basic_Infor")}</div>
                  </div>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("X_Trade_Bank_Account")}
                    name="custCode"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "S??? t??i kho???n kh??ng ???????c ????? tr???ng",
                      },
                      {
                        whitespace: true,
                        message: "S??? t??i kho???n kh??ng ???????c ????? tr???ng",
                      },
                    ]}
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Bank_Account")}
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 6) {
                          form.setFieldsValue({
                            accNo: object.target.value.slice(0, 6),
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Trading_Code_Date")}
                    name="dateTradingCode"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Ng??y c???p trading code kh??ng ???????c ????? tr???ng",
                      },
                    ]}
                  >
                    <DatePicker
                      locale={locale}
                      format={"DD-MM-yyyy"}
                      size="small"
                      style={{ width: "100%" }}
                      className="ant-picker-small-custom"
                      placeholder={t("Trading_Code_Date")}
                      disabledDate={disabledDate}
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Trading_Code_Place")}
                    name="placeTradingCode"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "N??i c???p trading code kh??ng ???????c ????? tr???ng",
                      },
                      {
                        whitespace: true,
                        message: "N??i c???p trading code kh??ng ???????c ????? tr???ng",
                      },
                    ]}
                  >
                    <Input
                      size="small"
                      placeholder={t("Trading_Code_Place")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
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
                        message: "H??? v?? t??n kh??ng ???????c ????? tr???ng",
                      },
                      {
                        whitespace: true,
                        message: "H??? v?? t??n kh??ng ???????c ????? tr???ng",
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
                        message: "Ng??y sinh kh??ng ???????c ????? tr???ng",
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
                        message: "S??? h??? chi???u kh??ng ???????c ????? tr???ng",
                      },
                      {
                        whitespace: true,
                        message: "S??? h??? chi???u kh??ng ???????c ????? tr???ng",
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
                      // onChange={onChangeGTDV}
                      checked={valueGender}
                      className="twork-check-box"
                      onChange={onChangeGenderMale}
                    >
                      Nam
                    </Checkbox>
                    &nbsp;
                    <Checkbox
                      // onChange={onChangeGTDV}
                      checked={!valueGender}
                      className="twork-check-box"
                      onChange={onChangeGenderFemale}
                    >
                      N???
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
                        message: "Qu???c t???ch kh??ng ???????c ????? tr???ng",
                      }
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
                      noOptionsMessage={() => "Kh??ng c?? d??? li???u...."}
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
                      noOptionsMessage={() => "Kh??ng c?? d??? li???u...."}
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
                        message: "Ng??y c???p kh??ng ???????c ????? tr???ng",
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
                    name="dob"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "Ng??y c???p kh??ng ???????c ????? tr???ng",
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
                        message: "N??i c???p kh??ng ???????c ????? tr???ng",
                      },
                      {
                        whitespace: true,
                        message: "N??i c???p kh??ng ???????c ????? tr???ng",
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
                        message: "?????a ch??? th?????ng tr?? kh??ng ???????c ????? tr???ng",
                      },
                      {
                        whitespace: true,
                        message: "?????a ch??? th?????ng tr?? kh??ng ???????c ????? tr???ng",
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
                      // onChange={onChangeGTDV}
                      checked={valueContract}
                      className="twork-check-box"
                      onChange={onChangeSetValueContract}
                    >
                      H?? th?????ng
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" xs="24">
                  &nbsp;
                </Col>

                <Col lg="8" md="8">
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
                <Col lg="8" md="8">
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
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col lg="12" md="12">
                  <Form.Item
                    label={t("X_Trade_Branch_Name")}
                    name="branchNameSale"
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
                      disabled
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
                      // onChange={onChangeGTDV}
                      checked={valueAmerica}
                      className="twork-check-box"
                      onChange={onChangeAmericaYes}
                    >
                      C??
                    </Checkbox>
                    &nbsp;
                    <Checkbox
                      // onChange={onChangeGTDV}
                      checked={!valueAmerica}
                      className="twork-check-box"
                      onChange={onChangeAmericaNo}
                    >
                      Kh??ng
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
                      CD/ ?????i t?????ng c?? tr?? t???i Hoa K???
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
                      C?? ?????a ch??? nh???n th??/ ?????a ch??? l??u k?? t???i Hoa K???
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
                      C?? l???nh ?????nh k??? chuy???n kho???n v??o m???t TK m??? t???i Hoa K???/ nh???n ch??? th??? th?????ng xuy??n t??? m???t ?????a ch??? t???i Hoa K???
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
                      C?? SD ?????a ch??? nh???n th?? h???/ gi??? th?? t???i Hoa K???
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
                      N??i sinh t???i Hoa K???
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
                      C?? S??T li??n l???c t???i Hoa K???
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
                      C?? gi???y UQ/ ????n UQ k?? c??n hi???u l???c c???p cho m???t ?????i t?????ng c?? ?????a ch??? t???i Hoa K??? li??n quan t???i TK c???a KH
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
                        placeholder={"Ch???n ?????i di???n TVSI..."}
                        getOptionLabel={(option: any) =>
                          option.ManCode + " - " + option.ManName
                        }
                        getOptionValue={(option: any) => option.ManCode}
                        onChange={getTvsiDetail}
                        noOptionsMessage={() => "Kh??ng c?? d??? li???u...."}
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
                        placeholder={"Ch???n ?????i di???n TVSI..."}
                        noOptionsMessage={() => "Kh??ng c?? d??? li???u...."}
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
                      // onChange={onChangeGTDV}
                      checked={valueSMS}
                      className="twork-check-box"
                      onChange={onChangeValueSMS}
                    >
                      Qua SMS(8.800??/th??ng)
                    </Checkbox>
                    &nbsp;
                    <Checkbox
                      // onChange={onChangeGTDV}
                      checked={valueEmail}
                      className="twork-check-box"
                      onChange={onChangeValueEmail}
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
                    label="S??? ??i???n tho???i 1"
                    name="phone1"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                    rules={[
                      {
                        required: true,
                        message: "S??? ??i???n tho???i kh??ng ???????c ????? tr???ng",
                      },
                    ]}
                  >
                    <Input
                      size="small"
                      placeholder="S??? ??i???n tho???i 1"
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
                    label="S??? ??i???n tho???i 2"
                    name="phone2"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder="S??? ??i???n tho???i 2"
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
                      // onChange={onChangeGTDV}
                      checked={valueBIDV}
                      className="twork-check-box"
                      onChange={onChangeBIDV}
                    >
                      TK c?? ????ng k?? d???ch v??? @BIDV
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
                {/* <Col lg="8" md="8">
                  <Form.Item
                    label={t("Province")}
                    name="national"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("Province")}
                      autoComplete="Off"
                      type="text"
                    />
                  </Form.Item>
                </Col> */}
              </Row>
            </Form>
          </CardBody>
          </Card>
        </PerfectScrollbar>

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
      </Fragment>
    );
  });
export default FormUpdate;
