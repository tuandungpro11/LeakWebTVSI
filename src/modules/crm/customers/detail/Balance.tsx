// ** Custom Components

import React, { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import { Card, CardHeader, CardTitle, CardBody, Media, TabPane, TabContent, Nav, NavItem, NavLink, Button, PaginationProps, FormGroup, Label, CustomInput, Toast, ToastHeader, ToastBody, Row, Col } from "reactstrap";
import { useObserver } from "mobx-react";
import { Collapse, Form, Input } from "antd";
import styled from "@emotion/styled";
import { crmStore } from "../../store/store";
import { numberUtil } from "../../../../utility/general/NumberUtil";
import { selectThemeColors } from "../../../../utility/Utils";
import { customSMSelectStyles, orderSide, tradingStatus } from "../../types";
import Select from "react-select";
import {
  RetweetOutlined,
  SearchOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { appStore } from "../../../../stores/appStore";

const UserBalance = (userInfo: any) =>
  useObserver(() => {
    const userDetail = userInfo.userSelected;
    const [expandBank, setExpandBank] = useState(true);
    const [expandAccount, setExpandAccount] = useState(true);
    const { Panel } = Collapse;
    const [active, setActive] = useState(1);
    const [form] = Form.useForm();
    const { t } = useTranslation();

    useEffect(() => {
      if (userDetail) {
        // crmStore.getCustomerInfo(userDetail.id);
        crmStore.getCustomerBalance("000198");
        crmStore.getOrderStatus();
      }
    }, [])

    const toggle = (tab: any) => {
      if (active !== tab) {
        setActive(tab);
      }
    };

    const onClickButtonSearch = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: "0011-001",
        Custcode: "000515",
        StockCode: valueForm.StockCode ? valueForm.StockCode.trim() : "",
        Side: valueForm.Side.value !== null ? valueForm.Side.value : valueForm.Side,
        OrderStatus: valueForm.OrderStatus.Value,
      };
      crmStore.getTradingDailyDetail(param);
    };

    const defaultValue = {
      StockCode: crmStore.listLeadSource[0],
      Side: orderSide[0],
      OrderStatus: crmStore.listTradingStatus[0],
    };

    const resetForm = () => {
      form.resetFields();
      onClickButtonSearch();
    };

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Nav pills className="mb-0 justify-content-center">

              <NavItem className="d-flex">

                <NavLink
                  active={active === 1}
                  onClick={() => {
                    toggle(1);
                  }}
                >
                  {'Số dư hiện tại'}
                </NavLink>
                <NavLink
                  active={active === 2}
                  onClick={() => {
                    toggle(2);
                  }}
                >
                  {'Giao dịch trong ngày'}
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent className="py-50" activeTab={active}>

              <TabPane tabId={1}>
                <Row className="justify-content-center">
                  <Col sm={24} md={16}>
                    <Collapse defaultActiveKey={['1']} ghost expandIconPosition={"end"}>
                      <Panel header="Số dư có thể rút" key="1">
                        <ListInfo className="list-unstyled custom-list-unstyled">
                          <ListItem className="mb-75 d-flex">
                            <ListItemValue className="d-flex fw-bolder me-25">{crmStore.detailCustomerBalance?.CashBalanceWithDrawal.AccountNo}</ListItemValue>
                            <ListItemValue className="d-flex justify-content-end">{numberUtil.formatNumber(crmStore.detailCustomerBalance?.CashBalanceWithDrawal.MaxWithdrawalAccount)}</ListItemValue>
                          </ListItem>
                          <ListItem className="mb-75 d-flex">
                            <ListItemValue className="d-flex fw-bolder me-25">{crmStore.detailCustomerBalance?.CashBalanceWithDrawal.AccountNoMargin}</ListItemValue>
                            <ListItemValue className="d-flex justify-content-end">{numberUtil.formatNumber(crmStore.detailCustomerBalance?.CashBalanceWithDrawal.MaxWithdrawalAccountMargin)}</ListItemValue>
                          </ListItem>
                        </ListInfo>
                      </Panel>
                      <Panel header="Số dư chứng khoán" key="2">
                        <ListInfo className="list-unstyled custom-list-unstyled">
                          {
                            crmStore.detailCustomerBalance?.StockBalance.map((bank) => (
                              <ListItem className="mb-h1">
                                <Toast className="custom-toast-account">
                                  <ToastHeader className="custom-toast-header-info">
                                    <div className="d-flex bank-name">{bank.StockCode}</div>
                                    <div className="d-flex bank-name justify-content-end" style={{ color: bank.StockTypeColor }}>{bank.StockTypeName}</div>
                                  </ToastHeader>
                                  <ToastBody className="toast-body-share-holder d-flex">
                                    <div className="d-flex share-holder-info">Khối lượng: {numberUtil.formatNumber(bank.Volume)}</div>
                                    <div className="d-flex share-holder-info">{bank.AccountNo}</div>
                                    <div className="d-flex share-holder-info">Giá mua TB: {numberUtil.formatNumber(bank.AvgPrice)}</div>
                                  </ToastBody>
                                </Toast>
                              </ListItem>
                            ))
                          }
                        </ListInfo>
                      </Panel>
                    </Collapse>

                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId={2}>

                <Card>
                  <CardBody>
                    <Form
                      layout={"vertical"}
                      form={form}
                      onFinish={onClickButtonSearch}
                      initialValues={defaultValue}
                      requiredMark={false}
                    >
                      <Row>
                        <Col lg="8" md="8">
                          <Form.Item label="Mã CK" name="StockCode">
                            <Input
                              size="small"
                              placeholder="Mã CK"
                              autoComplete="off"
                            />
                          </Form.Item>
                        </Col>
                        <Col lg="8" md="8">
                          <Form.Item label="Loại lệnh" name="Side">
                            <Select
                              theme={selectThemeColors}
                              className="react-select react-select-sm"
                              classNamePrefix="select"
                              options={orderSide}
                              defaultValue={orderSide[0]}
                              isClearable={false}
                              noOptionsMessage={() => "Không có dữ liệu...."}
                              styles={customSMSelectStyles}
                              placeholder={"Chọn loại lệnh..."}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg="8" md="8">
                          <Form.Item label="Loại trạng thái" name="OrderStatus">
                            <Select
                              theme={selectThemeColors}
                              className="react-select react-select-sm"
                              classNamePrefix="select"
                              options={crmStore.listTradingStatus}
                              defaultValue={crmStore.listTradingStatus[0]}
                              isClearable={false}
                              styles={customSMSelectStyles}
                              noOptionsMessage={() => "Không có dữ liệu...."}
                              getOptionLabel={(option) => option.Name}
                              getOptionValue={(option) => option.Value}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg="24" md="24" className="text-center mt-1 mb-1">
                          <Form.Item className="button-group">
                            <Button
                              htmlType="submit"
                              className="btn btn-gradient-info"
                              color="gradient-info"
                            >
                              <SearchOutlined /> {t("X_Trade_Button_Search")}
                            </Button>{" "}
                            <Button
                              htmlType="button"
                              className="btn btn-gradient-secondary"
                              color="gradient-secondary"
                              onClick={resetForm}
                            >
                              <RetweetOutlined /> {t("X_Trade_Button_Reset")}
                            </Button>{" "}
                          </Form.Item>
                        </Col>
                        <Col lg="24" md="24">
                          <Collapse defaultActiveKey={['1']} ghost expandIconPosition={"end"}>
                            <Panel header="Số lượng khớp" key="1">
                              <ListInfo className="list-unstyled custom-list-unstyled">
                                {
                                  crmStore.listTradingDailyDetail && crmStore.listTradingDailyDetail.TradingDailyVolume?.map((bank) => (
                                    <ListItem className="mb-h1">
                                      <Toast className="custom-toast-account" style={{border: '1px solid', borderColor: bank.Side === 'S' ? "#C20E11" : "#34A853"}}>
                                        <ToastHeader className="custom-toast-header-info">
                                          <div className="d-flex bank-name">{bank.StockCode}</div>
                                          <div className="d-flex bank-name justify-content-end" style={{ color: bank.Side === 'S' ? "#C20E11" : "#34A853" }}>{bank.Side === 'S' ? "BÁN" : "MUA"}</div>
                                        </ToastHeader>
                                        <ToastBody className="toast-body-share-holder d-flex">
                                          <div className="d-flex share-holder-info">{bank.AccountNo}</div>
                                          <div className="d-flex share-holder-info"></div>
                                          <div className="d-flex share-holder-info">Khối lượng: {numberUtil.formatNumber(bank.Volume)}</div>
                                          <div className="d-flex share-holder-info">Giá khớp TB: {numberUtil.formatNumber(bank.AvgPrice)}</div>
                                        </ToastBody>
                                      </Toast>
                                    </ListItem>
                                  ))
                                }
                              </ListInfo>
                            </Panel>
                            <Panel header="Lệnh đặt" key="2">
                              <ListInfo className="list-unstyled custom-list-unstyled">
                                {
                                  crmStore.listTradingDailyDetail && crmStore.listTradingDailyDetail.TradingDailyOrder?.map((bank) => (
                                    <ListItem className="mb-h1">
                                      <Toast className="custom-toast-account" style={{border: '1px solid', borderColor: bank.Side === 'S' ? "#C20E11" : "#34A853"}}>
                                        <ToastHeader className="custom-toast-header-info">
                                          <div className="d-flex bank-name">{bank.StockCode}</div>
                                          <div className="d-flex bank-name justify-content-end" style={{ color: bank.Side === 'S' ? "#C20E11" : "#34A853" }}>{bank.Side === 'S' ? "BÁN" : "MUA"}</div>
                                        </ToastHeader>
                                        <ToastBody className="toast-body-share-holder d-flex">
                                          <div className="d-flex share-holder-info">Số hiệu lệnh: {bank.OrderNo}</div>
                                          <div className="d-flex share-holder-info">{bank.OrderTime}</div>
                                          <div className="d-flex share-holder-info">KL đặt: {numberUtil.formatNumber(bank.Volume)}</div>
                                          <div className="d-flex share-holder-info">Giá đặt: {numberUtil.formatNumber(bank.OrderPrice)}</div>
                                          <div className="d-flex share-holder-info">KL khớp: {numberUtil.formatNumber(bank.MatchVolume)}</div>
                                          <div className="d-flex share-holder-info">Giá khớp TB: {numberUtil.formatNumber(bank.AvgPrice)}</div>
                                          <div className="d-flex share-holder-info">KL hủy: {numberUtil.formatNumber(bank.CancelVolume)}</div>
                                          <div className="d-flex share-holder-info">{bank.OrderDescription}</div>
                                        </ToastBody>
                                      </Toast>
                                    </ListItem>
                                  ))
                                }
                              </ListInfo>
                            </Panel>
                          </Collapse>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default UserBalance;

const ListInfo = styled.ul``;
const ListItem = styled.li``;
const ListItemSmall = styled.li`
  font-size: .85rem;
`;
const ListItemValue = styled.span`
  flex: 1 auto;
`;