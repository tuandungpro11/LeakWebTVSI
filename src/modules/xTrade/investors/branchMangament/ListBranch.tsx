import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { ChevronDown, Delete, Edit, List, Loader } from "react-feather";
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
import { customSMSelectStyles, pageSizeTable } from "../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import { PaginationProps, Menu, Form, Input, DatePicker } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import Select from "react-select";
import { Item, useContextMenu } from "react-contexify";
import { selectThemeColors } from "../../../../utility/Utils";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";

const StatusOption = [
  { value: 1, label: "Kích hoạt" },
  { value: 2, label: "Chưa kích hoạt" },
];

const ListBranchBank = (valueUpdateForm: any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const { t } = useTranslation();
    const valueBind = valueUpdateForm.valueUpdate;
    const [valueLoad, setValueLoad] = useState(false);
    const listBankColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (store.pageIndexBranchBank - 1) * store.pageSizeBranchBank,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã Ngân Hàng",
        dataIndex: "BankNo",
        key: "BankNo",
        width: 150,
        align: "left",
        fixed: "left",
      },
      {
        title: "Mã chi nhánh",
        dataIndex: "BranchNo",
        key: "BranchNo",
        align: "left",
        width: 500,
      },
      {
        title: "Tên chi nhánh",
        dataIndex: "BranchName",
        key: "BranchName",
        align: "left",
        width: 500,
      },
      {
        title: "Tên tiếng Anh",
        dataIndex: "BranchName_E",
        key: "BranchName_E",
        align: "left",
        width: 200,
      },
      {
        title: "Tên viết tắt",
        dataIndex: "ShortBranchName",
        key: "ShortBranchName",
        align: "left",
        width: 200,
      },
      {
        title: "Trạng thái",
        render: function (value: any) {
          if (value.Status == 1) {
            return "Kích hoạt";
          } else {
            return "Chưa kích hoạt";
          }
        },
        align: "left",
        width: 200,
      },
      {
        title: "Người tạo",
        dataIndex: "CreateBy",
        key: "CreateBy",
        align: "left",
        width: 200,
      },
      {
        title: "Ngày tạo",
        render: function (value: any) {
          return Moment.formatDateNew(value.CreateDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 200,
      },
      {
        title: "Người hiệu chỉnh",
        dataIndex: "ModifiedBy",
        key: "ModifiedBy",
        align: "left",
        width: 200,
      },
      {
        title: "Ngày hiệu chỉnh",
        render: function (value: any) {
          return Moment.formatDateNew(value.ModifiedDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 200,
      },
      {
        title: "Ghi chú",
        dataIndex: "Remark",
        key: "Remark",
        align: "left",
        width: 150,
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
                      key="two"
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
    const { show } = useContextMenu({
      id: "menu_left",
    });
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [loading, setLoading] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        BankNo: valueForm.BankNo == undefined ? "" : valueForm.BankNo.trim(),
        BranchNo: valueForm.BranchNo == undefined ? "" : valueForm.BranchNo.trim(),
        BranchName: "",
        BranchNameEn: "",
        ShortBranchName: "",
        Status: valueForm.Status == undefined ? -1 : valueForm.Status.value,
        PageIndex: store.pageIndexBranchBank,
        PageSize: store.pageSizeBranchBank,
      };
      store.getListBranchBank(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
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
            Id: value.Id,
            BankNo: value.BankNo,
            BranchNo: value.BranchNo,
          };
          store.onDeleteBranchkById(paramDel);
        }
      });
    };

    const PopupAddNew = () => {
      store.onShowModalAddNewBranchList(true);
    };

    const popupUpdate = (valueBank: any) => {
      setValueUpdate(valueBank);
      console.log("valueUpdate: ", valueBank);
      store.onShowModalUpdateBranchList(true);
    };

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndexBranchBank == 1) {
        onSubmit();
      } else {
        store.pageIndexBranchBank = 1;
      }
    };
    const defaultValue = {
      BankNo: valueBind.BankNo,
      Status: StatusOption[0],
      BranchNo: "",
    };
    // const getListBranch = () => {
    //   const valueForm = form.getFieldsValue();
    //   const param = {
    //     BankNo: valueForm.BankNo == undefined ? "" : valueForm.BankNo,
    //     BranchNo: valueForm.BranchNo == undefined ? "" : valueForm.BranchNo,
    //     BranchName: "",
    //     BranchNameEn: "",
    //     ShortBranchName: "",
    //     Status: valueForm.Status == undefined ? -1 : valueForm.Status.value,
    //     PageIndex: store.pageIndexBranchBank,
    //     PageSize: store.pageSizeBranchBank,
    //   };
    //   store.getListBranchBank(param);
    // };
    const onClickButtonSearch = () => {
      if (store.pageIndexBranchBank == 1) {
        onSubmit();
      } else {
        store.pageIndexBranchBank = 1;
      }
    };

    useEffect(() => {
      const valueForm = form.getFieldsValue();
      if (valueForm.BankNo == undefined || valueForm.BankNo == "") {
        form.setFieldsValue({ BankNo: valueBind.BankNo });
      }
      if (valueLoad) {
        onSubmit();
      }
    }, [store.pageIndexBranchBank, store.pageSizeBranchBank]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_List_Branch_Title")}</h4>
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
            >
              <Row>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Bank_Code")} name="BankNo">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Bank_Code")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item
                    label={t("X_Trade_Branch_Bank_No")}
                    name="BranchNo"
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Branch_Bank_No")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Status")} name="Status">
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      defaultValue={StatusOption[0]}
                      options={StatusOption}
                      isClearable={false}
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
              <Row>
                <Col sm="24" md="24">
                    <Table
                      columns={listBankColumn}
                      dataSource={store.dataListBranchBank}
                      size="small"
                      scroll={{ x: 800, y: 800 }}
                      loading={store.loadingData}
                      pagination={{
                        showSizeChanger: true,
                        onShowSizeChange: store.handlePerRowsChangeBranchBank,
                        pageSizeOptions: pageSizeTable,
                        total: store.totalRowsBranchBank,
                        showTotal: showTotal,
                        onChange: store.handlePageChangeBranchBank,
                        className: "mt-1 text-right custom-ant-pagination",
                        defaultCurrent: store.pageIndexBranchBank,
                        locale: { items_per_page: "/ trang" },
                        current: store.pageIndexBranchBank,
                      }}
                    />
                </Col>
              </Row>
            </Form>
          </CardBody>
          <PerfectScrollbar>
            <Modal
              isOpen={store.isShowPopupModalAddNewBranchList}
              toggle={() =>
                (store.isShowPopupModalAddNewBranchList =
                  !store.isShowPopupModalAddNewBranchList)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (store.isShowPopupModalAddNewBranchList =
                    !store.isShowPopupModalAddNewBranchList)
                }
              >
                <Label for="basicInput"><h4>{t("X_Trade_Branch_Bank_Add")}</h4></Label>
              </ModalHeader>
              <ModalBody>
                <FormAddNew />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          <PerfectScrollbar>
            <Modal
              isOpen={store.isShowPopupModalUpdateBranchList}
              toggle={() =>
                (store.isShowPopupModalUpdateBranchList =
                  !store.isShowPopupModalUpdateBranchList)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (store.isShowPopupModalUpdateBranchList =
                    !store.isShowPopupModalUpdateBranchList)
                }
              >
                <Label for="basicInput"><h4>{t("X_Trade_Branch_Bank_Upd")}</h4></Label>
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

export default ListBranchBank;
