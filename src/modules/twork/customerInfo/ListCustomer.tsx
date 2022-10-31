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
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useContextMenu } from "react-contexify";
import {
  ChevronDown,
  Delete,
  Edit,
  File,
  Edit2,
  Home,
  List,
  Loader,
  Search,
  PhoneForwarded,
  AlertCircle,
} from "react-feather";
import { customSMSelectStyles, pageSizeTable } from "../types";
import { storeTwork } from "../store/storeTwork";
import { Moment } from "../../../utility/general/Moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import PerfectScrollbar from "react-perfect-scrollbar";
import { PaginationProps, Menu, Form, DatePicker, Input, Tooltip } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { Vietnamese } from "flatpickr/dist/l10n/vn";
import { selectThemeColors } from "../../../utility/Utils";
import { useObserver } from "mobx-react";
import IndexDetail from "./IndexDetail";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../views/extensions/toastify/ToastTypes";
import { appStore } from "../../../stores/appStore";

const ListCustomer = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueUpdate, setValueUpdate] = useState([]);
    const [valueForceCall, setValueForceCall] = useState(false);
    const [valueNumberForceCall, setValueNumberForceCall] = useState("");
    const [valueLoad, setValueLoad] = useState(false);
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const listCustomerTableColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (storeTwork.pageIndexListCustomer - 1) *
            storeTwork.pageSizeListCustomer,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Họ và tên",
        render: function (value: any) {
          return (
            <Label
              style={{ cursor: "pointer" }}
              onClick={() => forceCall(value, false, "")}
            >
              {value.CustName}
            </Label>
          );
        },
        fixed: "left",
        width: 150,
      },
      {
        title: () => (
          <>
            Loại Khách hàng &nbsp;
            <Tooltip
              overlayStyle={{ whiteSpace: "pre-line" }}
              title={`👉 Khách hàng là những cá nhân, tổ chức đã được cấp mã số giao dịch tại TVSI.
👉 KH tiềm năng là những cá nhân, tổ chức có khả năng MTK giao dịch tại TVSI.
👉 KH đăng ký mở tài khoản là những cá nhân, tổ chức đã đăng ký mở tài khoản nhưng chưa được cấp mã số giao dịch tại TVSI.`}
            >
              <span>
                <AlertCircle size={16}></AlertCircle>
              </span>
            </Tooltip>
          </>
        ),
        render: function (value: any) {
          return (
            <Label
              style={{ cursor: "pointer" }}
              onClick={() => forceCall(value, false, "")}
            >
              {value.TypeCustomerName}
            </Label>
          );
        },
        width: 150,
      },
      {
        title: "Mã KH",
        render: function (value: any) {
          return (
            <Label
              style={{ cursor: "pointer" }}
              onClick={() => forceCall(value, false, "")}
            >
              {value.CustCode}
            </Label>
          );
        },
        width: 150,
      },
      {
        title: "Giới tính",
        render: function (value: any) {
          if (value.TypeCustomerName === "Khách hàng tiềm năng") {
            return "";
          } else {
            return (
              <Label
                style={{ cursor: "pointer" }}
                onClick={() => forceCall(value, false, "")}
              >
                {value.Gender}
              </Label>
            );
          }
        },
        width: 150,
      },
      {
        title: "Ngày sinh",
        render: function (value: any) {
          if (value.TypeCustomerName === "Khách hàng tiềm năng") {
            return "";
          } else {
            return (
              <Label
                style={{ cursor: "pointer" }}
                onClick={() => forceCall(value, false, "")}
              >
                {Moment.formatDateNew(value.BirthDay, "DD/MM/yyyy")}
              </Label>
            );
          }
        },
        width: 150,
      },
      {
        title: "Sale ID",
        render: function (value: any) {
          return (
            <Label
              style={{ cursor: "pointer" }}
              onClick={() => forceCall(value, false, "")}
            >
              {value.SaleId}
            </Label>
          );
        },
        width: 150,
      },
      {
        title: "Họ tên Sale",
        render: function (value: any) {
          return (
            <Label
              style={{ cursor: "pointer" }}
              onClick={() => forceCall(value, false, "")}
            >
              {value.SaleName}
            </Label>
          );
        },
        width: 150,
      },
      {
        title: "Số điện thoại 1",
        render: function (value: any) {
          if (value.PhoneNumber_01 != "" && value.PhoneNumber_01 != null) {
            return (
              <Fragment>
                {/* {encodePhoneNumber(value.PhoneNumber_01)} &nbsp; */}
                <Button.Ripple
                  color="primary"
                  className="btn-sm"
                  onClick={() => forceCall(value, true, value.PhoneNumber_01)}
                >
                  <PhoneForwarded size={12} />
                  <span className="align-middle ml-25">Gọi</span>
                </Button.Ripple>
              </Fragment>
            );
          } else {
            return "";
          }
        },
        fixed: "right",
        width: 150,
      },
      {
        title: "Số điện thoại 2",
        render: function (value: any) {
          if (value.PhoneNumber_02 != "" && value.PhoneNumber_02 != null) {
            return (
              <Fragment>
                {/* {encodePhoneNumber(value.PhoneNumber_02)} &nbsp; */}
                <Button.Ripple
                  color="primary"
                  className="btn-sm"
                  onClick={() => forceCall(value, true, value.PhoneNumber_01)}
                >
                  <PhoneForwarded size={12} />
                  <span className="align-middle ml-25">Gọi</span>
                </Button.Ripple>
              </Fragment>
            );
          } else {
            return "";
          }
        },
        fixed: "right",
        width: 150,
      },
      {
        title: "Hành động",
        fixed: "right",
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
                      icon={<File size={14} />}
                      onClick={() => forceCall(value, false, "")}
                    >
                      {t("deatail_label")}
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </Fragment>
            </>
          );
        },
        width: 70,
        align: "center",
      },
    ];
    const defaultValue = {
      CustomerID: "",
      FullName: "",
      Phone: "",
    };
    const resetForm = () => {
      form.resetFields();
      if (storeTwork.pageIndexListCustomer == 1) {
        if (storeTwork.pageSizeListCustomer != 10) {
          storeTwork.pageSizeListCustomer = 10;
          return;
        }
        getListCustormer();
      } else {
        storeTwork.pageIndexListCustomer = 1;
        if (storeTwork.pageSizeListCustomer != 10) {
          storeTwork.pageSizeListCustomer = 10;
          return;
        }
      }
    };
    const getListCustormer = () => {
      const valueForm = form.getFieldsValue();
      console.log(valueForm);

      const param = {
        UserName: appStore.account?.LoginName,
        UserRole: "CRM_SALE",
        Custcode: valueForm.CustomerID.trim(),
        Name: valueForm.FullName.trim(),
        Phone: valueForm.Phone.trim(),
        PageIndex: storeTwork.pageIndexListCustomer,
        PageSize: storeTwork.pageSizeListCustomer,
      };
      storeTwork.getListCustomer(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const forceCall = (
      valueCust: any,
      forceCall: boolean,
      numberForceCall: string
    ) => {
      setValueUpdate(valueCust);
      setValueForceCall(forceCall);
      setValueNumberForceCall(numberForceCall);
      storeTwork.dataPlanInfo = [];
      storeTwork.dataCallInfo = [];
      storeTwork.onShowModalAddNew(true);
    };
    const onClickButtonSearch = () => {
      if (storeTwork.pageIndexListCustomer == 1) {
        getListCustormer();
      } else {
        storeTwork.pageIndexListCustomer = 1;
      }
    };
    const showToast = () => {
      toast.error(ErrorToast("Không thể đóng popup khi đang trong cuộc gọi"));
      return;
    };
    const encodePhoneNumber = (phoneNumber: string) => {
      return phoneNumber.substring(0, 5) + "*****";
    };

    useEffect(() => {
      storeTwork.dataListCustormer = [];
      storeTwork.totalRowListCustomer = 0;
      storeTwork.pageSizeListCustomer = 10;
    }, []);
    useEffect(() => {
      if (valueLoad) {
        getListCustormer();
      }
    }, [storeTwork.pageIndexListCustomer, storeTwork.pageSizeListCustomer]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("twork_cust_info_title")}</h4>
            {/* <Button
              htmlType="button"
              className="btn btn-gradient-info"
              color="gradient-info"
              onClick={() => forceCall([], true)}
            >
              Demo gọi ngay
            </Button> */}
          </CardHeader>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={onClickButtonSearch}
              requiredMark={false}
            >
              <Row id="filterSection" className="filterSection">
                <Col lg="6" md="6">
                  <Form.Item label={t("Customer_ID")} name="CustomerID">
                    <Input
                      type="number"
                      size="small"
                      placeholder={t("Customer_ID")}
                      autoComplete="Off"
                      onChange={(object) => {
                        if (object.target.value.length > 6) {
                          form.setFieldsValue({
                            CustomerID: object.target.value.slice(0, 6),
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("FullName")} name="FullName">
                    <Input
                      size="small"
                      placeholder={t("FullName")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("Phone")} name="Phone">
                    <Input
                      type="number"
                      size="small"
                      placeholder={t("Phone")}
                      autoComplete="Off"
                      onChange={(object) => {
                        if (object.target.value.length > 10) {
                          form.setFieldsValue({
                            Phone: object.target.value.slice(0, 10),
                          });
                        }
                      }}
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
                  columns={listCustomerTableColumn}
                  dataSource={storeTwork.dataListCustormer}
                  size="small"
                  scroll={{ x: 800 }}
                  loading={storeTwork.loadingData}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange:
                      storeTwork.handlePerRowsChangeListCustomer,
                    pageSizeOptions: pageSizeTable,
                    total: storeTwork.totalRowListCustomer,
                    showTotal: showTotal,
                    onChange: storeTwork.handlePageChangeListCustomer,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: storeTwork.pageIndexListCustomer,
                    current: storeTwork.pageIndexListCustomer,
                    locale: { items_per_page: "/ trang" },
                  }}
                />
              </Col>
            </Row>
          </CardBody>
          <PerfectScrollbar style={{ maxHeight: "80vh", maxWidth: "90vh" }}>
            <Modal
              isOpen={storeTwork.isShowPopup}
              toggle={() => (storeTwork.isShowPopup = !storeTwork.isShowPopup)}
              className="modal-fullscreen modal-dialog-centered"
              backdrop={"static"}
              fullscreen
            >
              <ModalHeader
                toggle={() =>
                  storeTwork.isInCall == false
                    ? (storeTwork.isShowPopup = !storeTwork.isShowPopup)
                    : showToast()
                }
              >
                <Label for="basicInput">
                  {t("t_work_title_popup_deatail")}
                </Label>
              </ModalHeader>
              <ModalBody>
                <IndexDetail
                  valueUpdate={valueUpdate}
                  forceCall={valueForceCall}
                  numberForceCall={valueNumberForceCall}
                />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
        </Card>
      </Fragment>
    );
  });

export default ListCustomer;
