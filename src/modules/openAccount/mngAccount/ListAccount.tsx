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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { customSMSelectStyles, pageSizeTable } from "../types";
import { Moment } from "../../../utility/general/Moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import PerfectScrollbar from "react-perfect-scrollbar";
import { PaginationProps, Menu, Form, DatePicker, Input } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import { Calendar, PhoneForwarded, Plus, File, List } from "react-feather";
import form from "antd/lib/form";
import FormUpdate from "./FormUpdate";
import { mngAccountStore } from "../store/mngAccountStore";
import locale from "antd/es/date-picker/locale/vi_VN";
import { selectThemeColors } from "../../../utility/Utils";
import Select from "react-select";
import { appStore } from "../../../stores/appStore";

const ListHistory = () =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const [valueLoad, setValueLoad] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const listHistoryCallTableColumn: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (mngAccountStore.pageIndexListAccount - 1) *
            mngAccountStore.pageSizeListAccount,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "ID",
        dataIndex: "Id",
        key: "Id",
        width: 150,
        fixed: "left",
      },
      {
        title: "Ngày tạo",
        dataIndex: "CreateDate",
        key: "CreateDate",
        width: 150,
      },
      {
        title: "Mã KH",
        dataIndex: "Custcode",
        key: "Custcode",
        width: 150,
      },
      {
        title: "Họ và tên",
        dataIndex:"FullName",
        key:"FullName",
        width: 150,
      },
      {
        title: "Loại hồ sơ",
        render: function (value: any) {
          return "Tài khoản mở mới";
        },
        width: 150,
      },
      {
        title: "Loại hình TK",
        render: function (value: any) {
          return "Tài khoản mở mới";
        },
        width: 150,
      },
      {
        title: "Trạng thái TK",
        dataIndex: "AccountStatusName",
        key: "AccountStatusName",
        width: 150,
      },
      {
        title: "Trạng thái hồ sơ",
        dataIndex: "ProfileStatusName",
        key: "ProfileStatusName",
        width: 150,
      },
      {
        title: "Mô tả",
        render: function (value: any) {
          return "HĐ thường";
        },
        width: 150,
      },
      // {
      //   title: "Trạng thái SBA",
      //   dataIndex: "CreatedName",
      //   key: "CreatedName",
      //   width: 150,
      // },
      // {
      //   title: "Trạng thái Inno",
      //   dataIndex: "CreatedName",
      //   key: "CreatedName",
      //   width: 150,
      // },
      // {
      //   title: "Trạng thái TKNH",
      //   dataIndex: "CreatedName",
      //   key: "CreatedName",
      //   width: 150,
      // },
      // {
      //   title: "Trạng thái CT nội bộ",
      //   dataIndex: "CreatedName",
      //   key: "CreatedName",
      //   width: 150,
      // },
      // {
      //   title: "Trạng thái kênh trđổi TTĐL",
      //   dataIndex: "CreatedName",
      //   key: "CreatedName",
      //   width: 150,
      // },
      {
        title: "Người tạo",
        dataIndex: "CreateBy",
        key: "CreateBy",
        width: 150,
      },
      {
        title: "Hành động",
        render: (value, r, index) => {
          return (
            <>
              <Fragment>
                <Menu
                  mode="horizontal"
                  defaultSelectedKeys={["SubMenu"]}
                  className="menu-corg"
                >
                  <Menu.SubMenu key="SubMenu" icon={<List size={18} />}>
                    <Menu.Item key="two" icon={<Plus size={14} />}>
                      {t("X_Trade_Button_Add_New")}
                    </Menu.Item>
                    <Menu.Item key="updatebtn" icon={<File size={14}/>} onClick={() => openFormUpdate(value)}>
                      {t("X_Trade_Button_Update")}
                    </Menu.Item>
                    <Menu.Item key="Export_PDF" icon={<File size={14} />}>
                      {t("Export_PDF")}
                    </Menu.Item>
                    <Menu.Item key="confirmHS" icon={<File size={14} />}>
                      Bản tổng hợp kiểm tra và xác nhận hồ sơ KH
                    </Menu.Item>
                    <Menu.Item key="DKDV" icon={<File size={14} />}>
                      PYC mở tài khoản và đăng ký sử dụng dịch vụ
                    </Menu.Item>
                    <Menu.Item key="M05" icon={<File size={14} />}>
                      Phiếu đăng ký trả đổi thông tin đặt lệnh (Mẫu 05)
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </Fragment>
            </>
          );
        },
        width: 100,
        align: "center",
        fixed: "right",
      },
    ];
    const defaultValue = {
      Passport: "",
      txtDate: "",
      cbxStatus: "",
      cbxStatusContract: "",
    };
    const getListAccount = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        CardId: valueForm.Passport,
        FromDate: valueForm.txtDate ? valueForm.txtDate[0]._d:"",
        ToDate: valueForm.txtDate ? valueForm.txtDate[1]._d:"",
        AccountStatus: valueForm.cbxStatus.value,
        DocStatus: valueForm.cbxStatusContract.value,
        PageIndex: mngAccountStore.pageIndexListAccount,
        PageSize: mngAccountStore.pageSizeListAccount,
      };
      mngAccountStore.getListAccount(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (mngAccountStore.pageIndexListAccount == 1) {
        getListAccount();
      } else {
        mngAccountStore.pageIndexListAccount = 1;
      }
    };
    const resetForm = () => {
      form.resetFields();
    };
    const openFormUpdate = (value:any) =>{
      setValueUpdate(value);
      mngAccountStore.onShowModalUpdate(true);
    }

    useEffect(() => {
      mngAccountStore.dataListAccount = [];
      mngAccountStore.totalRowListAccount = 0;
      mngAccountStore.pageSizeListAccount = 10;
    }, []);
    useEffect(() => {
      if (valueLoad) {
        getListAccount();
      }
    }, [mngAccountStore.pageIndexListAccount, mngAccountStore.pageSizeListAccount]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("Open_Account_Personal_Foreign_Title")}</h4>
          </CardHeader>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              initialValues={defaultValue}
              onFinish={onClickButtonSearch}
              colon={false}
            >
              <Row id="filterSection" className="filterSection">
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Trading_Code_Input")}
                    name="tradingcode"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("Trading_Code_Input")}
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 6) {
                          form.setFieldsValue({
                            CustomerID: object.target.value.slice(0, 6),
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Passport_input")}
                    name="Passport"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Input
                      size="small"
                      placeholder={t("Passport_input")}
                      autoComplete="Off"
                      type="number"
                      //   onChange={(object) => {
                      //     if (object.target.value.length > 6) {
                      //       form.setFieldsValue({
                      //         CustomerID: object.target.value.slice(0, 6),
                      //       });
                      //     }
                      //   }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
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
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Status_Account")}
                    name="cbxStatus"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      // options={SaleTypeOption}
                      // defaultValue={SaleTypeOption[0]}
                      isClearable={false}
                      styles={customSMSelectStyles}
                      placeholder={t("Status_Account")}
                      noOptionsMessage={() => "Không có dữ liệu...."}
                    />
                  </Form.Item>
                </Col>
                <Col lg="8" md="8">
                  <Form.Item
                    label={t("Status_Contract")}
                    name="cbxStatusContract"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    labelAlign="left"
                    colon={false}
                  >
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      // options={SaleTypeOption}
                      // defaultValue={SaleTypeOption[0]}
                      isClearable={false}
                      styles={customSMSelectStyles}
                      placeholder={t("Status_Contract")}
                      noOptionsMessage={() => "Không có dữ liệu...."}
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
                  columns={listHistoryCallTableColumn}
                  dataSource={mngAccountStore.dataListAccount}
                  size="small"
                  scroll={{ x: 800, y: 1200 }}
                  loading={mngAccountStore.loadingData}
                  rowKey="Id"
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange:
                      mngAccountStore.handlePerRowsChangeListAccount,
                    pageSizeOptions: pageSizeTable,
                    total: mngAccountStore.totalRowListAccount,
                    showTotal: showTotal,
                    onChange: mngAccountStore.handlePageChangeListAccount,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: mngAccountStore.pageIndexListAccount,
                    current: mngAccountStore.pageIndexListAccount,
                    locale: { items_per_page: "/ trang" },
                  }}
                />
              </Col>
            </Row>
          </CardBody>
          <PerfectScrollbar style={{ maxHeight: "80vh", maxWidth: "90vh" }}>
            <Modal
              isOpen={mngAccountStore.isShowPopup}
              toggle={() =>
                (mngAccountStore.isShowPopup = !mngAccountStore.isShowPopup)
              }
              className="modal-fullscreen modal-dialog-centered"
              backdrop={"static"}
              fullscreen
            >
              <ModalHeader
                toggle={() =>
                  (mngAccountStore.isShowPopup = !mngAccountStore.isShowPopup)
                }
              >
                <Label for="basicInput">
                  {t("X_Trade_Title_Internal_Account_Add")}
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormUpdate prop={valueUpdate}/>
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
        </Card>
      </Fragment>
    );
  });

export default ListHistory;
