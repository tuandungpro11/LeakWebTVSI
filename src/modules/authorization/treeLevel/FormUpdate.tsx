import { Form, Input, TreeSelect } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { selectThemeColors } from "../../../utility/Utils";
import { treeLevelStore } from "../store/treeLevelStore";
import {
  bankAccountStatusOption,
  customSMSelectStyles,
  levelTypeOption,
} from "../type";
import Select from "react-select";
import { appStore } from "../../../stores/appStore";

const FormUpdate = (valueUpdate: any) =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const valueBind = valueUpdate.valueUpdate;

    const defaultValue = {
      appName: "",
      descript: "",
    };
    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      treeLevelStore.isShowPopupModalUpdate = false;
    };
    const onUpdateLevel = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserName: appStore.account.LoginName,
        SysLevelID: valueBind.SysLevelID,
        Code: valueForm.levelCode.trim(),
        Name: valueForm.levelName.trim(),
        ParentID: form.getFieldValue("levelParent"),
        BranchCode: valueForm.levelBranch.trim(),
        LevelType: valueForm.levelType.value,
        Status: valueForm.levelStatus.value,
      };
      treeLevelStore.UpdateSystemLevel(param);
    };

    useEffect(() => {
      const param = {
        UserName: appStore.account.LoginName,
        SysLevelID: valueBind.SysLevelID,
      };
      treeLevelStore.GetSystemLevelInfo(param);
    }, []);
    useEffect(() => {
      if (Object.keys(treeLevelStore.dataListSystemLevelInfo).length > 0) {
        form.setFieldsValue({
          levelCode: treeLevelStore.dataListSystemLevelInfo.Code,
          levelName: treeLevelStore.dataListSystemLevelInfo.Name,
          levelType: levelTypeOption.filter(
            (item) =>
              (item.value = treeLevelStore.dataListSystemLevelInfo.LevelType)
          )[0],
          levelBranch: treeLevelStore.dataListSystemLevelInfo.BranchCode,
          levelStatus: bankAccountStatusOption.filter(
            (item) =>
              (item.value = treeLevelStore.dataListSystemLevelInfo.Status)
          )[0],
          levelParent : treeLevelStore.dataListTreeLevel.filter(item=>item.SysLevelID === valueBind.SysLevelID)[0].SysLevelID
        });
      }
    }, [treeLevelStore.dataListSystemLevelInfo]);

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onUpdateLevel}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Form.Item
                label={t("authorize_level_code")}
                name="levelCode"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Mã cấp độ không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Mã cấp độ không được để trống",
                  },
                ]}
              >
                <Input
                  placeholder={t("authorize_level_code")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("authorize_level_name")}
                name="levelName"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Tên cấp độ không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Tên cấp độ không được để trống",
                  },
                ]}
              >
                <Input
                  placeholder={t("authorize_level_name")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("authorize_level_type")}
                name="levelType"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Loại cấp độ không được để trống",
                  },
                ]}
              >
                <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={levelTypeOption}
                  defaultValue={levelTypeOption[0]}
                  isClearable={false}
                  styles={customSMSelectStyles}
                  placeholder={"Chọn loại cấp độ..."}
                />
              </Form.Item>
              <Form.Item
                label={t("authorize_level_parent")}
                name="levelParent"
              >
                <TreeSelect
                  value={valueBind.ParentID}
                  key="SysLevelID"
                  allowClear
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  treeData={treeLevelStore.dataListTreeLevel}
                  placeholder={t("authorize_level_parent")}
                  treeDefaultExpandAll
                  fieldNames={{
                    label: "Code",
                    value: "SysLevelID",
                    children: "children",
                  }}
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Branch_Name")}
                name="levelBranch"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Chi nhánh không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Chi nhánh không được để trống",
                  },
                ]}
              >
                <Input
                  placeholder={t("X_Trade_Branch_Name")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Status")}
                name="levelStatus"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Trạng thái không được để trống",
                  },
                ]}
              >
                <Select
                  theme={selectThemeColors}
                  className="react-select react-select-sm"
                  classNamePrefix="select"
                  options={bankAccountStatusOption}
                  defalutValue={bankAccountStatusOption[0]}
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

export default FormUpdate;
