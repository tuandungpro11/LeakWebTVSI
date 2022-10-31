import { Form, Input, TreeSelect } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { titleStore } from "../store/titleStore";
import { GroupAuthorizationInfoEditing } from "../type";
import { groupStore } from "../store/groupAuthStore";
import Checkbox from "antd/lib/checkbox/Checkbox";
import TextArea from "antd/lib/input/TextArea";

const FormEdit = () =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [editingGroupInfo, setEditingGroupInfo] = useState<GroupAuthorizationInfoEditing>({} as GroupAuthorizationInfoEditing)
    const [statusString, setStatusString] = useState("Không hoạt động");
    const [statusChecked, setStatusChecked] = useState(false);

    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      groupStore.OnShowModalEdit(false)
    };
    const SubmitForm = () => {
      let payload = {
          GroupName: form.getFieldValue("GroupName"),
          GroupCode: form.getFieldValue("GroupCode"),
          Description: form.getFieldValue("Description"),
          ParentID: form.getFieldValue("ParentID"),
          Status: form.getFieldValue("Status"),
          GroupID: editingGroupInfo.GroupID
      }
      groupStore.isEditing ? groupStore.OnEditGroupInfo(payload) : groupStore.OnAddGroupInfo(payload)
    }

    const onCheckbox = (event: any) => {
        let { checked } = event.target;
        form.setFieldsValue({
            "Status": checked ? 1 : 0
        })
        setStatusString(checked ? "Hoạt động": "Không hoạt động")
    }

    useEffect(() => {
        if(groupStore.isEditing) {
            setEditingGroupInfo({
                GroupID: groupStore.editingGroupInfo.GroupID,
                GroupName: groupStore.editingGroupInfo.GroupName,
                GroupCode: groupStore.editingGroupInfo.GroupCode,
                ParentID: groupStore.editingGroupInfo.ParentID,
                Description: groupStore.editingGroupInfo.Description,
                Status: groupStore.editingGroupInfo.Status,
            } as GroupAuthorizationInfoEditing)
        } else {
            setEditingGroupInfo({
                GroupName: "",
                GroupCode: "",
                Description: "",
            })
            setStatusString("Không hoạt động")
        }
    }, [groupStore.editingGroupInfo]);

    useEffect(() => {
        setStatusString(editingGroupInfo.Status === 1 ? "Hoạt động" :"Không hoạt động")
        setStatusChecked(editingGroupInfo.Status === 1)
    }, [editingGroupInfo.Status])

    useEffect(() => {
        form.resetFields()
    }, [editingGroupInfo])

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={SubmitForm}
              initialValues={editingGroupInfo}
              requiredMark={false}
            >
              <Form.Item
                label="Tên nhóm quyền"
                name="GroupName"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Tên nhóm quyền không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Tên nhóm quyền không được để trống",
                  },
                ]}
              >
                <Input placeholder={"Tên nhóm quyền"} autoComplete="off" />
              </Form.Item>
              <Form.Item
                label="Mã nhóm quyền"
                name="GroupCode"
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Mã nhóm quyền không được để trống",
                  },
                  {
                    whitespace: true,
                    message: "Mã nhóm quyền không được để trống",
                  },
                ]}
              >
                <Input placeholder="Mã nhóm quyền" autoComplete="off" />
              </Form.Item>
              <Form.Item
                label="Nhóm quyền cha"
                name="ParentID"
                hasFeedback
              >
                <TreeSelect
                    value={editingGroupInfo.ParentID}
                    key="GroupID"
                    allowClear
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={groupStore.groupAuthList}
                    placeholder="Nhóm quyền cha"
                    treeDefaultExpandAll
                    fieldNames={{ label: 'GroupName', value: 'GroupID', children: 'children'}}
                    // onChange={onChange}
                />
              </Form.Item>
              <Form.Item 
                label="Trạng thái"
                name="Status"
              >
                <Checkbox defaultChecked={statusChecked} onChange={onCheckbox}>{statusString}</Checkbox>
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="Description"
                validateTrigger="onBlur"
              >
                <TextArea placeholder="Mô tả" autoComplete="off" />
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
                {!groupStore.isEditing && <Button
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

export default FormEdit;
