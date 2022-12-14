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
  customerProfileParam,
  customSMSelectStyles,
  pageSizeTable,
  PotentialCustomer,
} from "../../types";
import Swal from "sweetalert2";
import { Checkbox, DatePicker, Form, Input, PaginationProps, Radio, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { selectThemeColors } from "../../../../utility/Utils";
import { Dropdown, Menu, Pagination } from "antd";
import { crmStore } from "../../store/store";
import { appStore } from "../../../../stores/appStore";
import { Link, Redirect } from "react-router-dom";
import {
  RetweetOutlined,
  SearchOutlined,
  PlusOutlined
} from "@ant-design/icons";
import UILoader from "@components/ui-loader";

import Spinner from "@components/spinner/Loading-spinner";

const CreateForm = () =>
  useObserver(() => {
    // ANTD FORM
    const [form] = Form.useForm();
    const [formAttribute] = Form.useForm();
    const [resetCusForm] = Form.useForm();
    const { t } = useTranslation();

    useEffect(() => {
      crmStore.getListLeadSource(appStore.account.LoginName, false);
      const paramAttribute = {
        UserName: appStore.account.LoginName
      }
      crmStore.getListAttribute(paramAttribute);
    }, [])

    const resetForm = () => {
      form.resetFields();
    };

    const onClickButtonSearch = () => {
      crmStore.loadingCreate = true;
      console.log(form.getFieldsValue());
      const valueAtt = formAttribute.getFieldsValue();
      const valueInfo = form.getFieldsValue();
      const arrayAttribute = [];
      const tifOptions = Object.keys(valueAtt).map(key => {
        if (valueAtt[key]) {
          arrayAttribute.unshift({ "Category": valueAtt[key].Value })
        }
      }
      )
      const paramCreate = {
        UserName: appStore.account.LoginName,
        Name: valueInfo.Name.trim(),
        Phone: valueInfo.Phone.trim(),
        Email: valueInfo.Email?.trim(),
        Address: valueInfo.Address?.trim(),
        ProfileType: valueInfo.ProfileType.value,
        BranchID: 0,
        AssignUser: appStore.account.LoginName,
        Description: "",
        LeadSourceID: valueInfo.LeadSourceID.LeadSourceID,
        Attributes: arrayAttribute
      }

      crmStore.createPotentialCustomer(paramCreate);
    };

    useEffect(() => {
      if (crmStore.successCreate) {

      }
    }, [crmStore.successCreate])

    const defaultValue = {
      LeadSourceID: null,
      ProfileType: null,
      CustomerName: "",
      Phone: "",
      Email: "",
      Address: "",
    };

    return (
      <Fragment>
        {
          crmStore.successCreate && <Redirect to="/crm/potential-customer" />
        }

        <UILoader blocking={crmStore.loadingCreate} loader={<Spinner />}>
          <Card>
            <CardHeader className="custom-card-header">
              <h4>{t("Th??m m???i kh??ch h??ng ti???m n??ng")}</h4>
            </CardHeader>
            <CardBody>
              <Form
                form={form}
                onFinish={onClickButtonSearch}
                initialValues={defaultValue}
                requiredMark={false}
                labelAlign={"left"}
                autoComplete="off"
                colon={false}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                className="mt-2 mb-2 ant-form-lg"
              >
                <Row id="filterSection" className="filterSection">
                  <Col lg="12" md="12">
                    <Form.Item label={t("X_Trade_Customer_Name")}
                      name="Name"
                      rules={[
                        { required: true, message: 'Kh??ng ???????c ????? tr???ng' },
                        { whitespace: true, message: 'Kh??ng ???????c ????? tr???ng' },
                      ]}>
                      <Input
                        placeholder={t("X_Trade_Customer_Name")}
                        autoComplete="off"
                      />
                    </Form.Item>
                  </Col>
                  <Col lg="12" md="12">
                    <Form.Item label={t("Phone")} name="Phone"
                      rules={[
                        { required: true, message: 'Kh??ng ???????c ????? tr???ng' },
                        { whitespace: true, message: 'Kh??ng ???????c ????? tr???ng' },
                      ]}>
                      <Input
                        placeholder={t("Phone")}
                        autoComplete="off"
                      />
                    </Form.Item>
                  </Col>
                  <Col lg="12" md="12">
                    <Form.Item label={t("Lo???i h??nh")} name="ProfileType"
                      rules={[
                        { required: true, message: 'Ch??a ch???n lo???i h??nh' },
                      ]}>
                      <Select
                        theme={selectThemeColors}
                        className="react-select react-select-lg"
                        classNamePrefix="select"
                        options={customerProfileParam}
                        isClearable={false}
                        noOptionsMessage={() => "Kh??ng c?? d??? li???u...."}
                        styles={customSMSelectStyles}
                        placeholder={"Ch???n lo???i h??nh..."}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg="12" md="12">
                    <Form.Item label={t("Ngu???n khai th??c")} name="LeadSourceID"
                      rules={[
                        { required: true, message: 'Ch??a ch???n ngu???n khai th??c' },
                      ]}>
                      <Select
                        theme={selectThemeColors}
                        className="react-select react-select-lg"
                        classNamePrefix="select"
                        options={crmStore.listLeadSource}
                        isClearable={false}
                        noOptionsMessage={() => "Kh??ng c?? d??? li???u...."}
                        getOptionLabel={(option) => option.SourceName}
                        getOptionValue={(option) => option.LeadSourceID}
                        styles={customSMSelectStyles}
                        placeholder={"Ch???n ngu???n khai th??c..."}

                      />
                    </Form.Item>
                  </Col>
                  <Col lg="12" md="12">
                    <Form.Item label={t("Email")}
                      name="Email"
                      rules={[
                        { type: 'email', message: 'Kh??ng ????ng ?????nh d???ng Email' }
                      ]}>
                      <Input
                        placeholder={t("Email")}
                        autoComplete="off"
                      />
                    </Form.Item>
                  </Col>
                  <Col lg="12" md="12">
                    <Form.Item label={t("authorization_list_branch_address")}
                      name="Address">
                      <Input
                        placeholder={t("authorization_list_branch_address")}
                        autoComplete="off"
                      />
                    </Form.Item>
                  </Col>
                  <Col lg="24" md="24">
                    <Form
                      form={formAttribute}
                      requiredMark={false}
                      labelAlign={"left"}
                      autoComplete="off"
                      colon={false}
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 18 }}
                      className="ant-form-lg"
                    >
                      <Row>
                        {
                          crmStore.listAttribute && crmStore.listAttribute.length > 0 && crmStore.listAttribute.map((att) => (
                            <Col lg="12" md="12">
                              <Form.Item label={`${att.ExtendName}`} name={`${att.CategoryType}`}>
                                <Select
                                  theme={selectThemeColors}
                                  className="react-select react-select-lg"
                                  classNamePrefix="select"
                                  options={att.ExtendValue}
                                  isClearable={false}
                                  noOptionsMessage={() => "Kh??ng c?? d??? li???u...."}
                                  getOptionLabel={(option) => option.Name}
                                  getOptionValue={(option) => option.Value}
                                  styles={customSMSelectStyles}
                                  placeholder={`${att.ExtendValue[0].Name}`}

                                />
                              </Form.Item>
                            </Col>
                          ))
                        }
                      </Row>
                    </Form>
                  </Col>
                  {/* <Col lg="24" md="24" className="text-center mt-1 mb-1">
                    
                  </Col> */}
                </Row>
              </Form>
              <Form
                form={form}
                onFinish={onClickButtonSearch}
                initialValues={defaultValue}
                requiredMark={false}
                labelAlign={"left"}
                autoComplete="off"
                colon={false}
                className="mt-2 mb-2 ant-form-lg">
                <Form.Item className="button-group text-center">
                  <Button
                    htmlType="submit"
                    className="btn btn-gradient-info"
                    color="gradient-info"
                  >
                    <PlusOutlined /> {t("X_Trade_Button_Add")}
                  </Button>{" "}
                  <Button
                    htmlType="button"
                    className="btn btn-gradient-secondary"
                    color="gradient-secondary"
                    onClick={resetForm}
                  >
                    <Link
                      to={`/crm/potential-customer`}
                      className="user-name text-truncate mb-0 text-white"
                    ><RetweetOutlined /> {t("Quay l???i")}
                    </Link>
                    {/* <RetweetOutlined /> {t("X_Trade_Button_Reset")} */}
                  </Button>{" "}
                </Form.Item>
              </Form>
            </CardBody>

          </Card>
        </UILoader>
      </Fragment >
    );
  });

export default CreateForm;
