import { Form, Input, Menu, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React, { Fragment } from "react";
import { useState } from "react";
import { Activity, Delete, Edit, List, Lock } from "react-feather";
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
import withReactContent from "sweetalert2-react-content";
import { authorizeStore } from "../store/authorizeStore";
import {
  bankAccountStatusOption,
  customSMSelectStyles,
  pageSizeTable,
} from "../type";
import PerfectScrollbar from "react-perfect-scrollbar";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";
import Swal from "sweetalert2";
import { selectThemeColors } from "../../../utility/Utils";
import Select from "react-select";
import { userType } from "../../dashboard/types";
import { appStore } from "../../../stores/appStore";
import FormAuthorize from "./FormAuthorize";

const ListTitle = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueLoad, setValueLoad] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const listTitleColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (authorizeStore.pageIndexListAuthorize - 1) *
            authorizeStore.pageSizeListAuthorize,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã nhân viên",
        dataIndex: "EmployeeCode",
        key: "EmployeeCode",
        fixed: "left",
        align: "left",
        width: 150,
      },
      {
        title: "Tên đăng nhập",
        dataIndex: "LoginName",
        key: "LoginName",
        fixed: "left",
        align: "left",
        width: 200,
      },
      {
        title: "Họ và tên",
        dataIndex: "DisplayName",
        key: "DisplayName",
        align: "left",
        width: 200,
      },
      {
        title: "Loại xác thực",
        dataIndex: "AuthenType",
        key: "AuthenType",
        align: "left",
        width: 200,
      },
      {
        title: "Trạng thái",
        render: function(value:any){
          if(value.Status === 0) return "Chưa kích hoạt";
          if(value.Status === 1) return "Đã kích hoạt";
        },
        width: 200,
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
                    {/* <Menu.Item
                      key="twwo"
                      icon={<Edit s
                        ze={14} />}
                      onClick={() => popupUpdate(value)}
                    >
                      {t("X_Trade_Button_Update")}
                    </Menu.Item> */}
                    <Menu.Item
                      key="three"
                      icon={<Activity size={14} />}
                      onClick={() => popupAuthorize(value)}
                    >
                      {t("authorization_authorize_button")}
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </Fragment>
            </>
          );
        },
        fixed: "right",
        width: 70,
        align: "center",
      },
    ];

    const defaultValue = {
      staffCode: "",
      domainAcc: "",
      loginName: "",
      authType: userType[0],
    };
    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        EmployeeCode: valueForm.staffCode==undefined?"":valueForm.staffCode,
        UserDomain: valueForm.domainAcc==undefined?"":valueForm.domainAcc,
        LoginName: valueForm.loginName==undefined?"":valueForm.loginName,
        AuthenType: valueForm.authType.value,
      };
      authorizeStore.getAllUserInfos(param);
    };
    const resetForm = () => {
      form.resetFields();
      if (authorizeStore.pageIndexListAuthorize == 1) {
        onSubmit();
      } else {
        authorizeStore.pageIndexListAuthorize = 1;
      }
    };
    const onClickButtonSearch = () => {
      if (authorizeStore.pageIndexListAuthorize == 1) {
        onSubmit();
      } else {
        authorizeStore.pageIndexListAuthorize = 1;
      }
    };
    const popupAuthorize = (value: any) => {
      setValueUpdate(value);
      authorizeStore.onShowModalAddNew(true);
    };
    const popupUpdate = (value: any) => {
      setValueUpdate(value);
      authorizeStore.onShowModalUpdate(true);
    };
    const popupConfirmDel = (value: any) => {
      MySwal.fire({
        html: "Bạn có muốn xóa chức năng?",
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
          const paramDel = {};
          // authorizeStore.onDeleteBankById(paramDel);
        }
      });
    };

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("authorization_authorize_title")}</h4>
            {/* <Button
              htmlType="button"
              className="btn btn-gradient-info"
              color="gradient-info"
              onClick={() => PopupAddNew()}
            >
              {t("X_Trade_Button_Add_New")}
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
              <Row>
                <Col lg="6" md="6">
                  <Form.Item label={t("Login_Name")} name="loginName">
                    <Input
                      size="small"
                      placeholder={t("Login_Name")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("User_Domain")} name="domainAcc">
                    <Input
                      size="small"
                      placeholder={t("User_Domain")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Staff_Id")} name="staffCode">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Staff_Id")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    label={t("Auth_Type")}
                    name="authType"
                    rules={[
                      {
                        required: true,
                        message: "Loại xác thực chưa được chọn!",
                      },
                    ]}
                  >
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      options={userType}
                      defaultValue={userType[0]}
                      isClearable={false}
                      styles={customSMSelectStyles}
                      placeholder={"Chọn loại xác thực..."}
                      noOptionsMessage={() => "Không có dữ liệu...."}
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
                  columns={listTitleColumn}
                  dataSource={authorizeStore.dataListAuthorize}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={authorizeStore.loadingData}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange: authorizeStore.handlePerRowsListAuthorize,
                    pageSizeOptions: pageSizeTable,
                    total: authorizeStore.totalRowsListAuthorize,
                    showTotal: showTotal,
                    onChange: authorizeStore.handlePageChangeListAuthorize,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: authorizeStore.pageIndexListAuthorize,
                    locale: { items_per_page: "/ trang" },
                    current: authorizeStore.pageIndexListAuthorize,
                  }}
                />
              </Col>
            </Row>
          </CardBody>
          <PerfectScrollbar>
            <Modal
              isOpen={authorizeStore.isShowPopup}
              toggle={() =>
                (authorizeStore.isShowPopup = !authorizeStore.isShowPopup)
              }
              className="modal-xl modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (authorizeStore.isShowPopup = !authorizeStore.isShowPopup)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorization_authorize_title")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormAuthorize valueUpdate={valueUpdate}/>
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          {/* <PerfectScrollbar>
            <Modal
              isOpen={authorizeStore.isShowPopupModalUpdate}
              toggle={() =>
                (authorizeStore.isShowPopupModalUpdate =
                  !authorizeStore.isShowPopupModalUpdate)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (authorizeStore.isShowPopupModalUpdate =
                    !authorizeStore.isShowPopupModalUpdate)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorize_update")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormUpdate valueUpdate={valueUpdate} />
              </ModalBody>
            </Modal>
          </PerfectScrollbar> */}
        </Card>
      </Fragment>
    );
  });

export default ListTitle;
