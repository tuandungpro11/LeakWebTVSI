import { Form, Input } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { titleStore } from "../store/titleStore";
import Select from "react-select";
import { selectThemeColors } from "../../../utility/Utils";
import {
  bankAccountStatusOption,
  customSMSelectStyles,
  SaleTypeOption,
} from "../type";
import { store } from "../../xTrade/store/InvestorStore";
import { saleStore } from "../store/saleStore";
import { appStore } from "../../../stores/appStore";

const FormAddNew = () =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const defaultValue = {
      saleId: "",
      saleName: "",
      branch: "",
      cbxSaleType: SaleTypeOption[0],
      cbxStatus: bankAccountStatusOption[0],
    };
    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      saleStore.isShowPopup = false;
    };
    const onAddSale = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        SaleID: valueForm.saleId.trim(),
        SaleName: valueForm.saleName.trim(),
        SaleType: valueForm.cbxSaleType.value,
        BranchCode: valueForm.branch.trim(),
        Status: valueForm.cbxStatus.value,
      };
      saleStore.AddNewSale(param);
    };

    useEffect(() => {
      const param = {
        BankNo: "",
        BranchNo: "",
        BranchName: "",
        BranchNameEn: "",
        ShortBranchName: "",
        Status: 1,
        PageIndex: 1,
        PageSize: 9999,
      };
      store.getListBranchBank(param);
    }, []);

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onAddSale}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Form.Item
                label={t("SaleId")}
                name="saleId"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Tên chức năng không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Tên chức năng không được để trống",
                  },
                ]}
              >
                <Input placeholder={t("SaleId")} autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("FullName_Sale")}
                name="saleName"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Họ và tên không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Họ và tên không được để trống",
                  },
                ]}
              >
                <Input placeholder={t("FullName_Sale")} autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Branch_Name")}
                name="branch"
                rules={[
                  { required: true, message: "Chi nhánh ckhông được để trống" },
                  {
                    whitespace: true,
                    message: "Họ và tên không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input
                  placeholder={t("X_Trade_Branch_Name")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("authorization_sale_type")}
                name="cbxSaleType"
                hasFeedback
              >
                <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={SaleTypeOption}
                  defaultValue={SaleTypeOption[0]}
                  isClearable={false}
                  styles={customSMSelectStyles}
                  placeholder={"Chọn trạng thái..."}
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Status")}
                name="cbxStatus"
                hasFeedback
              >
                <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={bankAccountStatusOption}
                  defaultValue={bankAccountStatusOption[0]}
                  isClearable={false}
                  styles={customSMSelectStyles}
                  placeholder={"Chọn trạng thái..."}
                />
              </Form.Item>
              <Form.Item className="text-center mt-2">
                <Button
                  className="btn btn-gradient-secondary"
                  color="gradient-secondary"
                  htmlType="submit"
                >
                  {t("X_Trade_Button_Add")}
                </Button>
                &nbsp;&nbsp;
                <Button
                  className="btn btn-gradient-info"
                  color="gradient-info"
                  htmlType="button"
                  onClick={() => ResetForm()}
                >
                  {t("X_Trade_Button_Reset")}
                </Button>
                &nbsp;&nbsp;
                <Button
                  className="btn btn-gradient-primary"
                  color="gradient-primary"
                  onClick={() => ClosePopup()}
                  htmlType="button"
                >
                  {t("X_Trade_Button_Close")}
                </Button>
              </Form.Item>
            </Form>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default FormAddNew;
