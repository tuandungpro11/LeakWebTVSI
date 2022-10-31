import { Form, Input, PaginationProps, DatePicker } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import { Moment } from "../../../../utility/general/Moment";
import { store } from "../../store/InvestorStore";
import { customSMSelectStyles, listAPI, pageSizeTable } from "../../types";
import Select from "react-select";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import { selectThemeColors } from "@utils";
import locale from "antd/es/date-picker/locale/vi_VN";
import PerfectScrollbar from "react-perfect-scrollbar";
import moment from "moment";

const PassiotHisLogin = () =>
  useObserver(() => {
    const [formPasiot] = Form.useForm();
    const { RangePicker } = DatePicker;
    const { t } = useTranslation();
    const [valueDate, setvalueDate] = useState(new Date());
    const listMethod = [
      { value: "", label: "Tất cả" },
      { value: "GET", label: "GET" },
      { value: "POST", label: "POST" },
    ];
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueLoad, setValueLoad] = useState(false);
    const listHistoryLoginPasiot: ColumnsType<any> = [
      {
        title: "STT",
        render: (v, s, index) =>
          index +
          1 +
          (store.pageIndexListHisLoginPasiot - 1) *
            store.pageSizeListHisLoginPasiot,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Số tài khoản",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "Controller",
        dataIndex: "controllerName",
        key: "controllerName",
        align: "left",
      },
      {
        title: "Hành động",
        dataIndex: "actionName",
        key: "actionName",
        align: "left",
      },
      {
        title: "IP",
        dataIndex: "clientIP",
        key: "clientIP",
        align: "left",
      },
      {
        title: "Phương thức",
        dataIndex: "method",
        key: "method",
        align: "left",
      },
      {
        title: "Ngày",
        key: "createdDate",
        render: (value, record, index) => {
          return Moment.formatDateNew(value.createdDate, "DD/MM/yyyy HH:mm:ss");
        },
        align: "center",
      },
    ];

    const onSubmitPasiot = () => {
      const valueForm = formPasiot.getFieldsValue();
      const param = {
        UserId: valueForm.UserId == undefined ? "" : valueForm.UserId,
        ControllerName: "",
        ActionName: "",
        ClientIP:
          valueForm.ClientIP == undefined ? "" : valueForm.ClientIP.trim(),
        Method:
          valueForm.cbxMethod == undefined ? "" : valueForm.cbxMethod.value,
        FromDate:
          valueForm.txtDatePasiot != null
            ? valueForm.txtDatePasiot[0] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDatePasiot[0], "DD/MM/yyyy")
            : "",
        ToDate:
          valueForm.txtDatePasiot != null
            ? valueForm.txtDatePasiot[1] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDatePasiot[1], "DD/MM/yyyy")
            : "",
        PageIndex: store.pageIndexListHisLoginPasiot,
        PageSize: store.pageSizeListHisLoginPasiot,
      };

      store.getListHisLoginPasiot(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (store.pageIndexListHisLoginPasiot == 1) {
        onSubmitPasiot();
      } else {
        store.pageIndexListHisLoginPasiot = 1;
      }
    };

    const resetFormPasiot = () => {
      formPasiot.resetFields();
      if (store.pageIndexListHisLoginPasiot == 1) {
        onSubmitPasiot();
      } else {
        store.pageIndexListHisLoginPasiot = 1;
      }
    };

    const defaultValuePasiot = {
      ClientIP: "",
      Method: "",
      txtDatePasiot: [
        moment(
          new Date(new Date().setDate(new Date().getDate() - 7)),
          "DD-MM-yyyy"
        ),
        moment(new Date()),
      ],
    };
    const exportHisLogin = () => {
      const valueForm = formPasiot.getFieldsValue();
      const param = {
        UserId: valueForm.UserId == undefined ? "" : valueForm.UserId,
        ControllerName: "",
        ActionName: "",
        ClientIP: valueForm.ClientIP == undefined ? "" : valueForm.ClientIP.trim(),
        Method: valueForm.cbxMethod == undefined ? "" : valueForm.cbxMethod.value,
        FromDate: valueForm.txtDatePasiot != null
        ? valueForm.txtDatePasiot[0] === null
          ? ""
          : Moment.formatDateNew(valueForm.txtDatePasiot[0], "DD/MM/yyyy")
        : "",
        ToDate: valueForm.txtDatePasiot != null
        ? valueForm.txtDatePasiot[1] === null
          ? ""
          : Moment.formatDateNew(valueForm.txtDatePasiot[1], "DD/MM/yyyy")
        : "",
      };
      store.ExportListUI(listAPI.ExportHisLogin,param, "QUAN_LY_DANG_NHAP");
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    useEffect(() => {
      store.dataListHisLoginPasiot = [];
      store.totalRowsListHisLoginPasiot = 0;
    }, []);
    useEffect(() => {
      const valueForm = formPasiot.getFieldsValue();
      if (valueForm.UserId != "" && store.currentHisLoginTab === "pasiot") {
        if (valueLoad) {
          onSubmitPasiot();
        }
      }
    }, [
      store.pageSizeListHisLoginPasiot,
      store.pageIndexListHisLoginPasiot,
      store.currentHisLoginTab,
    ]);

    return (
      <Fragment>
        <Form
          layout={"vertical"}
          form={formPasiot}
          initialValues={defaultValuePasiot}
          onFinish={onClickButtonSearch}
          requiredMark={false}
        >
          <Row>
            <Col lg="6" md="6">
              <Form.Item
                label={t("Customer_ID")}
                name="UserId"
                validateTrigger="onBlur"
              >
                <Input
                  size="small"
                  placeholder={t("Customer_ID")}
                  autoComplete="Off"
                  type="number"
                  onChange={(object) => {
                    if (object.target.value.length > 6) {
                      formPasiot.setFieldsValue({
                        UserId: object.target.value.slice(0, 6),
                      });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col lg="6" md="6">
              <Form.Item label={t("X_Trade_Client_IP")} name="ClientIP">
                <Input
                  size="small"
                  placeholder={t("X_Trade_Client_IP")}
                  autoComplete="Off"
                />
              </Form.Item>
            </Col>
            <Col lg="6" md="6">
              <Form.Item label={t("X_Trade_Client_Method")} name="cbxMethod">
                <Select
                  options={listMethod}
                  defaultValue={listMethod[0]}
                  isClearable={false}
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  styles={customSMSelectStyles}
                />
              </Form.Item>
            </Col>
            <Col lg="6" md="6">
              <Form.Item label={t("X_Trade_Date_Range")} name="txtDatePasiot">
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
                  onClick={resetFormPasiot}
                >
                  {t("X_Trade_Button_Reset")}
                </Button>
                &nbsp;&nbsp;
                <Button
                  htmlType="button"
                  className="btn btn-gradient-success"
                  color="gradient-success"
                  onClick={exportHisLogin}
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
        </Form>
        <Row>
          <Col sm="24" md="24">
            <Table
              columns={listHistoryLoginPasiot}
              dataSource={store.dataListHisLoginPasiot}
              size="small"
              scroll={{ x: 800, y: 800 }}
              loading={store.loadingData}
              pagination={{
                showSizeChanger: true,
                onShowSizeChange: store.handlePerRowsChangeHisLoginPasiot,
                pageSizeOptions: pageSizeTable,
                total: store.totalRowsListHisLoginPasiot,
                showTotal: showTotal,
                onChange: store.handlePageChangeHisLoginPasiot,
                className: "mt-1 text-right custom-ant-pagination",
                defaultCurrent: store.pageIndexListHisLoginPasiot,
                locale: { items_per_page: "/ trang" },
                current: store.pageIndexListHisLoginPasiot,
              }}
            />
          </Col>
        </Row>
      </Fragment>
    );
  });
export default PassiotHisLogin;
