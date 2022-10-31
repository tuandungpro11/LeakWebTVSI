import { Form, Input, Menu, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import { Delete, Edit, List } from "react-feather";
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
import { authorizationStore } from "../store/authorizationStore";
import { pageSizeTable } from "../type";
import PerfectScrollbar from "react-perfect-scrollbar";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";
import Swal from "sweetalert2";
import { appStore } from "../../../stores/appStore";

const ListTitle = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueLoad, setValueLoad] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const listAuthorizeColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (authorizationStore.pageIndexListAuthorization - 1) *
            authorizationStore.pageSizeListAuthorization,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã quyền",
        dataIndex: "RightCode",
        key: "RightCode",
        align: "left",
        width: 150,
      },
      {
        title: "Tên quyền",
        dataIndex: "RightName",
        key: "RightName",
        align: "left",
        width: 200,
      },
      {
        title: "Mô tả",
        dataIndex: "Description",
        key: "Description",
        align: "left",
        width: 200,
      },
      {
        title: "Trạng thái",
        render: function (value: any) {
          if (value.Status == 1) {
            return "Đã kích hoạt";
          } else {
            return "Chưa kích hoạt";
          }
        },
        align: "left",
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
                    <Menu.Item
                      key="twwo"
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
        width: 70,
        align: "center",
      },
    ];

    const defaultValue = {
      appName: "",
    };
    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
      };
      authorizationStore.getListRightInfo(param);
    };
    const resetForm = () => {
      form.resetFields();
      if (authorizationStore.pageIndexListAuthorization == 1) {
        onSubmit();
      } else {
        authorizationStore.pageIndexListAuthorization = 1;
      }
    };
    const onClickButtonSearch = () => {
      if (authorizationStore.pageIndexListAuthorization == 1) {
        onSubmit();
      } else {
        authorizationStore.pageIndexListAuthorization = 1;
      }
    };
    const PopupAddNew = () => {
      authorizationStore.onShowModalAddNew(true);
    };
    const popupUpdate = (value: any) => {
      setValueUpdate(value);
      authorizationStore.onShowModalUpdate(true);
    };
    const popupConfirmDel = (value: any) => {
      MySwal.fire({
        html: "Bạn có muốn xóa quyền " + value.RightName +"?",
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
            UserName: appStore.account.LoginName,
            RightID: value.RightID,
          };
          authorizationStore.DeleteRight(paramDel);
        }
      });
    };

    useEffect(()=>{
      authorizationStore.totalRowsListAuthorization = 0;
      authorizationStore.pageIndexListAuthorization = 1;
      authorizationStore.pageSizeListAuthorization = 10;
      authorizationStore.dataListAuthorization=[];
    },[]);
    useEffect(()=>{
      if(valueLoad){
        onSubmit();
      }
    },[authorizationStore.pageIndexListAuthorization,authorizationStore.pageSizeListAuthorization])

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("authorization_title")}</h4>
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
                    label={t("authorization_list_title_name")}
                    name="titleName"
                  >
                    <Input
                      size="small"
                      placeholder={t("authorization_list_title_name")}
                      autoComplete="Off"
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
                {authorizationStore.dataListAuthorization.length > 0 && <Table
                  columns={listAuthorizeColumn}
                  dataSource={authorizationStore.dataListAuthorization}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={authorizationStore.loadingData}
                  expandable={{defaultExpandAllRows: true}}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange:
                      authorizationStore.handlePerRowsListAuthorization,
                    pageSizeOptions: pageSizeTable,
                    total: authorizationStore.totalRowsListAuthorization,
                    showTotal: showTotal,
                    onChange:
                      authorizationStore.handlePageChangeListAuthorization,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent:
                      authorizationStore.pageIndexListAuthorization,
                    locale: { items_per_page: "/ trang" },
                    current: authorizationStore.pageIndexListAuthorization,
                  }}
                />}
              </Col>
            </Row>
          </CardBody>
          <PerfectScrollbar>
            <Modal
              isOpen={authorizationStore.isShowPopup}
              toggle={() =>
                (authorizationStore.isShowPopup =
                  !authorizationStore.isShowPopup)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (authorizationStore.isShowPopup =
                    !authorizationStore.isShowPopup)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorization_add_new_authorization")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormAddNew />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          <PerfectScrollbar>
            <Modal
              isOpen={authorizationStore.isShowPopupModalUpdate}
              toggle={() =>
                (authorizationStore.isShowPopupModalUpdate =
                  !authorizationStore.isShowPopupModalUpdate)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (authorizationStore.isShowPopupModalUpdate =
                    !authorizationStore.isShowPopupModalUpdate)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorization_update_authorization")}</h4>
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

export default ListTitle;
