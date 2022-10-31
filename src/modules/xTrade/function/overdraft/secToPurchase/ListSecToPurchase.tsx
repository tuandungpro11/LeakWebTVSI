import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
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
import { Moment } from "../../../../../utility/general/Moment";
import { store } from "../../../store/FunctionStore";
import { customSMSelectStyles, pageSizeTable } from "../../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import Select from "react-select";
import { selectThemeColors } from "../../../../../utility/Utils";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";
import { PaginationProps, Menu, Form, Input, DatePicker } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useContextMenu } from "react-contexify";
import { Delete, Edit, List } from "react-feather";
import moment from "moment";
import locale from "antd/es/date-picker/locale/vi_VN";

const ListSecToPurChase = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const { t } = useTranslation();
    const [valueDate, setvalueDate] = useState(new Date());
    const [valueLoad, setValueLoad] = useState(false);
    const listOrderSlipColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (store.pageIndexListSecToPurchase - 1) *
            store.pageSizeListSecToPurchase,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã CK",
        dataIndex: "Symbol",
        key: "Symbol",
        align: "left",
        width: 100,
      },
      {
        title: "Trạng thái",
        dataIndex: "STATUS_TEXT",
        key: "STATUS_TEXT",
        align: "left",
        width: 120,
      },
      {
        title: "Ngày hiệu lực",
        render: function (value: any) {
          return Moment.formatDateNew(value.EffectDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 110,
      },
      {
        title: "Ngày hết hiệu lực",
        render: function (value: any) {
          return Moment.formatDateNew(value.ExpireDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 110,
      },
      {
        title: "Ngày tạo",
        render: function (value: any) {
          return Moment.formatDateNew(value.CreateDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 110,
      },
      {
        title: "Người tạo",
        dataIndex: "CreateBy",
        key: "CreateBy",
        align: "left",
        width: 100,
      },
      {
        title: "Ngày hiệu chỉnh",
        render: function (value: any) {
          return Moment.formatDateNew(value.ModifiedDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 110,
      },
      {
        title: "Người hiệu chỉnh",
        dataIndex: "ModifiedBy",
        key: "ModifiedBy",
        align: "left",
        width: 100,
      },
      {
        title: "Ghi chú",
        dataIndex: "Remark",
        key: "Remark",
        align: "left",
        width: 130,
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
        width: 70,
        align: "center",
        fixed: "right",
      },
    ];
    const { show } = useContextMenu({
      id: "menu_left",
    });
    const [loading, setLoading] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        Id: -1,
        Symbol: valueForm.Symbol == undefined ? "" : valueForm.Symbol.trim(),
        Status:
          valueForm.cbxStatus == undefined ? -1 : valueForm.cbxStatus.value,
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
        PageIndex: store.pageIndexListSecToPurchase,
        PageSize: store.pageSizeListSecToPurchase,
      };

      store.getListSecToPurChase(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if ((store.pageIndexListSecToPurchase = 1)) {
        onSubmit();
      } else {
        store.pageIndexListSecToPurchase = 1;
      }
    };
    const popupConfirmDel = (value: any) => {
      MySwal.fire({
        html: "Bạn có muốn xóa mã chứng khoán " + value.Symbol + "?",
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
          store.DeleteSecToPurchase(value.ID, value.Symbol);
        }
      });
    };
    const getListStatus = () => {
      var param = {
        Category: "OVERDRAFT_STOCK",
        Group: "STATUS",
        Code: "",
      };
      store.getListStatusSecToPurchase(param);
    };

    const PopupAddNew = () => {
      store.onShowModalAddNew(true);
    };

    const popupUpdate = (valueBank: any) => {
      setValueUpdate(valueBank);
      console.log("valueUpdate: ", valueBank);
      store.onShowModalUpdate(true);
    };

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndexListSecToPurchase != 1) {
        store.pageIndexListSecToPurchase = 1;
      } else {
        onSubmit();
      }
    };
    const defaultValue = {
      Id: -1,
      Symbol: "",
      Status: store.dataListStatusSecToPurchase[0],
      txtDate: [
        moment(
          new Date(new Date().setDate(new Date().getDate() - 7)),
          "DD-MM-yyyy"
        ),
        moment(new Date()),
      ],
    };

    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [store.pageIndexListSecToPurchase, store.pageSizeListSecToPurchase]);
    useEffect(() => {
      store.dataListSecToPurchase =[];
      store.totalRowsListSecToPurchase=0;
      getListStatus();
    }, []);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_ListSecBuy")}</h4>
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
                  <Form.Item label={t("X_Trade_Sec_Code")} name="Symbol">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Sec_Code")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Status")} name="cbxStatus">
                    {store.dataListStatusSecToPurchase.length > 0 ? (
                      <Select
                        options={store.dataListStatusSecToPurchase}
                        defaultValue={store.dataListStatusSecToPurchase[0]}
                        isClearable={false}
                        theme={selectThemeColors}
                        className="react-select react-select-sm"
                        classNamePrefix="select"
                        getOptionLabel={(option) => option.Name}
                        getOptionValue={(option) => option.Value}
                        styles={customSMSelectStyles}
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
              <Row>
                <Col sm="24" md="24">
                  <Table
                    columns={listOrderSlipColumn}
                    dataSource={store.dataListSecToPurchase}
                    size="small"
                    scroll={{ x: 800, y: 800 }}
                    loading={store.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange:
                        store.handlePerRowsChangeListSecToPurchase,
                      pageSizeOptions: pageSizeTable,
                      total: store.totalRowsListSecToPurchase,
                      showTotal: showTotal,
                      onChange: store.handlePageChangeListSecToPurchase,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent: store.pageIndexListSecToPurchase,
                      locale: { items_per_page: "/ trang" },
                      current: store.pageIndexListSecToPurchase,
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
                  <h4>{t("X_Trade_Sec_Code_Add_New_Form")}</h4>
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
                  <h4>{t("X_Trade_Sec_Code_Update_Form")}</h4>
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

export default ListSecToPurChase;
