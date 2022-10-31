import { DatePicker, Form, Input, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React from "react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { reportStore } from "../store/reportStore";
import { listAPI, pageSizeTable, SecColumnsType } from "../type";
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

    const columnsCustormer: ColumnsType<SecColumnsType> = [
      {
        title: "STT",
        render: (v, s, index) =>
          index +
          1 +
          (reportStore.pageIndexSec - 1) * reportStore.pageSizexSec,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Sale ID",
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
        title: "NAV trung bình",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "Dư nợ TB",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "GTGD TB tháng",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "Doanh thu phí",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "NAV trái phiếu TB",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "NAV CCQ TB",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "SL TK KH active",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "% TK active của sale",
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
      if (reportStore.pageIndexSec == 1) {
        onSubmit();
      } else {
        reportStore.pageIndexSec = 1;
      }
    };
    const onClickButtonSearch = () => {
      if (reportStore.pageIndexSec == 1) {
        onSubmit();
      } else {
        reportStore.pageIndexSec = 1;
      }
    };
    const onSubmit = () => {};
    const exportExcel = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        userName: appStore.account.LoginName,
        branchId: "53",
        reportCode: "RP_10.1",
        months: "",
        fromDate: valueForm.txtDate ? Moment.formatDateNew(valueForm.txtDate[0], "DD/MM/yyyy"):"",
        toDate: valueForm.txtDate ? Moment.formatDateNew(valueForm.txtDate[1], "DD/MM/yyyy"):"",
        reactiveType: 0,
        joinProducts: "",
        stockCode: valueForm.txtSymbol ? valueForm.txtSymbol:"",
      };
      reportStore.ExportListUI(
        listAPI.apiExport,
        param,
        "BAO_CAO_DS_KH_NAM_GIU_CO_PHIEU"
      );
    };

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("report_sec_title")}</h4>
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
                  <Form.Item label={t("X_Trade_Sec_Code")} name="txtSymbol">
                    <Input placeholder={t("X_Trade_Sec_Code")} maxLength={3}/>
                  </Form.Item>
              </Col>
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
                      reportStore.handlePerRowsChangeCustormerSec,
                    pageSizeOptions: pageSizeTable,
                    total: reportStore.totalRowsDob,
                    showTotal: showTotal,
                    onChange: reportStore.handlePageChangeCustormerSec,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: reportStore.pageIndexSec,
                    locale: { items_per_page: "/ trang" },
                    current: reportStore.pageIndexSec,
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
