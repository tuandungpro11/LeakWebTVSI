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
import { Delete, Edit, Info, List, RefreshCcw, Save, Trash, UserCheck, UserX } from "react-feather";
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

const EditForm = (userInfo: any) =>
  useObserver(() => {
    // ANTD FORM
    const userDetail = userInfo.userSelected;
    const location = userInfo.location;
    const [isBack, setIsBack] = useState(false)
    const [form] = Form.useForm();
    const [formAttribute] = Form.useForm();
    const [resetCusForm] = Form.useForm();
    const { t } = useTranslation();
    useEffect(() => {
      if (userDetail) {
        crmStore.getLeadInfo(userDetail.id);
      }
    }, [])

    useEffect(() => {
      if (!crmStore.loadingData && crmStore.detailLead && crmStore.listLeadSourceParam) {
        form.setFieldsValue({
          Name: crmStore.detailLead?.LeadName,
          Phone: crmStore.detailLead?.Mobile,
          ProfileType: customerProfileParam[customerProfileParam.findIndex(item => item.value === crmStore.detailLead?.ProfileType)],
          LeadSourceID: crmStore.listLeadSourceParam[crmStore.listLeadSourceParam.findIndex(item => item.LeadSourceID === crmStore.detailLead?.LeadSourceID)],
          Email: crmStore.detailLead?.Email,
          Address: crmStore.detailLead?.Address
        })
      }
    }, [crmStore.detailLead, crmStore.listLeadSourceParam])

    useEffect(() => {
      crmStore.getListLeadSourceParam(appStore.account.LoginName);
      const paramAttribute = {
        UserName: appStore.account.LoginName
      }
      crmStore.getListAttribute(paramAttribute);
    }, [])

    const resetForm = () => {
      crmStore.successCreate = true;
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
        LeadName: valueInfo.Name.trim(),
        Mobile: valueInfo.Phone.trim(),
        Email: valueInfo.Email?.trim(),
        Address: valueInfo.Address?.trim(),
        ProfileType: valueInfo.ProfileType.value,
        BranchID: 0,
        AssignUser: appStore.account.LoginName,
        Description: "",
        LeadSourceID: valueInfo.LeadSourceID.LeadSourceID,
        Attributes: arrayAttribute,
        LeadID: crmStore.detailLead?.LeadID,
        Status: crmStore.detailLead?.Status
      }

      crmStore.editPotentialCustomer(paramCreate);
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
    var arrMath = [];
    const attMatch = () => {
      crmStore.detailLead.LeadAttribute.forEach((item) => {
        const matched = crmStore.listAttribute.filter((itemCate) => itemCate.Category === item.Value);
        if (matched && matched.length > 0) {
          arrMath.unshift(matched[0]);
        }
      })
      console.log('arrMath ', arrMath);
    }

    const filterAttribute = (att: any) => {
      if (crmStore.detailLead && crmStore.detailLead.LeadAttribute) {
        let attFilterIndexCate = [];
        let countCate = crmStore.detailLead.LeadAttribute.filter((itemCate) => itemCate.AttributeId === att.CategoryType);
        if (countCate.length > 0) {
          const cateReturn = att.ExtendValue.filter((item) => item.Value === countCate[0].Category)
          formAttribute.setFieldsValue({
            [att.CategoryType]: cateReturn[0]
          })
          return cateReturn.length > 0 ? cateReturn[0] : null
        } else {
          return null;
        }
      }
    }

    useEffect(() => {
      crmStore.successCreate = false;
    }, [])

    return (
      <Fragment>
        {
          (crmStore.successCreate) && <Redirect to="/crm/potential-customer" />
        }

        <UILoader blocking={crmStore.loadingCreate} loader={<Spinner />}>
          <Card>
            <CardHeader className="custom-card-header">
              <h4>{t("Sửa thông tin khách hàng tiềm năng")}</h4>
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
                        { required: true, message: 'Không được để trống' },
                        { whitespace: true, message: 'Không được để trống' },
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
                        { required: true, message: 'Không được để trống' },
                        { whitespace: true, message: 'Không được để trống' },
                      ]}>
                      <Input
                        placeholder={t("Phone")}
                        autoComplete="off"
                      />
                    </Form.Item>
                  </Col>
                  <Col lg="12" md="12">
                    <Form.Item label={t("Loại hình")} name="ProfileType"
                      rules={[
                        { required: true, message: 'Chưa chọn loại hình' },
                      ]}>
                      <Select
                        theme={selectThemeColors}
                        className="react-select react-select-lg"
                        classNamePrefix="select"
                        options={customerProfileParam}
                        isClearable={false}
                        noOptionsMessage={() => "Không có dữ liệu...."}
                        styles={customSMSelectStyles}
                        placeholder={"Chọn loại hình..."}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg="12" md="12">
                    <Form.Item label={t("Nguồn khai thác")} name="LeadSourceID"
                      rules={[
                        { required: true, message: 'Chưa chọn nguồn khai thác' },
                      ]}>
                      <Select
                        theme={selectThemeColors}
                        className="react-select react-select-lg"
                        classNamePrefix="select"
                        options={crmStore.listLeadSourceParam}
                        isClearable={false}
                        noOptionsMessage={() => "Không có dữ liệu...."}
                        getOptionLabel={(option) => option.SourceName}
                        getOptionValue={(option) => option.LeadSourceID}
                        styles={customSMSelectStyles}
                        placeholder={"Chọn nguồn khai thác..."}

                      />
                    </Form.Item>
                  </Col>
                  <Col lg="12" md="12">
                    <Form.Item label={t("Email")}
                      name="Email"
                      rules={[
                        { type: 'email', message: 'Không đúng định dạng Email' }
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

                                  defaultValue={filterAttribute(att)}
                                  isClearable={false}
                                  noOptionsMessage={() => "Không có dữ liệu...."}
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
                  <Col lg="24" md="24" className="text-center mt-1 mb-1">
                    <Button
                      htmlType="submit"
                      className="btn btn-gradient-info"
                      color="gradient-info"
                    >
                      <Save size={14} /> {t("X_Trade_Button_Add")}
                    </Button>{" "}
                    <Button
                      htmlType="button"
                      className="btn btn-gradient-secondary"
                      color="gradient-secondary"
                      onClick={resetForm}
                    >
                      <RetweetOutlined /> {t("X_Trade_Button_Back")}
                    </Button>{" "}
                  </Col>
                </Row>
              </Form>
            </CardBody>

          </Card>
        </UILoader>
      </Fragment >
    );
  });

export default EditForm;
