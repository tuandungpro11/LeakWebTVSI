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

const ListPotentialCustomer = () =>
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
        title: "Mã khách hàng",
        key: "LeadID",
        dataIndex: "LeadID",
        align: "left",
      },
      {
        title: "Tên khách hàng",
        key: "LeadName",
        dataIndex: "LeadName",
        align: "left",
      },
      {
        title: "Số điện thoại",
        key: "Mobile",
        dataIndex: "Mobile",
        align: "left",
      },
      {
        title: "Email",
        key: "Email",
        dataIndex: "Email",
        align: "left",
      },
      {
        title: "Nguồn khai thác",
        key: "CELLPHONE",
        align: "left",
        render: (v) => {
          return GetResouceText(v);
        }
      },
      {
        title: "Loại hình",
        key: "ProfileName",
        align: "center",
        dataIndex: "ProfileName",
      },
      {
        title: "Ngày tạo",
        key: "CreatedDate",
        align: "center",
        render: (v) => {
          return Moment.formatDateNew(v.CreatedDate, "HH:mm - DD/MM/yyyy")
        }
      },
      {
        title: "Trạng thái",
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
            <Tooltip placement="left" title={"Chi tiết"}>
              <Button.Ripple
                className="btn-icon"
                color="flat-info"
                id="positionLeftActive"
                // onClick={() => detailCustomer(v)}
                size="sm"
              >
                <Link
                  to={`/crm/potential-customer/detail/${v.LeadID}`}
                  className="user-name text-truncate mb-0"
                ><Info size={18} /></Link>
              </Button.Ripple>

            </Tooltip>
            {
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
                        to={{ pathname: `/crm/potential-customer/edit/${v.LeadID}`, state: { from: 'list' } }}
                        className="user-name text-truncate mb-0 text-gray-dark"
                      >Sửa</Link>
                    </Menu.Item>
                    <Menu.Item
                      key="one"
                      icon={<Trash size={14} />}
                      onClick={() => deleteCustomer(v)}
                    >
                      Xóa
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              )
            }
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
      `Tổng ${total} bản ghi`;

    const getListCustomerAccount = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        UserRole: "CRM_SALE",
        Status: valueForm.Status.value !== null ? valueForm.Status.value : valueForm.Status,
        LeadSourceID: (valueForm.LeadSourceID && valueForm.LeadSourceID.LeadSourceID)
          ? valueForm.LeadSourceID.LeadSourceID
          : 0,
        ProfileType: valueForm.ProfileType.value !== null ? valueForm.ProfileType.value : valueForm.ProfileType,
        Name: valueForm.Name ? valueForm.Name.trim() : "",
        Phone: valueForm.Phone ? valueForm.Phone.trim() : "",
        Email: valueForm.Email ? valueForm.Email.trim() : "",
        PageIndex: crmStore.pageIndexCustomerPotential,
        PageSize: crmStore.pageSizeCustomerPotential,
      };
      crmStore.getListCustomerPotential(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    useEffect(() => {
      if (crmStore.listLeadSource && crmStore.listLeadSource.length > 0) {
        getListCustomerAccount();
      }
    }, [
      crmStore.pageSizeCustomerPotential,
      crmStore.pageIndexCustomerPotential,
    ]);

    useEffect(() => {
      if (crmStore.customerPotentialListParam) {
        crmStore.getListCustomerPotential(crmStore.customerPotentialListParam);
      }
    }, [crmStore.customerPotentialListParam])

    const resetForm = () => {
      form.resetFields();
      getListCustomerAccount();
    };

    const editCustomer = (item: PotentialCustomer) => {

    }

    const deleteCustomer = (item: PotentialCustomer) => {
      formDelete.setFieldsValue({reason: ""})
      MySwal.fire({
        html: (
          <>
            <label htmlFor="" className="mb-1" style={{ fontSize: '1rem' }}>Lý do</label>
            <Form form={formDelete}>
              <Form.Item name="reason">
                <TextArea rows={2} placeholder={"Nhập lí do"} />
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
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          const param = {
            UserName: appStore.account.LoginName,
            LeadID: item.LeadID,
            Reason: formDelete.getFieldsValue().reason,
          };
          crmStore.DeletePotentialAccount(param);
        }
      });
    }

    const detailCustomer = (item: PotentialCustomer) => {

    }

    const onClickButtonSearch = () => {
      if (crmStore.pageIndexCustomerPotential == 1) {
        getListCustomerAccount();
      } else {
        crmStore.pageSizeCustomerPotential = 1;
      }
    };

    const defaultValue = {
      LeadSourceID: crmStore.listLeadSource[0],
      ProfileType: customerProfile[0],
      Status: customerStatus[0],
      CustomerName: "",
      Phone: "",
      Email: "",
    };

    useEffect(() => {
      if (crmStore.listLeadSource) {
        form.setFieldsValue({ LeadSourceID: crmStore.listLeadSource[0] });
      }
    }, [crmStore.listLeadSource])

    useEffect(() => {
      crmStore.getListLeadSource(appStore.account.LoginName);
    }, [])

    const GetResouceText = (item: PotentialCustomer) => {
      if (crmStore.listLeadSource && crmStore.listLeadSource.length > 0) {
        const itemFilter = crmStore.listLeadSource.find(res => res.LeadSourceID === item.LeadSourceId);

        return itemFilter.SourceName
      }
    }

    useEffect(() => {
      crmStore.successCreate = false;
    }, [])

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("Quản lý khách hàng tiềm năng")}</h4>
            <Button
              htmlType="button"
              className="btn btn-gradient-info"
              color="gradient-info"
            >
              <Link
                to={`/crm/potential-customer/create`}
                className="user-name text-truncate mb-0 text-white"
              ><PlusOutlined /> {t("X_Trade_Button_Add_New")}
              </Link>
            </Button>
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
                  <Form.Item label={t("Nguồn khai thác")} name="LeadSourceID">
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      options={crmStore.listLeadSource}
                      defaultValue={crmStore.listLeadSource[0]}
                      isClearable={false}
                      noOptionsMessage={() => "Không có dữ liệu...."}
                      getOptionLabel={(option) => option.SourceName}
                      getOptionValue={(option) => option.LeadSourceID}
                      styles={customSMSelectStyles}
                      placeholder={"Chọn nguồn khai thác..."}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("Loại hình")} name="ProfileType">
                    <Select
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      options={customerProfile}
                      defaultValue={customerProfile[0]}
                      isClearable={false}
                      noOptionsMessage={() => "Không có dữ liệu...."}
                      styles={customSMSelectStyles}
                      placeholder={"Chọn loại hình..."}
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
                      noOptionsMessage={() => "Không có dữ liệu...."}
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
                  dataSource={crmStore.listCustomerAccount}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={crmStore.loadingData}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange:
                      crmStore.handlePerRowsChangeCustomerPotential,
                    pageSizeOptions: pageSizeTable,
                    total: crmStore.totalCustomerAccRows,
                    showTotal: showTotal,
                    onChange: crmStore.handlePageChangeCustomerPotential,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: crmStore.pageIndexCustomerPotential,
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

export default ListPotentialCustomer;
