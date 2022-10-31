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
import { pageSizeTable } from "../type";
import PerfectScrollbar from "react-perfect-scrollbar";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";
import Swal from "sweetalert2";
import { branchStore } from "../store/branchStore";
import { appStore } from "../../../stores/appStore";
import { Moment } from "../../../utility/general/Moment";

const ListBranch = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueLoad, setValueLoad] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const listBranchColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (branchStore.pageIndexListBranch - 1) *
            branchStore.pageSizeListBranch,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã CN",
        dataIndex: "BranchCode",
        key: "BranchCode",
        align: "left",
        width: 150,
      },
      {
        title: "Tên CN",
        dataIndex: "BranchName",
        key: "BranchName",
        align: "left",
        width: 200,
      },
      {
        title: "Địa chỉ",
        dataIndex: "Address",
        key: "Address",
        align: "left",
        width: 200,
      },
      {
        title: "Email",
        dataIndex: "Email",
        key: "Email",
        align: "left",
        width: 200,
      },
      {
        title: "Phone",
        dataIndex: "Phone",
        key: "Phone",
        align: "left",
        width: 200,
      },
      {
        title: "Manager",
        dataIndex: "Manager",
        key: "Manager",
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
        title: "Người tạo",
        dataIndex: "CreatedBy",
        key: "CreatedBy",
        align: "left",
        width: 200,
      },
      {
        title: "Ngày tạo",
        render: function (value: any) {
          return Moment.formatDateNew(value.CreatedDate, "DD/MM/yyyy");
        },
        align: "left",
        width: 200,
      },
      {
        title: "Người cập nhật",
        dataIndex: "UpdatedBy",
        key: "UpdatedBy",
        align: "left",
        width: 200,
      },
      {
        title: "Ngày cập nhật",
        render: function (value: any) {
          return Moment.formatDateNew(value.UpdatedDate, "DD/MM/yyyy");
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
      branchStore.getListBranch(param);
    };
    const resetForm = () => {
      form.resetFields();
      if (branchStore.pageIndexListBranch == 1) {
        onSubmit();
      } else {
        branchStore.pageIndexListBranch = 1;
      }
    };
    const onClickButtonSearch = () => {
      if (branchStore.pageIndexListBranch == 1) {
        onSubmit();
      } else {
        branchStore.pageIndexListBranch = 1;
      }
    };
    const PopupAddNew = () => {
      branchStore.onShowModalAddNew(true);
    };
    const popupUpdate = (value: any) => {
      setValueUpdate(value);
      branchStore.onShowModalUpdate(true);
    };
    const popupConfirmDel = (value: any) => {
      MySwal.fire({
        html: "Bạn có muốn xóa chi nhánh " + value.BranchName + "?",
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
            BranchID: value.BranchID
          };
          branchStore.DeleteRight(paramDel);
        }
      });
    };

    useEffect(() => {
      branchStore.totalRowsListBranch = 0;
      branchStore.pageIndexListBranch = 1;
      branchStore.pageSizeListBranch = 10;
      branchStore.dataListBranch = [];
    }, []);
    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [branchStore.pageIndexListBranch, branchStore.pageSizeListBranch]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("authorization_branch_title")}</h4>
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
                    label={t("authorization_list_app_name")}
                    name="appName"
                  >
                    <Input
                      size="small"
                      placeholder={t("authorization_list_app_name")}
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
                  columns={listBranchColumn}
                  dataSource={branchStore.dataListBranch}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={branchStore.loadingData}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange: branchStore.handlePerRowsListBranch,
                    pageSizeOptions: pageSizeTable,
                    total: branchStore.totalRowsListBranch,
                    showTotal: showTotal,
                    onChange: branchStore.handlePageChangeListBranch,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: branchStore.pageIndexListBranch,
                    locale: { items_per_page: "/ trang" },
                    current: branchStore.pageIndexListBranch,
                  }}
                />
              </Col>
            </Row>
          </CardBody>
          <PerfectScrollbar>
            <Modal
              isOpen={branchStore.isShowPopup}
              toggle={() =>
                (branchStore.isShowPopup = !branchStore.isShowPopup)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (branchStore.isShowPopup = !branchStore.isShowPopup)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorization_add_new_branch")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormAddNew />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          <PerfectScrollbar>
            <Modal
              isOpen={branchStore.isShowPopupModalUpdate}
              toggle={() =>
                (branchStore.isShowPopupModalUpdate =
                  !branchStore.isShowPopupModalUpdate)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (branchStore.isShowPopupModalUpdate =
                    !branchStore.isShowPopupModalUpdate)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorization_update_branch")}</h4>
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

export default ListBranch;
