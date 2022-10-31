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
  PhoneForwarded,
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

const InfoCall = (valueBind: any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueCallType, setvalueCallType] = useState(false);
    const defaultValue = {
      CustomerID: "",
      FullName: "",
      Phone: "",
    };
    const resetForm = () => {
      form.resetFields();
    };
    const onChangeType = () => {
      const valueForm = form.getFieldsValue();
      setvalueCallType(valueForm.chkChangeType);
    };
    const onSubmitInfoCust = () => {};

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={onSubmitInfoCust}
              requiredMark={false}
            >
              <Row id="filterSection" className="filterSection">
                <Col lg="12" md="12">
                  <Form.Item label={t("Customer_ID")} name="CustomerID">
                    <Input
                      size="small"
                      placeholder={t("Customer_ID")}
                      autoComplete="Off"
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col lg="12" md="12" hidden>
                  <Form.Item>
                    <Button
                      className="btn-sm btn-gradient-primary"
                      color="gradient-primary"
                      htmlType="button"
                    >
                      Kết thúc
                    </Button>
                    <br />
                    Đang gọi: 00:00
                  </Form.Item>
                </Col>
                <Col lg="24" md="24"></Col>
                <Col lg="8" md="8">
                  <Label>Chọn số điện thoại</Label>
                </Col>
                <Col lg="8" md="8">
                  <Label>0123456789</Label> &nbsp;
                  <Button.Ripple
                    className="btn-icon btn-sm"
                    outline
                    color="success"
                  >
                    <PhoneForwarded size={12} />
                  </Button.Ripple>
                </Col>
                <Col lg="8" md="8">
                  <Label>0123456789</Label> &nbsp;
                  <Button.Ripple
                    className="btn-icon btn-sm"
                    outline
                    color="success"
                  >
                    <PhoneForwarded size={12} />
                  </Button.Ripple>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item label={t("twork_cust_type")} name="cust-type">
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
                    <Input placeholder={t("X_Trade_Note")} autoComplete="off" />
                  </Form.Item>
                </Col>
              </Row>
              <Col lg="24" md="24" className="text-center">
                <Form.Item className="text-center mt-2">
                  <Button
                    className="btn btn-gradient-info"
                    color="gradient-info"
                    htmlType="submit"
                  >
                    {t("X_Trade_Button_Add")}
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default InfoCall;
