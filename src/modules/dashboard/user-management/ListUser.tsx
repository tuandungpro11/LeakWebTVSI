import { Form, Input, Menu, PaginationProps, Tooltip } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect, useState } from "react";
import { Edit, List, Lock, Unlock, UserCheck, UserX } from "react-feather";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, CardHeader, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Moment } from "../../../utility/general/Moment";
import { store } from "../../xTrade/store/InvestorStore";
import { customSMSelectStyles, pageSizeTable } from "../../xTrade/types";
import { userStore } from "../store/UserStore";
import { userTypeSearch } from "../types";
import CreateUser from "./CreateUser";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { selectThemeColors } from "../../../utility/Utils";
import EditUser from "./EditUser";
import ChangePassword from "./ChangePassword";
import ResetUserPassword from "./ResetPassword";

const ListUser = () =>
  useObserver(() => {
    useEffect(() => {
      if (store.accounts?.length <= 0) {
        store.GetAccounts();
      }
    }, [store.accounts]);

    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [form] = Form.useForm();
    const [valueDate, setValueDate] = useState(new Date());
    const showTotal: PaginationProps['showTotal'] = total => `Tổng ${total} bản ghi`;
    const MySwal = withReactContent(Swal);
    const { t } = useTranslation();
    const changeAccountStatus = (data: any, status: number) => {
      const title = status === 1 ? "active" : "inactive";
      MySwal.fire({
        html: "Bạn có muốn " + title + " tài khoản " + data.UserDomain + "?",
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
            UserId: data.UserId,
            // CustomerID: data.CUSTOMERID,
            Status: status,
          }
          userStore.ChangeAccountStatus(param);
        }
      });
    }
    const lockAccount = (data: any, status: number) => {
      const title = status === 1 ? "unlock" : "lock";
      MySwal.fire({
        html: "Bạn có muốn " + title + " tài khoản " + data.UserDomain + "?",
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
          userStore.LockAccount(data.LoginName, status);
        }
      });
    }
    const customerAccountColumn: ColumnsType<any> = [
      {
        title: "STT",
        key: 'STT',
        render: (v, s, index) => (index + 1) + (pageIndex - 1) * pageSize,
        width: 50,
        align: 'center'
      },
      {
        title: t('Employee_Code'),
        key: "EmployeeCode",
        dataIndex: "EmployeeCode"
      },
      {
        title: t('User_Domain'),
        key: "UserDomain",
        dataIndex: "UserDomain"
      },
      {
        title: t('Login_Name'),
        key: "LoginName",
        dataIndex: "LoginName"
      },
      {
        title: t('Display_Name'),
        key: "DisplayName",
        dataIndex: "DisplayName"
      },
      {
        title: "Email",
        key: "Email",
        dataIndex: "Email"
      },
      {
        title: t('Auth_Type'),
        key: "AuthType",
        dataIndex: "AuthType"
      },
      {
        title: "Phone",
        key: "Phone",
        dataIndex: "Phone"
      },
      {
        title: t('X_Trade_Status'),
        key: "StatusText",
        dataIndex: "StatusText",
        align: "center"
      },
      {
        title: t('X_Trade_Status_Login'),
        key: "StatusText",
        render: (v, record, index) => (
            !v.IsLockLogin ? (
              <span>Mở khóa</span>
            ) : (
              <span>Khóa đăng nhập</span>
            )
        ),
        align: "center"
      },
      {
        title: "Action",
        render: (v, record, index) => (
          <Fragment key={index}>
            <Menu mode="horizontal" defaultSelectedKeys={['SubMenu']} className="menu-corg">
              <Menu.SubMenu key="SubMenu" icon={<List size={18} />}>
                <Menu.Item key="two" icon={<Edit size={14} />} onClick={() => EdtUser(v)}>
                  Sửa
                </Menu.Item>
                <Menu.Item key="three" icon={<Lock size={14} />} onClick={() => ChgPassword(v)}>
                  Đổi mật khẩu
                </Menu.Item>
                <Menu.Item key="four" icon={<Lock size={14} />} onClick={() => ResetPassword(v)}>
                  Reset mật khẩu
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
            {
              v.Status === 1 ? (
                <>
                  <Tooltip placement="left" title={"Inactive tài khoản"}>
                    <Button.Ripple
                      className='btn-icon'
                      color='flat-danger'
                      id='positionLeftInactive'
                      onClick={() => changeAccountStatus(v, 0)}
                      size='sm'>
                      <UserX size={18} />
                    </Button.Ripple>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip placement="left" title={"Active tài khoản"}>
                    <Button.Ripple
                      className='btn-icon'
                      color='flat-success'
                      id='positionLeftActive'
                      onClick={() => changeAccountStatus(v, 1)}
                      size='sm'>
                      <UserCheck size={18} />
                    </Button.Ripple>
                  </Tooltip>
                </>
              )
            }
            {
              !v.IsLockLogin ? (
                <>
                  <Tooltip placement="left" title={"Lock tài khoản"}>
                    <Button.Ripple
                      className='btn-icon'
                      color='flat-danger'
                      id='positionLeftInactive'
                      onClick={() => lockAccount(v, 0)}
                      size='sm'>
                      <Lock size={18} />
                    </Button.Ripple>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip placement="left" title={"Unlock tài khoản"}>
                    <Button.Ripple
                      className='btn-icon'
                      color='flat-success'
                      id='positionLeftActive'
                      onClick={() => lockAccount(v, 1)}
                      size='sm'>
                      <Unlock size={18} />
                    </Button.Ripple>
                  </Tooltip>
                </>
              )
            }
          </Fragment>
        ),
        width: 150,
        fixed: "right",
        align: "center"
      },
    ];

    const handlePageChangeCustomerAccount = (page: any) => {
      setPageIndex(page);
    };
    const handlePerRowsChangeCustomerAccount = (newpage: any, page: any) => {
      setPageSize(page);
    };
    const AddNewUser = () => {
      userStore.onShowModalAddNew(true);
    }
    const EdtUser = (data: any) => {
      userStore.userInfoParam = data;
      userStore.onShowModalEdit(true);
    }
    const ChgPassword = (data: any) => {
      userStore.userInfoParam = data;
      userStore.onShowModalChangePassword(true);
    }
    const ResetPassword = (data: any) => {
      userStore.userInfoParam = data;
      userStore.onShowModalResetPassword(true);
    }
    const onSubmit = () => {
      const formValue = form.getFieldsValue();
      handlePageChangeCustomerAccount(1);
      const param = {
        "UserDomain": formValue.UserDomain.trim(),
        "LoginName": formValue.LoginName.trim(),
        "EmployeeCode": formValue.EmployeeCode.trim(),
        "AuthType": formValue.AuthType.value,
        "Status": -1
      }
      
      userStore.GetListUser(param);
    }

    useEffect(() => {
      onSubmit();
    }, []);

    // useEffect(() => {
    //   if(userStore.changeActiveAccount) {
    //     onSubmit();
    //   }
    // }, [userStore.changeActiveAccount]);

    const valueDefault = {
      UserDomain: "",
      LoginName: "",
      EmployeeCode: "",
      AuthType: userTypeSearch[0],
      Status: -1
    }

    const resetForm = () => {
      form.resetFields();
      onSubmit();
    }

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("User_Management")}</h4>
            <Button
              htmlType="button"
              className="btn btn-gradient-info"
              color="gradient-info"
              onClick={() => AddNewUser()}
            >{t("X_Trade_Button_Add_New")}</Button>
          </CardHeader>
          <CardBody>
            <Row>
              <Col sm="24">
                <Form
                  layout={"vertical"}
                  form={form}
                  initialValues={valueDefault}
                  onFinish={onSubmit}
                  requiredMark={false}
                >
                  <Row>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("Login_Name")}
                        name="LoginName"
                      >
                        <Input
                          size="small"
                          placeholder={t("Login_Name")}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                  <Col lg="6" md="6">
                      <Form.Item
                        label={t("Employee_Code")}
                        name="EmployeeCode"
                      >
                        <Input
                          size="small"
                          placeholder={t("Employee_Code")}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg="6" md="6">
                      <Form.Item
                        label={t("User_Domain")}
                        name="UserDomain"
                      >
                        <Input
                          size="small"
                          placeholder={t("User_Domain")}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>
                    
                    <Col lg="6" md="6">
                      <Form.Item label={t("Auth_Type")} name="AuthType">
                        <Select
                          options={userTypeSearch}
                          isClearable={false}
                          theme={selectThemeColors}
                          className="react-select react-select-sm"
                          classNamePrefix="select"
                          styles={customSMSelectStyles}
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
              </Col>
              <Col sm="24" md="24">
                <Table
                  className="mt-1"
                  columns={customerAccountColumn}
                  dataSource={userStore.listUsers}
                  size="small"
                  scroll={{ x: 800 }}
                  loading={userStore.loadingData}
                  pagination={
                    {
                      showSizeChanger: true,
                      onShowSizeChange: handlePerRowsChangeCustomerAccount,
                      pageSizeOptions: [10, 25, 50, 100],
                      defaultPageSize: 10,
                      defaultCurrent: pageIndex,
                      current: pageIndex,
                      total: userStore.listUsers.length,
                      onChange: handlePageChangeCustomerAccount,
                      className: "mt-1 text-right custom-ant-pagination",
                      locale: { items_per_page: "/ trang" },
                      showTotal: showTotal
                    }
                  }
                />
              </Col>
            </Row>
          </CardBody>
          <Modal
            isOpen={userStore.isShowPopup}
            toggle={() => (userStore.isShowPopup = !userStore.isShowPopup)}
            className="modal-lg modal-dialog-centered"
            backdrop={"static"}
          >
            <ModalHeader
              toggle={() => (userStore.isShowPopup = !userStore.isShowPopup)}
            >
              {t("Create_User")}
            </ModalHeader>
            <ModalBody>
              <CreateUser />
            </ModalBody>
          </Modal>
          <Modal
            isOpen={userStore.isShowPopupEdit}
            toggle={() => (userStore.isShowPopup = !userStore.isShowPopupEdit)}
            className="modal-lg modal-dialog-centered"
            backdrop={"static"}
          >
            <ModalHeader
              toggle={() => (userStore.isShowPopupEdit = !userStore.isShowPopupEdit)}
            >
              {t("Edit_User")}
            </ModalHeader>
            <ModalBody>
              <EditUser />
            </ModalBody>
          </Modal>
          <Modal
            isOpen={userStore.isShowPopupChangePassword}
            toggle={() => (userStore.isShowPopup = !userStore.isShowPopupChangePassword)}
            className="modal-sm modal-dialog-centered"
            backdrop={"static"}
          >
            <ModalHeader
              toggle={() => (userStore.isShowPopupChangePassword = !userStore.isShowPopupChangePassword)}
            >
              {t("Change_Password")}
            </ModalHeader>
            <ModalBody>
              <ChangePassword />
            </ModalBody>
          </Modal>
          <Modal
            isOpen={userStore.isShowPopupResetPassword}
            toggle={() => (userStore.isShowPopup = !userStore.isShowPopupResetPassword)}
            className="modal-sm modal-dialog-centered"
            backdrop={"static"}
          >
            <ModalHeader
              toggle={() => (userStore.isShowPopupResetPassword = !userStore.isShowPopupResetPassword)}
            >
              {t("Reset_Password")}
            </ModalHeader>
            <ModalBody>
              <ResetUserPassword />
            </ModalBody>
          </Modal>
        </Card>
      </Fragment>
    );
  });

export default ListUser;