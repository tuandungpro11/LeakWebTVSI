import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Delete, Edit, List, Loader } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
  UncontrolledButtonDropdown,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Moment } from "../../../../../utility/general/Moment";
import { numberUtil } from "../../../../../utility/general/NumberUtil";
import {
  ErrorToast,
  SuccessProgressToast,
} from "../../../../../views/extensions/toastify/ToastTypes";
import { storeOrder } from "../../../store/OrdersStore";
import { customSMSelectStyles, listAPI, pageSizeTable } from "../../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import { DatePicker, Form, Input, Pagination, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { storeSystemManagement } from "../../../store/SystemManagementStore";
import { appStore } from "../../../../../stores/appStore";
import { store } from "../../../store/InvestorStore";

const ListOrderTFOS = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const [valueDate, setvalueDate] = useState(new Date());
    const { t } = useTranslation();
    const { register, getValues, errors, handleSubmit, control } = useForm();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueLoad, setValueLoad] = useState(false);
    const listHistoryLogin: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index + 1 + (storeOrder.pageIndexTFOS - 1) * storeOrder.pageSizeTFOS,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "SHL",
        dataIndex: "fisOrderId",
        key: "fisOrderId",
        align: "right",
        width: 80,
      },
      {
        title: "Thời gian",
        render: function (value: any) {
          return Moment.formatDateNew(value.createdDate, "DD/MM/yyyy HH:mm:ss");
        },
        align: "center",
        width: 150,
      },
      {
        title: "Lệnh",
        render: function (value: any) {
          return value.side == "B" ? "Mua" : "Bán";
        },
        align: "left",
        width: 80,
      },
      {
        title: "Mã CK",
        dataIndex: "secSymbol",
        key: "secSymbol",
        align: "left",
        width: 100,
      },
      {
        title: "Mã KH",
        render: function (value: any) {
          return value.accountNo.substring(0, 6);
        },
        align: "left",
        width: 80,
      },
      {
        title: "Số TK",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "right",
        width: 80,
      },
      {
        title: "KL đặt",
        render: function (value: any) {
          return numberUtil.formatNumber(value.volume);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Giá đặt",
        render: function (value: any) {
          if (value.conPrice == "LO") {
            return numberUtil.formatNumber(value.price * 1000);
          } else {
            return value.conPrice;
          }
        },
        align: "right",
        width: 100,
      },
      {
        title: "Giờ khớp",
        render: function (value: any) {
          return value.timeMatched;
        },
        align: "center",
        width: 100,
      },
      {
        title: "KL khớp",
        render: function (value: any) {
          return numberUtil.formatNumber(value.totalMatchedVolume);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Giá khớp",
        render: function (value: any) {
          return numberUtil.formatNumber(value.matchedPrice * 1000);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Giờ hủy",
        render: function (value: any) {
          return value.timeCanceled;
        },
        align: "right",
        width: 100,
      },
      {
        title: "KL hủy",
        render: function (value: any) {
          return numberUtil.formatNumber(value.totalCancelledVolume);
        },
        align: "right",
        width: 100,
      },
      {
        title: "GT lệnh",
        render: function (value: any) {
          return numberUtil.formatNumber(value.orderValue);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Trạng thái",
        dataIndex: "statusName",
        key: "statusName",
        align: "left",
        width: 150,
      },
      {
        title: "Kênh đặt",
        dataIndex: "channelText",
        key: "channelText",
        align: "left",
        width: 150,
      },
    ];
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal);

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      if (
        valueForm.CustomerNo &&
        valueForm.CustomerNo.trim() != "" &&
        valueForm.CustomerNo.trim().length != 7
      ) {
        toast.error(ErrorToast("Hãy điền số tài khoản 7 số"));
        return;
      }
      if (
        valueForm.CustormerId &&
        valueForm.CustormerId.trim() != "" &&
        valueForm.CustormerId.trim().length != 6
      ) {
        toast.error(ErrorToast("Hãy điền số tài khoản 6 số"));
        return;
      }
      const param = {
        // UserId: appStore.account.LoginName,
        UserId:
          valueForm.CustormerId == undefined
            ? ""
            : valueForm.CustormerId.trim(),
        Accounts:
          valueForm.CustomerNo == undefined ? "" : valueForm.CustomerNo.trim(),
        Channel:
          valueForm.cbxChannel == undefined ? "" : valueForm.cbxChannel.Source,
        Status:
          valueForm.cbxStatus == undefined
            ? ""
            : valueForm.cbxStatus.Value.toString(),
        SecSymbols:
          valueForm.Symbol == undefined
            ? ""
            : valueForm.Symbol.trim().toUpperCase(),
        FisOrderIds:
          valueForm.Orders == undefined ? "" : valueForm.Orders.trim(),
        PageIndex: storeOrder.pageIndexTFOS,
        PageSize: storeOrder.pageSizeTFOS,
      };

      storeOrder.getListOrdersTFOS(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (storeOrder.pageIndexTFOS == 1) {
        onSubmit();
      } else {
        storeOrder.pageIndexTFOS = 1;
      }
    };

    const resetForm = () => {
      form.resetFields();
      if (storeOrder.pageIndexTFOS == 1) {
        onSubmit();
      } else {
        storeOrder.pageIndexTFOS = 1;
      }
    };
    const defaultValue = {
      Accounts: "",
      Channel: "",
      Status: "",
      SecSymbols: "",
      FisOrderIds: "",
      Inside: true,
      cbxChannel: storeSystemManagement.dataListChannel[0],
    };
    const ExportInsideOder = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserId: valueForm.CustormerId == undefined
          ? ""
          : valueForm.CustormerId.trim(),
        Accounts: valueForm.CustomerNo == undefined ? "" : valueForm.CustomerNo.trim(),
        Channel: valueForm.cbxChannel == undefined ? "" : valueForm.cbxChannel.Source,
        Status: valueForm.cbxStatus == undefined
          ? ""
          : valueForm.cbxStatus.Value.toString(),
        SecSymbols: valueForm.Symbol == undefined
          ? ""
          : valueForm.Symbol.trim().toUpperCase(),
        FisOrderIds: valueForm.Orders == undefined ? "" : valueForm.Orders.trim(),
      };
      store.ExportListUI(
        listAPI.ExportInsideOder,
        param,
        "DANH_SACH_LENH_TRONG_NGAY"
      );
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    useEffect(() => {
      storeOrder.dataListTFOS = [];
      storeOrder.totalRowsTFOS = 0;
      storeSystemManagement.getListChannel();
      const paramStt = {
        Category: "ORDER_INSIDE",
        Group: "STATUS",
        Code: ""
      }
      storeOrder.GetrderInOutStatus(paramStt);
    }, []);
    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [storeOrder.pageIndexTFOS, storeOrder.pageSizeTFOS]);
    // useEffect(() => {
    //   getListStatus();
    // }, []);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Orders")}</h4>
          </CardHeader>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={onClickButtonSearch}
              requiredMark={false}
            >
              <Row>
                <Col lg="6" md="6">
                  <Form.Item
                    label={t("X_Trade_Bank_Account")}
                    name="CustomerNo"
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Bank_Account")}
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 7) {
                          form.setFieldsValue({
                            CustomerNo: object.target.value.slice(0, 7),
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item
                    label={t("X_Trade_Customer_Id")}
                    name="CustormerId"
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Customer_Id")}
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 6) {
                          form.setFieldsValue({
                            CustormerId: object.target.value.slice(0, 6),
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Sec_Code")} name="Symbol">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Sec_Code")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Orders_No")} name="Orders">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Orders_No")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Channel")} name="cbxChannel">
                    {storeSystemManagement.dataListChannel.length > 0 ? (
                      <Select
                        options={storeSystemManagement.dataListChannel}
                        defaultValue={storeSystemManagement.dataListChannel[0]}
                        isClearable={false}
                        control={control}
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        styles={customSMSelectStyles}
                        getOptionLabel={(option) => option.Name}
                        getOptionValue={(option) => option.Source}
                      />
                    ) : (
                      <></>
                    )}
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Status")} name="cbxStatus">
                    {storeOrder.orderInOutStatus.length > 0 ? (
                      <Select
                        options={storeOrder.orderInOutStatus}
                        defaultValue={storeOrder.orderInOutStatus[0]}
                        isClearable={false}
                        control={control}
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        styles={customSMSelectStyles}
                        getOptionLabel={(option) => option.Name}
                        getOptionValue={(option) => option.Value}
                      />
                    ) : (
                      <></>
                    )}
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" className="text-center">
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      className="btn btn-gradient-info"
                      color="gradient-info"
                    >
                      {t("X_Trade_Button_Search")}
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
                      onClick={ExportInsideOder}
                    >
                      {t("X_Trade_Button_Export")}
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
              <Row>
                <Col sm="24" md="24">
                  <Table
                    columns={listHistoryLogin}
                    dataSource={storeOrder.dataListTFOS}
                    size="small"
                    scroll={{ x: 800, y: 800 }}
                    loading={storeOrder.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange: storeOrder.handlePerRowsChangeTFOS,
                      pageSizeOptions: pageSizeTable,
                      total: storeOrder.totalRowsTFOS,
                      showTotal: showTotal,
                      onChange: storeOrder.handlePageChangeTFOS,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent: storeOrder.pageIndexTFOS,
                      locale: { items_per_page: "/ trang" },
                      current: storeOrder.pageIndexTFOS,
                    }}
                  />
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default ListOrderTFOS;
