import { useObserver } from "mobx-react";
import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Col, CustomInput, Dropdown, DropdownToggle, DropdownMenu, Label, ListGroup, ListGroupItem, Row } from "reactstrap";
import { useTranslation } from "react-i18next";
import { store } from "../../store/InvestorStore";
import Select from "react-select";
import { selectThemeColors } from "../../../../utility/Utils";
import PerfectScrollbar from "react-perfect-scrollbar";
import { List, PlusCircle, XOctagon } from "react-feather";
import { customSMSelectStyles } from "../../types";
import Table, { ColumnsType } from "antd/lib/table";
import { Form, Input } from "antd";

const InvestorAccountEdit = (data: any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const [emailForm] = Form.useForm();
    const [phoneForm] = Form.useForm();
    const customerAccountEmail: ColumnsType<any> = [
      {
        title: "Email",
        dataIndex: "Email",
        width: 200
      },
      {
        title: "KQGD",
        width: 80,
        align: 'center',
        render: (v, s, index) => (
          <>
            <CustomInput
              name="abc"
              type="radio"
              className="custom-control-info"
              id={"Radio" + index}
              defaultChecked={v.IsKQGD}
              // onChange={() => {
              //   changeEmailKQGD(v);
              //   v.IsKQGD = !v.IsKQGD;
              // }}
              disabled
              inline
            />
          </>
        )
      },
      {
        title: "QC",
        align: 'center',
        width: 80,
        render: (v, s, index) => {
          return (
            <>
              <CustomInput
                type="checkbox"
                className="custom-control-info"
                id={"CheckBox" + index}
                defaultChecked={v.IsQC}
                // onChange={() => {
                //   changeEmailQC(v);
                //   v.IsQC = !v.IsQC;
                // }}
                disabled
                inline
              />
            </>
          );
        }
      }
    ];
    const customerAccountPhone: ColumnsType<any> = [
      {
        title: "Số ĐT",
        dataIndex: "Phone",
        width: 200
      },
      {
        title: "SMS",
        align: 'center',
        width: 80,
        render: (v, s, index) => {
          return (
            <>
              <CustomInput
                name="xyz"
                type="radio"
                className="custom-control-info"
                id={"RadioPhone" + index}
                defaultChecked={v.IsSMS}
                // onChange={() => {
                //   changePhoneSMS(v);
                //   v.IsSMS = !v.IsSMS;
                // }}
                disabled
                inline
              />
            </>
          );
        }
      },
      {
        title: "CC",
        align: 'center',
        width: "80px",
        render: (v, s, index) => {
          return (
            <>
              <CustomInput
                type="checkbox"
                className="custom-control-info"
                id={"CheckBoxPhone" + index}
                defaultChecked={v.IsCC}
                // onChange={() => {
                //   changePhoneCC(v);
                //   v.IsCC = !v.IsCC;
                // }}
                disabled
                inline
              />
            </>
          );
        }
      }
    ];
    const accountFormFill = data.accountInfo;
    const { t } = useTranslation();

    const [formEmailDropdown, setFormEmailDropdown] = useState(false);
    const toggleEmailFormDropdown = () => setFormEmailDropdown(!formEmailDropdown);

    const [formPhoneDropdown, setFormPhoneDropdown] = useState(false);
    const toggleFormPhoneDropdown = () => setFormPhoneDropdown(!formPhoneDropdown);

    const [isDisableInput, setIsDisableInput] = useState(true)

    useEffect(() => {
      store.GetCustomerAccountById(accountFormFill.CUSTOMERID);
    }, [])

    useEffect(() => {
      if (store.loadCustomerAccountById) {
        const param = {
          Id: -1,
          AccountType: -1
        }
        const paramBankAccount = {
          UserId: "",
          CustomerID: accountFormFill.CUSTOMERID,
          BankAccountID: -1,
          BankAccount: "",
          IsLike: 1,
          Status: 1,
          ToDate: "",
          FromDate: "",
          PageIndex: 1,
          PageSize: 3
        }
        store.GetCustomerGroupList(param);
        store.GetBankAccountList(paramBankAccount);

        getCustomerPhoneList();
        getCustomerEmailList();
      }
    }, [store.loadCustomerAccountById])

    useEffect(() => {
      if (store.loadDeleteAccountEmail) {
        getCustomerEmailList();
        emailForm.resetFields();
      }
    }, [store.loadDeleteAccountEmail]);

    useEffect(() => {
      if (store.listCustomerGroup && store.customerTypeList) {
        setFormValue();
      }
    }, [store.listCustomerGroup, store.customerTypeList]);

    useEffect(() => {
      if (store.loadDeleteAccountPhone) {
        getCustomerPhoneList();
        phoneForm.resetFields();
      }
    }, [store.loadDeleteAccountPhone]);

    useEffect(() => {
      if (accountFormFill.AGENTTYPE === 3 && accountFormFill.CUSTOMERTYPE === 1) {
        setIsDisableInput(false);
      }
    }, [])

    const getCustomerPhoneList = () => {
      const paramAccountPhone = {
        CustomerID: accountFormFill.CUSTOMERID,
        IsActive: -1,
        Phone: "",
        FromDate: "",
        ToDate: "",
        PageIndex: 1,
        PageSize: 20
      }
      store.GetCustomerPhoneList(paramAccountPhone);
    }

    const getCustomerEmailList = () => {
      const paramAccountEmail = {
        CustomerID: accountFormFill.CUSTOMERID,
        IsActive: -1,
        Email: "",
        FromDate: "",
        ToDate: "",
        PageIndex: 1,
        PageSize: 20
      }
      store.GetCustomerEmailList(paramAccountEmail);
    }

    const setFormValue = () => {
      form.setFieldsValue({
        CUSTOMERID: store.accountInfo.CUSTOMERID,
        CUSTOMERNO: store.accountInfo.CUSTOMERNO,
        CUSTOMERNAME: store.accountInfo.CUSTOMERNAME,
        IDENTITYCARD: store.accountInfo.IDENTITYCARD,
        ADDRESS: store.accountInfo.ADDRESS,
        BRANCHNAME: store.accountInfo.BRANCHNAME,
        AUTHTYPE: store.accountInfo.AUTHTYPE,
        MKTID: store.accountInfo.MKTID,
        CUSTOMERTYPE: store.customerTypeList.find(item => item.Value == (store.accountInfo.AGENTTYPE ?? store.accountInfo.CUSTOMERTYPE))
      })
    }

    const onSubmit = () => {
      const formValue = form.getFieldsValue();
      const param = {
        "UserId": store.account.LoginName,
        "CustomerId": store.accountInfo.CUSTOMERID,
        "CustomerNo": (formValue.CUSTOMERNO !== null && formValue.CUSTOMERNO !== undefined) ? formValue.CUSTOMERNO.trim() : null,
        "CustomerName": (formValue.CUSTOMERNAME !== null && formValue.CUSTOMERNAME !== undefined) ? formValue.CUSTOMERNAME.trim() : null,
        "AuthType": store.accountInfo.AUTHTYPE,
        "IdentityCard": (formValue.IDENTITYCARD !== null && formValue.IDENTITYCARD !== undefined) ? formValue.IDENTITYCARD.trim() : null,
        "Address": (formValue.ADDRESS !== null && formValue.ADDRESS !== undefined) ? formValue.ADDRESS.trim() : null,
        "Email": store.accountInfo.EMAIL,
        "Phone": store.accountInfo.PHONE,
        "CellPhone": store.accountInfo.CELLPHONE,
        "Status": store.accountInfo.STATUS,
        "CustomerType": formValue.CUSTOMERTYPE? (formValue.CUSTOMERTYPE.Value === "0" ? 0 : 1) : store.accountInfo.CUSTOMERTYPE,
        "AgentType": formValue.CUSTOMERTYPE? formValue.CUSTOMERTYPE.Value : store.accountInfo.AGENTTYPE,
        "CustomerGroupId": store.accountInfo.CUSTOMERGROUPID,
        "TotalPoint": store.accountInfo.TOTALPOINT,
        "BranchID": store.accountInfo.BRANCHID,
        "ContactEmail": store.accountInfo.CONTACTEMAIL,
        "ContactPhone": store.accountInfo.CONTACTPHONE,
        "IsDefault": store.accountInfo.ISDEFAULT ? 1 : 0,
        "DefaultAccount": store.accountInfo.DEFAULTACCOUNT,
        "PickAccount": store.accountInfo.PICKACCOUNT,
        "Custodian": store.accountInfo.CUSTODIAN,
        "MktId": store.accountInfo.MKTID,
        "PcFlag": store.accountInfo.PCFLAG,
        "CreditType": store.accountInfo.CREDITTYPE,
        "BirthDay": store.accountInfo.BIRTHDAY,
        "Sex": store.accountInfo.SEX,
        "CardIssue": store.accountInfo.CARDISSUE,
        "PlaceIssue": store.accountInfo.PLACEISSUE,
        "Occupation": store.accountInfo.OCCUPATION,
        "Nationality": store.accountInfo.NATIONALITY,
        "Remark": store.accountInfo.REMARK,
        "TaxCode": store.accountInfo.TaxCode
      }

      console.log('param', param);
      // store.UpdateCustomerAccount(param);
    };

    const bankAccountListView = () => (

      <ListGroup className="max-h-80vh list-group-item-sm">
        <PerfectScrollbar style={{ maxHeight: "70vh", overflowX: "hidden" }}>
          {store.bankAccountList.map((item, index) => (
            <ListGroupItem key={index}>
              <div className='d-flex justify-content-between w-100'>
                <Label>Tài khoản ngân hàng {index + 1}</Label>
              </div>
              <Row>
                <Label sm="10">Trạng thái</Label>
                <Col sm="14">
                  <Input type="text" value={item.STATUS_TEXT} size="small" readOnly />
                </Col>
                <Label sm="10">Người thụ hưởng {index + 1}</Label>
                <Col sm="14">
                  <Input type="text" value={item.CUSTOMERNAME} size="small" readOnly />
                </Col>
                <Label sm="10">Số tài khoản {index + 1}:</Label>
                <Col sm="14">
                  <Input type="text" value={item.BANKACCOUNT} size="small" readOnly />
                </Col>
                <Label sm="10">Tại ngân hàng {index + 1}:</Label>
                <Col sm="14">
                  <Input type="text" value={item.BankName} size="small" readOnly />
                </Col>
                <Label sm="10">Chi nhánh {index + 1}:</Label>
                <Col sm="14">
                  <Input type="text" value={item.BranchName} size="small" readOnly />
                </Col>
              </Row>

            </ListGroupItem>
          ))}
        </PerfectScrollbar>
      </ListGroup>
    )

    const addAccountEmail = () => {
      // if (emailForm.getFieldError("EMAIL_REGIS").length <= 0
      //   && emailForm.getFieldValue("EMAIL_REGIS") !== null
      //   && emailForm.getFieldValue("EMAIL_REGIS").trim() !== "") {
      //   const value = emailForm.getFieldsValue();
      //   const param = {
      //     CustomerID: store.accountInfo.CUSTOMERID,
      //     Email: value.EMAIL_REGIS.trim(),
      //     IsKQGD: 0,
      //     IsQC: 0,
      //     IsActive: 1
      //   }

      //   store.RegisAccountEmail(param);
      // }
    }

    const addAccountPhone = () => {
      // if (phoneForm.getFieldValue("PHONE_REGIS") && phoneForm.getFieldError("PHONE_REGIS").length <= 0
      //   && phoneForm.getFieldValue("PHONE_REGIS") !== null
      //   && phoneForm.getFieldValue("PHONE_REGIS").trim() !== "") {
      //   const value = phoneForm.getFieldsValue();
      //   const param = {
      //     CustomerID: store.accountInfo.CUSTOMERID,
      //     Phone: value.PHONE_REGIS.trim(),
      //     IsSMS: 0,
      //     IsCC: 0,
      //     IsActive: 1
      //   }

      //   store.RegisAccountPhone(param);
      // }

    }

    const deleteAccountEmail = (data: any) => {
      store.DeleteAccountEmail(data.ID);
    }

    const deleteAccountPhone = (data: any) => {
      store.DeleteAccountPhone(data.ID);
    }

    const formEmail = () => {
      return (
        <Form
          form={emailForm}
          onFinish={addAccountEmail}
          labelAlign={"left"}
          autoComplete="off"
          size="small"
          colon={false}
          requiredMark={false}>
          <Form.Item
            label={t("Email_GDDT")}
            name="EMAIL_REGIS"
            validateTrigger="onBlur"
            rules={[
              { type: 'email', message: 'Không đúng định dạng Email' }
            ]}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}>
            <Dropdown
              isOpen={formEmailDropdown}
              toggle={toggleEmailFormDropdown}
              direction="up"
              className="custom-dropdown-table"
            >

              <DropdownToggle color="info">
                <Input.Group compact>
                  <Input value={store.accountInfo.CONTACTEMAIL} className="text-left" style={{ width: 'calc(100% - 44px)' }} type="Email" disabled/>
                  <Button color="info" size="sm" onClick={() => addAccountEmail()}>
                    <List size={14} />
                  </Button>
                </Input.Group>

              </DropdownToggle>

              <DropdownMenu>
                <Table
                  columns={customerAccountEmail}
                  dataSource={store.accountEmailList}
                  size="small"
                  pagination={false}

                />
              </DropdownMenu>
            </Dropdown>
          </Form.Item>
        </Form>
      )
    }

    const formPhone = () => {
      return (
        <Form
          form={phoneForm}
          onFinish={addAccountPhone}
          labelAlign={"left"}
          autoComplete="off"
          size="small"
          colon={false}
          requiredMark={false}>
          <Form.Item
            label={t("Contact_Center")}
            name="PHONE_REGIS"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}>
            <Dropdown
              isOpen={formPhoneDropdown}
              toggle={toggleFormPhoneDropdown}
              direction="up"
              className="custom-dropdown-table"
            >

              <DropdownToggle color="info">
                <Input.Group compact>
                  <Input value={store.accountInfo.CONTACTPHONE} className="text-left" style={{ width: 'calc(100% - 44px)' }} disabled/>
                  <Button color="info" size="sm" onClick={() => addAccountPhone()}>
                    <List size={14} />
                  </Button>
                </Input.Group>

              </DropdownToggle>

              <DropdownMenu>
                <Table
                  columns={customerAccountPhone}
                  dataSource={store.accountPhoneList}
                  size="small"
                  pagination={false}

                />
              </DropdownMenu>
            </Dropdown>
          </Form.Item>
        </Form>
      )
    }

    const changeEmailKQGD = (item: any) => {
      const param = {
        Id: item.ID,
        CustomerID: store.accountInfo.CUSTOMERID,
        Email: item.Email,
        IsKQGD: 1,
        IsQC: item.IsQC ? 1 : 0,
        IsActive: 1
      }

      store.RegisAccountEmail(param);
    }

    const changeEmailQC = (item: any) => {
      const param = {
        Id: item.ID,
        CustomerID: store.accountInfo.CUSTOMERID,
        Email: item.Email,
        IsKQGD: item.IsKQGD ? 1 : 0,
        IsQC: item.IsQC ? 0 : 1,
        IsActive: 1
      }

      store.RegisAccountEmail(param);
    }

    const changePhoneSMS = (item: any) => {
      const param = {
        Id: item.ID,
        CustomerID: store.accountInfo.CUSTOMERID,
        Phone: item.Phone,
        IsSMS: 1,
        IsCC: item.IsCC ? 1 : 0,
        IsActive: 1
      }

      store.RegisAccountPhone(param);
    }

    const changePhoneCC = (item: any) => {
      const param = {
        Id: item.ID,
        CustomerID: store.accountInfo.CUSTOMERID,
        Phone: item.Phone,
        IsSMS: item.IsSMS ? 1 : 0,
        IsCC: item.IsCC ? 0 : 1,
        IsActive: 1
      }

      store.RegisAccountPhone(param);
    }

    useEffect(() => {
      const sysConfigParam = {
        Category: "CUSTOMER",
      };
      store.GetCustomerTypeList(sysConfigParam);
    }, [])

    const onChangeAccountType = (cusType: any) => {
      if(cusType.Value === '3') {
        setIsDisableInput(false);
      } else {
        setIsDisableInput(true);
      }
      form.setFieldsValue({
        CUSTOMERNO: store.accountInfo.CUSTOMERNO,
        CUSTOMERNAME: store.accountInfo.CUSTOMERNAME,
        IDENTITYCARD: store.accountInfo.IDENTITYCARD,
        ADDRESS: store.accountInfo.ADDRESS,
      })
    }

    return (
      <Fragment>

        <Row>
          <Col sm="24">
            <div className='divider'>
              <div className='divider-text'>Tìm kiếm</div>
            </div>
          </Col>
          <Col sm="16">
            <Row>
              <Col sm="24">
                <Form
                  form={form}
                  onFinish={onSubmit}
                  labelAlign={"left"}
                  autoComplete="off"
                  colon={false}
                  className=""
                  requiredMark={false}>
                  <Row>
                    <Col lg="12" md="12">
                      <Form.Item
                        label={t('Customer_ID')}
                        name="CUSTOMERID"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Input placeholder={t('Customer_ID')} disabled />
                      </Form.Item>
                      <Form.Item
                        label={t('Customer_Code')}
                        name="CUSTOMERNO"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        rules={[
                          { required: !isDisableInput, message: 'Không được để trống' },
                        ]}>
                        <Input placeholder={t('Customer_Code')} disabled={isDisableInput} />
                      </Form.Item>
                      <Form.Item
                        label={t('FullName')}
                        name="CUSTOMERNAME"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        rules={[
                          { required: !isDisableInput, message: 'Không được để trống' },
                        ]}>
                        <Input placeholder={t('FullName')} disabled={isDisableInput} />
                      </Form.Item>
                      <Form.Item
                        label={t('Identity_Number')}
                        name="IDENTITYCARD"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        rules={[
                          { required: !isDisableInput, message: 'Không được để trống' },
                        ]}>
                        <Input placeholder={t('Identity_Number')} disabled={isDisableInput} />
                      </Form.Item>
                      <Form.Item
                        label={t('Address')}
                        name="ADDRESS"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        rules={[
                          { required: !isDisableInput, message: 'Không được để trống' },
                        ]}>
                        <Input placeholder={t('Address')} disabled={isDisableInput} />
                      </Form.Item>
                      {/* <Form.Item
                        label={t('Phone_Static')}
                        name="PHONE"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        rules={[
                          { required: !isDisableInput, message: 'Không được để trống' },
                        ]}>
                        <Input placeholder={t('Phone_Static')} disabled={isDisableInput} />
                      </Form.Item>
                      <Form.Item
                        label={t('Cellphone')}
                        name="CELLPHONE"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        rules={[
                          { required: !isDisableInput, message: 'Không được để trống' },
                        ]}>
                        <Input placeholder={t('Cellphone')} disabled={isDisableInput} />
                      </Form.Item>
                      <Form.Item
                        label={t('Tax_Number')}
                        name="TaxCode"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Input placeholder={t('Tax_Number')} />
                      </Form.Item>
                      <Form.Item
                        label={t('X_Trade_Remark')}
                        name="REMARK"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Input.TextArea placeholder={t('X_Trade_Remark')} autoSize={{ minRows: 3, maxRows: 3 }} allowClear />
                      </Form.Item> */}
                    </Col>
                    <Col lg="12" md="12">
                      {/* <Form.Item
                        label={t('Email')}
                        name="EMAIL"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        rules={[
                          { required: !isDisableInput, message: 'Không được để trống' },
                          { type: 'email', message: 'Không đúng định dạng Email' }
                        ]}>
                        <Input placeholder={t('Email')} disabled={isDisableInput} />
                      </Form.Item> */}
                      <Form.Item
                        label={t('X_Trade_Branch_Name')}
                        name="BRANCHNAME"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Input placeholder={t('X_Trade_Branch_Name')} disabled />
                      </Form.Item>
                      {/* <Form.Item
                        label={t('Employee_Activated_Code')}
                        name="USERID"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Input placeholder={t('Employee_Activated_Code')} disabled />
                      </Form.Item> */}
                      <Form.Item
                        label={t('Employee_Management')}
                        name="MKTID"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Input placeholder={t('Employee_Management')} disabled />
                      </Form.Item>
                      {/* <Form.Item
                        label={t('Default_Account')}
                        name="PICKACCOUNT"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Input placeholder={t('Default_Account')} disabled />
                      </Form.Item>
                       
                      <Form.Item
                        label={t('Account_Group')}
                        name="CUSTOMERGROUPID"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Select
                          theme={selectThemeColors}
                          className="react-select react-select-sm"
                          classNamePrefix="select"
                          options={store.listCustomerGroup}
                          isClearable={false}
                          noOptionsMessage={() => "Không có dữ liệu...."}
                          getOptionLabel={(option) => option.NAME}
                          getOptionValue={(option) => option.CUSTOMERGROUPID}
                          styles={customSMSelectStyles}
                        />
                      </Form.Item>*/}
                      <Form.Item
                        label={t('Authen_Type')}
                        name="AUTHTYPE"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <CustomInput
                          type="radio"
                          id="exampleCustomRadio3"
                          className="custom-control-info"
                          inline
                          label="Mã pin tĩnh"
                          disabled
                          defaultChecked={accountFormFill === 0 ? false : true}
                        />
                      </Form.Item>
                      <Form.Item
                        label={t("Account_Type")}
                        name="CUSTOMERTYPE"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}>
                        <Select
                          theme={selectThemeColors}
                          className="react-select react-select-sm"
                          classNamePrefix="select"
                          options={store.customerTypeList}
                          isClearable={false}
                          noOptionsMessage={() => "Không có dữ liệu...."}
                          getOptionLabel={(option) => option.Name}
                          getOptionValue={(option) => option.Value}
                          onChange={onChangeAccountType}
                          styles={customSMSelectStyles}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Col sm="24">
                <div className='divider'>
                  <div className='divider-text'>Thông tin liên lạc</div>
                </div>
              </Col>
              <Col sm="12">
                {formEmail()}
              </Col>
              <Col sm="12">
                {formPhone()}
              </Col>
              <Col sm="24" lg="24">
                <Form
                  form={form}
                  onFinish={onSubmit}
                  labelAlign={"left"}
                  autoComplete="off"
                  size="small"
                  colon={false}
                  requiredMark={false}>
                  <Form.Item className="text-center mt-2">
                    <Button className="btn btn-gradient-secondary mr-1" color="gradient-secondary" htmlType="submit">
                      Lưu
                    </Button>
                    <Button className="btn btn-gradient-primary" color="gradient-primary" htmlType="button" onClick={() => (store.isShowPopupEdit = !store.isShowPopupEdit)}>
                      Hủy
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Col>
          <Col lg="8" md="8">
            {bankAccountListView()}
          </Col>



        </Row>
      </Fragment >
    )
  })

export default InvestorAccountEdit;