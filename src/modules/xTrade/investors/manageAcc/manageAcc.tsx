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
import { useForm } from "react-hook-form";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@customStyle/xtrade.scss";
import { Label } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";

import { basicColumns, data } from "../../../../views/tables/data-tables/data"; // demo datatable
import { ChevronDown } from "react-feather";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js"

const StatusOption = [
  { value: "All", label: "Tất cả" },
  { value: "1", label: "Chờ duyệt" },
  { value: "2", label: "Chờ HO xác nhận" },
  { value: "3", label: "Chờ KH xác nhận" },
  { value: "4", label: "KH đã kích hoạt" },
  { value: "5", label: "Bị từ chối" },
  { value: "6", label: "Ngừng sử dụng" },
  { value: "7", label: "KH hủy" },
];

const ManageAcc = () => {
  const [valueDate, setvalueDate] = useState(new Date());
  const { t } = useTranslation();
  const { register, errors, handleSubmit } = useForm();

  const onSubmit = (data: any) => {};

  return (
    <Fragment>
      <Card>
        <CardBody>
          <Form
            className="auth-login-form mt-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Row id="titlePage" className="RowTitle">
              <Col lg="24" md="24">
                {t("X_Trade_Investors")}
              </Col>
            </Row>
            <Row id="filterSection" className="filterSection">
              <Col lg="3" md="3">
                <FormGroup>
                <Label for="basicInput">{t("X_Trade_Customer_Id")}</Label>
                  <Input type="text" placeholder="Mã Khách Hàng" />
                </FormGroup>
              </Col>
              <Col lg="3" md="3">
                <FormGroup>
                <Label for="basicInput">{t("X_Trade_Bank_Account")}</Label> 
                <Input type="text" placeholder="Số tài khoản" />
                </FormGroup>
              </Col>
              <Col lg="3" md="3">
                <FormGroup>
                <Label for="basicInput">{t("X_Trade_Status")}</Label>
                  <Select
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    defaultValue={StatusOption[0]}
                    options={StatusOption}
                    isClearable={false}
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
              <Col lg="3" md="3">
                <FormGroup>
                <Label for="basicInput">{t("X_Trade_Date_Range")}</Label>
                  <Flatpickr
                    value={valueDate}
                    id="txtDatePick"
                    className="form-control"
                    onChange={(date: any) => setvalueDate(date)}
                    options={{
                      mode: "range",
                      defaultDate: valueDate,
                      locale: Vietnamese
                    }}
                  />
                </FormGroup>
              </Col>
              <Col lg="3" md="3">
                <FormGroup>
                  <CustomInput
                    inline
                    type="checkbox"
                    id="chkTime"
                    label={t("X_Trade_MngAcc_Time")}
                    defaultChecked
                  />
                </FormGroup>
              </Col>
              <Col lg="8" md="8">
                <FormGroup>
                  <Button
                    className="btn btn-gradient-info"
                    color="gradient-info"
                  >
                    {t("X_Trade_Button_Search")}
                  </Button>
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
            <Row>
              <Col sm="24" md="24">
                <DataTable
                  noHeader
                  pagination
                  data={data}
                  className="react-dataTable"
                  columns={basicColumns}
                  sortIcon={<ChevronDown size={10} />}
                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
                />
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default ManageAcc;
