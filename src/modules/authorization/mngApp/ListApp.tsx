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
import { appAuStore } from "../store/appStore";
import { pageSizeTable } from "../type";
import PerfectScrollbar from "react-perfect-scrollbar";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";
import Swal from "sweetalert2";
import { appStore } from "../../../stores/appStore";

const ListApp = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueLoad, setValueLoad] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const listAppColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (appAuStore.pageIndexListApp - 1) * appAuStore.pageSizeListApp,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "AppID",
        dataIndex: "AppID",
        key: "AppID",
        align: "right",
        width: 150,
      },
      {
        title: "Tên ứng dụng",
        dataIndex: "AppName",
        key: "AppName",
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
      const param = {
        UserName: appStore.account.LoginName,
      };
      appAuStore.getListApp(param);
    };
    const resetForm = () => {
      form.resetFields();
      if (appAuStore.pageIndexListApp == 1) {
        onSubmit();
      } else {
        appAuStore.pageIndexListApp = 1;
      }
    };
    const onClickButtonSearch = () => {
      if (appAuStore.pageIndexListApp == 1) {
        onSubmit();
      } else {
        appAuStore.pageIndexListApp = 1;
      }
    };
    const PopupAddNew = () => {
      appAuStore.onShowModalAddNew(true);
    };
    const popupUpdate = (value: any) => {
      setValueUpdate(value);
      appAuStore.onShowModalUpdate(true);
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
          const paramDel = {
            UserName: appStore.account.LoginName,
            AppID: value.AppID,
          };
          appAuStore.DeleteApp(paramDel);
        }
      });
    };
    
    useEffect(()=>{
      appAuStore.totalRowsListApp = 0;
      appAuStore.pageIndexListApp = 1;
      appAuStore.pageSizeListApp = 10;
      appAuStore.dataListApp=[];
    },[]);
    useEffect(()=>{
      if(valueLoad){
        onSubmit();
      }
    },[appAuStore.pageIndexListApp,appAuStore.pageSizeListApp])

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("authorization_manage_application_title")}</h4>
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
                {/* <Col lg="6" md="6">
                  <Form.Item
                    label={t("authorization_list_app_name")}
                    name="appName"
                  >
                    <Input
                      size="small"
                      placeholder={t("authorization_list_app_name")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col> */}
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
                {appAuStore.dataListApp.length > 0 && <Table
                  columns={listAppColumn}
                  dataSource={appAuStore.dataListApp}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={appAuStore.loadingData}
                  expandable={{defaultExpandAllRows: true}}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange: appAuStore.handlePerRowsListApp,
                    pageSizeOptions: pageSizeTable,
                    total: appAuStore.totalRowsListApp,
                    showTotal: showTotal,
                    onChange: appAuStore.handlePageChangeListApp,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: appAuStore.pageIndexListApp,
                    locale: { items_per_page: "/ trang" },
                    current: appAuStore.pageIndexListApp,
                  }}
                />}
              </Col>
            </Row>
          </CardBody>
          <PerfectScrollbar>
            <Modal
              isOpen={appAuStore.isShowPopup}
              toggle={() => (appAuStore.isShowPopup = !appAuStore.isShowPopup)}
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (appAuStore.isShowPopup = !appAuStore.isShowPopup)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorization_list_app_add_new_title")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormAddNew />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          <PerfectScrollbar>
            <Modal
              isOpen={appAuStore.isShowPopupModalUpdate}
              toggle={() =>
                (appAuStore.isShowPopupModalUpdate =
                  !appAuStore.isShowPopupModalUpdate)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (appAuStore.isShowPopupModalUpdate =
                    !appAuStore.isShowPopupModalUpdate)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorization_list_app_update_title")}</h4>
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

export default ListApp;
