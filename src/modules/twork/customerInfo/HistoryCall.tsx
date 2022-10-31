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
  UncontrolledTooltip,
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
  BookOpen,
  Book,
  Edit3,
  Eye,
} from "react-feather";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
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
import { appStore } from "../../../stores/appStore";

const HistoryCall = (valueBind: any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueDate, setvalueDate] = useState(new Date());
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const custType = [
      { value: -1, label: "Tất cả" },
      { value: 1, label: "Khách hàng tiềm năng" },
      { value: 2, label: "KH đăng ký MTK" },
    ];
    const callType = [
      { value: -11, label: "Tất cả", color: "#1890ff", isFixed: false },
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
    const workType = [
      { value: -1, label: "Tất cả" },
      { value: 1, label: "Hẹn lịch" },
      { value: 2, label: "Giao việc" },
    ];
    const status = [
      { value: -1, label: "Tất cả" },
      { value: 1, label: "Chờ xử lý" },
      { value: 2, label: "Đang xử lý" },
      { value: 2, label: "Đã xử lý" },
      { value: 2, label: "Đang hủy" },
    ];

    const listHistoryCallTableColumn: ColumnsType<any> = [
      {
        title: "Bắt đầu",
        render: function (value: any) {
          return Moment.formatDateNew(value.CreatedDate, "DD/MM/yyyy HH:mm:ss");
        },
        fixed: "left",
        width: 150,
      },
      {
        title: "Thời gian",
        dataIndex: "TimeCall",
        key: "TimeCall",
        width: 150,
      },
      {
        title: "Số điện thoại",
        render: function (value: any) {
            return (
              <Fragment>
                {encodePhoneNumber(value.Mobile)} &nbsp;
              </Fragment>
            );
        },
        width: 150,
      },
      {
        title: "Phân loại",
        render: function (value: any) {
          const id = "tooltipCallAppType" + value.CallAppHistId;
          return (
            <>
              <Tooltip placement="top" title={value.CallAppTypeName}>
                <Button.Ripple
                  className="btn-icon"
                  color="flat-success"
                  id={id}
                  size="sm"
                >
                  <BookOpen size={18} />
                </Button.Ripple>
              </Tooltip>
            </>
          );
        },
        width: 150,
      },
      {
        title: "Ghi chú",
        dataIndex: "Note",
        key: "Note",
        width: 150,
      },
      {
        title: "Họ và tên NV",
        dataIndex: "SaleName",
        key: "SaleName",
        width: 150,
      },
      {
        title: "Xếp hạng",
        render: function (value: any) {
          const id = "tooltipCallAppType" + value.CallAppHistId;
          return (
            <>
              {value.Rate}/5
              &nbsp;
              <Tooltip placement="top" title={value.Comment}>
                <Button.Ripple
                  className="btn-icon"
                  color="flat-success"
                  id={id}
                  size="sm"
                >
                  <BookOpen size={18} />
                </Button.Ripple>
              </Tooltip>
            </>
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
        title: "Người cập nhật",
        dataIndex: "UpdatedName",
        key: "UpdatedName",
        width: 150,
      },
      {
        title: "Ngày cập nhật",
        render: function (value: any) {
          return Moment.formatDateNew(value.UpdatedDate, "DD/MM/yyyy HH:mm:ss");
        },
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
                      onClick={() => viewDetail(value)}
                    >
                      {t("X_Trade_Button_Update")}
                    </Menu.Item>
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
    const viewDetail = (value: any) => {
      storeTwork.dataCallInfo=[value];
      storeTwork.scrollToTop =true;
    };
    const getHistoryCall = () => {
      const param = {
        UserName: appStore.account?.LoginName,
        UserRole: "CRM_SALE",
        CustCode: valueBind.valueBind.valueBind.CustCode,
        SaleId: "",
        CustType: -1,
        FromDate: "",
        ToDate: "",
        LeadId : 0,
        PageIndex: storeTwork.pageIndexHistoryCallDetail,
        PageSize: storeTwork.pageSizeHistoryCallDetail,
      };
      storeTwork.getHistoryCallDetail(param);
    };
    const encodePhoneNumber = (phoneNumber:string)=>{
      return phoneNumber.substring(0,5)+"*****"
    }

    useEffect(() => {
      storeTwork.dataCallInfo=[]
      storeTwork.dataHistoryCallDetail = [];
      storeTwork.pageIndexHistoryCallDetail =1;
      storeTwork.pageSizeHistoryCallDetail = 10;
      storeTwork.totalRowHistoryCallDetail = 0;
      // getHistoryCall();
    }, []);

    useEffect(()=>{
      getHistoryCall()
    },[storeTwork.pageIndexHistoryCallDetail,storeTwork.pageSizeHistoryCallDetail])
    return (
      <Fragment>
        <Card>
          <CardBody>
            <PerfectScrollbar>
              <Row>
                <Col sm="24" md="24">
                  <Table
                    columns={listHistoryCallTableColumn}
                    dataSource={storeTwork.dataHistoryCallDetail}
                    size="small"
                    scroll={{ x: 800, y: 1000 }}
                    loading={storeTwork.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange:
                        storeTwork.handlePerRowsChangeHistoryCallDetail,
                      pageSizeOptions: pageSizeTable,
                      total: storeTwork.totalRowHistoryCallDetail,
                      showTotal: showTotal,
                      onChange: storeTwork.handlePageChangeHistoryCallDetail,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent: 1,
                      locale: { items_per_page: "/ trang" },
                    }}
                  />
                </Col>
              </Row>
            </PerfectScrollbar>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default HistoryCall;
