import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  CustomInput
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Moment } from "../../../../utility/general/Moment";
import { numberUtil } from "../../../../utility/general/NumberUtil";
import {
  ErrorToast,
  SuccessProgressToast,
} from "../../../../views/extensions/toastify/ToastTypes";
import { storeOrder } from "../../store/OrdersStore";
import { customSMSelectStyles, listAPI, pageSizeTable } from "../../types";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { DatePicker, Form, Input, PaginationProps, Upload, UploadProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { storeSystemManagement } from "../../store/SystemManagementStore";
import { store } from "../../store/InvestorStore";

const ListOrderBeforeDate = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    
    const [valueDate, setvalueDate] = useState(new Date());
    const { t } = useTranslation();
    const { register, getValues, errors, handleSubmit, control } = useForm();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueLoad, setValueLoad] = useState(false);
    const listHistoryLogin: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (storeOrder.pageIndexBeforeDate - 1) * storeOrder.pageSizeBeforeDate,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Thời gian đặt lệnh",
        render: function (value: any) {
          return Moment.formatDateNew(value.createdDate, "DD/MM/yyyy HH:mm:ss");
        },
        align: "center",
        width: 150,
      },
      {
        title: "Lệnh",
        render: function (value: any) {
          return value.side == "B" ? "Mua" : "Bán";
        },
        align: "left",
        width: 80,
      },
      {
        title: "Mã CK",
        dataIndex: "secSymbol",
        key: "secSymbol",
        align: "left",
        width: 100,
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
        align: "right",
        width: 80,
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
        title: "Giá đặt",
        render: function (value: any) {
          return numberUtil.formatNumber(value.price * 1000);
        },
        align: "right",
        width: 100,
      },
      {
        title: "GT lệnh",
        render: function (value: any) {
          return numberUtil.formatNumber(value.orderValue);
        },
        align: "right",
        width: 100,
      },
      {
        title: "Trạng thái",
        dataIndex: "statusName",
        key: "statusName",
        align: "left",
        width: 150,
      },
      {
        title: "Kênh đặt",
        dataIndex: "channelText",
        key: "channelText",
        align: "left",
        width: 130,
      },
      {
        title: "Cho phép đẩy lệnh",
        align: "center",
        render: function (value: any) {
          return (
            <CustomInput
              inline
              id="chkTime"
              type="checkbox"
              defaultChecked={value.allowRePush === false ? false : true}
              disabled
            />
          );
        },
        width: 100,
      },
      {
        title: "Trạng thái đẩy lệnh",
        align: "center",
        render: function (value: any) {
          return (
            <CustomInput
              inline
              id="chkTime"
              type="checkbox"
              defaultChecked={value.pushStatus === false ? false : true}
              disabled
            />
          );
        },
        width: 100,
      },
      {
        title: "Mã lỗi",
        dataIndex: "errorCode",
        key: "errorCode",
        align: "left",
        width: 80,
      },
      {
        title: "Thông báo lỗi",
        dataIndex: "errorMessage",
        key: "errorMessage",
        align: "left",
        width: 150,
      },

    ];
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal);

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      if (
        valueForm.CustomerNo &&
        valueForm.CustomerNo.trim() != "" &&
        valueForm.CustomerNo.trim().length != 7
      ) {
        toast.error(ErrorToast("Hãy điền số tài khoản 7 số"));
        return;
      }
      if (
        valueForm.CustormerId &&
        valueForm.CustormerId.trim() != "" &&
        valueForm.CustormerId.trim().length != 6
      ) {
        toast.error(ErrorToast("Hãy điền số tài khoản 6 số"));
        return;
      }
      const param = {
        // UserId: appStore.account.LoginName,
        UserId:
          valueForm.CustormerId == undefined
            ? ""
            : valueForm.CustormerId.trim(),
        Accounts:
          valueForm.CustomerNo == undefined ? "" : valueForm.CustomerNo.trim(),
        Channel:
          valueForm.cbxChannel == undefined ? "" : valueForm.cbxChannel.Source,
        Status:
          valueForm.cbxStatus == undefined || valueForm.cbxStatus.Value == -1
            ? ""
            : valueForm.cbxStatus.Value.toString(),
        SecSymbols:
          valueForm.Symbol == undefined
            ? ""
            : valueForm.Symbol.trim().toUpperCase(),
        FisOrderIds:
          valueForm.Orders == undefined ? "" : valueForm.Orders.trim(),
        PageIndex: storeOrder.pageIndexBeforeDate,
        PageSize: storeOrder.pageSizeBeforeDate,
      };

      storeOrder.getListOrdersBeforeDate(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (storeOrder.pageIndexBeforeDate == 1) {
        onSubmit();
      } else {
        storeOrder.pageIndexBeforeDate = 1;
      }
    };

    const resetForm = () => {
      form.resetFields();
      if (storeOrder.pageIndexBeforeDate == 1) {
        onSubmit();
      } else {
        storeOrder.pageIndexBeforeDate = 1;
      }
    };
    const defaultValue = {
      CustomerId: "",
      Status: -1,
      cbxChannel: storeSystemManagement.dataListChannel[0],
    };
    const exportOrderBeforeDate = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserId: valueForm.CustormerId == undefined
          ? ""
          : valueForm.CustormerId.trim(),
        Accounts: valueForm.CustomerNo == undefined ? "" : valueForm.CustomerNo.trim(),
        Channel: valueForm.cbxChannel == undefined ? "" : valueForm.cbxChannel.Source,
        Status: valueForm.cbxStatus == undefined || valueForm.cbxStatus.Value == -1
          ? ""
          : valueForm.cbxStatus.Value.toString(),
        SecSymbols: valueForm.Symbol == undefined
          ? ""
          : valueForm.Symbol.trim().toUpperCase(),
        FisOrderIds: valueForm.Orders == undefined ? "" : valueForm.Orders.trim(),
      };
      store.ExportListUI(
        listAPI.ExportOrderBeforeDate,
        param,
        "DANH_SACH_LENH_DAT_TRUOC_NGAY"
      );
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    useEffect(() => {
      storeOrder.dataListBeforeDate = [];
      storeOrder.totalRowsBeforeDate = 0;
      storeSystemManagement.getListChannel();
      const paramStt = {
        Category: "ORDER_OUTSIDE",
        Group: "STATUS",
        Code: ""
      }
      storeOrder.GetrderInOutStatus(paramStt);
    }, []);
    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [storeOrder.pageIndexBeforeDate, storeOrder.pageSizeBeforeDate]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Order_Before_Date")}</h4>
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
                  <Form.Item
                    label={t("X_Trade_Bank_Account")}
                    name="CustomerNo"
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Bank_Account")}
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 7) {
                          form.setFieldsValue({
                            CustomerID: object.target.value.slice(0, 7),
                          });
                        }
                      }}
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
                          form.setFieldsValue({
                            CustormerId: object.target.value.slice(0, 6),
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
                  <Form.Item label={t("X_Trade_Channel")} name="cbxChannel">
                    {storeSystemManagement.dataListChannel.length > 0 ? (
                      <Select
                        options={storeSystemManagement.dataListChannel}
                        defaultValue={storeSystemManagement.dataListChannel[0]}
                        isClearable={false}
                        control={control}
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
                  {storeOrder.orderInOutStatus.length > 0 ? (
                      <Select
                        options={storeOrder.orderInOutStatus}
                        defaultValue={storeOrder.orderInOutStatus[0]}
                        isClearable={false}
                        control={control}
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
                <Col lg="24" md="24" className="text-center">
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      className="btn btn-gradient-info mr-h1"
                      color="gradient-info"
                    >
                      {t("X_Trade_Button_Search")}
                    </Button>
                    <Button
                      htmlType="button"
                      className="btn btn-gradient-secondary mr-h1"
                      color="gradient-secondary"
                      onClick={resetForm}
                    >
                      {t("X_Trade_Button_Reset")}
                    </Button>
                    <Button
                      htmlType="button"
                      className="btn btn-gradient-success mr-h1"
                      color="gradient-success"
                      onClick={exportOrderBeforeDate}
                    >
                      {t("X_Trade_Button_Export")}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col sm="24" md="24">
                  <Table
                    columns={listHistoryLogin}
                    dataSource={storeOrder.dataListBeforeDate}
                    size="small"
                    scroll={{ x: 800, y: 800 }}
                    loading={storeOrder.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange:
                        storeOrder.handlePerRowsChangeBeforeDate,
                      pageSizeOptions: pageSizeTable,
                      total: storeOrder.totalRowsBeforeDate,
                      showTotal: showTotal,
                      onChange: storeOrder.handlePageChangeBeforeDate,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent: storeOrder.pageIndexBeforeDate,
                      locale: { items_per_page: "/ trang" },
                      current: storeOrder.pageIndexBeforeDate,
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

export default ListOrderBeforeDate;
