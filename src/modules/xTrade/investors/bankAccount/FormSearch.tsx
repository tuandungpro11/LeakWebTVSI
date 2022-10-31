import React, { Fragment, useState, useContext, useEffect } from "react";
import themeConfig from "@configs/themeConfig";
import {
  Row,
  Col,
  FormGroup,
  Input,
  Form,
  CustomInput,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import useApi from "@services/UseAppApi";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import Flatpickr from "react-flatpickr";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@customStyle/xtrade.scss";
import DataTable from "react-data-table-component";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// import bankAccountColumn from "../../types"
import { ChevronDown, Loader } from "react-feather";
import { bankAccountColumn, listAPI, pageSizeTable } from "../../types";
import { store } from "../../store/InvestorStore";
import { appStore } from "../../../../stores/appStore";

const StatusOption = [
  { value: -1, label: "Tất cả" },
  { value: 1, label: "Chờ duyệt" },
  { value: 2, label: "Chờ HO xác nhận" },
  { value: 3, label: "Chờ KH xác nhận" },
  { value: 4, label: "KH đã kích hoạt" },
  { value: 5, label: "Bị từ chối" },
  { value: 6, label: "Ngừng sử dụng" },
  { value: 7, label: "KH hủy" },
];

const FormSearch = () => {
  const [valueDate, setValueDate] = useState(new Date());
  const { t } = useTranslation();
  //   const { register, errors, handleSubmit } = useForm();
  //   const SignupSchema = yup.object().shape({
  //     CustomerID: yup.string(),
  //   });
  const { register, getValues, errors, handleSubmit, control } = useForm();
  const [dataListBankAcc, setdataListBankAcc] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    console.log("getValues: ", getValues());
    const param = {
      UserId: appStore.account.LoginName,
      CustomerID: getValues().CustomerID.trim(),
      BankAccountID: -1,
      BankAccount: getValues().BankAccount.trim(),
      IsLike: 1,
      Status: getValues().Status.value,
      FromDate: getValues().txtDate[0] == undefined ? "" : getValues().txtDate[0],
      ToDate: getValues().txtDate[1] == undefined ? "" : getValues().txtDate[1],
      PageIndex: pageIndex,
      PageSize: pageSize,
    };

    store.onSubmit(param);
    // getListBank(param);
  };

  const getListBank = (param: any) => {
    useApi.postRequest(listAPI.listBankAccount, param).then((res: any) => {
      if (res.data.Code === "0") {
        store.dataListBankAcc = res.data.Data;
      } else {
        alert(res.data.RetMsg);
      }
    });
  };
  const handlePageChange = (page: any) => {
    setPageIndex(page);
  };
  const handlePerRowsChange = async (newPerPage: any, page: any) => {
    setLoading(true);
    setPageSize(newPerPage);
  };

  useEffect(() => {
    onSubmit();
  }, [pageIndex, pageSize]);

  return (
    <Fragment>
      <Card>
        <CardBody>
          <Form
            className="auth-login-form mt-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Row id="filterSection" className="filterSection">
              <Col lg="3" md="3">
                <FormGroup>
                  {t("X_Trade_Customer_Id")}
                  <Input
                    type="text"
                    placeholder="Mã Khách Hàng"
                    name="CustomerID"
                    innerRef={register({ required: false })}
                  />
                </FormGroup>
              </Col>
              <Col lg="3" md="3">
                <FormGroup>
                  {t("X_Trade_Bank_Account")}
                  <Input
                    type="text"
                    placeholder="Số tài khoản"
                    name="BankAccount"
                    innerRef={register({ required: false })}
                  />
                </FormGroup>
              </Col>
              <Col lg="3" md="3">
                <FormGroup>
                  {t("X_Trade_Status")}
                  <Controller
                    name="Status"
                    control={control}
                    defaultValue={StatusOption[0]}
                    rules={{ required: true }}
                    innerRef={register({ required: false })}
                    render={(props) => (
                      <Select
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        defaultValue={StatusOption[0]}
                        options={StatusOption}
                        isClearable={false}
                        bsSize="sm"
                        onChange={(e) => props.onChange(e.value)}
                      />
                    )}
                  />
                </FormGroup>
              </Col>
              <Col lg="3" md="3">
                <FormGroup>
                  {t("X_Trade_Date_Range")}
                  <Controller
                    name="txtDate"
                    control={control}
                    defaultValue={valueDate}
                    rules={{ required: true }}
                    innerRef={register({ required: false })}
                    render={(props) => (
                      <Flatpickr
                        value={valueDate}
                        id="txtDatePick"
                        className="form-control"
                        onChange={(date: any) => props.onChange(date)}
                        options={{
                          mode: "range",
                          defaultDate: valueDate,
                        }}
                      />
                    )}
                  />
                </FormGroup>
              </Col>
              {/* <Col lg="3" md="3">
                <FormGroup>
                  <CustomInput
                    inline
                    name="chkTime"
                    type="checkbox"
                    id="chkTime"
                    label={t("X_Trade_MngAcc_Time")}
                    innerRef={register({ required: false })}
                    defaultChecked
                  />
                </FormGroup>
              </Col> */}
              <Col lg="8" md="8">
                <FormGroup>
                  <Button
                    className="btn btn-gradient-secondary"
                    color="gradient-secondary"
                  >
                    {t("X_Trade_Button_Search")}
                  </Button>{" "}
                  &nbsp;&nbsp;
                  <Button
                    className="btn btn-gradient-info"
                    color="gradient-info"
                  >
                    {t("X_Trade_Button_Add_New")}
                  </Button>
                  {/* &nbsp;&nbsp;
                  <Button
                    className="btn btn-gradient-success"
                    color="gradient-success"
                  >
                    {t("X_Trade_Button_Export")}
                  </Button> */}
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default FormSearch;
