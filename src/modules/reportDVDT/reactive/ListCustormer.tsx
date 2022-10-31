import { DatePicker, Form, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React from "react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { reportStore } from "../store/reportStore";
import { listAPI, months, pageSizeTable, ReactiveColumnsType } from "../type";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { appStore } from "../../../stores/appStore";
import locale from "antd/es/date-picker/locale/vi_VN";
import { Moment } from "../../../utility/general/Moment";

const ListCustormer = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const { RangePicker } = DatePicker;
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const columnsCustormer: ColumnsType<ReactiveColumnsType> = [
      {
        title: "STT",
        render: (v, s, index) =>
          index +
          1 +
          (reportStore.pageIndexReactive - 1) * reportStore.pageSizexReactive,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Chi nhánh",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "Sale ID",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "Họ tên NVCS",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "Mã KH",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "Họ tên KH",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "Ngày mở TK",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "Ngày GDCC",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "Hành động",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
    ];
    const defaultValue = {
      txtDate: "",
    };
    const resetForm = () => {
      form.resetFields();
      if (reportStore.pageIndexReactive == 1) {
        onSubmit();
      } else {
        reportStore.pageIndexReactive = 1;
      }
    };
    const onClickButtonSearch = () => {
      if (reportStore.pageIndexReactive == 1) {
        onSubmit();
      } else {
        reportStore.pageIndexReactive = 1;
      }
    };
    const onSubmit = () => {};
    const exportExcel = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        userName: appStore.account.LoginName,
        branchId: "53",
        reportCode: "RP_04",
        months: "",
        fromDate: valueForm.txtDate ? Moment.formatDateNew(valueForm.txtDate[0], "DD/MM/yyyy"):"",
        toDate: valueForm.txtDate ? Moment.formatDateNew(valueForm.txtDate[1], "DD/MM/yyyy"):"",
        reactiveType: 0,
        joinProducts: "",
        stockCode: "",
      };
      reportStore.ExportListUI(
        listAPI.apiExport,
        param,
        "BAO_CAO_KH_REACTIVE"
      );
    };

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("report_reactive_title")}</h4>
          </CardHeader>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={exportExcel}
              requiredMark={false}
            >
              <Row>
                <Col md="6" lg="6" xs="6">
                  <Form.Item label={t("X_Trade_Date_Range")} name="txtDate"
                  rules={[
                    {
                      required: true,
                      message: "Từ ngày đến ngày ko được để trống",
                    },
                  ]}>
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
                      htmlType="button"
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
                      htmlType="submit"
                      className="btn btn-gradient-success"
                      color="gradient-success"
                      // onClick={exportExcel}
                    >
                      {t("X_Trade_Button_Export")}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col sm="24" md="24">
                <Table
                  columns={columnsCustormer}
                  dataSource={reportStore.dataListDob}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={reportStore.loadingData}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange:
                      reportStore.handlePerRowsChangeCustormerReactive,
                    pageSizeOptions: pageSizeTable,
                    total: reportStore.totalRowsDob,
                    showTotal: showTotal,
                    onChange: reportStore.handlePageChangeCustormerReactive,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: reportStore.pageIndexReactive,
                    locale: { items_per_page: "/ trang" },
                    current: reportStore.pageIndexReactive,
                  }}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Fragment>
    );
  });
export default ListCustormer;
