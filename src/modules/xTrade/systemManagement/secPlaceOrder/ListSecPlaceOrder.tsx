import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Moment } from "../../../../utility/general/Moment";
import { storeSystemManagement } from "../../store/SystemManagementStore";
import { listAPI, pageSizeTable } from "../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";
import { DatePicker, Dropdown, Form, Input, Menu, PaginationProps, Space, Upload, UploadProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useContextMenu } from "react-contexify";
import { List, Edit, Delete } from "react-feather";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../views/extensions/toastify/ToastTypes";
import { store } from "../../store/InvestorStore";
import {
  UploadOutlined,
  DownloadOutlined,
  DownOutlined
} from "@ant-design/icons"
import { UploadFile } from "antd/lib/upload/interface";

const ListSecPlaceOrder = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const { t } = useTranslation();
    const [valueLoad, setValueLoad] = useState(false);
    storeSystemManagement.totalRowsListSecPlaceOrder = 0;
    const listInternalAccountColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (storeSystemManagement.pageIndexListSecPlaceOrder - 1) *
          storeSystemManagement.pageSizeListSecPlaceOrder,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã CK",
        dataIndex: "StockSymbol",
        key: "StockSymbol",
        fixed: "left",
        width: 100,
      },
      {
        title: "Thị trường",
        dataIndex: "Market",
        key: "Market",
        width: 100,
      },
      {
        title: "Ngày hiệu lực",
        width: 110,
        render: function (value: any) {
          return Moment.formatDateNew(value.Date, "DD/MM/yyyy");
        },
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
        width: 80,
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
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        Symbol: valueForm.Symbol == undefined ? "" : valueForm.Symbol.trim(),
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
        LangId: 1,
        PageIndex: storeSystemManagement.pageIndexListSecPlaceOrder,
        PageSize: storeSystemManagement.pageSizeListSecPlaceOrder,
      };

      storeSystemManagement.getListSecPlaceOrder(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const delByDate = () => {
      const valueForm = form.getFieldsValue();
      if (valueForm.txtDate == null) {
        toast(ErrorToast("bạn chưa chọn ngày"));
        return;
      }
      if (valueForm.txtDate != null && valueForm.txtDate[0] === null) {
        toast(ErrorToast("bạn chưa chọn xóa Từ ngày"));
        return;
      }
      if (valueForm.txtDate != null && valueForm.txtDate[1] === null) {
        toast(ErrorToast("bạn chưa chọn xóa Đến ngày"));
        return;
      }
      MySwal.fire({
        html:
          "Bạn có muốn xóa mã  từ ngày" +
          Moment.formatDateNew(valueForm.txtDate[0], "yyyyMMDD") +
          " đến ngày " +
          Moment.formatDateNew(valueForm.txtDate[1], "yyyyMMDD") +
          "?",
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
            Symbol: "",
            FromDate: Moment.formatDateNew(valueForm.txtDate[0], "yyyyMMDD"),
            ToDate: Moment.formatDateNew(valueForm.txtDate[1], "yyyyMMDD"),
          };
          storeSystemManagement.onDeleteSymbolByStockCode(paramDel);
        }
      });
    };
    const onClickButtonSearch = () => {
      if (storeSystemManagement.pageIndexListSecPlaceOrder == 1) {
        onSubmit();
      } else {
        storeSystemManagement.pageIndexListSecPlaceOrder = 1;
      }
    };
    const resetForm = () => {
      form.resetFields();
      if (storeSystemManagement.pageIndexListSecPlaceOrder == 1) {
        onSubmit();
      } else {
        storeSystemManagement.pageIndexListSecPlaceOrder = 1;
      }
    };
    const defaultValue = {
      Symbol: "",
      LangId: 1,
      txtDate: [
        moment(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          "DD-MM-yyyy"
        ),
        moment(new Date()),
      ],
    };
    const popupConfirmDel = (value: any) => {
      const valueForm = form.getFieldsValue();
      MySwal.fire({
        html: "Bạn có muốn xóa mã " + value.StockSymbol + "?",
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
            Symbol: value.StockSymbol,
            FromDate: value.Date,
            ToDate: value.Date,
          };
          storeSystemManagement.onDeleteSymbolByStockCode(paramDel);
        }
      });
    };

    const PopupAddNew = () => {
      storeSystemManagement.onShowModalAddNew(true);
    };

    const popupUpdate = (valueInternalAccount: any) => {
      setValueUpdate(valueInternalAccount);
      storeSystemManagement.onShowModalUpdate(true);
    };
    const exportExceptionStock = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        Symbol: valueForm.Symbol == undefined ? "" : valueForm.Symbol.trim(),
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
        LangId: 1,
      };
      store.ExportListUI(
        listAPI.ExportExceptionStock,
        param,
        "DANH_SACH_MA_CHUNG_KHOAN_LOAI_TRU_DAT_LENH_TRUOC_NGAY"
      );
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [
      storeSystemManagement.pageIndexListSecPlaceOrder,
      storeSystemManagement.pageSizeListSecPlaceOrder,
    ]);
    useEffect(() => {
      storeSystemManagement.dataListSecPlaceOrder = [];
      storeSystemManagement.totalRowsListSecPlaceOrder = 0;
    }, []);

    // const uploadProps: UploadProps = {
    //   name: 'file',
    //   action: '',
    //   headers: {
    //     authorization: 'authorization-text',
    //   },
    //   onChange(info: any) {
    //     debugger;
    //   },
    // };
    const [fileList, setFileList] = useState([]);

    const uploadProps = {
      beforeUpload: (file) => {
        setFileList([...fileList, file]);
        return false;
      },
      fileList,
    };

    useEffect(() => {
      if(fileList.length > 0) {
        const formData = new FormData();
    
        // Update the formData object
        formData.append(
          "formFile",
          fileList[0],
          fileList[0].name
        );

        store.ImportData (
          listAPI.ImportExceptionStock,
          formData
        );

        setFileList([]);
      }
    }, [fileList])

    const downloadTemplate = () => {
      store.ExportListUI(
        listAPI.DownloadTemplateImportExceptionStock,
        null,
        "DANH_SACH_MA_CHUNG_KHOAN_LOAI_TRU_DAT_LENH_TRUOC_NGAY_TEMPLATE"
      );
    }

    const menu = (
      <Menu className="dropdown-import">
        <Menu.Item>
          <Upload 
          action=""
          fileList={fileList}
          beforeUpload={(file) => {
            setFileList([...fileList, file]);
            return false;
          }}
          className="upload-no-filename">
            <Space>
              <UploadOutlined />
              {t("X_Trade_Button_Import")}
            </Space>
          </Upload>
        </Menu.Item>
        <Menu.Item onClick={downloadTemplate}>
          <Space>
            <DownloadOutlined />
            {t("X_Trade_Template_Download")}
          </Space>
        </Menu.Item>
      </Menu>
    );

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Sec_Place_Order_Title")}</h4>
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
                      type="text"
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
                      htmlType="submit"
                      className="btn btn-gradient-info mr-h1"
                      color="gradient-info"
                    >
                      {t("X_Trade_Button_Search")}
                    </Button>
                    <Button
                      htmlType="button"
                      className="btn btn-gradient-primary mr-h1"
                      color="gradient-primary"
                      onClick={delByDate}
                    >
                      {t("X_Trade_Del_By_Date_Button")}
                    </Button>
                    <Button
                      htmlType="button"
                      className="btn btn-gradient-secondary mr-h1"
                      color="gradient-secondary"
                      onClick={resetForm}
                    >
                      {t("X_Trade_Button_Reset")}
                    </Button>
                    <Button
                      htmlType="button"
                      className="btn btn-gradient-success mr-h1"
                      color="gradient-success"
                      onClick={exportExceptionStock}
                    >
                      {t("X_Trade_Button_Export")}
                    </Button>
                    <Dropdown overlay={menu}>
                      <Button htmlType="button">
                        <Space>
                          Import
                          <DownOutlined />
                        </Space>
                      </Button>
                    </Dropdown>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col sm="24" md="24">
                  <Table
                    columns={listInternalAccountColumn}
                    dataSource={storeSystemManagement.dataListSecPlaceOrder}
                    size="small"
                    scroll={{ x: 800, y: 800 }}
                    loading={storeSystemManagement.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange:
                        storeSystemManagement.handlePerRowsChangeListSecToPurchase,
                      pageSizeOptions: pageSizeTable,
                      total: storeSystemManagement.totalRowsListSecPlaceOrder,
                      showTotal: showTotal,
                      onChange:
                        storeSystemManagement.handlePageChangeListSecToPurchase,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent:
                        storeSystemManagement.pageIndexListSecPlaceOrder,
                      locale: { items_per_page: "/ trang" },
                      current: storeSystemManagement.pageIndexListSecPlaceOrder,
                    }}
                  />
                </Col>
              </Row>
            </Form>
          </CardBody>
          <PerfectScrollbar>
            <Modal
              isOpen={storeSystemManagement.isShowPopup}
              toggle={() =>
              (storeSystemManagement.isShowPopup =
                !storeSystemManagement.isShowPopup)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                (storeSystemManagement.isShowPopup =
                  !storeSystemManagement.isShowPopup)
                }
              >
                <Label for="basicInput">
                  <h4>{t("X_Trade_Sec_Place_Order_Add_New_Form")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormAddNew />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          <PerfectScrollbar>
            <Modal
              isOpen={storeSystemManagement.isShowPopupModalUpdate}
              toggle={() =>
              (storeSystemManagement.isShowPopupModalUpdate =
                !storeSystemManagement.isShowPopupModalUpdate)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                (storeSystemManagement.isShowPopupModalUpdate =
                  !storeSystemManagement.isShowPopupModalUpdate)
                }
              >
                <Label for="basicInput">
                  <h4>{t("X_Trade_Sec_Place_Order_Update_Form")}</h4>
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

export default ListSecPlaceOrder;
