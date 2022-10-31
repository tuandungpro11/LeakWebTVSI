import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Moment } from "../../../../utility/general/Moment";
import { storeSystemManagement } from "../../store/SystemManagementStore";
import { customSMSelectStyles, pageSizeTable } from "../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";
import {
  DatePicker,
  Form,
  Input,
  Menu,
  Pagination,
  PaginationProps,
} from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { store } from "../../store/InvestorStore";
import Select from "react-select";
import { selectThemeColors } from "../../../../utility/Utils";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { appStore } from "../../../../stores/appStore";

const listChangeType = [
  { value: -1, label: "Tất cả" },
  { value: 1, label: "KH đăng nhập" },
  { value: 2, label: "KH thoát" },
];

const ListLog = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const [valueDate, setvalueDate] = useState(new Date());
    const { t } = useTranslation();
    const [valueLoad, setValueLoad] = useState(false);
    const listInternalAccountColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (storeSystemManagement.pageIndexListSecPlaceOrder - 1) *
            storeSystemManagement.pageSizeListSecPlaceOrder,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã nhân viên",
        dataIndex: "StockSymbol",
        key: "StockSymbol",
        fixed: "left",
        width: 150,
      },
      {
        title: "Mã khách hàng",
        dataIndex: "CompanyName",
        key: "CompanyName",
        width: 500,
      },
      {
        title: "Thời gian thay đổi",
        dataIndex: "Market",
        key: "Market",
        width: 200,
      },
      {
        title: "Loại thay đổi",
        width: 200,
        render: function (value: any) {
          return Moment.formatDateNew(value.Date, "DD/MM/yyyy");
        },
      },
      {
        title: "Giá trị cũ",
        width: 200,
        render: function (value: any) {
          return Moment.formatDateNew(value.Date, "DD/MM/yyyy");
        },
      },
      {
        title: "Giá trị mới",
        width: 200,
        render: function (value: any) {
          return Moment.formatDateNew(value.Date, "DD/MM/yyyy");
        },
      },
      {
        title: "IP",
        width: 200,
        render: function (value: any) {
          return Moment.formatDateNew(value.Date, "DD/MM/yyyy");
        },
      },
      {
        title: "Chức năng",
        width: 200,
        render: function (value: any) {
          return Moment.formatDateNew(value.Date, "DD/MM/yyyy");
        },
      },
      {
        title: "Mô tả",
        width: 200,
        render: function (value: any) {
          return Moment.formatDateNew(value.Date, "DD/MM/yyyy");
        },
      },
    ];
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [loading, setLoading] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        Symbol: valueForm.CustormerId == undefined ? "" : valueForm.CustormerId,
        FromDate: valueForm.txtDate != null
        ? valueForm.txtDate[0] === null
          ? ""
          : Moment.formatDateNew(valueForm.txtDate[0], "yyyyMMDD")
        : "",
        ToDate: valueForm.txtDate != null
        ? valueForm.txtDate[1] === null
          ? ""
          : Moment.formatDateNew(valueForm.txtDate[1], "yyyyMMDD")
        : "",
        LangId: 1,
        PageIndex: storeSystemManagement.pageIndexListSecPlaceOrder,
        PageSize: storeSystemManagement.pageSizeListSecPlaceOrder,
      };

      // storeSystemManagement.getListSecPlaceOrder(param);
    };
    const onClickButtonSearch = () => {
      if (storeSystemManagement.pageIndexListSecPlaceOrder == 1) {
        onSubmit();
      } else {
        storeSystemManagement.pageIndexListSecPlaceOrder = 1;
      }
    };
    const resetForm = () => {
      form.resetFields();
      if (storeSystemManagement.pageIndexListSecPlaceOrder == 1) {
        onSubmit();
      } else {
        storeSystemManagement.pageIndexListSecPlaceOrder = 1;
      }
    };
    const defaultValue = {
      StaffId: "",
      CustormerId: "",
      txtDate: [
        moment(
          new Date(new Date().setDate(new Date().getDate() - 3)),
          "DD-MM-yyyy"
        ),
        moment(new Date()),
      ],
      cbxBranch: store.dataListBranchOrderSlip[0],
      cbxChangeType: listChangeType[0],
    };
    const getListBranch = () => {
      const param = {
        BranchId: "",
        // UserId: appStore.account.LoginName,
        Active: 1,
        // IsLike: 1,
        PageNumber: 1,
        PageSize: 9999,
      };
      store.getListBranch(param);
    };

    useEffect(() => {
      getListBranch();
    }, []);
    useEffect(() => {
      onSubmit();
    }, [
      storeSystemManagement.pageIndexListSecPlaceOrder,
      storeSystemManagement.pageSizeListSecPlaceOrder,
    ]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Log")}</h4>
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
                  <Form.Item label={t("X_Trade_Staff_Id")} name="StaffId">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Staff_Id")}
                      autoComplete="Off"
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
                          form.setFieldsValue({CustormerId: object.target.value.slice(0, 6)})
                        }
                      }}
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
                  <Form.Item label={t("X_Trade_Branch_Name")} name="cbxBranch">
                    {store.dataListBranchOrderSlip.length > 0 ? (
                      <Select
                        options={store.dataListBranchOrderSlip}
                        defaultValue={store.dataListBranchOrderSlip[0]}
                        isClearable={false}
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        styles={customSMSelectStyles}
                        getOptionLabel={(option) => option.BRANCHNAME}
                        getOptionValue={(option) => option.BRANCHID}
                      />
                    ) : (
                      <></>
                    )}
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item
                    label={t("X_Trade_Change_Type")}
                    name="cbxChangeType"
                  >
                    <Select
                      options={listChangeType}
                      defaultValue={listChangeType[0]}
                      isClearable={false}
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      styles={customSMSelectStyles}
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
                    columns={listInternalAccountColumn}
                    dataSource={storeSystemManagement.dataListSecPlaceOrder}
                    size="small"
                    scroll={{ x: 800 }}
                    loading={storeSystemManagement.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange:
                        storeSystemManagement.handlePerRowsChangeListSecToPurchase,
                      pageSizeOptions: pageSizeTable,
                      total: storeSystemManagement.totalRowsListSecPlaceOrder,
                      showTotal: showTotal,
                      onChange:
                        storeSystemManagement.handlePageChangeListSecToPurchase,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent:
                        storeSystemManagement.pageIndexListSecPlaceOrder,
                      locale: { items_per_page: "/ trang" },
                      current: storeSystemManagement.pageIndexListSecPlaceOrder,
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

export default ListLog;
