import React, { Fragment, useState, useContext, useEffect } from "react";
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
  CardHeader,
  Label,
} from "reactstrap";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@customStyle/xtrade.scss";
import { Item, useContextMenu } from "react-contexify";

// import bankAccountColumn from "../../types"
import { Delete, Edit, List } from "react-feather";
import { customSMSelectStyles, listAPI, pageSizeTable } from "../../types";
import { store } from "../../store/InvestorStore";
import { useObserver } from "mobx-react";
import { Moment } from "../../../../utility/general/Moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import PerfectScrollbar from "react-perfect-scrollbar";
import FormUpdate from "./FormUpdate";
import { PaginationProps, Menu, Form, DatePicker, Input } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { Vietnamese } from "flatpickr/dist/l10n/vn";
import { selectThemeColors } from "../../../../utility/Utils";
import FormAddNew from "./FormAddNew";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { appStore } from "../../../../stores/appStore";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";

const WhiteList = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const [valueLoad, setValueLoad] = useState(false);

    const bankAccountColumn: ColumnsType<any> = [
      {
        title: "STT",
        key: "STT",
        //   dataindex: "id",
        render: (v, s, index) =>
          index +
          1 +
          (store.pageIndexListWhiteList - 1) * store.pageSizeListWhiteList,
        width: 50,
        align: "center",
      },
      {
        title: "Mã đại lý",
        dataIndex: "AgentId",
        key: "AgentId",
        align: "left",
        width: 80,
      },
      {
        title: "Loại đại lý",
        dataIndex: "AgentType_Text",
        key: "AgentType_Text",
        align: "left",
        width: 100,
      },
      {
        title: "Số tài khoản",
        dataIndex: "AccountNo",
        key: "AccountNo",
        align: "left",
        width: 100,
      },
      {
        title: "Ngày tạo",
        render: (v, s, index) => {
          return Moment.formatDateNew(v.CreateDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 150,
      },
      {
        title: "Người tạo",
        dataIndex: "CreateBy",
        key: "CreateBy",
        align: "left",
        width: 150,
      },
      {
        title: "Ngày sửa",
        render: (v, s, index) => {
          return Moment.formatDateNew(v.ModifiedDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 150,
      },
      {
        title: "Người sửa",
        dataIndex: "ModifiedBy",
        key: "ModifiedBy",
        align: "left",
        width: 150,
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
    const [valueDate, setValueDate] = useState();
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
        html: "Bạn có muốn xóa tài khoản " + value.CUSTOMERNAME + "?",
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
            CustomerId: value.CUSTOMERID,
            Status: 3,
            Reason: "",
            UpdatedBy: appStore.account.LoginName,
          };
          store.deleteBankAccount(value.CUSTOMERID, value.CUSTOMERNAME);
        }
      });
    };

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      if(valueForm.CustAcc 
        && valueForm.CustAcc.trim() != "" 
        && valueForm.CustAcc.trim().length != 7){
        toast.error(ErrorToast("Hãy điền số tài khoản 7 số"));
        return;
      }
      const param = {
        UserId: appStore.account.LoginName,
        AccountNo: valueForm.CustAcc == undefined?"":valueForm.CustAcc.trim(),
        AgentId: valueForm.AgentId == undefined?"":valueForm.AgentId.trim(),
        AgentType:
          valueForm.AgentType == undefined ? 1 : valueForm.AgentType.Value.trim(),
        FromDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[0] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[0], "yyyyMMDD")
            : "",
        ToDate:
          valueForm.txtDate != null
            ? valueForm.txtDate[1] === null
              ? ""
              : Moment.formatDateNew(valueForm.txtDate[1], "yyyyMMDD")
            : "",
        PageIndex: store.pageIndexListWhiteList,
        PageSize: store.pageSizeListWhiteList,
      };
      store.getListWhiteList(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (store.pageIndexListWhiteList == 1) {
        onSubmit();
      } else {
        store.pageIndexListWhiteList = 1;
      }
    };
    const PopupAddNew = (accTitle: any, accBank: any) => {
      store.onShowModalAddNew(true);
    };

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndexListWhiteList == 1) {
        onSubmit();
      } else {
        store.pageIndexListWhiteList = 1;
      }
    };
    const defaultValue = {
      CustAcc: "",
      AgentId: "",
      AgentType: store.dataListAgenType[0],
      txtDate: [
        moment(
          new Date(new Date().setMonth(new Date().getMonth() - 3)),
          "DD-MM-yyyy"
        ),
        moment(new Date()),
      ],
    };
    const getListDealerType = () => {
      const param = {
        Category: "AGENT",
        Group: "AGENT_TYPE",
        Code: "",
      };
      store.getListAgentType(param);
    };

    useEffect(() => {
      store.dataListWhiteList=[];
      store.totalRowsListWhiteList=0;
      getListDealerType();
    }, []);
    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [store.pageIndexListWhiteList, store.pageSizeListWhiteList]);

    useEffect(() => {
      store.subCustIDValid = true;
      store.AccountNameByID = "";
    }, [store.isShowPopup, store.isShowPopupModalUpdate])

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_White_List_Title")}</h4>
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
                  <Form.Item label={t("X_Trade_Bank_Account")} name="CustAcc">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Bank_Account")}
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 7) {
                          form.setFieldsValue({CustAcc: object.target.value.slice(0, 7)})
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Dealer_Id")} name="AgentId">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Dealer_Id")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Dealer_Type")} name="AgentType">
                    {store.dataListAgenType.length > 0 ? (
                      <Select
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        defaultValue={store.dataListAgenType[0]}
                        options={store.dataListAgenType}
                        isClearable={false}
                        styles={customSMSelectStyles}
                        getOptionLabel={(option) => option.Name}
                        getOptionValue={(option) => option.Value}
                      />
                    ) : (
                      <></>
                    )}
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Date_Range")} name="txtDate">
                    <RangePicker
                      locale={locale}
                      allowEmpty={[true, true]}
                      format={"DD-MM-yyyy"}
                      size="small"
                      style={{ width: "100%" }}
                      className="ant-picker-small-custom"
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
            <Row>
              <Col sm="24" md="24">
                  <Table
                    columns={bankAccountColumn}
                    dataSource={store.dataListWhiteList}
                    size="small"
                    scroll={{ x: 800, y: 800 }}
                    loading={store.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange: store.handlePerRowsChangeWhiteList,
                      pageSizeOptions: pageSizeTable,
                      total: store.totalRowsListWhiteList,
                      showTotal: showTotal,
                      onChange: store.handlePageChangeWhiteList,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent: store.pageIndexListWhiteList,
                      locale: { items_per_page: "/ trang" },
                      current: store.pageIndexListWhiteList,
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
                  <h4>{t("X_Trade_White_List_Add_Title")}</h4>
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
                  <h4>{t("X_Trade_White_List_Upd_Title")}</h4>
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

export default WhiteList;
