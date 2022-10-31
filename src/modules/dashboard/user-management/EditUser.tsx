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

const EditUser = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueDate, setValueDate] = useState(new Date());
    const onSubmit = () => {
      const formValue = form.getFieldsValue();
      const param = {
        "UserId": userStore.userInfoParam.UserId,
        "SysLevelId": formValue.SysLevelId,
        "SaleId": formValue.SaleId ? formValue.SaleId.SaleID : "",
        "PositionId": formValue.PositionId ? formValue.PositionId.PositionID : 0,
        "EmployeeCode": formValue.EmployeeCode.trim(),
        "DisplayName": formValue.DisplayName.trim(),
        "Sex": formValue.Sex.value,
        "Birthday": Moment.formatDateNew(formValue.Birthday, "yyyy-MM-DD"),
        "Address": formValue.Address.trim(),
        "Phone": formValue.Phone.trim(),
        "Email": formValue.Email.trim(),
        "Status": 0
      }
      userStore.UpdateUser(param);
    }

    useEffect(() => {
      // userStore.GetSystemLevelInfo();
      treeLevelStore.GetSystemLevelList();
      userStore.GetSaleInfo();
      userStore.getListPosition();

      userStore.GetUserInfo(userStore.userInfoParam.LoginName);
    }, []);

    useEffect(() => {    
      form.setFieldsValue({
        // SysLevelId: userStore.listSystemLevel.filter(item => item.)
        DisplayName: userStore.userInfo.DisplayName,
        EmployeeCode: userStore.userInfo.EmployeeCode,
        Sex: Sex[Sex.findIndex(item => item.value === userStore.userInfo.Sex)],
        Birthday: new Date(userStore.userInfo.Birthday),
        Address: userStore.userInfo.Address,
        Phone: userStore.userInfo.Phone,
        Email: userStore.userInfo.Email,
        PositionId: userStore.listPosition.filter(item => item.PositionID === userStore.userInfo.PositionId)[0],
        SysLevelId: !!treeLevelStore.dataListTreeLevel[treeLevelStore.dataListTreeLevel.findIndex(item => item.SysLevelID === userStore.userInfo.SysLevelId)] && treeLevelStore.dataListTreeLevel[treeLevelStore.dataListTreeLevel.findIndex(item => item.SysLevelID === userStore.userInfo.SysLevelId)].SysLevelID,
        SaleId: userStore.listSaleInfo[userStore.listSaleInfo.findIndex(item => item.SaleID === userStore.userInfo.SaleId)],
        AuthType: userType[userType.findIndex(item => item.value === userStore.userInfo.AuthType)],
      });
    }, [userStore.userInfo, treeLevelStore.dataListTreeLevel]);

    return (
      <Fragment>
        <Form
          form={form}
          layout={'vertical'}
          onFinish={onSubmit}
          autoComplete="off"
          size="small"
          colon={false}
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
                  }}/>
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
                name="SaleId">
                {/* <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={userStore.listSaleInfo}
                  isClearable={false}
                  styles={customSMSelectStyles}
                  placeholder={"Chọn SaleId..."}
                  noOptionsMessage={() => "Không có dữ liệu...."}
                  getOptionLabel={(option) => option.SaleName}
                  getOptionValue={(option) => option.SaleId}
                /> */}
                
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
                {/* <Input
                  placeholder={t("Position")}
                  autoComplete="off" /> */}
                  
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
            </Col>
            <Col span={12}>
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
                  className="btn btn-gradient-primary"
                  color="gradient-primary"
                  onClick={() => (userStore.isShowPopupEdit = !userStore.isShowPopupEdit)}
                  htmlType="button"
                >
                  {t("X_Trade_Button_Close")}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Fragment>
    )
  })

export default EditUser;