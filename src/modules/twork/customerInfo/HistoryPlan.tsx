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
  Book,
  BookOpen,
  Edit3,
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

const HistoryPlan = (valueBind: any) =>
  useObserver(() => {
    const { t } = useTranslation();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const MySwal = withReactContent(Swal);
    const listHistoryPlanTableColumn: ColumnsType<any> = [
      {
        title: "Bắt đầu",
        render: function (value: any) {
          return Moment.formatDateNew(value.StartTime, "DD/MM/yyyy HH:mm:ss");
        },
        width: 150,
      },
      {
        title: "Kết thúc",
        render: function (value: any) {
          return Moment.formatDateNew(value.EndTime, "DD/MM/yyyy HH:mm:ss");
        },
        width: 150,
      },
      {
        title: "Phân loại",
        render: function (value: any) {
          const id = "tooltipPlanAppType" + value.BookApptCallId;
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
        render: function (value: any) {
          const id = "tooltipPlanDescript" + value.BookApptCallId;
          return (
            <>
              <Tooltip placement="top" title={value.Description}>
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
        title: "Người gọi",
        dataIndex: "AssignUser",
        key: "AssignUser",
        width: 150,
      },
      {
        title: "Họ và tên NV",
        dataIndex: "AssignUserName",
        key: "AssignUserName",
        width: 150,
      },
      {
        title: "Phương thức",
        dataIndex: "BookCallTypeName",
        key: "BookCallTypeName",
        width: 150,
      },
      {
        title: "Người tạo",
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
                    {(value.Status==0 && value.StatusState=="Chưa đến hạn")||value.Status===1 || value.StatusState==="Quá hạn"?(
                    <Menu.Item
                      key="two"
                      icon={<File size={14} />}
                      onClick={() => viewDetail(value)}
                    >
                      {t("X_Trade_Button_Update")}
                    </Menu.Item>):(<></>)}
                    {(value.Status==0 && value.StatusState=="Chưa đến hạn")?(
                    <Menu.Item
                      key="three"
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
    const viewDetail = (value: any) => {
      storeTwork.scrollToTop = false;
      storeTwork.dataPlanInfo = [value];
      storeTwork.scrollToTop = true;
    };
    const getHistoryPlan = () => {
      const param = {
        UserName: appStore.account?.LoginName,
        UserRole: "CRM_SALE",
        CustCode: valueBind.valueBind.valueBind.CustCode,
        SaleId: "",
        CustType: -1,
        FromDate: "",
        ToDate: "",
        StateStatus:0,
        PageIndex: storeTwork.pageIndexHistoryPlanDetail,
        PageSize: storeTwork.pageSizeHistoryPlanDetail,
      };
      storeTwork.getHistoryPlanDetail(param);
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
      }).then((result) => {
        if (result.isConfirmed) {
          const param = {
            UserName: appStore.account?.LoginName,
            UserRole: "CRM_SALE",
            BookApptCallId: value.BookApptCallId,
          };
          storeTwork.DeletePlan(param);
        }
      });
    };

    useEffect(() => {
      // storeTwork.dataPlanInfo = [];
      storeTwork.dataHistoryPlanDetail = [];
      storeTwork.pageIndexHistoryPlanDetail =1;
      storeTwork.pageSizeHistoryPlanDetail = 10;
      storeTwork.totalRowHistoryPlanDetail = 0;
      // getHistoryPlan();
    }, []);

    useEffect(() => {
      getHistoryPlan();
    }, [
      storeTwork.pageIndexHistoryPlanDetail,
      storeTwork.pageSizeHistoryPlanDetail,
    ]);

    // useEffect(()=>{
    //   if(storeTwork.isCallApiSuccess==true){
    //     getHistoryPlan(); 
    //   }
    // },[storeTwork.isCallApiSuccess])

    return (
      <Fragment>
        <Card>
          <CardBody>
            <PerfectScrollbar>
              <Row>
                <Col sm="24" md="24">
                  <Table
                    columns={listHistoryPlanTableColumn}
                    dataSource={storeTwork.dataHistoryPlanDetail}
                    size="small"
                    scroll={{ x: 800, y: 1000 }}
                    loading={storeTwork.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange:
                        storeTwork.handlePerRowsChangeHistoryPlanDetail,
                      pageSizeOptions: pageSizeTable,
                      total: storeTwork.totalRowHistoryPlanDetail,
                      showTotal: showTotal,
                      onChange: storeTwork.handlePageChangeHistoryPlanDetail,
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

export default HistoryPlan;
