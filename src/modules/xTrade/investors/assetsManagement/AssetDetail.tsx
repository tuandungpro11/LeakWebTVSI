import React, { Fragment, useEffect, useState } from "react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";
import { useObserver } from "mobx-react";
import { DatePicker, Form, Input, PaginationProps, Tooltip } from "antd";
import { Moment } from "../../../../utility/general/Moment";
import { store } from "../../store/InvestorStore";
import Table, { ColumnsType } from "antd/lib/table";
import { Database } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { assetDetailType, pageSizeTable } from "../../types";
import { useTranslation } from "react-i18next";
import AssetHistory from "./AssetHistory";
import { numberUtil } from "../../../../utility/general/NumberUtil";
import "moment/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";

const AssetDetail = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const { t } = useTranslation();
    const [assetInfo, setAssetInfo] = useState({});
    const resetForm = () => {
      form.resetFields();
      getListAssets();
    };
    const customerAccountColumn: ColumnsType<any> = [
      {
        title: "STT",
        key: "STT",
        render: (v, s, index) => index + 1 + (pageIndex - 1) * pageSize,
        width: 50,
        align: "center",
      },
      {
        title: "Số TK",
        key: "accountNo",
        dataIndex: "accountNo",
        align: "left",
        width: 80,
      },
      {
        title: "Mã KH",
        key: "customerId",
        dataIndex: "customerId",
        align: "left",
        width: 80,
      },
      {
        title: "Ngày",
        key: "date",
        dataIndex: "date",
        align: "center",
        width: 110,
      },
      {
        title: "Số dư tiền",
        key: "cashBalance",
        render: function (value: any) {
          return numberUtil.formatNumber(value.cashBalance);
        },
        width: 120,
        align: "right",
      },
      {
        title: "Tài sản CP",
        key: "stockBalance",
        render: function (value: any) {
          return numberUtil.formatNumber(value.stockBalance);
        },
        width: 120,
        align: "right",
      },
      {
        title: "Tài sản TP",
        key: "bondBalance",
        render: function (value: any) {
          return numberUtil.formatNumber(value.bondBalance);
        },
        width: 120,
        align: "right",
      },
      {
        title: "Tài sản MM",
        key: "mmBalance",
        render: function (value: any) {
          return numberUtil.formatNumber(value.mmBalance);
        },
        width: 120,
        align: "right",
      },
      {
        title: "Tài sản Quỹ",
        key: "fundBalance",
        render: function (value: any) {
          return numberUtil.formatNumber(value.fundBalance);
        },
        width: 120,
        align: "right",
      },
      {
        title: "Tổng NAV",
        key: "nav",
        render: function (value: any) {
          return numberUtil.formatNumber(value.nav);
        },
        width: 120,
        align: "right",
      },
      {
        title: "Tổng tài sản",
        key: "CustomerGroup",
        render: function (value: any) {
          return numberUtil.formatNumber(value.equity);
        },
        width: 120,
        align: "right",
      },
      {
        title: "Nợ TK 6",
        key: "loan01",
        render: function (value: any) {
          return numberUtil.formatNumber(value.loan01);
        },
        width: 120,
        align: "right",
      },
      {
        title: "Nợ ứng trước HĐTP",
        key: "loan02",
        render: function (value: any) {
          return numberUtil.formatNumber(value.loan02);
        },
        width: 130,
        align: "right",
      },
      {
        title: "Tổng nợ",
        key: "totalLoan",
        render: function (value: any) {
          return numberUtil.formatNumber(value.totalLoan);
        },
        width: 120,
        align: "right",
      },
      {
        title: "Action",
        render: (v, record, index) => (
          <Fragment key={index}>
            <Tooltip placement="left" title={"Lịch sử gần nhất"}>
              <Button.Ripple
                className="btn-icon"
                color="flat-info"
                id="positionLeftInactive"
                onClick={() => viewLastestAsset(v)}
                size="sm"
              >
                <Database size={18} />
              </Button.Ripple>
            </Tooltip>
          </Fragment>
        ),
        width: 100,
        fixed: "right",
        align: "center",
      },
    ];
    const { RangePicker } = DatePicker;
    const defaultValue = {
      AccountNo: "",
      // CustId:"",
      Status: assetDetailType[0],
      txtDate: [
        moment(
          new Date(new Date().setDate(new Date().getDate() - 7)),
          "DD-MM-yyyy"
        ),
        moment(new Date()),
      ],
    };
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const handlePageChangeCustomerAccount = (page: any) => {
      setPageIndex(page);
    };
    const handlePerRowsChangeCustomerAccount = (newpage: any, page: any) => {
      setPageSize(page);
    };

    const getListAssets = () => {
      const valueForm = form.getFieldsValue();
      // debugger;
      // if(valueForm.AccountNo=="" && valueForm.CustId==""){
      //   toast(ErrorToast("Không được để trống đồng thời mã khách hàng và số tài khoản"));
      //   return;
      // }
      // if(valueForm.CustId 
      //   && valueForm.CustId.trim() != "" 
      //   && valueForm.CustId.trim().length != 6){
      //   toast(ErrorToast("Hãy điền số tài khoản 6 số"));
      //   return;
      // }
      if(valueForm.AccountNo 
        && valueForm.AccountNo.trim() != "" 
        && valueForm.AccountNo.trim().length != 7){
        toast(ErrorToast("Hãy điền số tài khoản 7 số"));
        return;
      }
      const param = {
        AccountNo: valueForm.AccountNo,
        CustomerId: "",
        FromDate: valueForm.txtDate
          ? valueForm.txtDate[0] === null
            ? ""
            : Moment.formatDateNew(valueForm.txtDate[0], "DD/MM/yyyy")
          : "",
        ToDate: valueForm.txtDate
          ? valueForm.txtDate[1] === null
            ? ""
            : Moment.formatDateNew(valueForm.txtDate[1], "DD/MM/yyyy")
          : "",
      };
      store.GetAssetDetail(param);
    };

    const viewLastestAsset = (assetInfo: any) => {
      setAssetInfo(assetInfo);
      store.showModalAssetLastest(true);
    };

    useEffect(() => {
      store.listAssets = [];
    }, [])

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("Asset_Management")}</h4>
          </CardHeader>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={getListAssets}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Row id="filterSection" className="filterSection">
                {/* <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Customer_Id")} name="CustId">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Customer_Id")}
                      autoComplete="off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 6) {
                          form.setFieldsValue({CustId: object.target.value.slice(0, 6)})
                        }
                      }}
                    />
                  </Form.Item>
                </Col> */}
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Bank_Account")} name="AccountNo"
                      rules={[
                        { required: true, message: 'Số tài khoản không được để trống!' },
                        {
                          whitespace:true,
                          message: "Số tài khoản không được để trống",
                        }
                      ]}>
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Bank_Account")}
                      autoComplete="off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 7) {
                          form.setFieldsValue({AccountNo: object.target.value.slice(0, 7)})
                        }
                      }}
                    />
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
                <Col lg="24" md="24" className="text-center mt-1 mb-1">
                  <Form.Item className="button-group">
                    <Button
                      htmlType="submit"
                      className="btn btn-gradient-info mr-1"
                      color="gradient-info"
                    >
                      {t("X_Trade_Button_Search")}
                    </Button>
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
            </Form>
            <Row>
              <Col sm="24" md="24">
                <Table
                  columns={customerAccountColumn}
                  dataSource={store.listAssets}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={store.loadingAsset}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange: handlePerRowsChangeCustomerAccount,
                    pageSizeOptions: pageSizeTable,
                    showTotal: showTotal,
                    onChange: handlePageChangeCustomerAccount,
                    className: "mt-1 text-right custom-ant-pagination",
                    locale: { items_per_page: "/ trang" },
                  }}
                />
              </Col>
            </Row>
          </CardBody>
          <Modal
            isOpen={store.isShowAssetLastest}
            toggle={() =>
              (store.isShowAssetLastest = !store.isShowAssetLastest)
            }
            className="modal-lg modal-dialog-centered"
            backdrop={"static"}
          >
            <ModalHeader
              toggle={() =>
                (store.isShowAssetLastest = !store.isShowAssetLastest)
              }
            >
              {t("Asset_Management_Latest")}
            </ModalHeader>
            <ModalBody>
              <AssetHistory assetItem={assetInfo} />
            </ModalBody>
          </Modal>
        </Card>
      </Fragment>
    );
  });

export default AssetDetail;
