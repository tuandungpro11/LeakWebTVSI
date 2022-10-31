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
import Select from "react-select";
import { useTranslation } from "react-i18next";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@customStyle/xtrade.scss";
import { useContextMenu } from "react-contexify";

// import bankAccountColumn from "../../types"
import {
  Delete,
  Edit,
  List,
} from "react-feather";
import { customSMSelectStyles, listAPI, pageSizeTable } from "../../types";
import { store } from "../../store/InvestorStore";
import { useObserver } from "mobx-react";
import { Moment } from "../../../../utility/general/Moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import FormAddNewUpdate from "./FormAddNew_Update";
import PerfectScrollbar from "react-perfect-scrollbar";
import FormUpdate from "./FormUpdate";
import {
  PaginationProps,
  Menu,
  Form,
  DatePicker,
  Input,
} from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { selectThemeColors } from "../../../../utility/Utils";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { appStore } from "../../../../stores/appStore";
import FormChangeStatus from "./FormChangeStatus";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";

const BankAccount = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const [valueLoad, setValueLoad] = useState(false);

    const bankAccountColumn: ColumnsType<any> = [
      {
        title: "STT",
        key: "STT",
        //   dataindex: "id",
        render: (v, s, index) =>
          index + 1 + (store.pageIndex - 1) * store.pageSize,
        width: 50,
        align: "center",
      },
      {
        title: "Mã KH",
        dataIndex: "CUSTOMERID",
        key: "CUSTOMERID",
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
        title: "Số TK ngân hàng",
        dataIndex: "BANKACCOUNT",
        key: "BANKACCOUNT",
        align: "left",
        width: 130,
      },
      {
        title: "Tên ngân hàng",
        dataIndex: "BankName",
        key: "BankName",
        align: "left",
        width: 200,
      },
      {
        title: "Chi nhánh",
        dataIndex: "BranchName",
        key: "BranchName",
        align: "left",
        width: 200,
      },
      {
        title: "BIDV",
        align: "center",
        render: function (value: any) {
          return (
            <CustomInput
              inline
              id="chkTime"
              type="checkbox"
              defaultChecked={value.bankType === 0 ? false : true}
              disabled
            />
          );
        },
        width: 80,
      },
      {
        title: "Người thụ hưởng",
        dataIndex: "BENEFICIARY",
        key: "BENEFICIARY",
        align: "left",
        width: 200,
      },
      {
        title: "Ngày hiệu chỉnh",
        render: function (value: any) {
          return Moment.formatDateNew(value.MODIFIEDDATE, "DD/MM/yyyy");
        },
        align: "center",
        width: 110,
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
        dataIndex: "STATUS_TEXT",
        key: "STATUS_TEXT",
        align: "left",
        width: 120,
      },
      {
        title: "Ghi chú",
        dataIndex: "REMARK",
        key: "REMARK",
        align: "left",
        width: 150,
      },
      {
        title: "Lý do từ chối",
        dataIndex: "Reason",
        key: "Reason",
        align: "left",
        width: 120,
      },
      {
        title: "Action",
        fixed: "right",
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
                    {value.STATUS == -1 || value.STATUS == 4
                    ||value.STATUS == 5 || value.STATUS == 0 ?(
                      <Menu.Item
                      key="two"
                      icon={<Edit size={14} />}
                      onClick={() => popupUpdate(value)}
                    >
                      {t("X_Trade_Button_Update")}
                    </Menu.Item>
                    ):(<></>)}
                    {value.STATUS == -1 || value.STATUS == 3
                    || value.STATUS == 1 || value.STATUS == 2
                    || value.STATUS == 0 ?(
                      <Menu.Item
                      key="three"
                      icon={<List size={14} />}
                      onClick={() => changeStatus(value)}
                    >
                      {t("X_Trade_Processing")}
                    </Menu.Item>
                    ):(<></>)}
                  </Menu.SubMenu>
                </Menu>
              </Fragment>
            </>
          );
        },
        width: 80,
        align: "center",
      },
    ];
    const { show } = useContextMenu({
      id: "menu_left",
    });
    const [valueDate, setValueDate] = useState();
    const { t } = useTranslation();
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal);
    const [valueUpdate, setValueUpdate] = useState([]);
    const popupUpdate = (valueInternalAccount: any) => {
      setValueUpdate(valueInternalAccount);
      store.onShowModalUpdate(true);
    };
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const popupConfirmDel = (value: any) => {
      MySwal.fire({
        html: "Bạn có muốn xóa tài khoản " + value.CUSTOMERNAME + "?",
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
            CustomerId: value.CUSTOMERID,
            Status: 3,
            Reason: "",
            UpdatedBy: appStore.account.LoginName,
          };
          store.deleteBankAccount(value.CUSTOMERID, value.CUSTOMERNAME);
        }
      });
    };
    const changeStatus = (value: any) => {
      setValueUpdate(value);
      store.onShowModalDetail(true);
    };
    const getListStatus = () => {
      var param = {
        Category: "INTERNAL_ACCOUNT",
        Group: "STATUS",
        Code: "",
      };
      store.getListStatusBankAccount(param);
    };

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      if(valueForm.CustomerId && valueForm.CustomerId.trim() != "" && valueForm.CustomerId.trim().length <7){
        toast.error(ErrorToast("Hãy điền số tài khoản 6 số"));
        return;
      }
      const param = {
        UserId: appStore.account.LoginName,
        CustomerId: valueForm.CustomerID.trim(),
        BankAccountID: -1,
        BankAccount: valueForm.BankAccount.trim(),
        IsLike: 1,
        Status: valueForm.Status == undefined ? -2 : valueForm.Status.Value,
        FromDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[0] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[0], "yyyyMMDD")
            : "",
        ToDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[1] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[1], "yyyyMMDD")
            : "",
        PageIndex: store.pageIndex,
        PageSize: store.pageSize,
      };
      store.getListBankAccount(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (store.pageIndex == 1) {
        onSubmit();
      } else {
        store.pageIndex = 1;
      }
    };
    const PopupAddNew = (accTitle: any, accBank: any) => {
      store.onShowModalAddNew(true);
    };

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndex!= 1) {
        store.pageIndex = 1;
      } else {
        onSubmit();
      }
    };
    const defaultValue = {
      CustomerID: "",
      BankAccountID: -1,
      BankAccount: "",
      IsLike: 1,
      Status: store.dataListInternalAccountStatus[0],
      txtDate: [],
    };

    useEffect(() => {
      store.dataListBankAcc=[];
      store.totalRows=0;
      getListStatus();
    }, []);
    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [store.pageIndex, store.pageSize]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_BankAccount")}</h4>
            <Button
              htmlType="button"
              className="btn btn-gradient-info"
              color="gradient-info"
              onClick={() => PopupAddNew("", "")}
            >
              {t("X_Trade_Button_Add_New")}
            </Button>
          </CardHeader>
          <CardBody>
            {/* <Row id="titlePage" className="RowTitle">
              <Col lg="24" md="24">
                {t("X_Trade_Investors")}
              </Col>
            </Row> */}
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={onClickButtonSearch}
              requiredMark={false}
            >
              <Row id="filterSection" className="filterSection">
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Customer_Id")} name="CustomerID">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Customer_Id")}
                      autoComplete="Off"
                      onChange={(object) => {
                        if (object.target.value.length > 6) {
                          form.setFieldsValue({CustomerID: object.target.value.slice(0, 6)})
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item
                    label={t("X_Trade_Bank_Account_Acc")}
                    name="BankAccount"
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Bank_Account_Acc")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Status")} name="Status">
                    {store.dataListInternalAccountStatus.length > 0 ? (
                      <Select
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        defaultValue={store.dataListInternalAccountStatus[0]}
                        options={store.dataListInternalAccountStatus}
                        isClearable={false}
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
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col sm="24" md="24">
                  <Table
                    columns={bankAccountColumn}
                    dataSource={store.dataListBankAcc}
                    size="small"
                    scroll={{ x: 800, y: 850 }}
                    loading={store.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange: store.handlePerRowsChange,
                      pageSizeOptions: pageSizeTable,
                      total: store.totalRows,
                      showTotal: showTotal,
                      onChange: store.handlePageChange,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent: store.pageIndex,
                      locale: { items_per_page: "/ trang" },
                      current: store.pageIndex,
                    }}
                    style={{ maxHeight: 500 }}
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
                  <h4>{t("X_Trade_Title_Form_Add_New_Bank_Acc")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormAddNewUpdate />
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
                  <h4>{t("X_Trade_Title_Form_Update_Bank_Acc")}</h4>
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

export default BankAccount;
