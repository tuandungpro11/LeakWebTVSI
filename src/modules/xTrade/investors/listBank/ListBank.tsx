import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import DataTable from "react-data-table-component";
import {
  ChevronDown,
  Delete,
  Edit,
  Home,
  List,
  Loader,
  Twitch,
} from "react-feather";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
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
import { numberUtil } from "../../../../utility/general/NumberUtil";
import { store } from "../../store/InvestorStore";
import { customSMSelectStyles, listAPI, pageSizeTable } from "../../types";
import FormAddNewBank from "./AddNewBank";
import PerfectScrollbar from "react-perfect-scrollbar";
import FormUpdateBank from "./UpdateBank";
import {
  Pagination,
  PaginationProps,
  Menu,
  Form,
  Input,
  DatePicker,
} from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { Item, useContextMenu } from "react-contexify";
import ListBranchBank from "../branchMangament/ListBranch";
import Select from "react-select";
import { selectThemeColors } from "../../../../utility/Utils";
import FormDetail from "./FormDetail";
import { appStore } from "../../../../stores/appStore";

const ListBank = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const { t } = useTranslation();
    const [valueLoad, setValueLoad] = useState(false);
    const listBankColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index + 1 + (store.pageIndexListBank - 1) * store.pageSizeListBank,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã Ngân Hàng",
        dataIndex: "BankNo",
        key: "BankNo",
        width: 100,
        fixed: "left",
        align: "left",
      },
      {
        title: "Tên Ngân Hàng",
        dataIndex: "BankName",
        key: "BankName",
        fixed: "left",
        align: "left",
        width: 250,
      },
      {
        title: "Tên Tiếng Anh",
        dataIndex: "BankName_E",
        key: "BankName_E",
        align: "left",
        width: 250,
      },
      {
        title: "Tên Viết Tắt",
        dataIndex: "ShortName",
        key: "ShortName",
        align: "left",
        width: 150,
      },
      {
        title: "Trạng thái",
        dataIndex: "Status_Text",
        key: "Status_Text",
        align: "left",
        width: 120,
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
                      icon={<Twitch size={14} />}
                      onClick={() => popupDetail(value)}
                    >
                      {t("deatail_label")}
                    </Menu.Item>
                    <Menu.Item
                      key="three"
                      icon={<Edit size={14} />}
                      onClick={() => popupUpdate(value)}
                    >
                      {t("X_Trade_Button_Update")}
                    </Menu.Item>
                    <Menu.Item
                      key="four"
                      icon={<Delete size={14} />}
                      onClick={() =>
                        popupConfirmDel(value.Id, value.BankNo, value.BankName)
                      }
                    >
                      {t("X_Trade_Button_Delete")}
                    </Menu.Item>
                    <Menu.Item
                      key="five"
                      icon={<Home size={14} />}
                      onClick={() => popupBranch(value)}
                    >
                      {t("X_Trade_Branch_Name")}
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
      console.log(valueForm);
      const param = {
        UserId: appStore.account.LoginName,
        BankNo: valueForm.BankNo == undefined ? "" : valueForm.BankNo.trim(),
        BankTitle: "",
        BankNameEn: "",
        ShortTitle: "",
        Status:
          valueForm.cbxStatus == undefined ? -1 : valueForm.cbxStatus.Value,
        Bankcheqcode: "",
        SecCode: valueForm.SecCode,
        BankName: "",
        ShortName: "",
        SecCodeBranch: "",
        PageIndex: store.pageIndexListBank,
        PageSize: store.pageSizeListBank,
      };

      store.onSubmitListBank(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (store.pageIndexListBank == 1) {
        onSubmit();
      } else {
        store.pageIndexListBank = 1;
      }
    };
    const popupConfirmDel = (Id: any, BankNo: any, BankTitle: any) => {
      MySwal.fire({
        html: "Bạn có muốn xóa ngân hàng " + BankTitle + "?",
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
            Id: Id,
            BankNo: BankNo,
          };
          store.onDeleteBankById(paramDel, BankTitle);
        }
      });
    };

    const PopupAddNew = () => {
      store.onShowModalAddNew(true);
    };

    const popupUpdate = (valueBank: any) => {
      setValueUpdate(valueBank);
      console.log("valueUpdate: ", valueBank);
      store.onShowModalUpdate(true);
    };
    const popupBranch = (valueBank: any) => {
      setValueUpdate(valueBank);
      store.onShowModalBranchList(true);
    };
    const popupDetail = (valueBank: any) => {
      setValueUpdate(valueBank);
      console.log("valueUpdate: ", valueBank);
      store.onShowModalDetail(true);
    };

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndexListBank == 1) {
        onSubmit();
      } else {
        store.pageIndexListBank = 1;
      }
    };
    const defaultValue = {
      BankNo: "",
      BankTitle: "",
      BankNameEn: "",
      ShortTitle: "",
      Status: -1,
      Bankcheqcode: "",
      SecCode: "",
      BankName: "",
      ShortName: "",
      SecCodeBranch: "",
    };
    const exportListBank = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        BankNo: valueForm.BankNo == undefined ? "" : valueForm.BankNo.trim(),
        BankName: "",
        BankNameEn: "",
        ShortName: "",
        Status: valueForm.cbxStatus == undefined ? -1 : valueForm.cbxStatus.Value,
        Bankcheqcode: "",
        SecCode: valueForm.SecCode,
        SecCodeBranch: "",
      };
      store.ExportListUI(listAPI.ExportListBank,param,'DANH_SACH_NGAN_HANG');
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    useEffect(() => {
      store.dataListBank = [];
      store.totalRowsListBank = 0;
      const param = {
        Category: "BANK",
        Group: "STATUS",
        Code: "",
      };
      store.getListStatusBank(param);
      //onSubmit();
    }, []);
    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [store.pageIndexListBank, store.pageSizeListBank]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_ListBank")}</h4>
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
                  <Form.Item label={t("X_Trade_Bank_Code")} name="BankNo">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Bank_Code")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_CTCK_Code")} name="SecCode">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_CTCK_Code")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Status")} name="cbxStatus">
                    {store.dataListStatusBank.length > 0 ? (
                      <Select
                        options={store.dataListStatusBank}
                        defaultValue={store.dataListStatusBank[0]}
                        isClearable={false}
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        styles={customSMSelectStyles}
                        getOptionLabel={(option: { Name: any; }) => option.Name}
                        getOptionValue={(option: { Value: any; }) => option.Value}
                      />
                    ) : (
                      <></>
                    )}
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
                    &nbsp;&nbsp;
                    <Button
                      htmlType="button"
                      className="btn btn-gradient-success"
                      color="gradient-success"
                      onClick={exportListBank}
                    >
                      {t("X_Trade_Button_Export")}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col sm="24" md="24">
                  <Table
                    columns={listBankColumn}
                    dataSource={store.dataListBank}
                    size="small"
                    scroll={{ x: 800, y: 800 }}
                    loading={store.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange: store.handlePerRowsChangeListBank,
                      pageSizeOptions: pageSizeTable,
                      total: store.totalRowsListBank,
                      showTotal: showTotal,
                      onChange: store.handlePageChangeListBank,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent: store.pageIndexListBank,
                      locale: { items_per_page: "/ trang" },
                      current: store.pageIndexListBank,
                    }}
                  />
                </Col>
              </Row>
            </Form>
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
                <FormAddNewBank />
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
                <FormUpdateBank valueUpdate={valueUpdate} />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          <PerfectScrollbar>
            <Modal
              isOpen={store.isShowPopupModalBranchList}
              toggle={() =>
                (store.isShowPopupModalBranchList =
                  !store.isShowPopupModalBranchList)
              }
              className="modal-sxl modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (store.isShowPopupModalBranchList =
                    !store.isShowPopupModalBranchList)
                }
              >
                {/* <Label for="basicInput">
                  {t("X_Trade_Title_Form_Update_Bank_Acc")}
                </Label> */}
              </ModalHeader>
              <ModalBody>
                <ListBranchBank valueUpdate={valueUpdate} />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          <PerfectScrollbar>
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
                {/* <Label for="basicInput">
                  {t("X_Trade_Title_Form_Update_Bank_Acc")}
                </Label> */}
              </ModalHeader>
              <ModalBody>
                <FormDetail valueUpdate={valueUpdate} />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
        </Card>
      </Fragment>
    );
  });

export default ListBank;
