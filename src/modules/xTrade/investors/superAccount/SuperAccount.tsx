import React, { Fragment, useState, useContext, useEffect } from "react";
import themeConfig from "@configs/themeConfig";
import {
  Row,
  Col,
  CustomInput,
  Button,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardHeader,
  DropdownToggle,
  DropdownItem,
  UncontrolledButtonDropdown,
  DropdownMenu,
  Label,
  Spinner,
} from "reactstrap";
import useApi from "@services/UseAppApi";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@customStyle/xtrade.scss";
import DataTable from "react-data-table-component";
import { Item, useContextMenu } from "react-contexify";

// import bankAccountColumn from "../../types"
import {
  Activity,
  ChevronDown,
  Delete,
  Edit,
  Edit2,
  Home,
  List,
  Loader,
} from "react-feather";
import { customSMSelectStyles, listAPI, pageSizeTable } from "../../types";
import { store } from "../../store/InvestorStore";
import { useObserver } from "mobx-react";
import { Moment } from "../../../../utility/general/Moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ToastTypes, {
  SuccessProgressToast,
} from "../../../../views/extensions/toastify/ToastTypes";
import { toast } from "react-toastify";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Pagination,
  PaginationProps,
  Menu,
  Form,
  DatePicker,
  Input,
} from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { Vietnamese } from "flatpickr/dist/l10n/vn";
import { selectThemeColors } from "../../../../utility/Utils";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";
import { appStore } from "../../../../stores/appStore";

const ListSuperAccount = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const [valueLoad, setValueLoad] = useState(false);

    const superAccountColumn: ColumnsType<any> = [
      {
        title: "STT",
        key: "STT",
        //   dataindex: "id",
        render: (v, s, index) =>
          index +
          1 +
          (store.pageIndexListSuperAccount - 1) *
            store.pageSizeListSuperAccount,
        width: 50,
        align: "center",
      },
      {
        title: "Mã khách hàng",
        dataIndex: "Customerid",
        key: "Customerid",
        align: "left",
        width: 200,
      },
      {
        title: "Chi nhánh",
        dataIndex: "BranchName",
        key: "BranchName",
        align: "left",
        width: 200,
      },
      {
        title: "Tình trạng",
        render: function (value: any) {
          if (value.Status == 0) {
            return "Không kích hoạt";
          } else {
            return "Kích họat";
          }
        },
        align: "left",
        width: 200,
      },
      {
        title: "Action",
        fixed: "right",
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
                    <Menu.Item
                      key="four"
                      icon={<Activity size={14} />}
                      onClick={() => changeStatus(value)}
                    >
                      {t("X_Trade_Button_Change_Status")}
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </Fragment>
            </>
          );
        },
        width: 80,
        align: "center",
      },
    ];
    const { show } = useContextMenu({
      id: "menu_left",
    });
    const { t } = useTranslation();
    //   const { register, errors, handleSubmit } = useForm();
    //   const SignupSchema = yup.object().shape({
    //     CustomerID: yup.string(),
    //   });
    const { register, getValues, errors, handleSubmit, control } = useForm();
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal);
    const [valueUpdate, setValueUpdate] = useState([]);
    const popupUpdate = (valueInternalAccount: any) => {
      setValueUpdate(valueInternalAccount);
      store.onShowModalUpdate(true);
    };
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const popupConfirmDel = (value: any) => {
      MySwal.fire({
        html: "Bạn có muốn xóa tài khoản " + value.Customerid + "?",
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
            CustomerId: value.Customerid,
            BranchId: value.BranchID,
            UpdatedBy: appStore.account.LoginName,
          };
          store.onDelteSuperAccount(paramDel);
        }
      });
    };
    const changeStatus = (value: any) => {
      MySwal.fire({
        html: "Bạn có muốn đổi trạng thái tài khoản " + value.Customerid + "?",
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
          const paramChange = {
            CustomerId: value.Customerid,
            BranchId: value.BranchID,
            Status: value.Status == 0 ? 1 : 0,
            UserId: appStore.account.LoginName,
          };
          store.onChangeStatusSuperAccount(paramChange);
        }
      });
    };

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserId: appStore.account.LoginName,
        CustomerId:
          valueForm.CustomerID == undefined ? "" : valueForm.CustomerID.trim(),
        BranchId:
          valueForm.Branch == undefined || valueForm.Branch.BRANCHID == -1
            ? ""
            : valueForm.Branch.BRANCHID,
        PageIndex: store.pageIndexListSuperAccount,
        PageSize: store.pageSizeListSuperAccount,
      };
      store.getListSuperAccount(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (store.pageIndexListSuperAccount == 1) {
        onSubmit();
      } else {
        store.pageIndexListSuperAccount = 1;
      }
    };
    const PopupAddNew = (accTitle: any, accBank: any) => {
      store.onShowModalAddNew(true);
    };

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndexListSuperAccount == 1) {
        onSubmit();
      } else {
        store.pageIndexListSuperAccount = 1;
      }
    };
    const defaultValue = {
      CustomerID: "",
      Branch: store.dataListBranchOrderSlip[0],
    };

    useEffect(() => {
      store.dataListSuperAccount=[];
      store.totalRowsListSuperAccount=0;
      const param = {
        BranchId: "",
        // UserId: appStore.account.LoginName,
        Active: 1,
        // IsLike: 1,
        PageNumber: 1,
        PageSize: 9999,
      };
      store.getListBranch(param);
    }, []);
    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [store.pageIndexListSuperAccount, store.pageSizeListSuperAccount]);

    useEffect(() => {
      store.custIDValid = true;
    }, [store.isShowPopup, store.isShowPopupModalUpdate])

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Super_Account_Title")}</h4>
            <Button
              htmlType="button"
              className="btn btn-gradient-info"
              color="gradient-info"
              onClick={() => PopupAddNew("", "")}
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
              <Row id="filterSection" className="filterSection">
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Customer_Id")} name="CustomerID">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Customer_Id")}
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 6) {
                          form.setFieldsValue({CustomerID: object.target.value.slice(0, 6)})
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Branch_Name")} name="Branch">
                    {store.dataListBranchOrderSlip.length > 0 ? (
                      <Select
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        defaultValue={store.dataListBranchOrderSlip[0]}
                        options={store.dataListBranchOrderSlip}
                        getOptionLabel={(option) => option.BRANCHNAME}
                        getOptionValue={(option) => option.BRANCHID}
                        isClearable={false}
                        styles={customSMSelectStyles}
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
            <Row>
              <Col sm="24" md="24">
                  <Table
                    columns={superAccountColumn}
                    dataSource={store.dataListSuperAccount}
                    size="small"
                    scroll={{ x: 800, y: 800 }}
                    loading={store.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange: store.handlePerRowsChangeSuperAccount,
                      pageSizeOptions: pageSizeTable,
                      total: store.totalRowsListSuperAccount,
                      showTotal: showTotal,
                      onChange: store.handlePageChangeSuperAccountt,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent: store.pageIndexListSuperAccount,
                      locale: { items_per_page: "/ trang" },
                      current: store.pageIndexListSuperAccount,
                    }}
                  />
              </Col>
            </Row>
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
                  <h4>{t("X_Trade_Super_Account_Add_Upd_Title")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormAddNew />
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
                  <h4>{t("X_Trade_Super_Account_Add_Upd_Title")}</h4>
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

export default ListSuperAccount;
