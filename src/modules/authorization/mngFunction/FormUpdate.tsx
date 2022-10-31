import { Checkbox, Form, Input, InputNumber, TreeSelect } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { selectThemeColors } from "../../../utility/Utils";
import { titleStore } from "../store/titleStore";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { AppInfo, FunctionInfo, FunctionInfoEditing } from "../type";
import { functionStore } from "../store/functionStore";
import FormRepeater from "../../../views/forms/form-repeater";

const FormUpdate = () =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const animatedComponents = makeAnimated();
    const [statusChecked, setStatusChecked] = useState(false);
    const [isShowChecked, setIsShowChecked] = useState(false);
    const [statusString, setStatusString] = useState("Không hoạt động");
    const [isShowString, setIsShowString] = useState("Không hiển thị");
    const [editingFunctionInfo, setEditingFunctionInfo] = useState<FunctionInfoEditing>({} as FunctionInfoEditing)

    useEffect(() => {
      functionStore.GetAppList()
    }, [])

    useEffect(() => {
      if(functionStore.isEditing) {
          setEditingFunctionInfo({
              FunctionID: functionStore.editingFunctionInfo.FunctionID,
              FunctionName: functionStore.editingFunctionInfo.FunctionName,
              FunctionCode: functionStore.editingFunctionInfo.FunctionCode,
              ParentID: functionStore.editingFunctionInfo.ParentID,
              Status: functionStore.editingFunctionInfo.Status,
              OrderNum: functionStore.editingFunctionInfo.OrderNum,
              Url: functionStore.editingFunctionInfo.Url,
              AppName: functionStore.editingFunctionInfo.AppName,
              IsShow: functionStore.editingFunctionInfo.IsShow,
          } as FunctionInfoEditing)
      } else {
          setEditingFunctionInfo({
              FunctionName: "",
              FunctionCode: "",
              OrderNum: 0,
              Url: "",
          })
          setStatusString("Không hoạt động")
          setIsShowString("Không hiển thị")
      }
    }, [functionStore.editingFunctionInfo]);

    const onIsShowCheckbox = (event: any) => {
      let { checked } = event.target;
      form.setFieldsValue({
          "IsShow": checked
      })
      setIsShowString(checked ? "Hiển thị": "Không hiển thị")
    }

    const onStatusCheckbox = (event: any) => {
      let { checked } = event.target;
      form.setFieldsValue({
          "Status": checked ? 1 : 0
      })
      setStatusString(checked ? "Hoạt động": "Không hoạt động")
    }

    useEffect(() => {
      if(functionStore.isEditing && Object.keys(editingFunctionInfo).length && functionStore.appList.length) {
        setStatusString(editingFunctionInfo.Status === 1 ? "Hoạt động" :"Không hoạt động")
        setStatusChecked(editingFunctionInfo.Status === 1)
        setIsShowString(editingFunctionInfo.IsShow ? "Hiển thị" : "Không hiển thị")
        setIsShowChecked(!!editingFunctionInfo.IsShow)
        form.setFieldsValue({
          AppName: functionStore.appList.filter(x => x.AppName === editingFunctionInfo.AppName)[0],
          FunctionName: editingFunctionInfo.FunctionName,
          FunctionCode: editingFunctionInfo.FunctionCode,
          OrderNum: editingFunctionInfo.OrderNum,
          IConCls: editingFunctionInfo.IConCls,
          IsShow: editingFunctionInfo.IsShow,
          ParentID: editingFunctionInfo.ParentID,
          Status: editingFunctionInfo.Status,
          Url: editingFunctionInfo.Url,
        })
      }
      form.resetFields(["IsShow", "Status"])
    }, [editingFunctionInfo, functionStore.appList])

    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      functionStore.onShowModalEdit(false)
    };
    const onFinish = () => {
      let payload = {
        AppName: editingFunctionInfo.AppName,
        FunctionName: form.getFieldValue("FunctionName"),
        FunctionCode: form.getFieldValue("FunctionCode"),
        Url: form.getFieldValue("Url") || "",
        ParentID: form.getFieldValue("ParentID"),
        OrderNum: parseInt(form.getFieldValue("OrderNum")),
        IConCls: form.getFieldValue("IConCls") || "",
        Status: form.getFieldValue("Status"),
        IsShow: form.getFieldValue("IsShow"),
      }
      functionStore.isEditing ? functionStore.OnEditFunctionInfo(payload) : functionStore.OnAddFunctionInfo(payload)
    };

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onFinish}
              initialValues={editingFunctionInfo}
              requiredMark={false}
            >
            <Form.Item label={t("authorization_list_app_name")} name="AppName">
              {functionStore.appList && <Select
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={true}
                components={animatedComponents}
                options={functionStore.appList}
                getOptionLabel={(option: AppInfo) => option.AppName}
                getOptionValue={(option: AppInfo) => option.AppName}
                className="react-select react-select-sm"
                classNamePrefix="select"
                onChange={(value: AppInfo) => setEditingFunctionInfo({...editingFunctionInfo, AppName: value.AppName})}
              />}
            </Form.Item>
              <Form.Item
                label={t("authorize_function_name")}
                name="FunctionName"
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
                <Input placeholder={t("authorize_function_name")} autoComplete="off" />
              </Form.Item>
              <Form.Item label={t("authorize_function_code")} name="FunctionCode"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Mã chức năng không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Mã chức năng không được để trống",
                  },
                ]}>
                <Input placeholder={t("authorize_function_code")} autoComplete="off" />
              </Form.Item>
              <Form.Item
                label="Chức năng cha"
                name="ParentID"
              >
                <TreeSelect
                  value={editingFunctionInfo.FunctionID}
                  key="FunctionID"
                  allowClear
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  treeData={[ {FunctionID: 0, FunctionName: "Chức năng cha"}, ...functionStore.functionAuthList]}
                  placeholder="Chức năng cha"
                  treeDefaultExpandAll
                  fieldNames={{
                    label: "FunctionName",
                    value: "FunctionID",
                    children: "children",
                  }}
                />
              </Form.Item>
              <Form.Item label="IconCls" name="IConCls">
                <Input placeholder="IconCls" autoComplete="off" />
              </Form.Item>
              <Form.Item label={t("authorize_function_order_by")} name="OrderNum"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Thứ tự hiển thị không được để trống",
                  },
                ]}>
                <InputNumber min={1} placeholder={t("authorize_function_order_by")} autoComplete="off" />
              </Form.Item>
              <Form.Item label={t("authorize_function_url")} name="Url"
                validateTrigger="onBlur">
                <Input placeholder={t("authorize_function_url")} autoComplete="off" />
              </Form.Item>
              <Form.Item
                label={t("X_Trade_Status")}
                name="Status"
                hasFeedback
              >
                <Checkbox defaultChecked={statusChecked} onChange={onStatusCheckbox}>{statusString}</Checkbox>
              </Form.Item>
              <Form.Item
                label="Hiển thị"
                name="IsShow"
                hasFeedback
              >
                <Checkbox defaultChecked={isShowChecked} onChange={onIsShowCheckbox}>{isShowString}</Checkbox>
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
                {!functionStore.isEditing && <Button
                  className="btn btn-gradient-info"
                  color="gradient-info"
                  htmlType="button"
                  onClick={() => ResetForm()}
                >
                  {t("X_Trade_Button_Reset")}
                </Button>}
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
