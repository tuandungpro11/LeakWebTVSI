import { useObserver } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import { Fragment } from "react";
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
import { Moment } from "../../../../../utility/general/Moment";
import { store } from "../../../store/FunctionStore";
import { pageSizeTable } from "../../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import { Input, PaginationProps, Menu, Form, DatePicker } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { Delete, Edit, List } from "react-feather";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";

const HisListSecToPurChase = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const { t } = useTranslation();
    const [valueDate, setvalueDate] = useState(new Date());
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueLoad, setValueLoad] = useState(false);
    const listOrderSlipColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (store.pageIndexHisListSecToPurchase - 1) *
            store.pageSizeHisListSecToPurchasee,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã CK",
        dataIndex: "Symbol",
        key: "Symbol",
        align: "left",
        width: 80,
      },
      {
        title: "Trạng thái",
        dataIndex: "Status",
        key: "Status",
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
    ];
    const [loading, setLoading] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);

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
        PageIndex: store.pageIndexHisListSecToPurchase,
        PageSize: store.pageSizeHisListSecToPurchasee,
      };

      store.getListHisSecToPurChase(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (store.pageIndexHisListSecToPurchase == 1) {
        onSubmit();
      } else {
        store.pageIndexHisListSecToPurchase = 1;
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
          const paramDel = {
            Id: value.ID,
          };
          store.DeleteSecToPurchase(paramDel, value.Symbol);
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

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndexHisListSecToPurchase != 1) {
        store.pageIndexHisListSecToPurchase = 1;
      } else {
        onSubmit();
      }
    };

    const defaultValue = {
      Id: -1,
      Symbol: "",
      txtDate: [
        moment(
          new Date(new Date().setMonth(new Date().getMonth() - 3)),
          "DD-MM-yyyy"
        ),
        moment(new Date()),
      ],
    };

    useEffect(()=>{
      store.dataHisListSecToPurchase=[];
      store.totalRowsHisListSecToPurchase=0;
    },[])
    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [
      store.pageIndexHisListSecToPurchase,
      store.pageSizeHisListSecToPurchasee,
    ]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Sec_Code_His")}</h4>
            {/* <Button
              htmlType="button"
              className="btn btn-gradient-info"
              color="gradient-info"
              onClick={() => PopupAddNew()}
            >
              {t("X_Trade_Button_Add_New")}
            </Button> */}
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
                      className="btn btn-gradient-info"
                      color="gradient-info"
                      htmlType="submit"
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
                      dataSource={store.dataHisListSecToPurchase}
                      size="small"
                      scroll={{ x: 800, y: 800 }}
                      loading={store.loadingData}
                      pagination={{
                        showSizeChanger: true,
                        onShowSizeChange:
                          store.handlePerRowsChangeHisListSecToPurchase,
                        pageSizeOptions: pageSizeTable,
                        total: store.totalRowsHisListSecToPurchase,
                        showTotal: showTotal,
                        onChange: store.handlePageChangeLisHistSecToPurchase,
                        className: "mt-1 text-right custom-ant-pagination",
                        defaultCurrent: store.pageIndexHisListSecToPurchase,
                        locale: { items_per_page: "/ trang" },
                        current: store.pageIndexHisListSecToPurchase,
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
                  {t("X_Trade_Sec_Code_Add_New_Form")}
                </Label>
              </ModalHeader>
              <ModalBody>{/* <FormAddNew /> */}</ModalBody>
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
                  {t("X_Trade_Order_Slip_Update_Form")}
                </Label>
              </ModalHeader>
              <ModalBody>
                {/* <FormUpdate valueUpdate={valueUpdate} /> */}
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
        </Card>
      </Fragment>
    );
  });

export default HisListSecToPurChase;
