import { Form, Input, Menu, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React, { Fragment } from "react";
import { useState } from "react";
import { Delete, Edit, List } from "react-feather";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, CardHeader, Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import withReactContent from "sweetalert2-react-content";
import { saleStore } from "../store/saleStore";
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
    const [valueUpdate, setValueUpdate] = useState([]);
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const listSaleColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (saleStore.pageIndexListSale - 1) * saleStore.pageSizeListSale,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "ID",
        dataIndex: "SaleID",
        key: "SaleID",
        align: "right",
        width: 80,
      },
      {
        title: "Họ tên",
        dataIndex: "SaleName",
        key: "SaleName",
        align: "left",
        width: 200,
      },
      {
        title: "Loại Sale",
        render: function(value:any){
          if(value.SaleType === 1) return "Sale";
          if(value.SaleType === 2) return "CTV mục tiêu";
          if(value.SaleType === 3) return "CTV lâu năm";
          if(value.SaleType === 4) return "Khác";
        },
        align: "left",
        width: 200,
      },
      {
        title: "Mã CN",
        dataIndex: "BranchCode",
        key: "BranchCode",
        align: "left",
        width: 200,
      },
      {
        title: "Trạng thái",
        render: function(value:any){
          if(value.Status === 0) return "Chưa kích hoạt";
          if(value.Status === 1) return "Đã kích hoạt";
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
                    {/* <Menu.Item
                      key="three"
                      icon={<Delete size={14} />}
                      onClick={() => popupConfirmDel(value)}
                    >
                      {t("X_Trade_Button_Delete")}
                    </Menu.Item> */}
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
      branchCode:"", 
      saleId:""
    }
    const onSubmit = () =>{
      const valueForm = form.getFieldsValue();
      const param ={
        UserName: appStore.account.LoginName,
        BranchCode: valueForm.branchCode == undefined ?"":valueForm.branchCode.trim(),
        SaleID:valueForm.saleId == undefined ?"":valueForm.saleId.trim()
      }
      saleStore.getAllSaleInfos(param);
    }
    const resetForm = () =>{
      form.resetFields();
      if (saleStore.pageIndexListSale == 1) {
        onSubmit();
      } else {
        saleStore.pageIndexListSale = 1;
      }
    }
    const onClickButtonSearch = () =>{
      if (saleStore.pageIndexListSale == 1) {
        onSubmit();
      } else {
        saleStore.pageIndexListSale = 1;
      }
    }
    const PopupAddNew = () => {
      saleStore.onShowModalAddNew(true);
    };
    const popupUpdate = (value: any) => {
      setValueUpdate(value);
      saleStore.onShowModalUpdate(true);
    };
    // const popupConfirmDel = (value:any) => {
    //   MySwal.fire({
    //     html: "Bạn có muốn xóa chức năng?",
    //     customClass: {
    //       confirmButton: "btn btn-gradient-primary mr-1",
    //       cancelButton: "btn btn-gradient-secondary",
    //     },
    //     showClass: {
    //       popup: "animate__animated animate__flipInX",
    //     },
    //     buttonsStyling: false,
    //     showCancelButton: true,
    //     confirmButtonText: "Đồng ý",
    //     cancelButtonText: "Hủy",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       const paramDel = {
            
    //       };
    //       // saleStore.onDeleteBankById(paramDel);
    //     }
    //   });
    // };

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("authorization_sale_title")}</h4>
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
                    label={t("X_Trade_Branch_Bank_No")}
                    name="branchCode"
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Branch_Bank_No")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item
                    label={t("SaleId")}
                    name="saleId"
                  >
                    <Input
                      size="small"
                      placeholder={t("SaleId")}
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
                  columns={listSaleColumn}
                  dataSource={saleStore.dataListSale}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={saleStore.loadingData}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange: saleStore.handlePerRowsListSale,
                    pageSizeOptions: pageSizeTable,
                    total: saleStore.totalRowsListSale,
                    showTotal: showTotal,
                    onChange: saleStore.handlePageChangeListSale,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: saleStore.pageIndexListSale,
                    locale: { items_per_page: "/ trang" },
                    current: saleStore.pageIndexListSale,
                  }}
                />
              </Col>
            </Row>
          </CardBody>
          <PerfectScrollbar>
            <Modal
              isOpen={saleStore.isShowPopup}
              toggle={() => (saleStore.isShowPopup = !saleStore.isShowPopup)}
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() => (saleStore.isShowPopup = !saleStore.isShowPopup)}
              >
                <Label for="basicInput">
                  <h4>{t("authorization_add_new_sale")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormAddNew />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          <PerfectScrollbar>
            <Modal
              isOpen={saleStore.isShowPopupModalUpdate}
              toggle={() =>
                (saleStore.isShowPopupModalUpdate = !saleStore.isShowPopupModalUpdate)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (saleStore.isShowPopupModalUpdate = !saleStore.isShowPopupModalUpdate)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorization_update_sale")}</h4>
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
