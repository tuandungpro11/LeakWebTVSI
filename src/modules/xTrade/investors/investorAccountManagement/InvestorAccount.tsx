import React, { Fragment, useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useTranslation } from "react-i18next";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@customStyle/xtrade.scss";
import { Delete, Edit, List, RefreshCcw, UserCheck, UserX } from "react-feather";
import { store } from "../../store/InvestorStore";
import { useObserver } from "mobx-react";
import { Moment } from "../../../../utility/general/Moment";
import withReactContent from "sweetalert2-react-content";
import {
  CustomerAccountInfo,
  customSMSelectStyles,
  investorAccountType,
  investorStatusOption,
  pageSizeTable,
} from "../../types";
import Swal from "sweetalert2";
import InvestorAccountEdit from "./InvestorAccountEdit";
import { Checkbox, DatePicker, Form, Input, PaginationProps, Radio, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { selectThemeColors } from "../../../../utility/Utils";
import { Dropdown, Menu, Pagination } from "antd";
import styled from "@emotion/styled";
import "moment/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { appStore } from "../../../../stores/appStore";
import PerfectScrollbar from "react-perfect-scrollbar";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

const InvestorAccount = () =>
  useObserver(() => {
    useEffect(() => {
      if (store.accounts?.length <= 0) {
        store.GetAccounts();
      }
    }, [store.accounts]);
    // ANTD FORM
    const [form] = Form.useForm();
    const [resetCusForm] = Form.useForm();

    const [valueLoad, setValueLoad] = useState(false);
    const { RangePicker } = DatePicker;
    //END ANTD FORM
    const customerAccountColumn: ColumnsType<any> = [
      {
        title: "STT",
        key: "STT",
        render: (v, s, index) =>
          index +
          1 +
          (store.pageIndexCustomerAccount - 1) * store.pageSizeCustomerAccount,
        width: 50,
        align: "center",
      },
      {
        title: "Mã KH",
        key: "CUSTOMERID",
        dataIndex: "CUSTOMERID",
        align: "left",
        width: 80,
      },
      {
        title: "Mã số KH",
        key: "CUSTOMERNO",
        dataIndex: "CUSTOMERNO",
        align: "left",
        width: 110,
      },
      {
        title: "Tên tài khoản",
        key: "CUSTOMERNAME",
        dataIndex: "CUSTOMERNAME",
        align: "left",
        width: 200,
      },
      {
        title: "Số CMT/Hộ Chiếu",
        key: "IDENTITYCARD",
        dataIndex: "IDENTITYCARD",
        width: 120,
        align: "left",
      },
      {
        title: "Email",
        key: "EMAIL",
        dataIndex: "CONTACTEMAIL",
        align: "left",
        width: 150,
      },
      {
        title: "ĐT liên lạc/SMS",
        key: "PHONE",
        dataIndex: "CONTACTPHONE",
        align: "left",
        width: 110,
      },
      {
        title: "ĐT CC",
        key: "CELLPHONE",
        dataIndex: "CC_PHONE",
        align: "left",
        width: 110,
      },
      {
        title: "Chi nhánh",
        key: "BRANCHNAME",
        dataIndex: "BRANCHNAME",
        align: "left",
        width: 150,
      },
      {
        title: "Loại TK",
        key: "CUSTOMERTYPE_TEXT",
        dataIndex: "CUSTOMERTYPE_TEXT",
        width: 120,
        align: "center",
      },
      {
        title: "Nhóm TK",
        key: "CustomerGroup",
        dataIndex: "CustomerGroup",
        width: 100,
        align: "center",
      },
      {
        title: "Tình trạng",
        key: "STATUS_TEXT",
        dataIndex: "STATUS_TEXT",
        width: 100,
        align: "center",
      },
      {
        title: "NV kích hoạt",
        key: "UserName",
        dataIndex: "UserName",
        width: 100,
        align: "left",
      },
      {
        title: "Ngày kích hoạt",
        render: (v, s, index) => {
          return Moment.formatDateNew(v.ACTIVEDATE, "DD/MM/yyyy");
        },
        width: 120,
        align: "center",
      },
      {
        title: "Ghi chú",
        width: 120,
        key: "REMARK",
        dataIndex: "REMARK",
        align: "left",
      },
      {
        title: "Action",
        render: (v, record, index) => (
          <Fragment key={index}>
            {v.STATUS === 1 ? (
              <>
                <Tooltip placement="left" title={"Inactive tài khoản"}>
                  <Button.Ripple
                    className="btn-icon"
                    color="flat-danger"
                    id="positionLeftInactive"
                    onClick={() => changeAccountStatus(v, 0)}
                    size="sm"
                  >
                    <UserX size={18} />
                  </Button.Ripple>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip placement="left" title={"Active tài khoản"}>
                  <Button.Ripple
                    className="btn-icon"
                    color="flat-success"
                    id="positionLeftActive"
                    onClick={() => changeAccountStatus(v, 1)}
                    size="sm"
                  >
                    <UserCheck size={18} />
                  </Button.Ripple>
                </Tooltip>
              </>
            )}
            <Menu
              mode="horizontal"
              defaultSelectedKeys={["SubMenu"]}
              className="menu-corg"
            >
              <Menu.SubMenu key="SubMenu" icon={<List size={18} />}>
                <Menu.Item
                  key="two"
                  icon={<Edit size={14} />}
                  onClick={() => editAccount(v)}
                >
                  Sửa
                </Menu.Item>
                <Menu.Item
                  key="three"
                  icon={<UserCheck size={14} />}
                  onClick={() => reactive(v)}
                >
                  Kích hoạt lại
                </Menu.Item>
                <Menu.Item
                  key="one"
                  icon={<RefreshCcw size={14} />}
                  onClick={() => resetPassPin(v)}
                >
                  Reset pass/pin
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Fragment>
        ),
        width: 100,
        fixed: "right",
        align: "center",
      },
    ];
    const [valueDate, setValueDate] = useState(new Date());
    const { t } = useTranslation();
    const MySwal = withReactContent(Swal);
    const [accountEditInfo, setAccountEditInfo] = useState({});
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const changeAccountStatus = (data: any, status: number) => {
      const title = status === 1 ? "active" : "inactive";
      MySwal.fire({
        html: "Bạn có muốn " + title + " tài khoản " + data.CUSTOMERID + "?",
        customClass: {
          confirmButton: "btn btn-gradient-success mr-1",
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
            UserId: appStore.account.LoginName,
            CustomerID: data.CUSTOMERID,
            Status: status,
          };
          store.ChangeAccountStatus(param);
        }
      });
    };

    const getListCustomerAccount = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserId: appStore.account.LoginName,
        CustomerID:
          valueForm.CustomerID == undefined ? "" : valueForm.CustomerID.trim(),
        Status: valueForm.Status.Value
          ? parseInt(valueForm.Status.Value)
          : valueForm.Status,
        BranchId: valueForm.BranchId === "" ? "" : valueForm.BranchId.BRANCHID,
        CustomerType: valueForm.CustomerType.Value
          ? parseInt(valueForm.CustomerType.Value)
          : valueForm.CustomerType,
        CustomerGroupId: valueForm.CustomerGroupId ?? -1,
        IsLike: 1,
        BeginDate: valueForm.txtDate
          ? valueForm.txtDate[0] === null
            ? ""
            : Moment.formatDateNew(valueForm.txtDate[0], "yyyyMMDD")
          : "",
        EndDate: valueForm.txtDate
          ? valueForm.txtDate[1] === null
            ? ""
            : Moment.formatDateNew(valueForm.txtDate[1], "yyyyMMDD")
          : "",
        ByUser: valueForm.ByUser == undefined ? "" : valueForm.ByUser.trim(),
        IdentityCard: valueForm.IdentityCard.trim(),
        CustomerName: valueForm.CustomerName.trim(),
        Phone: valueForm.Phone.trim(),
        Email: valueForm.Email.trim(),
        PageIndex: store.pageIndexCustomerAccount,
        PageSize: store.pageSizeCustomerAccount,
      };
      store.getListCustomerAccount(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    const editAccount = (accountInfo: CustomerAccountInfo) => {
      setAccountEditInfo(accountInfo);
      store.showModalEditAccount(true);
    };

    const resetPassPin = (accountInfo: CustomerAccountInfo) => {
      setAccountEditInfo(accountInfo);
      setCheckedSMS(false);
      store.showModalResetAccount(true);
    };

    const confirmReset = (data: any) => {
      MySwal.fire({
        html: "Bạn xác nhận reset tài khoản " + data.CUSTOMERID + "?",
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
          const value = resetCusForm.getFieldsValue();
          const paramReset = {
            CustomerId: data.CUSTOMERID,
            SendSMS: checkedSMS ? 1 : 0,
            ChangeType: value.ChangeType,
          };
          store.resetCustomer(paramReset);
        }
      });
    };

    const reactive = (value: any) => {
      MySwal.fire({
        html: "Bạn xác nhận kích hoạt lại tài khoản " + value.CUSTOMERID + "?",
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
          const paramReset = {
            CustomerId: value.CUSTOMERID,
            Email: value.CONTACTEMAIL,
            FullName: value.CUSTOMERNAME,
          };
          store.reactiveCustomer(paramReset);
        }
      });
    };

    const onClickButtonSearch = () => {
      if (store.pageIndexCustomerAccount == 1) {
        getListCustomerAccount();
      } else {
        store.pageIndexCustomerAccount = 1;
      }
    };

    useEffect(() => {
      if (!store.isShowPopupEdit) {
        if (valueLoad) {
          getListCustomerAccount();
        }
      }
    }, [
      store.pageSizeCustomerAccount,
      store.pageIndexCustomerAccount,
    ]);

    useEffect(() => {
      const param = {
        BranchId: "",
        Active: -1,
        PageIndex: 1,
        PageSize: 1000,
      };
      store.getTVSIBrachList(param);

      const sysConfigParam = {
        Category: "CUSTOMER",
      };
      store.GetSysConfigList(sysConfigParam);
    }, []);

    const resetForm = () => {
      form.resetFields();
      form.setFieldsValue({
        Status: store.sysConfigList[0],
        CustomerType: store.listCustomerType[0],
      });
      if (store.pageIndexCustomerAccount == 1) {
        getListCustomerAccount();
      } else {
        store.pageIndexCustomerAccount = 1;
      }
    };

    const defaultValue = {
      CustomerID: "",
      Status: -1,
      BranchId: "",
      CustomerType: -1,
      IdentityCard: "",
      CustomerName: "",
      Phone: "",
      Email: "",
    };

    const defaultValueReset = {
      ChangeType: 2,
    };

    useEffect(() => {
      if (store.sysConfigList.length > 0) {
        form.setFieldsValue({ Status: store.sysConfigList[0] });
      }
    }, [store.sysConfigList]);

    useEffect(() => {
      if (store.listCustomerType.length > 0) {
        form.setFieldsValue({ CustomerType: store.listCustomerType[0] });
      }
    }, [store.listCustomerType]);

    useEffect(() => {
      store.listCustomerAccount = [];
      store.totalCustomerAccRows = 0;
    }, [])

    useEffect(() => {
      if (store.listTVSIBrachList.length > 0) {
        form.setFieldsValue({
          BranchId: store.listTVSIBrachList[0]
        })
      }
    }, [store.listTVSIBrachList])

    const [checkedSMS, setCheckedSMS] = useState(false);

    const cancelReset = () => {
      store.isShowPopupReset = false;
      store.isShowDetailPassPin = false;
    }

    const onChangeSMS = (e: CheckboxChangeEvent) => {
      setCheckedSMS(e.target.checked);
    };

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Investors")}</h4>
          </CardHeader>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onClickButtonSearch}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Row id="filterSection" className="filterSection">
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Customer_Id")} name="CustomerID">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Customer_Id")}
                      autoComplete="off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 6) {
                          form.setFieldsValue({ CustomerID: object.target.value.slice(0, 6) })
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("Phone")} name="Phone">
                    <Input
                      size="small"
                      placeholder={t("Phone")}
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("Account_Status")} name="Status">
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      options={store.sysConfigList}
                      defaultValue={store.sysConfigList[0]}
                      isClearable={false}
                      styles={customSMSelectStyles}
                      noOptionsMessage={() => "Không có dữ liệu...."}
                      getOptionLabel={(option) => option.Name}
                      getOptionValue={(option) => option.Value}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("Identity_Number")} name="IdentityCard">
                    <Input
                      size="small"
                      placeholder={t("Identity_Number")}
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("Email")} name="Email">
                    <Input
                      size="small"
                      placeholder={t("Email")}
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("Account_Type")} name="CustomerType">
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      options={store.listCustomerType}
                      defaultValue={store.listCustomerType[0]}
                      isClearable={false}
                      styles={customSMSelectStyles}
                      noOptionsMessage={() => "Không có dữ liệu...."}
                      getOptionLabel={(option) => option.Name}
                      getOptionValue={(option) => option.Value}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("FullName")} name="CustomerName">
                    <Input
                      size="small"
                      placeholder={t("FullName")}
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("Employee_Activated")} name="ByUser">
                    <Input
                      size="small"
                      placeholder={t("Employee_Activated")}
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Branch_Name")} name="BranchId">
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      options={store.listTVSIBrachList}
                      isClearable={false}
                      noOptionsMessage={() => "Không có dữ liệu...."}
                      getOptionLabel={(option) => option.BRANCHNAME}
                      getOptionValue={(option) => option.BRANCHID}
                      styles={customSMSelectStyles}
                      placeholder={"Chọn chi nhánh..."}
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
                      className="btn btn-gradient-info"
                      color="gradient-info"
                    >
                      {t("X_Trade_Button_Search")}
                    </Button>{" "}
                    <Button
                      htmlType="button"
                      className="btn btn-gradient-secondary"
                      color="gradient-secondary"
                      onClick={resetForm}
                    >
                      {t("X_Trade_Button_Reset")}
                    </Button>{" "}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col sm="24" md="24">
                <Table
                  columns={customerAccountColumn}
                  dataSource={store.listCustomerAccount}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={store.loadingData}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange:
                      store.handlePerRowsChangeCustomerAccount,
                    pageSizeOptions: pageSizeTable,
                    total: store.totalCustomerAccRows,
                    showTotal: showTotal,
                    onChange: store.handlePageChangeCustomerAccount,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: store.pageIndexCustomerAccount,
                    locale: { items_per_page: "/ trang" },
                  }}
                />
              </Col>
            </Row>
          </CardBody>
          <Modal
            isOpen={store.isShowPopupEdit}
            toggle={() => (store.isShowPopupEdit = !store.isShowPopupEdit)}
            className="modal-sxl modal-dialog-centered"
            backdrop={"static"}
          >
            <ModalHeader
              toggle={() => (store.isShowPopupEdit = !store.isShowPopupEdit)}
            >
              {t("Customer_Account_Edit")}
            </ModalHeader>
            <ModalBody>
              <InvestorAccountEdit accountInfo={accountEditInfo} />
            </ModalBody>
          </Modal>
          <Modal
            isOpen={store.isShowPopupReset}
            toggle={() => (store.isShowPopupReset = !store.isShowPopupReset)}
            className="modal-dialog-centered"
            backdrop={"static"}
          >
            <ModalHeader
              toggle={() => (store.isShowPopupReset = !store.isShowPopupReset)}
            >
              {t("Customer_Account_Reset")}
            </ModalHeader>
            <ModalBody>
              {
                store.isShowDetailPassPin ?
                  <>
                    <label style={{fontSize: '14px', width: '100%'}}>
                      <strong>Mã khách hàng:</strong> {store.DetailPassPin?.CustomerId}
                    </label>
                    <label style={{fontSize: '14px', width: '100%'}}>
                      <strong>Mật khẩu mới:</strong> {store.DetailPassPin?.Password}
                    </label>
                    <label style={{fontSize: '14px', width: '100%'}}>
                      <strong>Mã pin mới:</strong> {store.DetailPassPin?.Pin}
                    </label>
                    <div className="text-center mt-2">
                      <Button
                        htmlType="button"
                        className="btn btn-gradient-secondary"
                        color="gradient-secondary"
                        onClick={cancelReset}
                      >
                        {t("Đóng")}
                      </Button>
                    </div>
                  </> :
                  <Form
                    layout={"vertical"}
                    form={resetCusForm}
                    initialValues={defaultValueReset}
                  >
                    <Form.Item label="SMS" name="SendSMS">
                      <Checkbox checked={checkedSMS} onChange={onChangeSMS}>Gửi SMS</Checkbox>
                    </Form.Item>
                    <Form.Item label="Loại reset" name="ChangeType">
                      <Radio.Group>
                        <Radio value={0}> Reset mật khẩu </Radio>
                        <Radio value={1}> Reset pin </Radio>
                        <Radio value={2}> Reset cả 2 thông tin </Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item className="text-center mt-2">
                      <Button
                        htmlType="button"
                        className="btn btn-gradient-info"
                        color="gradient-info"
                        onClick={() => confirmReset(accountEditInfo)}
                      >
                        {t("Reset")}
                      </Button>{" "}
                      <Button
                        htmlType="button"
                        className="btn btn-gradient-secondary"
                        color="gradient-secondary"
                        onClick={cancelReset}
                      >
                        {t("Hủy")}
                      </Button>
                    </Form.Item>
                  </Form>
              }

            </ModalBody>
          </Modal>
        </Card>
      </Fragment>
    );
  });

export default InvestorAccount;
