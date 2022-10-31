import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
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
import { Moment } from "../../../../utility/general/Moment";
import { store } from "../../store/InvestorStore";
import { customSMSelectStyles, listAPI, pageSizeTable } from "../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";
import Table, { ColumnsType } from "antd/lib/table";
import { useContextMenu } from "react-contexify";
import { DatePicker, Form, Input, Menu, PaginationProps } from "antd";
import { Delete, Edit, List } from "react-feather";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { appStore } from "../../../../stores/appStore";
import FormChangeStatus from "./FormChangeStatus";

const ListInternalAccount = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const [valueDate, setvalueDate] = useState(new Date());
    const { t } = useTranslation();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueLoad, setValueLoad] = useState(false);
    const listInternalAccountColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (store.pageIndexInternalAccount - 1) * store.pageSizeInternalAccount,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã KH",
        dataIndex: "CustomerId",
        key: "CustomerId",
        fixed: "left",
        align: "left",
        width: 80,
      },
      {
        title: "Tên KH",
        dataIndex: "CUSTOMERNAME",
        key: "CUSTOMERNAME",
        align: "left",
        width: 200,
      },
      {
        title: "Số TK",
        dataIndex: "InternalAccountNo",
        key: "InternalAccountNo",
        align: "left",
        width: 80,
      },
      {
        title: "Tên TK nội bộ",
        dataIndex: "InternalCustomerName",
        key: "InternalCustomerName",
        align: "left",
        width: 200,
      },
      {
        title: "Ngày hiệu chỉnh",
        render: function (value: any) {
          return Moment.formatDateNew(value.ModifiedDate);
        },
        align: "center",
        width: 110
      },
      {
        title: "Người hiệu chỉnh",
        dataIndex: "MODIFIEDBY",
        key: "MODIFIEDBY",
        align: "left",
        width: 110,
      },
      {
        title: "Trạng thái",
        dataIndex: "INTERNALSTATUS_TEXT",
        key: "INTERNALSTATUS_TEXT",
        align: "left",
        width: 120,
      },
      {
        title: "Lý do từ chối",
        dataIndex: "Reason",
        key: "Reason",
        align: "left",
        width: 150,
      },
      {
        title: "Action",
        fixed: "right",
        render: (value, r, index) => {
          if (
            value.InternalStatus == -1 ||
            value.InternalStatus == 3 ||
            value.InternalStatus == 1 ||
            value.InternalStatus == 0 ||
            value.InternalStatus == 2
          ) {
            return (
              <>
                <Fragment>
                  <Menu
                    mode="horizontal"
                    defaultSelectedKeys={["SubMenu"]}
                    className="menu-corg"
                  >
                    <Menu.SubMenu key="SubMenu" icon={<List size={18} />}>
                      {value.InternalStatus == -1 ||
                      value.InternalStatus == 4 ||
                      value.InternalStatus == 0 ||
                      value.InternalStatus == 5 ? (
                        <Menu.Item
                          key="two"
                          icon={<Edit size={14} />}
                          onClick={() => popupUpdate(value)}
                        >
                          {t("X_Trade_Button_Update")}
                        </Menu.Item>
                      ) : (
                        <></>
                      )}

                      <Menu.Item
                        key="three"
                        icon={<List size={14} />}
                        onClick={() => changeStatus(value)}
                      >
                        {t("X_Trade_Processing")}
                      </Menu.Item>
                    </Menu.SubMenu>
                  </Menu>
                </Fragment>
              </>
            );
          } else {
            return (
              <>
                <Fragment>
                  <Menu
                    mode="horizontal"
                    defaultSelectedKeys={["SubMenu"]}
                    className="menu-corg"
                  >
                    <Menu.SubMenu key="SubMenu" icon={<List size={18} />}>
                      {value.InternalStatus == -1 ||
                      value.InternalStatus == 4 ||
                      value.InternalStatus == 0 ||
                      value.InternalStatus == 5 ? (
                        <Menu.Item
                          key="two"
                          icon={<Edit size={14} />}
                          onClick={() => popupUpdate(value)}
                        >
                          {t("X_Trade_Button_Update")}
                        </Menu.Item>
                      ) : (
                        <></>
                      )}
                      {/* <Menu.Item
                        key="three"
                        icon={<Delete size={14} />}
                        onClick={() => deleteIternalAccount(value)}
                      >
                        {t("X_Trade_Button_Delete")}
                      </Menu.Item> */}
                    </Menu.SubMenu>
                  </Menu>
                </Fragment>
              </>
            );
          }
        },
        width: 70,
        align: "center",
      },
    ];
    const { show } = useContextMenu({
      id: "menu_left",
    });
    const [loading, setLoading] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);

    const changeStatus = (value: any) => {
      setValueUpdate(value);
      store.onShowModalDetail(true);
    };
    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserId: appStore.account.LoginName,
        CustomerID:
          valueForm.CustormerId == undefined
            ? ""
            : valueForm.CustormerId.trim(),
        Status:
          valueForm.cbxStatus == undefined ? -2 : valueForm.cbxStatus.Value,
        BeginDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[0] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[0], "yyyyMMDD")
            : "",
        EndDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[1] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[1], "yyyyMMDD")
            : "",
        PageIndex: store.pageIndexInternalAccount,
        PageSize: store.pageSizeInternalAccount,
      };

      store.getListInternalAccount(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (store.pageIndexInternalAccount == 1) {
        onSubmit();
      } else {
        store.pageIndexInternalAccount = 1;
      }
    };
    const deleteIternalAccount = (value: any) => {
      MySwal.fire({
        html: "Bạn có muốn xóa tài khoản " + value.InternalCustomerName + "?",
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
            CustomerId: value.CustomerId,
            InternalAccountNo: value.InternalAccountNo,
            InterAccStatus: 4,
            Reason: "",
            UpdatedBy: appStore.account.LoginName,
          };
          store.deleteInternalAccount(paramDel, value.InternalCustomerName);
        }
      });
    };

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndexInternalAccount == 1) {
        onSubmit();
      } else {
        store.pageIndexInternalAccount = 1;
      }
    };
    const defaultValue = {
      CustomerID: "",
      Status: -2,
      // txtDate: [
      //   moment(
      //     new Date(new Date().setMonth(new Date().getMonth() - 1)),
      //     "DD-MM-yyyy"
      //   ),
      //   moment(new Date()),
      // ],
    };

    const PopupAddNew = () => {
      store.onShowModalAddNew(true);
    };

    const popupUpdate = (valueInternalAccount: any) => {
      setValueUpdate(valueInternalAccount);
      store.onShowModalUpdate(true);
    };

    const getListStatus = () => {
      var param = {
        Category: "INTERNAL_ACCOUNT",
        Group: "STATUS",
        Code: "",
      };
      store.getListStatusInternalAccount(param);
    };
    const exportListInternalAccount = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserId: appStore.account.LoginName,
        CustomerId:
          valueForm.CustormerId == undefined
            ? ""
            : valueForm.CustormerId.trim(),
        Status:
          valueForm.cbxStatus == undefined ? -2 : valueForm.cbxStatus.Value,
        BeginDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[0] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[0], "yyyyMMDD")
            : "",
        EndDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[1] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[1], "yyyyMMDD")
            : "",
        PageIndex: store.pageIndexInternalAccount,
        PageSize: store.pageSizeInternalAccount,
      };
      store.ExportListUI(listAPI.ExportListInternalAccount,param, "DANH_SACH_TAI_KHOAN_NOI_BO");
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    useEffect(() => {
      store.dataListInternalAccount = [];
      store.totalRowsInternalAccount = 0;
      getListStatus();
    }, []);
    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [store.pageIndexInternalAccount, store.pageSizeInternalAccount]);
    useEffect(() => {
      if (!store.isShowPopup) {
        store.AccountNameByID = "";
        store.InternalCustName = "";
      }
    }, [store.isShowPopup]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_TransferCash")}</h4>
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
                  <Form.Item label={t("X_Trade_Status")} name="cbxStatus">
                    {store.dataListInternalAccountStatus.length > 0 ? (
                      <Select
                        options={store.dataListInternalAccountStatus}
                        defaultValue={store.dataListInternalAccountStatus[0]}
                        isClearable={false}
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
                    &nbsp;&nbsp;
                    <Button
                      htmlType="button"
                      className="btn btn-gradient-success"
                      color="gradient-success"
                      onClick={exportListInternalAccount}
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
              <Row>
                <Col sm="24" md="24">
                  <Table
                    columns={listInternalAccountColumn}
                    dataSource={store.dataListInternalAccount}
                    size="small"
                    scroll={{ x: 800, y: 800 }}
                    loading={store.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange:
                        store.handlePerRowsChangeInternalAccount,
                      pageSizeOptions: pageSizeTable,
                      total: store.totalRowsInternalAccount,
                      showTotal: showTotal,
                      onChange: store.handlePageChangeInternalAccount,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent: store.pageIndexInternalAccount,
                      locale: { items_per_page: "/ trang" },
                      current: store.pageIndexInternalAccount,
                    }}
                  />
                </Col>
              </Row>
            </Form>
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
                  <h4>{t("X_Trade_Title_Internal_Account_Add")}</h4>
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
                  <h4>{t("X_Trade_Title_Internal_Account_Upd")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormUpdate valueUpdate={valueUpdate} />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          <Modal
            isOpen={store.isShowPopupModalDetail}
            toggle={() =>
              (store.isShowPopupModalDetail = !store.isShowPopupModalDetail)
            }
            className="modal-lg modal-dialog-centered"
            backdrop={"static"}
          >
            <ModalHeader
              toggle={() =>
                (store.isShowPopupModalDetail = !store.isShowPopupModalDetail)
              }
            >
              <Label for="basicInput">
                <h4>{t("X_Trade_Processing")}</h4>
              </Label>
            </ModalHeader>
            <ModalBody>
              <FormChangeStatus valueUpdate={valueUpdate} />
            </ModalBody>
          </Modal>
        </Card>
      </Fragment>
    );
  });

export default ListInternalAccount;
