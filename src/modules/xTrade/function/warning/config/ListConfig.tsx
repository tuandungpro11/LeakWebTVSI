import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  CustomInput,
  Label,
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Moment } from "../../../../../utility/general/Moment";
import { numberUtil } from "../../../../../utility/general/NumberUtil";
import { store } from "../../../store/FunctionStore";
import { customSMSelectStyles, pageSizeTable } from "../../../types";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { DatePicker, Form, Input, Pagination, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { appStore } from "../../../../../stores/appStore";
import PerfectScrollbar from "react-perfect-scrollbar";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../../views/extensions/toastify/ToastTypes";

const ListConfig = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const [valueDate, setvalueDate] = useState(new Date());
    const { t } = useTranslation();
    const { register, getValues, errors, handleSubmit, control } = useForm();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueLoad, setValueLoad] = useState(false);
    const listConfig: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index + 1 + (store.pageIndexConfig - 1) * store.pageSizeConfig,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã khách hàng",
        dataIndex: "CustomerId",
        key: "CustomerId",
        align: "left",
        width: 200,
      },
      {
        title: "Tên khách hàng",
        dataIndex: "CustomerName",
        key: "CustomerName",
        align: "left",
        width: 200,
      },
      {
        title: "Số tài khoản",
        dataIndex: "AccountNo",
        key: "AccountNo",
        align: "left",
        width: 200,
      },
      {
        title: "Loại cảnh báo",
        render: function (value: any) {
          if (value.NotifyType == 5) {
            return "Email, Màn hình";
          } else {
            value.NotifyType;
          }
        },
        align: "left",
        width: 200,
      },
      {
        title: "Chức năng cảnh báo",
        render: function (value: any) {
          if (value.NotifyAction == 2) {
            return "Giá chứng khoán";
          }
          if (value.NotifyAction == 3) {
            return "Chỉ số thị trường";
          }
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
      if(valueForm.CustormerId && valueForm.CustormerId.trim() != "" && valueForm.CustormerId.trim().length <7){
        toast.error(ErrorToast("Hãy điền số tài khoản 6 số"));
        return;
      }
      const param = {
        UserId: appStore.account.LoginName,
        CustomerId:
          valueForm.CustormerId == undefined ? "" : valueForm.CustormerId.trim(),
        AccountNo: valueForm.AccountNo == undefined?"":valueForm.AccountNo.trim(),
        NotifyAction:
          valueForm.cbxType == undefined ? -1 : valueForm.cbxType.Value,
        PageIndex: store.pageIndexConfig,
        PageSize: store.pageSizeConfig,
      };

      store.getListWarning(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (store.pageIndexConfig == 1) {
        onSubmit();
      } else {
        store.pageIndexConfig = 1;
      }
    };

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndexConfig == 1) {
        onSubmit();
      } else {
        store.pageIndexConfig = 1;
      }
    };
    const defaultValue = {
      CustomerId: "",
      AccountNo: "",
      cbxType: store.dataListInternalAccountStatus[0],
    };
    const getListFuncWarning = () => {
      var param = {
        Category: "NOTIFICATION",
        Group: "WARNING",
        Code: "",
      };
      store.getListStatusInternalAccount(param);
    };

    useEffect(() => {
      store.dataConfig=[];
      store.totalRowsConfig=0;
      getListFuncWarning();
    }, []);
    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [store.pageIndexConfig, store.pageSizeConfig]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Warning_Title")}</h4>
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
                          form.setFieldsValue({CustormerId: object.target.value.slice(0, 6)})
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Bank_Account")} name="AccountNo">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Bank_Account")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Warning_Select")} name="cbxType">
                    {store.dataListInternalAccountStatus.length > 0 ? (
                      <Select
                        options={store.dataListInternalAccountStatus}
                        defaultValue={store.dataListInternalAccountStatus[0]}
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
                      columns={listConfig}
                      dataSource={store.dataConfig}
                      size="small"
                      scroll={{ x: 800, y: 800 }}
                      loading={store.loadingData}
                      pagination={{
                        showSizeChanger: true,
                        onShowSizeChange: store.handlePerRowsChangeListWarning,
                        pageSizeOptions: pageSizeTable,
                        total: store.totalRowsConfig,
                        showTotal: showTotal,
                        onChange: store.handlePageChangeListWarning,
                        className: "mt-1 text-right custom-ant-pagination",
                        defaultCurrent: store.pageIndexConfig,
                        locale: { items_per_page: "/ trang" },
                        current: store.pageIndexConfig,
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

export default ListConfig;
