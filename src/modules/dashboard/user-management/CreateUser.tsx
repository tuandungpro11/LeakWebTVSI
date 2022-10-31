import { Col, Form, Input, Row, TreeSelect } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import { userStore } from "../store/UserStore";
import Select from "react-select";
import { selectThemeColors } from "../../../utility/Utils";
import { customSMSelectStyles } from "../../xTrade/types";
import { Sex, userType } from "../types";
import Flatpickr from "react-flatpickr";
import { Vietnamese } from "flatpickr/dist/l10n/vn";
import { Moment } from "../../../utility/general/Moment";
import { treeLevelStore } from "../../authorization/store/treeLevelStore";

const CreateUser = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueDate, setValueDate] = useState(new Date());
    const [requiredPassword, setRequiredPassword] = useState(false);
    const onSubmit = () => {
      const formValue = form.getFieldsValue();
      const param = {
        "SysLevelId": formValue.SysLevelId,
        "UserDomain": formValue.UserDomain.trim(),
        "LoginName": formValue.LoginName.trim(),
        "Password": formValue.Password.trim(),
        "AuthType": formValue.AuthType.value,
        "DisplayName": formValue.DisplayName.trim(),
        "SaleId": formValue.SaleId ? formValue.SaleId.SaleID : "",
        "EmployeeCode": formValue.EmployeeCode.trim(),
        "PositionId": formValue.PositionId ? formValue.PositionId.PositionID : 0,
        "Sex": formValue.Sex.value,
        "Birthday": Moment.formatDateNew(formValue.Birthday[0], "yyyy-MM-DD"),
        "Address": formValue.Address.trim(),
        "Phone": formValue.Phone.trim(),
        "Email": formValue.Email.trim(),
        "Status": 0
      }
      userStore.CreateUser(param);
    }
    const ResetForm = () => {
      form.resetFields();
    }
    useEffect(() => {
      // userStore.GetSystemLevelInfo();
      treeLevelStore.GetSystemLevelList();
      userStore.GetSaleInfo();
      userStore.getListPosition();
    }, [])
    const valueDefault = {
      // SysLevelId: 143,
      UserDomain: "",
      Password: "",
      AuthType: userType[1],
      Sex: Sex[0]
    }
    return (
      <Fragment>
        <Form
          form={form}
          layout={'vertical'}
          onFinish={onSubmit}
          autoComplete="off"
          size="small"
          colon={false}
          initialValues={valueDefault}
          requiredMark={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("SysLevelId")}
                name="SysLevelId"
                rules={[
                  { required: true, message: 'SysLevelId chưa được chọn' }
                ]}>
                {/* <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={userStore.listSystemLevel}
                  isClearable={false}
                  styles={customSMSelectStyles}
                  placeholder={"Chọn SysLevelId..."}
                  noOptionsMessage={() => "Không có dữ liệu...."}
                  getOptionLabel={(option) => option.Name}
                  getOptionValue={(option) => option.SysLevelId}
                /> */}
                <TreeSelect
                  key="SysLevelID"
                  allowClear={false}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  treeData={treeLevelStore.dataListTreeLevel}
                  placeholder={t("authorize_level_parent")}
                  className="react-select react-select-sm"
                  treeDefaultExpandAll
                  fieldNames={{
                    label: "Code",
                    value: "SysLevelID",
                    children: "children",
                  }}
                  // onChange={onChange}
                />
              </Form.Item>
              <Form.Item
                label={t("User_Domain")}
                name="UserDomain"
                rules={[
                  { required: true, message: 'Tài khoản domain không được để trống' }
                ]}>
                <Input
                  placeholder={t("User_Domain")}
                  autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("Login_Name")}
                name="LoginName"
                rules={[
                  { required: true, message: 'Tên đăng nhập không được để trống' }
                ]}>
                <Input
                  placeholder={t("Login_Name")}
                  autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("Password")}
                name="Password"
                rules={[
                  { required: requiredPassword, message: 'Mật khẩu không được để trống' }
                ]}>
                <Input.Password
                  className="ant-input-affix-custom"
                  placeholder={t("Password")}
                  value={""}
                  autoComplete="new-password" 
                  disabled={!requiredPassword} />
              </Form.Item>
              <Form.Item
                label={t("Auth_Type")}
                name="AuthType"
                rules={[
                  { required: true, message: 'Loại xác thực chưa được chọn!' }
                ]}>
                <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={userType}
                  isClearable={false}
                  styles={customSMSelectStyles}
                  placeholder={"Chọn loại xác thực..."}
                  noOptionsMessage={() => "Không có dữ liệu...."}
                  onChange={(item) => {
                    if(item.value === "NORMAL") {
                      setRequiredPassword(true);
                    } else {
                      setRequiredPassword(false);
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                label={t("Display_Name")}
                name="DisplayName"
                rules={[
                  { required: true, message: 'Tên tài khoản không được để trống' }
                ]}>
                <Input
                  placeholder={t("Display_Name")}
                  autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("SaleId")}
                name="SaleId"
                rules={[
                  { required: true, message: 'SaleId không được để trống' }
                ]}>
                <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={userStore.listSaleInfo}
                  isClearable={false}
                  styles={customSMSelectStyles}
                  placeholder={"Chọn SaleId..."}
                  noOptionsMessage={() => "Không có dữ liệu...."}
                  getOptionLabel={(option) => option.SaleID + " - " + option.SaleName}
                  getOptionValue={(option) => option.SaleID}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Employee_Code")}
                name="EmployeeCode"
                rules={[
                  { required: true, message: 'Mã NV không được để trống' }
                ]}>
                <Input
                  placeholder={t("Employee_Code")}
                  autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("Position")}
                name="PositionId"
                rules={[
                  { required: true, message: 'Vị trí không được để trống' }
                ]}>
                <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={userStore.listPosition}
                  isClearable={false}
                  styles={customSMSelectStyles}
                  placeholder={t("Position")}
                  noOptionsMessage={() => "Không có dữ liệu...."}
                  getOptionLabel={(option) => option.PositionName}
                  getOptionValue={(option) => option.PositionID}
                />
              </Form.Item>
              <Form.Item
                label={t("Sex")}
                name="Sex"
                rules={[
                  { required: true, message: 'Giới tính chưa được chọn!' }
                ]}>
                <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={Sex}
                  isClearable={false}
                  styles={customSMSelectStyles}
                  placeholder={"Chọn giới tính..."}
                  noOptionsMessage={() => "Không có dữ liệu...."}
                />
              </Form.Item>
              <Form.Item
                label={t("Birthday")}
                name="Birthday"
                rules={[
                  { required: true, message: 'Ngày sinh không được để trống' }
                ]}>
                <Flatpickr
                  value={valueDate}
                  id="txtDatePick"
                  className="form-control form-control-sm"
                  options={{
                    defaultDate: valueDate,
                    dateFormat: "d-m-Y",
                    locale: Vietnamese
                  }}
                />
              </Form.Item>
              <Form.Item
                label={t("Address")}
                name="Address"
                rules={[
                  { required: true, message: 'Địa chỉ không được để trống' }
                ]}>
                <Input
                  placeholder={t("Address")}
                  autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("Phone")}
                name="Phone"
                rules={[
                  { required: true, message: 'SĐT không được để trống' }
                ]}>
                <Input
                  placeholder={t("Phone")}
                  autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("Email")}
                name="Email"
                rules={[
                  { required: true, message: 'Email không được để trống' },
                  { type: 'email', message: 'Không đúng định dạng Email' }
                ]}>
                <Input
                  placeholder={t("Email")}
                  type="Email"
                  autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item className="text-center mt-2">
                <Button
                  className="btn btn-gradient-secondary mr-1"
                  color="gradient-secondary"
                  htmlType="submit"
                >
                  {t("X_Trade_Button_Add")}
                </Button>
                <Button
                  className="btn btn-gradient-info mr-1"
                  color="gradient-info"
                  htmlType="button"
                  onClick={() => ResetForm()}
                >
                  {t("X_Trade_Button_Clear")}
                </Button>
                <Button
                  className="btn btn-gradient-primary"
                  color="gradient-primary"
                  onClick={() => (userStore.isShowPopup = !userStore.isShowPopup)}
                  htmlType="button"
                >
                  {t("X_Trade_Button_Close")}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  });

export default CreateUser;