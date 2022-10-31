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
import { any } from "prop-types";

const PriceConditionOrders = () =>
  useObserver(() => {
    const [formPrice] = Form.useForm();
    const { RangePicker } = DatePicker;
    const { t } = useTranslation();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueDate, setvalueDate] = useState(new Date());
    const [valueLoad, setValueLoad] = useState(false);

    const listConditonPrice: ColumnsType<any> = [
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
          return Moment.formatDateNew(value.fromDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 110,
      },
      {
        title: "Đến ngày",
        render: function (value: any) {
          return Moment.formatDateNew(value.toDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 110,
      },
      {
        title: "Mã CK",
        dataIndex: "stockSymbol",
        key: "stockSymbol",
        align: "left",
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
        title: "Chối lời",
        render: function (value: any) {
          if (value.isCheckTakeProfit == true) {
            return "Có";
          } else {
            return "Không";
          }
        },
        align: "left",
        width: 100,
      },
      {
        title: "Cắt lỗ",
        render: function (value: any) {
          if (value.isCheckStopLoss == true) {
            return "Có";
          } else {
            return "Không";
          }
        },
        align: "left",
        width: 100,
      },
      {
        title: "KL khớp",
        render: function (value: any) {
          return numberUtil.formatNumber(value.volumeMatched);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Giá khớp sau cùng",
        render: function (value: any) {
          var lastMatchedPrice = value.lastMatchedPrice ?? 0;          
          return numberUtil.formatNumber(lastMatchedPrice * 1000);
        },
        align: "right",
        width: 100,
      },
      {
        title: "TG khớp",
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
        title: "Giá cắt lỗ",
        render: function (value: any) {
          var stopLossPrice = value.stopLossPrice ?? 0;          
          return numberUtil.formatNumber(stopLossPrice * 1000);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Giá cắt lỗ khi đạt",
        render: function (value: any) {
          var stopLossWhenPrice = value.stopLossWhenPrice ?? 0;  
          return numberUtil.formatNumber(stopLossWhenPrice * 1000);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Giá chốt lời",
        render: function (value: any) {
          var takeProfitPrice = value.takeProfitPrice ?? 0;  
          return numberUtil.formatNumber(takeProfitPrice * 1000);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Giá chốt lời khi đạt",
        render: function (value: any) {
          var takeProfitWhenPrice = value.takeProfitWhenPrice ?? 0; 
          return numberUtil.formatNumber(takeProfitWhenPrice * 1000);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Trạng thái",
        dataIndex: "Status_Text",
        key: "Status_Text",
        align: "left",
        width: 150,
      },
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
    ];
    const resetFormPrice = () => {
      formPrice.resetFields();
      if (storeOrder.pageIndexCondition == 1) {
        onSubmitPrice();
      } else {
        storeOrder.pageIndexCondition = 1;
      }
    };
    const defaultValuePrice = {
      CustormerIdPrice: "",
      CustomerNoPrice: "",
      SymbolPrice: "",
      cbxStatusPrice: storeOrder.dataSysStatus[0],
      cbxOrderTypePrice: storeOrder.dataSysCooType[0],
      txtDatePrice: [
        moment(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          "DD-MM-yyyy"
        ),
        moment(new Date()),
      ],
    };
    const onSubmitPrice = () => {
      const valueForm = formPrice.getFieldsValue();
      if (
        valueForm.CustomerNoPrice &&
        valueForm.CustomerNoPrice.trim() != "" &&
        valueForm.CustomerNoPrice.trim().length != 7
      ) {
        toast.error(ErrorToast("Hãy điền số tài khoản 7 số"));
        return;
      }
      if (
        valueForm.CustormerIdPrice &&
        valueForm.CustormerIdPrice.trim() != "" &&
        valueForm.CustormerIdPrice.trim().length != 6
      ) {
        toast.error(ErrorToast("Hãy điền số tài khoản 6 số"));
        return;
      }
      //LDK gia
      const param = {
        BranchId: "",
        CustomerID:
          valueForm.CustormerIdPrice == undefined
            ? ""
            : valueForm.CustormerIdPrice.trim(),
        AccountNo:
          valueForm.CustomerNoPrice == undefined
            ? ""
            : valueForm.CustomerNoPrice.trim(),
        Symbol:
          valueForm.SymbolPrice == undefined
            ? ""
            : valueForm.SymbolPrice.trim().toUpperCase(),
        OrderStatus:
          valueForm.cbxStatusPrice == undefined
            ? -1
            : valueForm.cbxStatusPrice.Value,
        OrderChannel:
          valueForm.cbxOrderTypePrice == undefined
            ? ""
            : valueForm.cbxOrderTypePrice.Value,
        BeginDate:
          valueForm.txtDate != null
            ? valueForm.txtDatePrice[0] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDatePrice[0], "DD/MM/yyyy")
            : "",
        EndDate:
          valueForm.txtDate != null
            ? valueForm.txtDatePrice[1] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDatePrice[1], "DD/MM/yyyy")
            : "",
        PageIndex: storeOrder.pageIndexCondition,
        PageSize: storeOrder.pageSizeCondition,
      };
      storeOrder.getListConditionByPrice(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (storeOrder.pageIndexCondition == 1) {
        onSubmitPrice();
      } else {
        storeOrder.pageIndexCondition = 1;
      }
    };

    const getSysConfig = (code: any) => {
      const param = {
        Category: "ORDER_CONDITION",
        Group: code,
        Code: "",
      };
      storeOrder.getSysConfig(param);
    };
    const exportConditionST = () => {
      const valueForm = formPrice.getFieldsValue();
      const param = {
        BranchId: "",
        AccountNo: valueForm.CustomerNoPrice == undefined
        ? ""
        : valueForm.CustomerNoPrice.trim(),
        Source: "",
        FromDate: valueForm.txtDate != null
        ? valueForm.txtDatePrice[0] === null
          ? ""
          : Moment.formatDateNew(valueForm.txtDatePrice[0], "DD/MM/yyyy")
        : "",
        ToDate:  valueForm.txtDate != null
        ? valueForm.txtDatePrice[1] === null
          ? ""
          : Moment.formatDateNew(valueForm.txtDatePrice[1], "DD/MM/yyyy")
        : "",
        Status: -1,
        PageIndex: storeOrder.pageIndexCondition,
        PageSize: storeOrder.pageSizeCondition,
      };
      store.ExportListUI(
        listAPI.ExportConditionST,
        param,
        "DANH_SACH_LENH_DIEU_KIEN_GIA"
      );
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    // useEffect(() => {
    //   getSysConfig("COOTYPE");
    //   getSysConfig("STATUS");
    //   getSysConfig("SIDE");
    // }, []);
    useEffect(() => {
      if (storeOrder.currentConditionOrderTab === "Price") {
        if (valueLoad) {
          onSubmitPrice();
        }
      }
    }, [
      storeOrder.pageIndexCondition,
      storeOrder.pageSizeCondition,
      storeOrder.currentConditionOrderTab,
    ]);

    useEffect(() => {
      storeOrder.dataListCondition = [];
      storeOrder.totalRowsCondition = 0;
    }, []);

    return (
      <Form
        layout={"vertical"}
        form={formPrice}
        initialValues={defaultValuePrice}
        onFinish={onClickButtonSearch}
        requiredMark={false}
      >
        <Row>
          <Col lg="6" md="6">
            <Form.Item label={t("X_Trade_Bank_Account")} name="CustomerNoPrice">
              <Input
                size="small"
                placeholder={t("X_Trade_Bank_Account")}
                autoComplete="Off"
                type="number"
                onChange={(object) => {
                  if (object.target.value.length > 7) {
                    formPrice.setFieldsValue({
                      CustomerNoPrice: object.target.value.slice(0, 7),
                    });
                  }
                }}
              />
            </Form.Item>
          </Col>
          {/* <Col lg="6" md="6">
            <Form.Item label={t("X_Trade_Customer_Id")} name="CustormerIdPrice">
              <Input
                size="small"
                placeholder={t("X_Trade_Customer_Id")}
                autoComplete="Off"
                type="number"
                onChange={(object) => {
                  if (object.target.value.length > 6) {
                    formPrice.setFieldsValue({CustormerIdPrice: object.target.value.slice(0, 6)})
                  }
                }}
              />
            </Form.Item>
          </Col> */}
          <Col lg="6" md="6">
            <Form.Item label={t("X_Trade_Sec_Code")} name="SymbolPrice">
              <Input
                size="small"
                placeholder={t("X_Trade_Sec_Code")}
                autoComplete="Off"
              />
            </Form.Item>
          </Col>
          {/* <Col lg="6" md="6">
            <Form.Item
              label={t("X_Trade_Condition_Order_Type")}
              name="cbxOrderTypePrice"
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
            <Form.Item label={t("X_Trade_Status")} name="cbxStatusPrice">
              {storeOrder.dataSysStatus.length > 0 ? (
                <Select
                  options={storeOrder.dataSysStatus}
                  defaultValue={storeOrder.dataSysStatus[0]}
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
          </Col>
          {/* <Col lg="6" md="6">
            <Form.Item label={t("X_Trade_Date_Range")} name="txtDatePrice">
              <RangePicker
                locale={locale}
                allowEmpty={[true, true]}
                format={"DD-MM-yyyy"}
                size="small"
                style={{ width: "100%" }}
                className="ant-picker-small-custom"
              />
            </Form.Item>
          </Col> */}
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
                onClick={resetFormPrice}
              >
                {t("X_Trade_Button_Reset")}
              </Button>
              &nbsp;&nbsp;
              <Button
                htmlType="button"
                className="btn btn-gradient-success"
                color="gradient-success"
                onClick={exportConditionST}
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
              columns={listConditonPrice}
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

export default PriceConditionOrders;
