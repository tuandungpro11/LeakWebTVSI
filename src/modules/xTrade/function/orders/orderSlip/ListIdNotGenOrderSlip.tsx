import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Delete, Edit, List, Loader } from "react-feather";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Moment } from "../../../../../utility/general/Moment";
import { store } from "../../../store/InvestorStore";
import { customSMSelectStyles, listAPI, pageSizeTable } from "../../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import Select from "react-select";
import { selectThemeColors } from "../../../../../utility/Utils";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";
import { DatePicker, Form, PaginationProps, Menu, Input } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useContextMenu } from "react-contexify";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { appStore } from "../../../../../stores/appStore";

const ListOrderSlip = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const { t } = useTranslation();
    const { register, getValues, errors, handleSubmit, control } = useForm();
    const [valueDate, setvalueDate] = useState(new Date());
    const [valueLoad, setValueLoad] = useState(false);
    const listOrderSlipColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index + 1 + (store.pageIndexListBank - 1) * store.pageSizeListBank,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "TraderID",
        dataIndex: "TraderID",
        key: "TraderID",
        fixed: "left",
        width: 100,
        align: "left",
      },
      {
        title: "Tên môi giới",
        dataIndex: "TraderName",
        key: "TraderName",
        fixed: "left",
        width: 200,
        align: "left",
      },
      {
        title: "Chi nhánh",
        dataIndex: "BranchName",
        key: "BranchName",
        width: 150,
        align: "left",
      },
      {
        title: "Loại",
        dataIndex: "TRADER_TEXT",
        key: "TRADER_TEXT",
        width: 80,
        align: "left",
      },
      {
        title: "Ngày hiệu lực",
        render: function (value: any) {
          return Moment.formatDateNew(value.EffDate, "DD/MM/yyyy");
        },
        width: 110,
        align: "center",
      },
      {
        title: "Ngày hết hạn",
        render: function (value: any) {
          return Moment.formatDateNew(value.ExpDate, "DD/MM/yyyy");
        },
        width: 110,
        align: "center",
      },
      {
        title: "Ngày tạo",
        render: function (value: any) {
          return Moment.formatDateNew(value.CreateDate, "DD/MM/yyyy");
        },
        width: 110,
        align: "center",
      },
      {
        title: "Người tạo",
        dataIndex: "Createby",
        key: "Createby",
        width: 100,
        align: "left",
      },
      {
        title: "Ngày chỉnh",
        render: function (value: any) {
          return Moment.formatDateNew(value.ModifyDate, "DD/MM/yyyy");
        },
        width: 110,
        align: "center",
      },
      {
        title: "Người chỉnh",
        dataIndex: "ModifyBy",
        key: "ModifyBy",
        width: 100,
        align: "left",
      },
      {
        title: "Kích hoạt",
        dataIndex: "STATUS_TEXT",
        key: "STATUS_TEXT",
        width: 120,
        align: "left",
      },
      {
        title: "Ghi chú",
        dataIndex: "Remark",
        key: "Remark",
        width: 130,
        align: "left",
      },
      {
        title: "Action",
        render: function (value: any) {
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
                      icon={<Edit size={14} />}
                      onClick={() => popupUpdate(value)}
                    >
                      {t("X_Trade_Button_Update")}
                    </Menu.Item>
                    <Menu.Item
                      key="three"
                      icon={<Delete size={14} />}
                      onClick={() => popupConfirmDel(value)}
                    >
                      {t("X_Trade_Button_Delete")}
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </Fragment>
            </>
          );
        },
        fixed: "right",
        align: "center",
        width: 70,
      },
    ];
    const { show } = useContextMenu({
      id: "menu_left",
    });
    const [loading, setLoading] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        ExTraderID: -1,
        TraderID:
          valueForm.TraderID == undefined ? "" : valueForm.TraderID.trim(),
        Branch:
          valueForm.cbxBranch == undefined || valueForm.cbxBranch.BRANCHID == -1
            ? ""
            : valueForm.cbxBranch.BRANCHID,
        TraderType:
          valueForm.cbxType == undefined ? -1 : valueForm.cbxType.Value,
        Status:
          valueForm.cbxActive == undefined ? -1 : valueForm.cbxActive.Value,
        ToDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[1] == undefined
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[1], "yyyyMMDD")
            : "",
        FromDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[0] == undefined
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[0], "yyyyMMDD")
            : "",
        PageIndex: store.pageIndexOrderSlip,
        PageSize: store.pageSizeOrderSlip,
      };

      store.getListNotGenOrderSlip(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (store.pageIndexOrderSlip == 1) {
        onSubmit();
      } else {
        store.pageIndexOrderSlip = 1;
      }
    };

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndexOrderSlip != 1) {
        store.pageIndexOrderSlip = 1;
      } else {
        onSubmit();
      }
    };
    const defaultValue = {
      ExTraderID: -1,
      TraderID: "",
      Branch: store.dataListBranchOrderSlip[0],
      TraderType: store.dataListTypeOrderSlip[0],
      Status: -1,
      txtDate: [
        moment(
          new Date(new Date().setMonth(new Date().getMonth() - 1)),
          "DD-MM-yyyy"
        ),
        moment(new Date()),
      ],
    };

    const popupConfirmDel = (value: any) => {
      MySwal.fire({
        html: "Bạn có muốn xóa " + value.TraderName + "?",
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
          store.DeleteOrderSlip(value.ExTraderID);
        }
      });
    };

    const PopupAddNew = () => {
      store.onShowModalAddNew(true);
    };

    const popupUpdate = (valueBank: any) => {
      setValueUpdate(valueBank);
      console.log("valueUpdate: ", valueBank);
      store.onShowModalUpdate(true);
    };
    const getListBranch = () => {
      const param = {
        BranchId: "",
        // UserId: appStore.account.LoginName,
        Active: 1,
        // IsLike: 1,
        PageNumber: 1,
        PageSize: 9999,
      };
      store.getListBranch(param);
    };
    const getListType = () => {
      var param = {
        Category: "EXTRADER",
        Group: "TRADER_TYPE",
        Code: "",
      };
      store.getListTypeOrderSlip(param);
    };
    const getListActive = () => {
      var param = {
        Category: "EXTRADER",
        Group: "STATUS",
        Code: "",
      };
      store.getListActiveOrderSlip(param);
    };
    const exportExtrader = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        ExTraderId: -1,
        TraderId: valueForm.TraderID == undefined ? "" : valueForm.TraderID.trim(),
        Branch: valueForm.cbxBranch == undefined || valueForm.cbxBranch.BRANCHID == -1
        ? ""
        : valueForm.cbxBranch.BRANCHID,
        TraderType: valueForm.cbxType == undefined ? -1 : valueForm.cbxType.Value,
        Status: valueForm.cbxActive == undefined ? -1 : valueForm.cbxActive.Value,
        FromDate: valueForm.txtDate != null
        ? valueForm.txtDate[0] == undefined
          ? ""
          : Moment.formatDateNew(valueForm.txtDate[0], "yyyyMMDD")
        : "",
        ToDate: valueForm.txtDate != null
        ? valueForm.txtDate[1] == undefined
          ? ""
          : Moment.formatDateNew(valueForm.txtDate[1], "yyyyMMDD")
        : "",
      };
      store.ExportListUI(
        listAPI.ExportListNotGenOrderSlip,
        param,
        "DANH_SACH_TRADER_KHONG_PHAT_SINH_PHIEU_LENH"
      );
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    useEffect(() => {
      store.dataListOrderSlip = [];
      store.totalRowsOrderSlip = 0;
      getListBranch();
      getListType();
      getListActive();
    }, []);
    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [store.pageIndexOrderSlip, store.pageSizeOrderSlip]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_ListTraderNotOrder")}</h4>
            <Button
              htmlType="button"
              className="btn btn-gradient-info"
              color="gradient-info"
              onClick={() => PopupAddNew()}
            >
              {t("X_Trade_Button_Add_New")}
            </Button>
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
                  <Form.Item label={t("X_Trade_Trader_Id")} name="TraderID">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Trader_Id")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Branch_Name")} name="cbxBranch">
                    {store.dataListBranchOrderSlip.length > 0 ? (
                      <Select
                        options={store.dataListBranchOrderSlip}
                        defaultValue={store.dataListBranchOrderSlip[0]}
                        isClearable={false}
                        control={control}
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        styles={customSMSelectStyles}
                        getOptionLabel={(option) => option.BRANCHNAME}
                        getOptionValue={(option) => option.BRANCHID}
                      />
                    ) : (
                      <></>
                    )}
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Active")} name="cbxActive">
                    {store.dataListActiveOrderSlip.length > 0 ? (
                      <Select
                        options={store.dataListActiveOrderSlip}
                        defaultValue={store.dataListActiveOrderSlip[0]}
                        isClearable={false}
                        control={control}
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
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Type")} name="cbxType">
                    {store.dataListTypeOrderSlip.length > 0 ? (
                      <Select
                        options={store.dataListTypeOrderSlip}
                        defaultValue={store.dataListTypeOrderSlip[0]}
                        isClearable={false}
                        control={control}
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
                <Col lg="24" md="24" className="text-center">
                  <Form.Item>
                    <Button
                      className="btn btn-gradient-info"
                      color="gradient-info"
                      htmlType="submit"
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
                    &nbsp;&nbsp;
                    <Button
                      htmlType="button"
                      className="btn btn-gradient-success"
                      color="gradient-success"
                      onClick={exportExtrader}
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
            </Form>
            <Row>
              <Col sm="24" md="24">
                <Table
                  columns={listOrderSlipColumn}
                  dataSource={store.dataListOrderSlip}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={store.loadingData}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange: store.handlePerRowsChangeOrderSlip,
                    pageSizeOptions: pageSizeTable,
                    total: store.totalRowsOrderSlip,
                    showTotal: showTotal,
                    onChange: store.handlePageChangeOrderSlip,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: store.pageIndexOrderSlip,
                    locale: { items_per_page: "/ trang" },
                    current: store.pageIndexOrderSlip,
                  }}
                />
              </Col>
            </Row>
          </CardBody>
          <PerfectScrollbar>
            <Modal
              isOpen={store.isShowPopup}
              toggle={() => (store.isShowPopup = !store.isShowPopup)}
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() => (store.isShowPopup = !store.isShowPopup)}
              >
                <Label for="basicInput">
                  <h4>{t("X_Trade_Order_Slip_Add_New_Form")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormAddNew />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          <PerfectScrollbar>
            <Modal
              isOpen={store.isShowPopupModalUpdate}
              toggle={() =>
                (store.isShowPopupModalUpdate = !store.isShowPopupModalUpdate)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (store.isShowPopupModalUpdate = !store.isShowPopupModalUpdate)
                }
              >
                <Label for="basicInput">
                  <h4>{t("X_Trade_Order_Slip_Update_Form")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormUpdate valueUpdate={valueUpdate} />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
        </Card>
      </Fragment>
    );
  });

export default ListOrderSlip;
