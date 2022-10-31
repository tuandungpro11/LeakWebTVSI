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
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Moment } from "../../../../../utility/general/Moment";
import { numberUtil } from "../../../../../utility/general/NumberUtil";
import { store } from "../../../store/FunctionStore";
import { customSMSelectStyles, listAPI, pageSizeTable } from "../../../types";
import Select from "react-select";
import { selectThemeColors } from "../../../../../utility/Utils";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import { PaginationProps, Form, DatePicker, Input } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useContextMenu } from "react-contexify";
import { appStore } from "../../../../../stores/appStore";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../../views/extensions/toastify/ToastTypes";

const HisRightBuy = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const { t } = useTranslation();
    const [valueDate, setvalueDate] = useState(new Date());
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueLoad, setValueLoad] = useState(false);
    const listStatus = [
      { value: -1, label: "Tất cả" },
      { value: 1, label: "Chờ xử lý" },
      { value: 2, label: "Đang xử lý" },
      { value: 3, label: "Đã xử lý" },
      { value: 4, label: "Bị từ chối" },
      { value: 5, label: "Hủy" },
    ];
    const listRight = [
      { value: -1, label: "Tất cả" },
      { value: 0, label: "Quyền mua cổ phiếu/trái phiếu" },
      { value: 3, label: "Cổ tức bằng tiền" },
      { value: 1, label: "Cổ tức bằng cổ phiếu" },
      { value: 2, label: "Cổ phiếu thưởng" },
      { value: 4, label: "Chuyển nhượng" },
    ];
    
    // 30/08/22 doi lai giao dien theo yeu cau SSBUGLST-19
    const listOrderSlipColumn: ColumnsType<any> = [
      {
        title: "STT",
        render: (v, s, index) =>
          index +
          1 +
          (store.pageIndexHisRightBuy - 1) * store.pageSizeHisRightBuy,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Số TK",
        dataIndex: "AccountNo",
        key: "AccountNo",
        align: "left",
        width: 80,
      },
      {
        title: "Mã CK",
        dataIndex: "Symbol",
        key: "Symbol",
        align: "left",
        width: 80,
      },
      {
        title: "Loại quyền",
        dataIndex: "XTYPE_TEXT",
        key: "XTYPE_TEXT",
        align: "left",
        width: 180,
      },
      {
        title: "Tỷ lệ",
        render: function (value: any) {
          return value.Old + ":" + value.New;
        },
        align: "right",
        width: 80,
      },
      {
        title: "Số tiền được nhận",
        render: function (value: any) {
          return numberUtil.formatNumber(value.Compamt);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Mã CK được nhận/mua",
        dataIndex: "NEWSHARECODE",
        key: "NEWSHARECODE",
        align: "left",
        width: 100,
      },
      {
        title: "Số CK được nhận/mua",
        render: function (value: any) {
          return numberUtil.formatNumber(value.StockVolume);
        },
        align: "right",
        width: 80,
      },
      {
        title: "Số CK đã đăng ký/đã mua",
        render: function (value: any) {
          return numberUtil.formatNumber(value.CompUnitConfirm);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Giá phát hành",
        render: function (value: any) {
          return numberUtil.formatNumber(value.Price);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Số tiền đã nộp",
        render: function (value: any) {
          return numberUtil.formatNumber(value.Amount);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Ngày GDKHQ",
        render: function (value: any) {
          return Moment.formatDateNew(value.CloseDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 120,
      },
      {
        title: "Ngày thực hiện",
        render: function (value: any) {
          return Moment.formatDateNew(value.RightDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 120,
      }
    ];
    const { show } = useContextMenu({
      id: "menu_left",
    });
    const [loading, setLoading] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      if (
        valueForm.AccountNo &&
        valueForm.AccountNo.trim() != "" &&
        valueForm.AccountNo.trim().length != 7
      ) {
        toast.error(ErrorToast("Hãy điền số tài khoản 7 số"));
        return;
      }
      if (
        valueForm.CustomerId &&
        valueForm.CustomerId.trim() != "" &&
        valueForm.CustomerId.trim().length != 6
      ) {
        toast.error(ErrorToast("Hãy điền số tài khoản 6 số"));
        return;
      }
      const param = {
        UserId: appStore.account.LoginName,
        CustomerId:
          valueForm.CustomerId == undefined ? "" : valueForm.CustomerId.trim(),
        AccountNo: valueForm.AccountNo.trim(),
        ContractNo: valueForm.ContractNo.trim(),
        XType: valueForm.cbxRight == undefined ? -1 : valueForm.cbxRight.value,
        UserIdEdit: "",
        Symbol: valueForm.Symbol == undefined ? "" : valueForm.Symbol.trim().toUpperCase(),
        Status: -1, //valueForm.cbxStatus == undefined ? -1 : valueForm.cbxStatus.value,
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
        PageIndex: store.pageIndexHisRightBuy,
        PageSize: store.pageSizeHisRightBuy,
      };

      store.getListHisRightBuy(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (store.pageIndexHisRightBuy == 1) {
        onSubmit();
      } else {
        store.pageIndexHisRightBuy = 1;
      }
    };

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndexHisRightBuy == 1) {
        onSubmit();
      } else {
        store.pageIndexHisRightBuy = 1;
      }
    };
    const defaultValue = {
      CustomerId: "",
      AccountNo: "",
      ContractNo: "",
      XType: listRight[0],
      UserIdEdit: "",
      Symbol: "",
      Status: -1,//listStatus[0],
      txtDate: [
        moment(
          new Date(new Date().setMonth(new Date().getMonth() - 3)),
          "DD-MM-yyyy"
        ),
        moment(new Date()),
      ],
    };
    const exportListHisRightBuy = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserId: appStore.account.LoginName,
        CustomerId: valueForm.CustomerId == undefined ? "" : valueForm.CustomerId.trim(),
        AccountNo: valueForm.AccountNo.trim(),
        ContractNo: valueForm.ContractNo.trim(),
        RightDateFrom: valueForm.txtDate != null
        ? valueForm.txtDate[0] === null
          ? ""
          : Moment.formatDateNew(valueForm.txtDate[0], "yyyyMMDD")
        : "",
        RightDateTo: valueForm.txtDate != null
        ? valueForm.txtDate[1] === null
          ? ""
          : Moment.formatDateNew(valueForm.txtDate[1], "yyyyMMDD")
        : "",
        Status: -1, //valueForm.cbxStatus == undefined ? -1 : valueForm.cbxStatus.value,
        XType: valueForm.cbxRight == undefined ? -1 : valueForm.cbxRight.value,
        Symbol: valueForm.Symbol == undefined ? "" : valueForm.Symbol.trim().toUpperCase(),
        UserIdEdit: "",
      };
      store.ExportListUI(
        listAPI.ExportListHisRightBuy,
        param,
        "LICH_SU_HUONG_QUYEN"
      );
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    useEffect(() => {
      store.dataHisRightBuy = [];
      store.totalRowsHisRightBuy = 0;
    }, []);
    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [store.pageIndexHisRightBuy, store.pageSizeHisRightBuy]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_His_Right_Buy_Title")}</h4>
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
                  <Form.Item label={t("X_Trade_Bank_Account")} name="AccountNo">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Bank_Account")}
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 7) {
                          form.setFieldsValue({
                            AccountNo: object.target.value.slice(0, 7),
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Customer_Id")} name="CustomerId">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Customer_Id")}
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 6) {
                          form.setFieldsValue({
                            CustomerId: object.target.value.slice(0, 6),
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
                  <Form.Item label={t("X_Trade_Contract_No")} name="ContractNo">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Contract_No")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                {/* <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Status")} name="cbxStatus">
                    <Select
                      options={listStatus}
                      defaultValue={listStatus[0]}
                      isClearable={false}
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      styles={customSMSelectStyles}
                    />
                  </Form.Item>
                </Col> */}
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Right_Title")} name="cbxRight">
                    <Select
                      options={listRight}
                      defaultValue={listRight[0]}
                      isClearable={false}
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      styles={customSMSelectStyles}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Right_Date_Range")} name="txtDate">
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
                      className="btn btn-gradient-info"
                      color="gradient-info"
                      htmlType="submit"
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
                      onClick={exportListHisRightBuy}
                    >
                      {t("X_Trade_Button_Export")}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col sm="24" md="24">
                  <Table
                    columns={listOrderSlipColumn}
                    dataSource={store.dataHisRightBuy}
                    size="small"
                    scroll={{ x: 800, y: 800 }}
                    loading={store.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange:
                        store.handlePerRowsChangeHisListRightBuy,
                      pageSizeOptions: pageSizeTable,
                      total: store.totalRowsHisRightBuy,
                      showTotal: showTotal,
                      onChange: store.handlePageChangeListHisRightBuy,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent: store.pageIndexHisRightBuy,
                      locale: { items_per_page: "/ trang" },
                      current: store.pageIndexHisRightBuy,
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

export default HisRightBuy;
