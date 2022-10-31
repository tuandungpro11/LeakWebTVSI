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
  Edit3,
  ArrowUp,
  ArrowDown,
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
import { toast } from "react-toastify";
import { ErrorToast } from "../../../views/extensions/toastify/ToastTypes";
import { appStore } from "../../../stores/appStore";

const HistoryPlan = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const { t } = useTranslation();
    const [valueDate, setvalueDate] = useState(new Date());
    const [valueUpdate, setValueUpdate] = useState([]);
    const [valueForceCall, setValueForceCall] = useState(false);
    const MySwal = withReactContent(Swal);
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueLoad, setValueLoad] = useState(false);

    const custType = [
      { value: -1, label: "Tất cả" },
      { value: 1, label: "Khách hàng" },
      { value: 2, label: "Khách hàng tiềm năng" },
      { value: 3, label: "KH đăng ký MTK" },
    ];
    const statusState = [
      { value: 0, label: "Tất cả" },
      { value: 1, label: "Chưa đến hạn" },
      { value: 2, label: "Đúng hạn" },
      { value: 3, label: "Quá hạn" }
    ];

    const listHistoryPlanTableColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (storeTwork.pageIndexHistoryPlan - 1) *
            storeTwork.pageSizeHistoryPlan,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Họ và tên",
        dataIndex: "CustName",
        key: "CustName",
        fixed: "left",
        width: 150,
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
        title: "Thời gian",
        render: function (value: any) {
          return (
            Moment.formatDateNew(value.StartTime, "DD/MM/yyyy HH:mm:ss") +
            " đến " +
            Moment.formatDateNew(value.EndTime, "DD/MM/yyyy HH:mm:ss")
          );
        },
        width: 200,
      },
      {
        title: "NVTH",
        dataIndex: "CreatedName",
        key: "CreatedName",
        width: 150,
      },
      {
        title: "Hình thức",
        dataIndex: "BookCallTypeName",
        key: "BookCallTypeName",
        width: 150,
      },
      {
        title: "Trạng thái",
        dataIndex: "StatusName",
        key: "StatusName",
        width: 150,
      },
      {
        title: "Tình trạng",
        dataIndex: "StatusState",
        key: "StatusState",
        width: 150,
      },
      {
        title: "Ngày hiệu chỉnh",
        render: function (value: any) {
          return Moment.formatDateNew(value.UpdatedDate, "DD/MM/yyyy HH:mm:ss");
        },
        width: 150,
      },
      {
        title: "Người hiệu chỉnh",
        dataIndex: "UpdatedName",
        key: "UpdatedName",
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
                      icon={<Plus size={14} />}
                      onClick={() => viewDetailNotUpdate(value)}
                    >
                      {t("X_Trade_Button_Add_New")}
                    </Menu.Item>
                    {(value.Status==0 && value.StatusState=="Chưa đến hạn")||(value.Status==1 || value.StatusState=="Quá hạn")?(
                    <Menu.Item
                      key="three"
                      icon={<File size={14} />}
                      onClick={() => viewDetail(value)}
                    >
                      {t("X_Trade_Button_Update")}
                    </Menu.Item>):(<></>)}
                    {value.Status==0 && value.StatusState=="Chưa đến hạn"?(
                    <Menu.Item
                      key="four"
                      icon={<Delete size={14} />}
                      onClick={() => deletePlan(value)}
                    >
                      {t("X_Trade_Button_Close")}
                    </Menu.Item>):(<></>)}
                  </Menu.SubMenu>
                </Menu>
              </Fragment>
            </>
          );
        },
        width: 100,
        align: "center",
      },
    ];
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
      statusState: statusState[0],
      custType:custType[0]
    };
    const showToast=()=>{
      toast.error(ErrorToast("Không thể đóng popup khi đang trong cuộc gọi"));
      return;
    }
    const resetForm = () => {
      form.resetFields();
      if (storeTwork.pageIndexHistoryPlan == 1) {
        if (storeTwork.pageSizeHistoryPlan != 10) {
          storeTwork.pageSizeHistoryPlan = 10;
          return;
        }
        getHistoryPlan();
      } else {
        storeTwork.pageIndexHistoryPlan = 1;
        if (storeTwork.pageSizeHistoryPlan != 10) {
          storeTwork.pageSizeHistoryPlan = 10;
          return;
        }
      }
    };

    const onClickButtonSearch = () => {
      if (storeTwork.pageIndexHistoryPlan == 1) {
        getHistoryPlan();
      } else {
        storeTwork.pageIndexHistoryPlan = 1;
      }
    };
    const viewDetail = (value: any) => {
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
      storeTwork.dataPlanInfo = [value];
    };
    const viewDetailNotUpdate = (value: any) => {
      storeTwork.dataPlanInfo = [];
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
    const getHistoryPlan = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account?.LoginName,
        UserRole: "CRM_SALE",
        CustCode:
          valueForm.CustomerID == undefined ? "" : valueForm.CustomerID,
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
        StateStatus: valueForm.statusState == undefined?0:valueForm.statusState.value,
        PageIndex: storeTwork.pageIndexHistoryPlan,
        PageSize: storeTwork.pageSizeHistoryPlan,
      };
      storeTwork.getHistoryPlan(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const deletePlan = (value: any) => {
      storeTwork.isCallApiSuccess=false;
      MySwal.fire({
        html: "Bạn có chắc chắn hủy lịch đặt cuộc gọi này không?",
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
      }).then(async (result) => {
        if (result.isConfirmed) {
          const param = {
            UserName: appStore.account?.LoginName,
            UserRole: "CRM_SALE",
            BookApptCallId: value.BookApptCallId,
          };
          await storeTwork.DeletePlan(param);
          getHistoryPlan();
        }
      });
    };

    useEffect(() => {
      storeTwork.dataListCustormer = [];
      storeTwork.dataHistoryPlan = [];
      storeTwork.totalRowHistoryPlan = 0;
      storeTwork.pageSizeHistoryPlan =10;
      // getHistoryCall();
    }, []);
    useEffect(() => {
      if (valueLoad) {
        getHistoryPlan();
      }
    }, [storeTwork.pageIndexHistoryPlan, storeTwork.pageSizeHistoryPlan]);

    useEffect(() => {
      if (storeTwork.dataListCustormer.length > 0 && storeTwork.currentHisTab =="Plan") {
        setValueUpdate(storeTwork.dataListCustormer[0]);
        setValueForceCall(false);
        //show modal
        storeTwork.onShowModalBookingCall(true);
      }
    }, [storeTwork.dataListCustormer]);

    return (
      <Fragment>
        <Card>
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
                    label={t("twork_status_state")}
                    name="statusState"
                    labelCol={{ span: 16 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      defaultValue={statusState[0]}
                      options={statusState}
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
                  columns={listHistoryPlanTableColumn}
                  dataSource={storeTwork.dataHistoryPlan}
                  rowKey="BookApptCallId"
                  size="small"
                  scroll={{ x: 800, y: 1200 }}
                  loading={storeTwork.loadingData}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange: storeTwork.handlePerRowsChangeHistoryPlan,
                    pageSizeOptions: pageSizeTable,
                    total: storeTwork.totalRowHistoryPlan,
                    showTotal: showTotal,
                    onChange: storeTwork.handlePageChangeHistoryPlan,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: storeTwork.pageIndexHistoryPlan,
                    current: storeTwork.pageIndexHistoryPlan,
                    locale: { items_per_page: "/ trang" },
                  }}
                  expandable={{
                    expandedRowRender: (record) => (
                      <>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Ngày sinh:{" "}
                          {Moment.formatDateNew(record.Birthday, "DD/MM/yyyy")}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Sale Id: {record.AssignUser}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Phân loại: {record.CallAppTypeName}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Giới tính: {record.Gender}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Họ tên sale: {record.AssignUserName}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Ghi chú: {record.Description}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Người tạo: {record.CreatedBy}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Ngày tạo:{" "}
                          {Moment.formatDateNew(
                            record.CreatedDate,
                            "DD/MM/yyyy HH:mm:ss"
                          )}
                        </Col>
                        <Col md="8" lg="8" style={{ display: "inline-block" }}>
                          Họ và tên: {record.CreatedName}
                        </Col>
                      </>
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
              isOpen={storeTwork.isShowPopupBookingCall}
              toggle={() => (storeTwork.isShowPopupBookingCall = !storeTwork.isShowPopupBookingCall)}
              className="modal-fullscreen modal-dialog-centered"
              backdrop={"static"}
              fullscreen
            >
              <ModalHeader
                toggle={() =>
                  (storeTwork.isInCall==false ? storeTwork.isShowPopupBookingCall = !storeTwork.isShowPopupBookingCall : showToast())
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
                />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
        </Card>
      </Fragment>
    );
  });

export default HistoryPlan;
