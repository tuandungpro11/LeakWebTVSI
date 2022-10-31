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
  Phone,
  Cast,
  Star,
  ArrowUp,
  ArrowDown,
  Edit3,
  PhoneForwarded,
  Plus,
} from "react-feather";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { customSMSelectStyles, pageSizeTable } from "../types";
import { storeTwork } from "../store/storeTwork";
import { Moment } from "../../../utility/general/Moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import PerfectScrollbar from "react-perfect-scrollbar";
import { PaginationProps, Menu, Form, DatePicker, Input } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { Vietnamese } from "flatpickr/dist/l10n/vn";
import { selectThemeColors } from "../../../utility/Utils";
import { useObserver } from "mobx-react";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import IndexDetail from "../customerInfo/IndexDetail";
import Rating from "react-rating";
import { ThemeColors } from "../../../utility/context/ThemeColors";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../views/extensions/toastify/ToastTypes";
import { appStore } from "../../../stores/appStore";

const HistoryCall = (props: any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueDate, setvalueDate] = useState(new Date());
    const { RangePicker } = DatePicker;
    const [valueUpdate, setValueUpdate] = useState([]);
    const [valueForceCall, setValueForceCall] = useState(false);
    const themeColors = useContext(ThemeColors);
    const [valueNumberForceCall, setValueNumberForceCall] = useState("");
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const [valueLoad, setValueLoad] = useState(false);

    const custType = [
      { value: -1, label: "Tất cả" },
      { value: 1, label: "Khách hàng" },
      { value: 2, label: "Khách hàng tiềm năng" },
      { value: 3, label: "KH đăng ký MTK" },
    ];
    const callType = [
      { value: -1, label: "Tất cả", color: "#1890ff", isFixed: false },
      { value: 1, label: "Tư vấn đầu tư", color: "#1890ff", isFixed: false },
      {
        value: 2,
        label: "Hướng dẫn giao dịch",
        color: "#1890ff",
        isFixed: false,
      },
      { value: 3, label: "Thông báo lỗi", color: "#1890ff", isFixed: false },
      {
        value: 4,
        label: "Giới thiệu dịch vụ",
        color: "#1890ff",
        isFixed: false,
      },
      {
        value: 5,
        label: "Hoàn thiện hồ sơ MTK",
        color: "#1890ff",
        isFixed: false,
      },
      { value: 6, label: "Khác", color: "#1890ff", isFixed: false },
    ];

    const listHistoryCallTableColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (storeTwork.pageIndexHistoryCall - 1) *
          storeTwork.pageSizeHistoryCall,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Họ và tên",
        dataIndex: "CustName",
        key: "CustName",
        width: 150,
        fixed: "left",
      },
      {
        title: "Loại khách hàng",
        dataIndex: "CustTypeName",
        key: "CustTypeName",
        width: 150,
      },
      {
        title: "Mã KH",
        dataIndex: "CustCode",
        key: "CustCode",
        width: 150,
      },
      {
        title: "Bắt đầu",
        render: function (value: any) {
          return Moment.formatDateNew(value.CreatedDate, "DD/MM/yyyy HH:mm:ss");
        },
        width: 150,
      },
      {
        title: "Thời gian",
        dataIndex: "TimeCall",
        key: "TimeCall",
        width: 150,
      },
      {
        title: "SĐT",
        render: function (value: any) {
          return (
            <Fragment>
              {/* {encodePhoneNumber(value.Mobile)} &nbsp; */}
              <Button.Ripple
                className="btn-sm"
                color="primary"
                onClick={() => viewDetailNotUpdate(value, true, value.Mobile)}
              >
                <PhoneForwarded size={12} />
                <span className='align-middle ml-25'>Gọi</span>
              </Button.Ripple>
            </Fragment>
          );
        },
        width: 150,
      },
      {
        title: "Hình thức",
        dataIndex: "DirectionName",
        key: "DirectionName",
        width: 150,
      },
      {
        title: "NVTH",
        dataIndex: "SaleID",
        key: "SaleID",
        width: 150,
      },
      {
        title: "Họ và tên",
        dataIndex: "CreatedName",
        key: "CreatedName",
        width: 150,
      },
      {
        title: "Ngày tạo",
        render: function (value: any) {
          return Moment.formatDateNew(value.CreatedDate, "DD/MM/yyyy HH:mm:ss");
        },
        width: 150,
      },
      {
        title: "Người tạo",
        dataIndex: "CreatedName",
        key: "CreatedName",
        width: 150,
      },
      {
        title: "Hành động",
        render: function (value, r, index) {
          return (props && props.activeTab === 'Call' ? (
            <Fragment>
              <Menu
                mode="horizontal"
                defaultSelectedKeys={["SubMenu"]}
                className="menu-corg"
              >
                <Menu.SubMenu key="SubMenu" icon={<List size={18} />}>
                  <Menu.Item
                    key="two"
                    icon={<Plus size={14} />}
                    onClick={() => viewDetailNotUpdate(value, false, value.Mobile)}
                  >
                    {t("X_Trade_Button_Add_New")}
                  </Menu.Item>
                  <Menu.Item
                    key="three"
                    icon={<File size={14} />}
                    onClick={() => viewDetail(value, false)}
                  >
                    {t("X_Trade_Button_Update")}
                  </Menu.Item>
                </Menu.SubMenu>
              </Menu>
            </Fragment>
          ) : (
            <></>
          )
          )
        },
        width: 100,
        align: "center",
        fixed: "right",
      },
    ];
    const showToast = () => {
      toast.error(ErrorToast("Không thể đóng popup khi đang trong cuộc gọi"));
      return;
    };
    const defaultValue = {
      CustomerID: "",
      FullName: "",
      Phone: "",
      txtDate: [
        moment(
          new Date(new Date().setDate(new Date().getDate() - 7)),
          "DD-MM-yyyy"
        ),
        moment(new Date()),
      ],
    };
    const resetForm = () => {
      form.resetFields();
      if (storeTwork.pageIndexHistoryCall == 1) {
        if (storeTwork.pageSizeHistoryCall != 10) {
          storeTwork.pageSizeHistoryCall = 10;
          return;
        }
        getHistoryCall();
      } else {
        storeTwork.pageIndexHistoryCall = 1;
        if (storeTwork.pageSizeHistoryCall != 10) {
          storeTwork.pageSizeHistoryCall = 10;
          return;
        }
      }
    };
    const viewDetailNotUpdate = (value: any, valueForceCall: boolean, numberForceCall: string) => {
      setValueForceCall(valueForceCall);
      setValueNumberForceCall(numberForceCall);
      storeTwork.dataCallInfo = [];
      //call api getlist
      const param = {
        UserName: appStore.account?.LoginName,
        UserRole: "CRM_SALE",
        Custcode: value.CustCode,
        Name: "",
        Phone: "",
        PageIndex: 1,
        PageSize: 1,
      };
      storeTwork.getListCustomer(param);
    };
    const viewDetail = (value: any, valueForceCall: boolean) => {
      setValueForceCall(valueForceCall);
      setValueNumberForceCall("");
      //call api getlist
      const param = {
        UserName: appStore.account?.LoginName,
        UserRole: "CRM_SALE",
        Custcode: value.CustCode,
        Name: "",
        Phone: "",
        PageIndex: 1,
        PageSize: 1,
      };
      storeTwork.getListCustomer(param);
      storeTwork.dataCallInfo = [value];
    };
    const getHistoryCall = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account?.LoginName,
        UserRole: "CRM_SALE",
        CustCode: valueForm.CustomerID == undefined ? "" : valueForm.CustomerID,
        SaleId: valueForm.SaleId == undefined ? "" : valueForm.SaleId,
        CustType:
          valueForm.custType == undefined ? -1 : valueForm.custType.value,
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
        LeadId: 0,
        PageIndex: storeTwork.pageIndexHistoryCall,
        PageSize: storeTwork.pageSizeHistoryCall,
      };
      storeTwork.getHistoryCall(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (storeTwork.pageIndexHistoryCall == 1) {
        getHistoryCall();
      } else {
        storeTwork.pageIndexHistoryCall = 1;
      }
    };
    const encodePhoneNumber = (phoneNumber:string)=>{
      return phoneNumber.substring(0,5)+"*****"
    }

    useEffect(() => {
      storeTwork.dataListCustormer = [];
      storeTwork.dataHistoryCall = [];
      storeTwork.totalRowHistoryCall = 0;
      storeTwork.pageSizeHistoryCall = 10;
      // getHistoryCall();
    }, []);
    useEffect(() => {
      if (valueLoad) {
        getHistoryCall();
      }
    }, [storeTwork.pageIndexHistoryCall, storeTwork.pageSizeHistoryCall]);

    useEffect(() => {
      if (
        storeTwork.dataListCustormer.length > 0 &&
        storeTwork.currentHisTab == "Call"
      ) {
        setValueUpdate(storeTwork.dataListCustormer[0]);
        //show modal
        storeTwork.onShowModalHistoryCall(true);
      }
    }, [storeTwork.dataListCustormer]);

    useEffect(() => { }, []);

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={onClickButtonSearch}
              colon={false}
              requiredMark={false}
            >
              <Row id="filterSection" className="filterSection">
                <Col lg="6" md="6">
                  <Form.Item
                    label={t("Customer_ID")}
                    name="CustomerID"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("Customer_ID")}
                      autoComplete="Off"
                      type="number"
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
                  <Form.Item
                    label={t("twork_sale_id")}
                    name="SaleId"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("twork_sale_id")}
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 4) {
                          form.setFieldsValue({
                            SaleId: object.target.value.slice(0, 4),
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item
                    label={t("twork_cust_type")}
                    name="custType"
                    labelCol={{ span: 16 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      defaultValue={custType[0]}
                      options={custType}
                      isClearable={false}
                      styles={customSMSelectStyles}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item
                    label={t("X_Trade_Date")}
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
                  dataSource={storeTwork.dataHistoryCall}
                  size="small"
                  scroll={{ x: 800, y: 1200 }}
                  loading={storeTwork.loadingData}
                  rowKey="CallAppHistId"
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange: storeTwork.handlePerRowsChangeHistoryCall,
                    pageSizeOptions: pageSizeTable,
                    total: storeTwork.totalRowHistoryCall,
                    showTotal: showTotal,
                    onChange: storeTwork.handlePageChangeHistoryCall,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: storeTwork.pageIndexHistoryCall,
                    current: storeTwork.pageIndexHistoryCall,
                    locale: { items_per_page: "/ trang" },
                  }}
                  expandable={{
                    expandedRowRender: (record) => (
                      <Fragment>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Ngày sinh:{" "}
                          {Moment.formatDateNew(record.Birthday, "DD/MM/yyyy")}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Sale Id: {record.SaleID}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Phân loại: {record.CallAppTypeName}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Giới tính: {record.Gender}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Họ tên sale: {record.SaleName}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Xếp hạng:
                          <Rating
                            emptySymbol={
                              <Star size={24} fill="#babfc7" stroke="#babfc7" />
                            }
                            fullSymbol={
                              <Star
                                size={24}
                                fill={themeColors.colors.warning.main}
                                stroke={themeColors.colors.warning.main}
                              />
                            }
                            initialRating={record.Rate}
                            direction="ltr"
                            readonly={true}
                          />
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Người cập nhật cuối: {record.UpdatedBy}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Ngày cập nhật:{" "}
                          {Moment.formatDateNew(
                            record.UpdatedDate,
                            "DD/MM/yyyy HH:mm:ss"
                          )}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Họ và tên: {record.UpdatedName}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Ghi chú: {record.Note}
                        </Col>
                      </Fragment>
                    ),
                    expandIcon: ({ expanded, onExpand, record }) =>
                      expanded ? (
                        <ArrowUp onClick={(e) => onExpand(record, e)} />
                      ) : (
                        <ArrowDown onClick={(e) => onExpand(record, e)} />
                      ),
                  }}
                />
              </Col>
            </Row>
          </CardBody>
          <PerfectScrollbar style={{ maxHeight: "80vh", maxWidth: "90vh" }}>
            <Modal
              isOpen={storeTwork.isShowPopupHistoryCall}
              toggle={() =>
              (storeTwork.isShowPopupHistoryCall =
                !storeTwork.isShowPopupHistoryCall)
              }
              className="modal-fullscreen modal-dialog-centered"
              backdrop={"static"}
              fullscreen
            >
              <ModalHeader
                toggle={() =>
                  storeTwork.isInCall == false
                    ? (storeTwork.isShowPopupHistoryCall =
                      !storeTwork.isShowPopupHistoryCall)
                    : showToast()
                }
              >
                <Label for="basicInput">
                  {t("X_Trade_Title_Internal_Account_Add")}
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

export default HistoryCall;
