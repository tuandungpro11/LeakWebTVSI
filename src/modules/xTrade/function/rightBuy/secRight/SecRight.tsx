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
  CustomInput,
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
import { SuccessProgressToast } from "../../../../../views/extensions/toastify/ToastTypes";
import { store } from "../../../store/FunctionStore";
import { customSMSelectStyles, pageSizeTable } from "../../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import { DatePicker, Form, Input, Pagination, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { appStore } from "../../../../../stores/appStore";

const ListSecRight = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const [valueDate, setvalueDate] = useState(new Date());
    const { t } = useTranslation();
    const { register, getValues, errors, handleSubmit, control } = useForm();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueLoad, setValueLoad] = useState(false);
    const listRight = [
      { value: -1, label: "Tất cả" },
      { value: 0, label: "Quyền mua cổ phiếu/trái phiếu" },
      { value: 3, label: "Cổ tức bằng tiền" },
      { value: 1, label: "Cổ tức bằng cổ phiếu" },
      { value: 2, label: "Cổ phiếu thưởng" },
      { value: 4, label: "Chuyển nhượng" },
    ];
    const listHistoryLogin: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index + 1 + (store.pageIndexSecRight - 1) * store.pageSizeSecRight,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã chứng khoán",
        dataIndex: "SYMBOL",
        key: "SYMBOL",
        fixed: "left",
        align: "left",
        width: 150,
      },
      {
        title: "Tỷ lệ phát hành",
        render: function (value: any) {
          return (
            value.OLD +
            ":" +
            value.NEW
          );
        },
        align: "left",
        width: 200,
      },
      {
        title: "Giá phát hành(VNĐ)",
        render: function (value: any) {
          return numberUtil.formatNumber(value.PRICE);
        },
        align: "right",
        width: 200,
      },
      {
        title: "Ngày giao dịch không hưởng quyền",
        render: function (value: any) {
          return Moment.formatDateNew(value.TRANSFERFROMDATE, "DD/MM/yyyy");
        },
        align: "center",
        width: 200,
      },
      {
        title: "Ngày hết hạn ĐK",
        render: function (value: any) {
          return value.TRANSFERTODATE == null
            ? "-"
            : Moment.formatDateNew(value.TRANSFERTODATE, "DD/MM/yyyy");
        },
        align: "center",
        width: 200,
      },
      {
        title: "SL còn được mua/Chuyển nhượng",
        render: function (value: any) {
          return numberUtil.formatNumber(
            value.COMPUNITNEW - value.COMPUNITCONFIRMSBA
          );
        },
        align: "right",
        width: 200,
      },
      {
        title: "SL đã đăng ký mua",
        render: function (value: any) {
          return numberUtil.formatNumber(value.COMPUNITCONFIRMSBA);
        },
        align: "right",
        width: 200,
      },
      {
        title: "Số tiền được nhận",
        render: function (value: any) {
          return "-";
        },
        align: "right",
        width: 200,
      },
      {
        title: "Số CK được nhận",
        render: function (value: any) {
          return numberUtil.formatNumber(value.COMPUNITNEW);
        },
        align: "right",
        width: 200,
      },
      {
        title: "Loại quyền",
        dataIndex: "XTYPE_TEXT",
        key: "XTYPE_TEXT",
        align: "left",
        width: 200,
      },
      {
        title: "Thông báo",
        render: function (value: any) {
          return "Không phải tất cả";
        },
        align: "left",
        width: 200,
      },
    ];
    const [loading, setLoading] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserId: appStore.account.LoginName,
        XType: valueForm.cbxRight == undefined ? -1 : valueForm.cbxRight.value,
        Symbol: valueForm.Symbol == undefined ? "" : valueForm.Symbol.trim().toUpperCase(),
        RightDateFrom:
          valueForm.txtDate != null
            ? valueForm.txtDate[0] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[0], "yyyyMMDD")
            : "",
        RightDateTo:
          valueForm.txtDate != null
            ? valueForm.txtDate[1] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[1], "yyyyMMDD")
            : "",
        PageIndex: store.pageIndexSecRight,
        PageSize: store.pageSizeSecRight,
      };

      store.getListSecRight(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (store.pageIndexSecRight == 1) {
        onSubmit();
      } else {
        store.pageIndexSecRight = 1;
      }
    };

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndexSecRight == 1) {
        onSubmit();
      } else {
        store.pageIndexSecRight = 1;
      }
    };
    const defaultValue = {
      UserId: appStore.account.LoginName,
      XType: -1,
      Symbol: "",
      txtDate: [
        moment(new Date(new Date().setMonth(new Date().getMonth() - 3)),"DD-MM-yyyy"),
        moment(new Date()),
      ],
    };

    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [store.pageIndexSecRight, store.pageSizeSecRight]);
    useEffect(() => {
      store.dataSecRight=[];
      store.totalRowsSecRight=0;
    }, []);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Sec_Right_Title")}</h4>
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
                  <Form.Item label={t("X_Trade_Sec_Code")} name="Symbol">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Sec_Code")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Right_Title")} name="cbxRight">
                    <Select
                      options={listRight}
                      defaultValue={listRight[0]}
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
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col sm="24" md="24">
                  <Table
                    columns={listHistoryLogin}
                    dataSource={store.dataSecRight}
                    size="small"
                    scroll={{ x: 800, y: 800 }}
                    loading={store.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange: store.handlePerRowsChangeSecListRight,
                      pageSizeOptions: pageSizeTable,
                      total: store.totalRowsSecRight,
                      showTotal: showTotal,
                      onChange: store.handlePageChangeListSecRight,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent: store.pageIndexSecRight,
                      locale: { items_per_page: "/ trang" },
                      current: store.pageIndexSecRight,
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

export default ListSecRight;
