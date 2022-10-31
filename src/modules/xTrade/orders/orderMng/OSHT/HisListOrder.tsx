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
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { appStore } from "../../../../../stores/appStore";
import { store } from "../../../store/InvestorStore";

const ListHistOrderOSHT = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const [valueDate, setvalueDate] = useState(new Date());
    const { t } = useTranslation();
    const { register, getValues, errors, handleSubmit, control } = useForm();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueLoad, setValueLoad] = useState(false);
    const listStatus = [
      { value: -1, label: "Tất cả" },
      { value: 1, label: "Đang chờ" },
      { value: 3, label: "Khớp một phần" },
      { value: 2, label: "Đã khớp" },
      { value: 4, label: "Đang hủy" },
      { value: 5, label: "Đã hủy" },
      { value: 6, label: "Bị từ chối" },
    ];
    const listHistoryLogin: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index + 1 + (storeOrder.pageIndexOSHT - 1) * storeOrder.pageSizeOSHT,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Ngày đặt lệnh",
        render: function (value: any) {
          return Moment.formatDateNew(value.orderDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 100,
      },
      {
        title: "SHL",
        dataIndex: "orderNo",
        key: "orderNo",
        align: "right",
        width: 80,
      },
      {
        title: "Lệnh",
        render: function (value: any) {
          if (value.side == "S") {
            return "Bán";
          } else {
            return "Mua";
          }
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
        dataIndex: "customerId",
        key: "customerId",
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
          return numberUtil.formatNumber(value.price);
        },
        align: "right",
        width: 100,
      },
      {
        title: "KL khớp",
        render: function (value: any) {
          return numberUtil.formatNumber(value.matchVolume);
        },
        width: 100,
        align: "right",
      },
      {
        title: "Giá khớp",
        render: function (value: any) {
          return numberUtil.formatNumber(value.matchPrice);
        },
        align: "right",
        width: 100,
      },
      {
        title: "KL hủy",
        render: function (value: any) {
          return numberUtil.formatNumber(value.cancelVolume);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Phí GD",
        render: function (value: any) {
          return numberUtil.formatNumber(value.comm);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Thuế",
        render: function (value: any) {
          return numberUtil.formatNumber(value.tax);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Ngày GD",
        render: function (value: any) {
          return Moment.formatDateNew(value.effectedDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 100,
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
        UserId: valueForm.CustormerId == undefined ?"": valueForm.CustormerId,
        BranchId: valueForm.BranchId === "" ? "" : valueForm.BranchId.BRANCHID,
        CustomerID:
          valueForm.CustormerId == undefined
            ? ""
            : valueForm.CustormerId.trim(),
        AccountNo:
          valueForm.CustomerNo == undefined ? "" : valueForm.CustomerNo.trim(),
        Symbol:
          valueForm.Symbol == undefined
            ? ""
            : valueForm.Symbol.trim().toUpperCase(),
        OrderStatus:
          valueForm.cbxStatus == undefined ? -1 : valueForm.cbxStatus.value,
        OrderChannel:
          valueForm.cbxChannel == undefined ? "" : valueForm.cbxChannel.Source,
        BeginDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[0] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[0], "DD/MM/yyyy")
            : "",
        EndDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[1] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[1], "DD/MM/yyyy")
            : "",
        PageIndex: storeOrder.pageIndexOSHT,
        PageSize: storeOrder.pageSizeOSHT,
      };

      storeOrder.getListOSHT(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (storeOrder.pageIndexOSHT == 1) {
        onSubmit();
      } else {
        storeOrder.pageIndexOSHT = 1;
      }
    };

    const resetForm = () => {
      form.resetFields();
      if (storeOrder.pageIndexOSHT == 1) {
        onSubmit();
      } else {
        storeOrder.pageIndexOSHT = 1;
      }
    };
    const defaultValue = {
      BranchId: "",
      CustomerID: "",
      AccountNo: "",
      Symbol: "",
      Channel: "",
      cbxStatus: listStatus[0],
      cbxChannel: storeSystemManagement.dataListChannel[0],
      txtDate: [
        moment(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          "DD-MM-yyyy"
        ),
        moment(new Date()),
      ],
    };
    const exportOrderHist = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        BranchId: valueForm.BranchId === "" ? "" : valueForm.BranchId.BRANCHID,
        AccountNo: valueForm.CustomerNo == undefined ? "" : valueForm.CustomerNo.trim(),
        customerID: valueForm.CustormerId == undefined
        ? ""
        : valueForm.CustormerId.trim(),
        Symbol: valueForm.Symbol == undefined
        ? ""
        : valueForm.Symbol.trim().toUpperCase(),
        OrderStatus: valueForm.cbxStatus == undefined ? -1 : valueForm.cbxStatus.value,
        OrderChannel: valueForm.cbxChannel == undefined ? "" : valueForm.cbxChannel.Source,
        BeginDate: valueForm.txtDate != null
        ? valueForm.txtDate[0] === null
          ? ""
          : Moment.formatDateNew(valueForm.txtDate[0], "DD/MM/yyyy")
        : "",
        EndDate: valueForm.txtDate != null
        ? valueForm.txtDate[1] === null
          ? ""
          : Moment.formatDateNew(valueForm.txtDate[1], "DD/MM/yyyy")
        : "",
      };
      store.ExportListUI(
        listAPI.ExportHistoryOder,
        param,
        "DANH_SACH_LICH_SU_DAT_LENH"
      );
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [storeOrder.pageIndexOSHT, storeOrder.pageSizeOSHT]);
    useEffect(() => {
      storeOrder.dataListOSHT = [];
      storeOrder.totalRowsOSHT = 0;
      storeSystemManagement.getListChannel();
      const param = {
        BranchId: "",
        Active: -1,
        PageIndex: 1,
        PageSize: 1000,
      };
      store.getTVSIBrachList(param);
    }, []);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_His_Orders")}</h4>
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
                    <Select
                      options={listStatus}
                      defaultValue={listStatus[0]}
                      isClearable={false}
                      control={control}
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      styles={customSMSelectStyles}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Date_Range")} name="txtDate">
                    <RangePicker
                      locale={locale}
                      allowEmpty={[true, true]}
                      format={"DD-MM-yyyy"}
                      size="small"
                      style={{ width: "100%" }}
                      className="ant-picker-small-custom"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Branch_Name")} name="BranchId">
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      options={store.listTVSIBrachList}
                      isClearable={false}
                      noOptionsMessage={"Không có dữ liệu...."}
                      getOptionLabel={(option) => option.BRANCHNAME}
                      getOptionValue={(option) => option.BRANCHID}
                      styles={customSMSelectStyles}
                      placeholder={"Chọn chi nhánh..."}
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
                      onClick={exportOrderHist}
                    >
                      {t("X_Trade_Button_Export")}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col sm="24" md="24">
                  <Table
                    columns={listHistoryLogin}
                    dataSource={storeOrder.dataListOSHT}
                    size="small"
                    scroll={{ x: 800, y: 800 }}
                    loading={storeOrder.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange: storeOrder.handlePerRowsChangeOSHT,
                      pageSizeOptions: pageSizeTable,
                      total: storeOrder.totalRowsOSHT,
                      showTotal: showTotal,
                      onChange: storeOrder.handlePageChangeOSHT,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent: storeOrder.pageIndexOSHT,
                      locale: { items_per_page: "/ trang" },
                      current: storeOrder.pageIndexOSHT,
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

export default ListHistOrderOSHT;
