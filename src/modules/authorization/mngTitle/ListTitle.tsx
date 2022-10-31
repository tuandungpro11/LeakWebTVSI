import { Form, Input, Menu, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React, { Fragment } from "react";
import { useState } from "react";
import { Delete, Edit, List } from "react-feather";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, CardHeader, Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import withReactContent from "sweetalert2-react-content";
import { titleStore } from "../store/titleStore";
import { pageSizeTable } from "../type";
import PerfectScrollbar from "react-perfect-scrollbar";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";
import Swal from "sweetalert2";

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
          (titleStore.pageIndexListTitle - 1) * titleStore.pageSizeListTitle,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "ID",
        dataIndex: "CustomerId",
        key: "CustomerId",
        fixed: "left",
        align: "left",
        width: 150,
      },
      {
        title: "Tên vị trí",
        dataIndex: "CUSTOMERNAME",
        key: "CUSTOMERNAME",
        align: "left",
        width: 200,
      },
      {
        title: "Mô tả",
        dataIndex: "CUSTOMERNAME",
        key: "CUSTOMERNAME",
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

    const defaultValue={
      appName:""
    }
    const onSubmit = () =>{}
    const resetForm = () =>{
      form.resetFields();
      if (titleStore.pageIndexListTitle == 1) {
        onSubmit();
      } else {
        titleStore.pageIndexListTitle = 1;
      }
    }
    const onClickButtonSearch = () =>{
      if (titleStore.pageIndexListTitle == 1) {
        onSubmit();
      } else {
        titleStore.pageIndexListTitle = 1;
      }
    }
    const PopupAddNew = () => {
      titleStore.onShowModalAddNew(true);
    };
    const popupUpdate = (value: any) => {
      setValueUpdate(value);
      titleStore.onShowModalUpdate(true);
    };
    const popupConfirmDel = (value:any) => {
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
            
          };
          // titleStore.onDeleteBankById(paramDel);
        }
      });
    };

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
                <Table
                  columns={listTitleColumn}
                  dataSource={titleStore.dataListTitle}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={titleStore.loadingData}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange: titleStore.handlePerRowsListTitle,
                    pageSizeOptions: pageSizeTable,
                    total: titleStore.totalRowsListTitle,
                    showTotal: showTotal,
                    onChange: titleStore.handlePageChangeListTitle,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: titleStore.pageIndexListTitle,
                    locale: { items_per_page: "/ trang" },
                    current: titleStore.pageIndexListTitle,
                  }}
                />
              </Col>
            </Row>
          </CardBody>
          <PerfectScrollbar>
            <Modal
              isOpen={titleStore.isShowPopup}
              toggle={() => (titleStore.isShowPopup = !titleStore.isShowPopup)}
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() => (titleStore.isShowPopup = !titleStore.isShowPopup)}
              >
                <Label for="basicInput">
                  <h4>{t("authorization_add_new_title")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormAddNew />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          <PerfectScrollbar>
            <Modal
              isOpen={titleStore.isShowPopupModalUpdate}
              toggle={() =>
                (titleStore.isShowPopupModalUpdate = !titleStore.isShowPopupModalUpdate)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (titleStore.isShowPopupModalUpdate = !titleStore.isShowPopupModalUpdate)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorization_update_title")}</h4>
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
