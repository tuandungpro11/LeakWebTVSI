import { Form, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React from "react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { reportStore } from "../store/reportStore";
import { DobColumnsType, listAPI, months, pageSizeTable } from "../type";
import Select from "react-select";
import { selectThemeColors } from "../../../utility/Utils";
import makeAnimated from "react-select/animated";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { appStore } from "../../../stores/appStore";

const ListCustormer = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const animatedComponents = makeAnimated();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const columnsCustormer: ColumnsType<DobColumnsType> = [
      {
        title: "STT",
        render: (v, s, index) =>
          index + 1 + (reportStore.pageIndexDob - 1) * reportStore.pageSizeDob,
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
        title: "Loại khách hàng",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
      {
        title: "Ngày sinh",
        dataIndex: "accountNo",
        key: "accountNo",
        align: "left",
      },
    ];
    const defaultValue = {
      cbxMonth: "",
    };
    const resetForm = () => {
      form.resetFields();
      if (reportStore.pageIndexDob == 1) {
        onSubmit();
      } else {
        reportStore.pageIndexDob = 1;
      }
    };
    const onClickButtonSearch = () => {
      if (reportStore.pageIndexDob == 1) {
        onSubmit();
      } else {
        reportStore.pageIndexDob = 1;
      }
    };
    const onSubmit = () => {};
    const exportExcel = () => {
      const valueForm = form.getFieldsValue();
      let paramMonth:string="";
      if(valueForm.cbxMonth){
        valueForm.cbxMonth.map((item:any)=>{
          if(paramMonth==""){
            paramMonth= item.value;
          }else{
            paramMonth = paramMonth +  "," + item.value;
          }
        });
      }
      const param = {
        userName: appStore.account.LoginName,
        branchId: "53",
        reportCode: "RP_02",
        months: paramMonth,
        fromDate: "",
        toDate: "",
        reactiveType: 0,
        joinProducts: "",
        stockCode: "",
      };
      reportStore.ExportListUI(
        listAPI.apiExport,
        param,
        "BAO_CAO_SINH_NHAT_KHACH_HANG"
      );
    };

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("report_dob_title")}</h4>
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
                  <Form.Item label={t("report_dob")} name="cbxMonth"
                  rules={[
                    {
                      required: true,
                      message: "Tháng ko được để trống",
                    },
                  ]}>
                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      defaultValue={[]}
                      isMulti
                      options={months}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      placeholder={t("report_dob")}
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
                    onShowSizeChange: reportStore.handlePerRowsChangeCustormer,
                    pageSizeOptions: pageSizeTable,
                    total: reportStore.totalRowsDob,
                    showTotal: showTotal,
                    onChange: reportStore.handlePageChangeCustormer,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: reportStore.pageIndexDob,
                    locale: { items_per_page: "/ trang" },
                    current: reportStore.pageIndexDob,
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
