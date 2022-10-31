import React, { Fragment, useState, useContext, useEffect } from "react";
import {
  Row,
  Col,
  CustomInput,
  Button,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  CardHeader,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { customSMSelectStyles, pageSizeTable } from "../types";
import { Moment } from "../../../utility/general/Moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import PerfectScrollbar from "react-perfect-scrollbar";
import { PaginationProps, Menu, Form, DatePicker, Input } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import {
  Calendar,
  PhoneForwarded,
  Plus,
  File,
  Twitch,
  List,
  Delete,
  Printer,
  Trello,
  Aperture,
} from "react-feather";
import form from "antd/lib/form";
import locale from "antd/es/date-picker/locale/vi_VN";
import { tradingCodeStore } from "../store/tradingCodeStore";
import { Link, useHistory } from "react-router-dom";
import { appStore } from "../../../stores/appStore";

const ListTradingCode = () =>
  useObserver(() => {
    const { t } = useTranslation();
    const history = useHistory();
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const MySwal = withReactContent(Swal);
    const [valueLoad, setValueLoad] = useState(false);
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const listHistoryCallTableColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (tradingCodeStore.pageIndexListTradingCode - 1) *
            tradingCodeStore.pageSizeListTradingCode,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "ID Sale",
        dataIndex: "SaleId",
        key: "SaleId",
        width: 150,
        fixed: "left",
      },
      {
        title: "Ngày tạo",
        dataIndex: "CreateDate",
        key: "CreateDate",
        width: 150,
      },
      {
        title: "Số TK",
        dataIndex: "Custcode",
        key: "Custcode",
        width: 150,
      },
      {
        title: "Họ và tên",
        dataIndex:"FullName",
        key:"FullName",
        width: 150,
      },
      {
        title: "Trading code",
        dataIndex: "TradingCode",
        key: "TradingCode",
        width: 150,
      },
      {
        title: "Ngày cấp",
        dataIndex: "DateIssue",
        key: "DateIssue",
        width: 150,
      },
      {
        title: "Trạng thái",
        dataIndex: "StatusName",
        key: "StatusName",
        width: 150,
      },
      {
        title: "Người tạo",
        dataIndex: "CreateBy",
        key: "CreateBy",
        width: 150,
      },
      {
        title: "Hành động",
        render: (value, r, index) => {
          return (
            <>
              <Fragment>
                <Menu
                  mode="horizontal"
                  defaultSelectedKeys={["SubMenu"]}
                  className="menu-corg"
                >
                  <Menu.SubMenu key="SubMenu" icon={<List size={18} />}>
                    <Menu.Item
                      key="two"
                      icon={<Twitch size={14} />}
                        // onClick={() => popupDetail(value.Id)}
                    >
                      <Link style={{color:"#b4b7bd"}} to={`/open-account/update-trading-code/${value.Id}`}>{t("deatail_label")}</Link>
                    </Menu.Item>
                    <Menu.Item key="three" icon={<File size={14} />} onClick={()=>changeStatusTradingCode(value)}>
                      {t("X_Trade_Button_Change_Status")}
                    </Menu.Item>
                    <Menu.Item
                      key="four"
                      icon={<Delete size={14} />}
                      //   onClick={() =>
                      //     popupConfirmDel(value.Id, value.BankNo, value.BankName)
                      //   }
                    >
                      {t("X_Trade_Button_Delete")}
                    </Menu.Item>
                    <Menu.Item key="five" icon={<Printer size={14} />}>
                      {t("Export_PDF")}
                    </Menu.Item>
                    <Menu.Item key="six" icon={<Printer size={14} />}>
                      in Mở tài khoản
                    </Menu.Item>
                    <Menu.Item key="seven" icon={<Printer size={14} />}>
                      in Giấy ủy quyền
                    </Menu.Item>
                    <Menu.Item key="eight" icon={<Printer size={14} />}>
                      Phiếu gửi hồ sơ đăng ký MSGD
                    </Menu.Item>
                    <Menu.Item
                      key="six"
                      icon={
                        <Aperture
                          size={14}
                          onClick={() => convertToAccount(value)}
                        />
                      }
                    >
                      {t("Convert")}
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </Fragment>
            </>
          );
        },
        width: 100,
        align: "center",
        fixed: "right",
      },
    ];
    const defaultValue = {
      Passport: "",
      txtDate: "",
    };
    const getListTradingCode = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        CardId: valueForm.Passport,
        FromDate: valueForm.txtDate ? Moment.formatDateNew(valueForm.txtDate[0]._d,"DD/MM/yyyy") : "",
        ToDate: valueForm.txtDate ? Moment.formatDateNew(valueForm.txtDate[1]._d,"DD/MM/yyyy") : "",
        PageIndex: tradingCodeStore.pageIndexListTradingCode,
        PageSize: tradingCodeStore.pageSizeListTradingCode,
      };
      tradingCodeStore.getListTradingCode(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (tradingCodeStore.pageIndexListTradingCode == 1) {
        getListTradingCode();
      } else {
        tradingCodeStore.pageIndexListTradingCode = 1;
      }
    };
    const resetForm = () => {
      form.resetFields();
    };
    const PopupAddNew = () => {
      history.replace("/open-account/regist-trading-code");
    };
    const convertToAccount = (value: any) => {
      MySwal.fire({
        html:
          "Bạn có muốn chuyển đổi Trading code " +
          value.CUSTOMERNAME +
          " thành tài khoản?",
        customClass: {
          confirmButton: "btn btn-gradient-primary mr-1",
          cancelButton: "btn btn-gradient-secondary",
        },
        showClass: {
          popup: "animate__animated animate__flipInX",
        },
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          const paramDel = {
            UserName: appStore.account.LoginName,
            Id: 0,
            CustomerCode: "string",
            TradingCode: "string",
          };
          tradingCodeStore.convertTradingCode(paramDel);
        }
      });
    };
    const changeStatusTradingCode = (value: any) => {
      MySwal.fire({
        html:
          "Bạn có muốn đổi trạng thái Trading code " +
          value.CUSTOMERNAME +
          "?",
        customClass: {
          confirmButton: "btn btn-gradient-primary mr-1",
          cancelButton: "btn btn-gradient-secondary",
        },
        showClass: {
          popup: "animate__animated animate__flipInX",
        },
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          const paramDel = {
            UserName: appStore.account.LoginName,
            "Id": 0,
            "Status": 0,
            "TradingCode": "string",
            "IssueDate": "string",
            "Description": "string"
          };
          tradingCodeStore.changeStatusTradingCode(paramDel);
        }
      });
    };
    const popupDetail = (Id:string)=>{
      
      history.replace(`/open-account/regist-trading-code/${Id}`);
    }

    useEffect(() => {
      tradingCodeStore.dataListTradingCode = [];
      tradingCodeStore.totalRowListTradingCode = 0;
      tradingCodeStore.pageSizeListTradingCode = 10;
    }, []);
    useEffect(() => {
      if (valueLoad) {
        getListTradingCode();
      }
    }, [
      tradingCodeStore.pageIndexListTradingCode,
      tradingCodeStore.pageSizeListTradingCode,
    ]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("Open_Account_Personal_Foreign_Title")}</h4>
            <Link to="/open-account/regist-trading-code">
              <Button
                htmlType="button"
                className="btn btn-gradient-info"
                color="gradient-info"
                onClick={() => PopupAddNew()}
              >
                {t("Regist_Trading_Code_Button")}
              </Button>
            </Link>
          </CardHeader>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={onClickButtonSearch}
              colon={false}
            >
              <Row id="filterSection" className="filterSection">
                <Col lg="6" md="6">
                  <Form.Item
                    label={t("Passport_input")}
                    name="Passport"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("Passport_input")}
                      autoComplete="Off"
                      type="number"
                      //   onChange={(object) => {
                      //     if (object.target.value.length > 6) {
                      //       form.setFieldsValue({
                      //         CustomerID: object.target.value.slice(0, 6),
                      //       });
                      //     }
                      //   }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item
                    label={t("X_Trade_Date_Range")}
                    name="txtDate"
                    labelCol={{ span: 16 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
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
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col sm="24" md="24">
                <Table
                  columns={listHistoryCallTableColumn}
                  dataSource={tradingCodeStore.dataListTradingCode}
                  size="small"
                  scroll={{ x: 800, y: 1200 }}
                  loading={tradingCodeStore.loadingData}
                  rowKey="CallAppHistId"
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange:
                      tradingCodeStore.handlePerRowsChangeListTradingCode,
                    pageSizeOptions: pageSizeTable,
                    total: tradingCodeStore.totalRowListTradingCode,
                    showTotal: showTotal,
                    onChange: tradingCodeStore.handlePageChangeListTradingCode,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: tradingCodeStore.pageIndexListTradingCode,
                    current: tradingCodeStore.pageIndexListTradingCode,
                    locale: { items_per_page: "/ trang" },
                  }}
                />
              </Col>
            </Row>
          </CardBody>
          {/* <PerfectScrollbar style={{ maxHeight: "80vh", maxWidth: "90vh" }}>
            <Modal
              isOpen={tradingCodeStore.isShowPopup}
              toggle={() =>
                (tradingCodeStore.isShowPopup = !tradingCodeStore.isShowPopup)
              }
              className="modal-fullscreen modal-dialog-centered"
              backdrop={"static"}
              fullscreen
            >
              <ModalHeader
                toggle={() =>
                  (tradingCodeStore.isShowPopup = !tradingCodeStore.isShowPopup)
                }
              >
                <Label for="basicInput">
                  {t("X_Trade_Title_Internal_Account_Add")}
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormAddNew />
              </ModalBody>
            </Modal>
          </PerfectScrollbar> */}
        </Card>
      </Fragment>
    );
  });

export default ListTradingCode;
