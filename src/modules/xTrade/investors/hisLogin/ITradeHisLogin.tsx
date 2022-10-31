import { DatePicker, Form, Input, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Moment } from "../../../../utility/general/Moment";
import { store } from "../../store/InvestorStore";
import { customSMSelectStyles, pageSizeTable } from "../../types";
import Select from "react-select";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import { selectThemeColors } from "@utils";
import { Button, Col, Row } from "reactstrap";
import { storeSystemManagement } from "../../store/SystemManagementStore";
import locale from 'antd/es/date-picker/locale/vi_VN';
import moment from "moment";
import { appStore } from "../../../../stores/appStore";

const ITradeHisLogin = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueDate, setvalueDate] = useState(new Date());
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const { RangePicker } = DatePicker;
    const listHistoryLogin: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (store.pageIndexListHisLogin - 1) * store.pageSizeListHisLogin,
        width: 50,
        align: "center",
      },
      {
        title: "Mã khách hàng",
        dataIndex: "CUSTOMERID",
        key: "CUSTOMERID",
      },
      {
        title: "Tên tài khoản",
        dataIndex: "CUSTOMERNAME",
        key: "CUSTOMERNAME",
      },
      {
        title: "Ngày giờ đăng nhập",
        key: "LOGINDATE",
        render: (value, record, index) => {
          return Moment.formatDateNew(value.LOGINDATE, "DD/MM/yyyy HH:mm:ss");
        },
      },
      {
        title: "Ngày giờ thoát",
        key: "LOGOUTDATE",
        render: (value, record, index) => {
          return Moment.formatDateNew(value.LOGOUTDATE, "DD/MM/yyyy HH:mm:ss");
        },
      },
      {
        title: "IP đăng nhập",
        dataIndex: "IP",
        key: "IP",
      },
      {
        title: "Kênh",
        dataIndex: "CHANNELNAME",
        key: "CHANNELNAME",
      },
      {
        title: "Trạng thái",
        render: (value, row, index) => {
          if (value.STATUS == 1) {
            return "Đăng nhập chưa thoát";
          }
          if (value.STATUS == 2) {
            return "Đăng nhập đã thoát";
          }
          if (value.STATUS == 3) {
            return "Đăng nhập hết giờ";
          }
          if (value.STATUS == 4) {
            return "Đăng nhập bị NV kích thoát";
          }
        },
      },
      {
        title: "Tên nhân viên",
        dataIndex: "USERNAME",
        key: "USERNAME",
      },
      {
        title: "Ghi chú",
        dataIndex: "REMARK",
        key: "REMARK",
      },
    ];
    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserId: appStore.account.LoginName,
        CustomerId:
          valueForm.CustormerId == undefined ? "" : valueForm.CustormerId,
        Status:
          valueForm.cbxStatus == undefined ? -1 : valueForm.cbxStatus.Value,
        Channel:
          valueForm.cbxChannel == undefined ? "" : valueForm.cbxChannel.Source,
        BeginDate: valueForm.txtDate != null ? valueForm.txtDate[0] === null ? "" : Moment.formatDateNew(valueForm.txtDate[0], "yyyyMMDD") : "",
        EndDate: valueForm.txtDate != null ? valueForm.txtDate[1] === null ? "" : Moment.formatDateNew(valueForm.txtDate[1], "yyyyMMDD") : "",
        PageIndex: store.pageIndexListHisLogin,
        PageSize: store.pageSizeListHisLogin,
      };

      store.getListHisLogin(param);
    };
    const onClickButtonSearch = () => {
      if (store.pageIndexListHisLogin == 1) {
        onSubmit();
      } else {
        store.pageIndexListHisLogin = 1;
      }
    };

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndexListHisLogin == 1) {
        onSubmit();
      } else {
        store.pageIndexListHisLogin = 1;
      }
    };

    const defaultValue = {
      CustomerId: "",
      Status: storeSystemManagement.listStatusLogin[0],
      cbxChannel: storeSystemManagement.dataListChannel[0],
      txtDate: [moment(new Date(new Date().setDate(new Date().getDate() - 7)), "DD-MM-yyyy"), moment(new Date())],
    };

    useEffect(() => {
      const param = {
        Category: "LOGLOGIN",
        Group: "STATUS",
        Code: "",
      };
      storeSystemManagement.getListChannel();
      storeSystemManagement.getListStatus(param);
    }, []);
    
    const useComponentDidMount = () => {
      const ref = useRef();
      useEffect(() => {
        ref.current = true;
      }, []);
      return ref.current;
    };
    const isComponentMounted = useComponentDidMount();
    useEffect(() => {
      if(isComponentMounted){
        if (store.currentHisLoginTab === "iTrade") {
          onSubmit();
        }
      }
    }, [
      store.pageIndexListHisLogin,
      store.pageSizeListHisLogin,
      store.currentHisLoginTab,
    ]);

    return (
      <Form
        layout={"vertical"}
        form={form}
        initialValues={defaultValue}
        onFinish={onClickButtonSearch}
        requiredMark={false}
      >
        <Row>
          <Col lg="6" md="6">
            <Form.Item label={t("X_Trade_Customer_Id")} name="CustormerId">
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
            <Form.Item label={t("X_Trade_Channel")} name="cbxChannel">
              {storeSystemManagement.dataListChannel.length > 0 ? (
                <Select
                  options={storeSystemManagement.dataListChannel}
                  defaultValue={storeSystemManagement.dataListChannel[0]}
                  isClearable={false}
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
              {storeSystemManagement.listStatusLogin.length > 0 ? (
                <Select
                  options={storeSystemManagement.listStatusLogin}
                  defaultValue={storeSystemManagement.listStatusLogin[0]}
                  isClearable={false}
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
              dataSource={store.dataListHisLogin}
              size="small"
              scroll={{ x: 800 }}
              loading={store.loadingData}
              pagination={{
                showSizeChanger: true,
                onShowSizeChange: store.handlePerRowsChangeListHisLogin,
                pageSizeOptions: pageSizeTable,
                total: store.totalRowsListHisLogin,
                showTotal: showTotal,
                onChange: store.handlePageChangeListHisLogin,
                className: "mt-1 text-right custom-ant-pagination",
                defaultCurrent: store.pageIndexListHisLogin,
                locale: { items_per_page: "/ trang" },
                current: store.pageIndexListHisLogin,
              }}
            />
          </Col>
        </Row>
      </Form>
    );
  });
export default ITradeHisLogin;
