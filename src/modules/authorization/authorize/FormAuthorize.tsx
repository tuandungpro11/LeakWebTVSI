import { Form, Input, Table } from "antd";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge, Button, Card, CardBody, Col, Row } from "reactstrap";
import { titleStore } from "../store/titleStore";
import { Key } from "antd/lib/table/interface";
import makeAnimated from "react-select/animated";
import { authorizeStore } from "../store/authorizeStore";
import { appStore } from "../../../stores/appStore";
import { AuthorizeGroupByUser, AuthorizeGroupByUserUpdate } from "../type";
import TextArea from "antd/lib/input/TextArea";

const FormAuthorize = (valueUpdate: any) =>
  useObserver(() => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const valueBind = valueUpdate.valueUpdate
    const [selectedList, setSelectedList] = useState<string[]>([]);
    const [isRightNameList, setIsRightNameList] = useState<string[]>([])
    const [selectedNameList, setSelectedNameList] = useState<string[]>([])

    
    const columns = [
      { title: "", dataIndex: "", key: "expand", width: 1 },
      {
        title: "Nhóm quyền",
        dataIndex: "GroupName",
        key: "GroupName",
      },
      {
        title: "Mã nhóm",
        dataIndex: "GroupCode",
        key: "GroupCode",
      },
      Table.SELECTION_COLUMN,
    ]

    const defaultValue = {
      appName: "",
      descript: "",
    };
    const ResetForm = () => {
      form.resetFields();
    };
    const ClosePopup = () => {
      authorizeStore.isShowPopup = false;
    };
    const onAddAuthorize = () => {
      authorizeStore.OnUpdateGroupByUser(selectedList, valueBind.UserId);
    };

    const rowSelection = {
      selectedRowKeys: selectedList,
      onChange: (selectedRowKeys: Key[]) => {
        let selectedRowNames = selectedRowKeys.map((x) => (x as string).split("||")[1]).filter((x) => isRightNameList.indexOf(x) === -1)
        setSelectedNameList([...selectedRowNames])
        setSelectedList([...selectedRowKeys as string[]]);
      },
      getCheckboxProps: (record: any) => ({
        name: record.GroupID,
      }),
    };
    const getSelectedList = (data: AuthorizeGroupByUser[]): { result: string[], isRightNameList: string[] } => {
      let result: string[] = []
      let  isRightNameList: string[] = []
      for(let item of data) {
        if (item.IsRight === 1) {
          result = [...result, `${item.GroupID}||${item.GroupName}`]
          isRightNameList = [...isRightNameList, item.GroupName]
        }
        if (item.children && item.children.length > 0) {
          result = [...result, ...getSelectedList(item.children).result]
          isRightNameList = [... isRightNameList, ...getSelectedList(item.children).isRightNameList]
        }
      }
      return { result, isRightNameList }
    }

    const rowKeyCustomised = (value: AuthorizeGroupByUserUpdate): string => {
      return `${value.GroupID}||${value.GroupName}`
    }

    useEffect(() => {
      let { result, isRightNameList } = getSelectedList(authorizeStore.dataListAuthorizeTree)
      setIsRightNameList([...isRightNameList])
      setSelectedList([...result])
    }, [authorizeStore.dataListAuthorizeTree])
    useEffect(() => {
      form.setFieldsValue({
        loginName: valueBind.LoginName,
        fullName: valueBind.DisplayName,
      });
      const param ={
        UserName: appStore.account.LoginName,
        UserId: valueBind.UserId
      }
      authorizeStore.getJsonGroupByUser(param);
    }, []);

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Form
              layout={"vertical"}
              form={form}
              onFinish={onAddAuthorize}
              initialValues={defaultValue}
              requiredMark={false}
            >
              <Form.Item
                label={t("Login_Name")}
                name="loginName"
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
                <Input
                  placeholder={t("Login_Name")}
                  autoComplete="off"
                  disabled
                />
              </Form.Item>
              <Form.Item
                label={t("FullName")}
                name="fullName"
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
                <Input
                  placeholder={t("FullName")}
                  autoComplete="off"
                  disabled
                />
              </Form.Item>
              <Row>
                <Col md={16} xs={16}>
                  <Form.Item label={t("authorize_group")} name="groupAuthorize">
                    {
                      authorizeStore.dataListAuthorizeTree.length > 0 && <Table
                      columns={columns}
                      dataSource={authorizeStore.dataListAuthorizeTree}
                      rowKey={rowKeyCustomised}
                      loading={authorizeStore.loadingData}
                      expandable={{defaultExpandAllRows:true}}
                      rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                      }}
                      
                      scroll={{ y: 500 }}
                      pagination={false}
                    />
                    }
                    
                  </Form.Item>
                </Col>
                <Col md={8} xs={8}>
                    <Form.Item name="IsRightNameList" label="Nhóm quyền đã chọn">
                      {isRightNameList.map((name: string) => <><Badge>{name}</Badge>&nbsp;</>)}
                    </Form.Item>
                    <hr/>
                    <Form.Item name="SelectedNameList" label="Nhóm quyền mới chọn">
                    {selectedNameList.map((name: string) => <><Badge>{name}</Badge>&nbsp;</>)}
                    </Form.Item>
                </Col>
              </Row>
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

export default FormAuthorize;
