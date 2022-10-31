import { DatePicker, Form, Input, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, CustomInput, Row } from "reactstrap";
import { Moment } from "../../../../utility/general/Moment";
import { storeOrder } from "../../store/OrdersStore";
import { customSMSelectStyles, listAPI, pageSizeTable } from "../../types";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import { numberUtil } from "../../../../utility/general/NumberUtil";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";
import { store } from "../../store/InvestorStore";

const TimeConditionOrders = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const { t } = useTranslation();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueDate, setvalueDate] = useState(new Date());
    const [valueLoad, setValueLoad] = useState(false);

    const listConditionTime: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (storeOrder.pageIndexCondition - 1) * storeOrder.pageSizeCondition,
        width: 50,
        align: "center",
        fixed: "left",
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
        align: "left",
        width: 80,
      },
      {
        title: "Từ ngày",
        render: function (value: any) {
          return Moment.formatDateNew(value.fromDate, "DD/MM/yyyy HH:mm:ss");
        },
        align: "center",
        width: 150,
      },
      {
        title: "Đến ngày",
        render: function (value: any) {
          return Moment.formatDateNew(value.toDate, "DD/MM/yyyy HH:mm:ss");
        },
        align: "center",
        width: 150,
      },
      {
        title: "Lệnh",
        render: function (value: any) {
          if (value.side == "S") {
            return "Bán";
          }
          if (value.side == "B") {
            return "Mua";
          }
        },
        align: "left",
        width: 80,
      },
      {
        title: "Mã CK",
        dataIndex: "stockSymbol",
        key: "stockSymbol",
        align: "left",
        width: 100,
      },
      {
        title: "Điều kiện",
        dataIndex: "conditionPrice",
        key: "conditionPrice",
        align: "left",
        width: 100,
      },
      {
        title: "Giá đặt",
        render: function (value: any) {
          var price = value.price ?? 0;          
          return numberUtil.formatNumber(price * 1000);
        },
        align: "right",
        width: 100,
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
        title: "KL khớp",
        dataIndex: "volumeMatched",
        key: "volumeMatched",
        align: "right",
        width: 100,
      },
      {
        title: "Giá khớp",
        render: function (value: any) {
          var lastMatchedPrice = value.lastMatchedPrice ?? 0;          
          return numberUtil.formatNumber(lastMatchedPrice * 1000);
        },
        align: "right",
        width: 100,
      },
      // {
      //   title: "Thời gian khớp",
      //   render: function (value: any) {
      //     return Moment.formatDateNew(
      //       value.lastMatchingDate,
      //       "DD/MM/yyyy HH:mm:ss"
      //     );
      //   },
      //   align: "center",
      //   width: 150,
      // },
      {
        title: "TG khớp sau cùng",
        render: function (value: any) {
          return Moment.formatDateNew(
            value.lastMatchingDate,
            "DD/MM/yyyy HH:mm:ss"
          );
        },
        align: "center",
        width: 150,
      },
      {
        title: "KL hủy",
        dataIndex: "volumeCancelled",
        key: "volumeCancelled",
        align: "right",
        width: 100,
      },
      {
        title: "TG hủy",
        render: function (value: any) {
          return Moment.formatDateNew(
            value.cancelledDate,
            "DD/MM/yyyy HH:mm:ss"
          );
        },
        align: "center",
        width: 150,
      },
      {
        title: "Lý do từ chối",
        dataIndex: "rejectedReasonCode",
        key: "rejectedReasonCode",
        align: "left",
        width: 150,
      },
      // {
      //   title: "Trạng thái",
      //   dataIndex: "Status_Text",
      //   key: "Status_Text",
      //   align: "left",
      //   width: 200,
      // },
      {
        title: "Kênh đặt",
        render: function (value: any) {
          if (value.source == "W") {
            return "InnoTradeGWWe";
          } else if (value.source == "B") {
            return "Counter/Broker";
          } else if (value.source == "M") {
            return "TVSI Mobiler";
          } else if (value.source == "S") {
            return "Core";
          } else {
            return "";
          }
        },
        align: "left",
        width: 150,
      },
      {
        title: "Ngày tạo",
        render: function (value: any) {
          return Moment.formatDateNew(value.createdDate, "DD/MM/yyyy HH:mm:ss");
        },
        align: "center",
        width: 150,
      },
      {
        title: "Ngày hiệu chỉnh",
        render: function (value: any) {
          return Moment.formatDateNew(
            value.lastModifiedDate,
            "DD/MM/yyyy HH:mm:ss"
          );
        },
        align: "center",
        width: 150,
      },
    ];

    const onSubmitTime = () => {
      const valueForm = form.getFieldsValue();
      if (
        valueForm.CustomerNo &&
        valueForm.CustomerNo.trim() != "" &&
        valueForm.CustomerNo.trim().length != 7
      ) {
        toast.error(ErrorToast("Hãy điền số tài khoản 7 số"));
        return;
      }
      //LDK thoi gian
      var param = {
        BranchId: "",
        AccountNo:
          valueForm.CustomerNo == undefined ? "" : valueForm.CustomerNo.trim(),
        Source:
          valueForm.dataSysCooType == undefined
            ? ""
            : valueForm.dataSysCooType.Value,
        FromDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[0] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[0], "DD/MM/yyyy")
            : "",
        ToDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[1] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[1], "DD/MM/yyyy")
            : "",
        Status:
          valueForm.cbxStatus == undefined ? "" : valueForm.cbxStatus.Value,
        PageIndex: storeOrder.pageIndexCondition,
        PageSize: storeOrder.pageSizeCondition,
      };
      storeOrder.getListConditionByTime(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (storeOrder.pageIndexCondition == 1) {
        onSubmitTime();
      } else {
        storeOrder.pageIndexCondition = 1;
      }
    };

    const resetFormTime = () => {
      form.resetFields();
      if (storeOrder.pageIndexCondition == 1) {
        onSubmitTime();
      } else {
        storeOrder.pageIndexCondition = 1;
      }
    };
    const defaultValue = {
      AccountNo: "",
      Source: "",
      Status: storeOrder.dataSysStatus[0],
      txtDate: [
        moment(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          "DD-MM-yyyy"
        ),
        moment(new Date()),
      ],
      // cbxBS: storeOrder.dataSysSide[0],
      cbxOrderType: storeOrder.dataSysCooType[0],
    };

    const getSysConfig = (code: any) => {
      const param = {
        Category: "ORDER_CONDITION",
        Group: code,
        Code: "",
      };
      storeOrder.getSysConfig(param);
    };
    const exportConditionGTD = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        BranchId: "",
        AccountNo: valueForm.CustomerNo == undefined ? "" : valueForm.CustomerNo.trim(),
        Source: valueForm.dataSysCooType == undefined
        ? ""
        : valueForm.dataSysCooType.Value,
        FromDate: valueForm.txtDate != null
        ? valueForm.txtDate[0] === null
          ? ""
          : Moment.formatDateNew(valueForm.txtDate[0], "DD/MM/yyyy")
        : "",
        ToDate: valueForm.txtDate != null
        ? valueForm.txtDate[1] === null
          ? ""
          : Moment.formatDateNew(valueForm.txtDate[1], "DD/MM/yyyy")
        : "",
        Status: valueForm.cbxStatus == undefined ? "" : valueForm.cbxStatus.Value,
      };
      store.ExportListUI(
        listAPI.ExportConditionGTD,
        param,
        "DANH_SACH_LENH_DIEU_KIEN_THOI_GIAN"
      );
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    useEffect(() => {
      storeOrder.dataListCondition = [];
      storeOrder.totalRowsCondition = 0;
      getSysConfig("COOTYPE");
      getSysConfig("STATUS");
      getSysConfig("SIDE");
    }, []);

    useEffect(() => {
      if (storeOrder.currentConditionOrderTab === "Time") {
        if (valueLoad) {
          onSubmitTime();
        }
      }
    }, [
      storeOrder.pageIndexCondition,
      storeOrder.pageSizeCondition,
      storeOrder.currentConditionOrderTab,
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
            <Form.Item label={t("X_Trade_Bank_Account")} name="CustomerNo">
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
          {/* <Col lg="6" md="6">
            <Form.Item label={t("X_Trade_Sec_Code")} name="Symbol">
              <Input
                size="small"
                placeholder={t("X_Trade_Sec_Code")}
                autoComplete="Off"
              />
            </Form.Item>
          </Col> */}
          {/* <Col lg="6" md="6">
            <Form.Item
              label={t("X_Trade_Condition_Order_Type")}
              name="cbxOrderType"
            >
              {storeOrder.dataSysCooType.length > 0 ? (
                <Select
                  options={storeOrder.dataSysCooType}
                  defaultValue={storeOrder.dataSysCooType[0]}
                  isClearable={false}
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  getOptionLabel={(option) => option.Name}
                  getOptionValue={(option) => option.Value}
                  styles={customSMSelectStyles}
                />
              ) : (
                <></>
              )}
            </Form.Item>
          </Col> */}
          <Col lg="6" md="6">
            <Form.Item label={t("X_Trade_Status")} name="cbxStatus">
              {storeOrder.dataSysStatus.length > 0 ? (
                <Select
                  options={storeOrder.dataSysStatus}
                  defaultValue={storeOrder.dataSysStatus[0]}
                  isClearable={false}
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  getOptionLabel={(option:any) => option.Name}
                  getOptionValue={(option:any) => option.Value}
                  styles={customSMSelectStyles}
                />
              ) : (
                <></>
              )}
            </Form.Item>
          </Col>
          {/* <Col lg="6" md="6">
            <Form.Item label={t("X_Trade_Condition_Order_BS")} name="cbxBS">
              {storeOrder.dataSysSide.length > 0 ? (
                <Select
                  options={storeOrder.dataSysSide}
                  defaultValue={storeOrder.dataSysSide[0]}
                  isClearable={false}
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  getOptionLabel={(option) => option.Name}
                  getOptionValue={(option) => option.Value}
                  styles={customSMSelectStyles}
                />
              ) : (
                <></>
              )}
            </Form.Item>
          </Col> */}
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
          {/* <Col lg="6" md="6">
            <Form.Item style={{ position: "absolute", bottom: "0px" }}>
              <CustomInput
                inline
                type="checkbox"
                id="chkTime"
                label={t("X_Trade_Condition_Order_Out_Time")}
                defaultChecked={false}
              />
            </Form.Item>
          </Col> */}
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
                onClick={resetFormTime}
              >
                {t("X_Trade_Button_Reset")}
              </Button>
              &nbsp;&nbsp;
              <Button
                htmlType="button"
                className="btn btn-gradient-success"
                color="gradient-success"
                onClick={exportConditionGTD}
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
              columns={listConditionTime}
              dataSource={storeOrder.dataListCondition}
              size="small"
              scroll={{ x: 800, y: 800 }}
              loading={storeOrder.loadingData}
              pagination={{
                showSizeChanger: true,
                onShowSizeChange: storeOrder.handlePerRowsCondition,
                pageSizeOptions: pageSizeTable,
                total: storeOrder.totalRowsCondition,
                showTotal: showTotal,
                onChange: storeOrder.handlePageChangeCondition,
                className: "mt-1 text-right custom-ant-pagination",
                defaultCurrent: storeOrder.pageIndexCondition,
                locale: { items_per_page: "/ trang" },
                current: storeOrder.pageIndexCondition,
              }}
            />
          </Col>
        </Row>
      </Form>
    );
  });

export default TimeConditionOrders;
