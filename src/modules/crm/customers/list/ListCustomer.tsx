import React, { Fragment, useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useTranslation } from "react-i18next";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@customStyle/xtrade.scss";
import { Delete, Edit, Info, List, RefreshCcw, Trash, UserCheck, UserX } from "react-feather";
import { useObserver } from "mobx-react";
import { Moment } from "../../../../utility/general/Moment";
import withReactContent from "sweetalert2-react-content";
import {
  Customer,
  customerProfile,
  customSMSelectStyles,
  pageSizeTable,
  PotentialCustomer,
} from "../../types";
import Swal from "sweetalert2";
import { Checkbox, DatePicker, Form, Input, PaginationProps, Radio, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { selectThemeColors } from "../../../../utility/Utils";
import { Dropdown, Menu, Pagination } from "antd";
import styled from "@emotion/styled";
import "moment/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { customerStatus } from "../../types";
import { crmStore } from "../../store/store";
import { appStore } from "../../../../stores/appStore";
import { Link } from "react-router-dom";
import {
  RetweetOutlined,
  SearchOutlined,
  PlusOutlined
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

const ListCustomer = () =>
  useObserver(() => {
    // ANTD FORM
    const [form] = Form.useForm();
    const [formDelete] = Form.useForm();
    const [resetCusForm] = Form.useForm();

    const [valueLoad, setValueLoad] = useState(false);
    //END ANTD FORM
    const customerAccountColumn: ColumnsType<any> = [
      {
        title: "STT",
        key: "STT",
        render: (v, s, index) =>
          index +
          1 +
          (crmStore.pageIndexCustomerPotential - 1) * crmStore.pageSizeCustomerPotential,
        width: 50,
        align: "center",
      },
      {
        title: "M?? kh??ch h??ng",
        key: "Custcode",
        dataIndex: "Custcode",
        align: "left",
      },
      {
        title: "T??n kh??ch h??ng",
        key: "FullName",
        dataIndex: "FullName",
        align: "left",
      },
      {
        title: "S??? ??i???n tho???i",
        key: "Mobile",
        align: "left",
        render: (v) => (
          <>
            <label>{v.Phone01}</label>
            <label>{v.Phone02}</label>
          </>
        )
      },
      {
        title: "Email",
        key: "Email",
        dataIndex: "Email",
        align: "left",
      },
      {
        title: "Lo???i t??i kho???n",
        key: "CustomerTypeName",
        align: "center",
        dataIndex: "CustomerTypeName",
      },
      {
        title: "Ng??y sinh",
        key: "Birthday",
        align: "center",
        dataIndex: "Birthday"
      },
      {
        title: "Tr???ng th??i",
        key: "StatusName",
        align: "right",
        render: (v) => {
          return <span style={{ color: `${v.StatusColor}` }}>{v.StatusName}</span>
        }
      },
      {
        title: "Action",
        render: (v, record, index) => (
          <Fragment key={index}>
            <Tooltip placement="left" title={"Chi ti???t"}>
              <Button.Ripple
                className="btn-icon"
                color="flat-info"
                id="positionLeftActive"
                // onClick={() => detailCustomer(v)}
                size="sm"
              >
                <Link
                  to={`/crm/customer/detail/${v.Custcode}`}
                  className="user-name text-truncate mb-0"
                ><Info size={18} /></Link>
              </Button.Ripple>

            </Tooltip>
            {/* {
              v.Status === 1 && (
                <Menu
                  mode="horizontal"
                  defaultSelectedKeys={["SubMenu"]}
                  className="menu-corg"
                >
                  <Menu.SubMenu key="SubMenu" icon={<List size={18} />}>
                    <Menu.Item
                      key="two"
                      icon={<Edit size={14} />}
                    >
                      <Link
                        to={{ pathname: `/crm/customers/edit/${v.Custcode}`, state: { from: 'list' } }}
                        className="user-name text-truncate mb-0 text-gray-dark"
                      >S???a</Link>
                    </Menu.Item>
                    <Menu.Item
                      key="one"
                      icon={<Trash size={14} />}
                      onClick={() => deleteCustomer(v)}
                    >
                      X??a
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              )
            } */}
          </Fragment>
        ),
        width: 100,
        fixed: "right",
        align: "center",
      },
    ];
    const [valueDate, setValueDate] = useState(new Date());
    const { t } = useTranslation();
    const MySwal = withReactContent(Swal);
    const [accountEditInfo, setAccountEditInfo] = useState({});
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `T???ng ${total} b???n ghi`;

    const getListCustomerAccount = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        Custcode: valueForm.Custcode ? valueForm.Custcode.trim() : "",
        FullName: valueForm.Name ? valueForm.Name.trim() : "",
        Phone: valueForm.Phone ? valueForm.Phone.trim() : "",
        Email: valueForm.Email ? valueForm.Email.trim() : "",
        Status: valueForm.Status.value !== null ? valueForm.Status.value : valueForm.Status,
        CustomerType: valueForm.CustomerType.value !== null ? valueForm.CustomerType.value : valueForm.CustomerType,
        PageIndex: crmStore.pageIndexCustomer,
        PageSize: crmStore.pageSizeCustomer,
      };
      crmStore.customerListParam = param;
      // crmStore.getListCustomer(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    useEffect(() => {
      getListCustomerAccount();
    }, [
      crmStore.pageSizeCustomer,
      crmStore.pageIndexCustomer,
    ]);

    useEffect(() => {
      if (crmStore.customerListParam) {
        crmStore.getListCustomer(crmStore.customerListParam);
      }
    }, [crmStore.customerListParam])

    const resetForm = () => {
      form.resetFields();
      getListCustomerAccount();
    };

    const editCustomer = (item: Customer) => {

    }

    const deleteCustomer = (item: Customer) => {
      formDelete.setFieldsValue({ reason: "" })
      MySwal.fire({
        html: (
          <>
            <label htmlFor="" className="mb-1" style={{ fontSize: '1rem' }}>L?? do</label>
            <Form form={formDelete}>
              <Form.Item name="reason">
                <TextArea rows={2} placeholder={"Nh???p l?? do"} />
              </Form.Item>

            </Form>
          </>
        ),
        customClass: {
          confirmButton: "btn btn-gradient-success mr-1",
          cancelButton: "btn btn-gradient-secondary",
        },
        showClass: {
          popup: "animate__animated animate__flipInX",
        },
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: "?????ng ??",
        cancelButtonText: "H???y",
      }).then((result) => {
        if (result.isConfirmed) {
          const param = {
            UserName: appStore.account.LoginName,
            Custcode: item.Custcode,
            Reason: formDelete.getFieldsValue().reason,
          };
          crmStore.DeletePotentialAccount(param);
        }
      });
    }

    const detailCustomer = (item: Customer) => {

    }

    const onClickButtonSearch = () => {
      if (crmStore.pageIndexCustomer == 1) {
        getListCustomerAccount();
      } else {
        crmStore.pageSizeCustomer = 1;
      }
    };

    const defaultValue = {
      CustomerType: customerProfile[0],
      Status: customerStatus[0],
      CustomerName: "",
      Phone: "",
      Email: "",
    };

    useEffect(() => {
      crmStore.successCreate = false;
    }, [])

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("Qu???n l?? kh??ch h??ng")}</h4>
            {/* <Button
              htmlType="button"
              className="btn btn-gradient-info"
              color="gradient-info"
            >
              <Link
                to={`/crm/-customer/create`}
                className="user-name text-truncate mb-0 text-white"
              ><PlusOutlined /> {t("X_Trade_Button_Add_New")}
              </Link>
            </Button> */}
          </CardHeader>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onClickButtonSearch}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Row id="filterSection" className="filterSection">
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Customer_Id")} name="Custcode">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Customer_Id")}
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Customer_Name")} name="Name">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Customer_Name")}
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("Phone")} name="Phone">
                    <Input
                      size="small"
                      placeholder={t("Phone")}
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("Email")} name="Email">
                    <Input
                      size="small"
                      placeholder={t("Email")}
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("Lo???i t??i kho???n")} name="CustomerType">
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      options={customerProfile}
                      defaultValue={customerProfile[0]}
                      isClearable={false}
                      noOptionsMessage={() => "Kh??ng c?? d??? li???u...."}
                      styles={customSMSelectStyles}
                      placeholder={"Ch???n t??i kho???n..."}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("Account_Status")} name="Status">
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      options={customerStatus}
                      defaultValue={customerStatus[0]}
                      isClearable={false}
                      styles={customSMSelectStyles}
                      noOptionsMessage={() => "Kh??ng c?? d??? li???u...."}
                    />
                  </Form.Item>
                </Col>
                <Col lg="24" md="24" className="text-center mt-1 mb-1">
                  <Form.Item className="button-group">
                    <Button
                      htmlType="submit"
                      className="btn btn-gradient-info"
                      color="gradient-info"
                    >
                      <SearchOutlined /> {t("X_Trade_Button_Search")}
                    </Button>{" "}
                    <Button
                      htmlType="button"
                      className="btn btn-gradient-secondary"
                      color="gradient-secondary"
                      onClick={resetForm}
                    >
                      <RetweetOutlined /> {t("X_Trade_Button_Reset")}
                    </Button>{" "}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col sm="24" md="24">
                <Table
                  columns={customerAccountColumn}
                  dataSource={crmStore.listCustomer}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={crmStore.loadingData}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange:
                      crmStore.handlePerRowsChangeCustomer,
                    pageSizeOptions: pageSizeTable,
                    total: crmStore.totalCustomerAccRows,
                    showTotal: showTotal,
                    onChange: crmStore.handlePageChangeCustomer,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: crmStore.pageIndexCustomer,
                    locale: { items_per_page: "/ trang" },
                  }}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default ListCustomer;
