import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
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
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Moment } from "../../../../utility/general/Moment";
import { numberUtil } from "../../../../utility/general/NumberUtil";
import { storeSystemManagement } from "../../store/SystemManagementStore";
import { listAPI, pageSizeTable } from "../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";
import {
  DatePicker,
  Dropdown,
  Form,
  Input,
  Menu,
  PaginationProps,
  Space,
  Upload,
} from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { Item, useContextMenu } from "react-contexify";
import { store } from "../../store/InvestorStore";
import {
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,
} from "@ant-design/icons";

const ListSecPlaceOrder = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueLoad, setValueLoad] = useState(false);
    const listPriceColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (storeSystemManagement.pageIndexListPricePlaceOrder - 1) *
            storeSystemManagement.pageSizeListPricePlaceOrder,
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
        title: "Giá sàn",
        render: function (value: any) {
          return value.FloorPrice;
        },
        align: "right",
        width: 100,
      },
      {
        title: "Giá trần",
        render: function (value: any) {
          return value.CeilingPrice;
        },
        align: "right",
        width: 100,
      },
      {
        title: "Giá tham chiếu",
        render: function (value: any) {
          return value.RefPrice;
        },
        align: "right",
        width: 100,
      },
      {
        title: "Sàn GD",
        dataIndex: "Market",
        key: "Market",
        align: "left",
        width: 100,
      },
      {
        title: "Ngày hiệu chỉnh",
        render: function (value: any) {
          return Moment.formatDateNew(value.ModifiedDate, "DD/MM/yyyy");
        },
        align: "center",
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
        fixed: "right",
        align: "center",
      },
    ];
    const { show } = useContextMenu({
      id: "menu_left",
    });
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);
    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        Symbol:
          valueForm.Symbol == undefined
            ? ""
            : valueForm.Symbol.trim().toUpperCase(),
        LangId: 1,
        pageIndex: storeSystemManagement.pageIndexListPricePlaceOrder,
        PageSize: storeSystemManagement.pageSizeListPricePlaceOrder,
      };

      storeSystemManagement.getListPricePlaceOrder(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (storeSystemManagement.pageIndexListPricePlaceOrder == 1) {
        onSubmit();
      } else {
        storeSystemManagement.pageIndexListPricePlaceOrder = 1;
      }
    };
    const resetForm = () => {
      form.resetFields();
      if (storeSystemManagement.pageIndexListPricePlaceOrder == 1) {
        onSubmit();
      } else {
        storeSystemManagement.pageIndexListPricePlaceOrder = 1;
      }
    };
    const defaultValue = {
      Symbol: "",
      LangId: 1,
    };
    const popupConfirmDel = (value: any) => {
      MySwal.fire({
        html: "Bạn có muốn xóa mã " + value.Symbol + "?",
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
          storeSystemManagement.deleteSymboPriceToPurchase(value.Symbol);
        }
      });
    };

    const PopupAddNew = () => {
      storeSystemManagement.onShowModalAddNew(true);
    };

    const popupUpdate = (valuePricePurchase: any) => {
      setValueUpdate(valuePricePurchase);
      storeSystemManagement.onShowModalUpdate(true);
    };
    const exportNextPrice = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        Symbol:
          valueForm.Symbol == undefined
            ? ""
            : valueForm.Symbol.trim().toUpperCase(),
        LangId: 1,
      };
      store.ExportListUI(
        listAPI.ExportPricePlaceOrder,
        param,
        "DANH_SACH_GIA_TRUOC_NGAY"
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
      storeSystemManagement.pageIndexListPricePlaceOrder,
      storeSystemManagement.pageSizeListPricePlaceOrder,
    ]);

    useEffect(() => {
      storeSystemManagement.dataListPricePlaceOrder = [];
      // storeSystemManagement.totalRowsListPricePlaceOrder = 0;
    }, []);

    const [fileList, setFileList] = useState([]);

    const uploadProps = {
      beforeUpload: (file) => {
        setFileList([...fileList, file]);
        return false;
      },
      fileList,
    };

    useEffect(() => {
      if (fileList.length > 0) {
        const formData = new FormData();

        // Update the formData object
        formData.append("formFile", fileList[0], fileList[0].name);
        console.log('formDatasso', formData);

        store.ImportData(listAPI.ImportNextPriceList, formData);

        setFileList([]);
      }
    }, [fileList]);

    const downloadTemplate = () => {
      store.ExportListUI(
        listAPI.DownloadTemplateImportNextPrice,
        null,
        "DANH_SACH_GIA_TRUOC_NGAY_TEMPLATE"
      );
    };

    const menu = (
      <Menu className="dropdown-import">
        <Menu.Item>
          <Upload {...uploadProps} className="upload-no-filename">
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
            <h4>{t("X_Trade_Price_Place_Order")}</h4>
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
                      onClick={exportNextPrice}
                    >
                      {t("X_Trade_Button_Export")}
                    </Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        <Space>
                          Import
                          <DownOutlined />
                        </Space>
                      </Button>
                    </Dropdown>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col sm="24" md="24">
                <Table
                  columns={listPriceColumn}
                  dataSource={storeSystemManagement.dataListPricePlaceOrder}
                  size="small"
                  scroll={{ x: 800 }}
                  loading={storeSystemManagement.loadingData}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange:
                      storeSystemManagement.handlePerRowsChangeListPriceToPurchase,
                    pageSizeOptions: pageSizeTable,
                    total: storeSystemManagement.totalRowsListPricePlaceOrder,
                    showTotal: showTotal,
                    onChange:
                      storeSystemManagement.handlePageChangeListPriceToPurchase,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent:
                      storeSystemManagement.pageIndexListPricePlaceOrder,
                    locale: { items_per_page: "/ trang" },
                  }}
                />
              </Col>
            </Row>
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
                  <h4>{t("X_Trade_Add_New_Price_Place_Order")}</h4>
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
