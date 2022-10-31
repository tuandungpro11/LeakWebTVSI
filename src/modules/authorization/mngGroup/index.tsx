import { Fragment, useEffect, useState } from "react"
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";
import React from "react";
import { Button, Card, CardBody, CardHeader, Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { GroupAuthorizationInfo, SearchTreeResult } from "../type";
import { groupStore } from "../store/groupAuthStore";
import { useObserver } from "mobx-react";
import { Form, Input, Menu, Table } from "antd";
import { Activity, Delete, Edit, List } from "react-feather";
import { useTranslation } from "react-i18next";
import FormEdit from "./FormEdit";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import GroupAuthUserList from "./GroupAuthUserList";
import GroupAuthorizeTree from "./GroupAuthorizeTree";
import { ColumnsType } from "antd/lib/table";

const index = () => useObserver(() => {

    const [data, setData] = useState<GroupAuthorizationInfo[]>([])
    const [expandedRowKeys, setExpandedRowKeys]  = useState<number[]>([])
    const { t } = useTranslation();
    const swal = withReactContent(Swal);
    const [form] = Form.useForm();
    const defaultValue = {
        GroupName: ""
    }
    useEffect(() => {
        groupStore.GetGroupAuthList();
    }, [])

    useEffect(() => {
        setData([...groupStore.groupAuthList])
    }, [groupStore.groupAuthList])

    const columns: ColumnsType<GroupAuthorizationInfo> = [
        {
            title: "Tên nhóm quyền",
            dataIndex: "GroupName",
            key: "GroupName",
            width: "50%"
        },
        {
            title: "Mã nhóm quyền",
            dataIndex: "GroupCode",
            key: "GroupCode",
            render: (value: string) => <span>{value.toUpperCase()}</span>
        },
        {
            title: "Trạng thái",
            dataIndex: "Status",
            key: "Status",
            render: (value: number) => <>{value === 1 ? "Hoạt động" : "Không hoạt động"}</>
        },
        {
            title: "Người sử dụng",
            render: (record: GroupAuthorizationInfo) => 
                <Button onClick={() => onClickViewUserList(record)}>Xem</Button>
        },
        {
            title: "Action",
            render: function (value: GroupAuthorizationInfo) {
                return (
                    <>
                        <Menu
                            mode="horizontal"
                            defaultSelectedKeys={["SubMenu"]}
                            className="menu-corg"
                        >
                            <Menu.SubMenu key="SubMenu" icon={<List size={18} />}>
                                <Menu.Item
                                    key="update"
                                    icon={<Edit size={14} />}
                                    onClick={() => PopupEditModal(value.GroupID)}
                                >
                                    {t("X_Trade_Button_Update")}
                                </Menu.Item>
                                <Menu.Item
                                    key="delete"
                                    icon={<Delete size={14} />}
                                    onClick={() => popupConfirmDelete(value.GroupID)}
                                >
                                    {t("X_Trade_Button_Delete")}
                                </Menu.Item>
                                <Menu.Item
                                    key="authorize"
                                    icon={<Activity size={14} />}
                                    onClick={() => PopupAuthorizeModal(value)}
                                >
                                    Phân quyền
                                </Menu.Item>
                            </Menu.SubMenu>
                        </Menu>
                    </>
                );
            },
            fixed: "right",
            width: 70,
            align: "center",
        },
    ]

    const onClickViewUserList = (value: GroupAuthorizationInfo) => {
        groupStore.OnShowModalViewUsers(true)
        groupStore.GetUsersByGroup(value)
    }

    const PopupAddModal = () => {
        groupStore.OnShowModalEdit(true);
        groupStore.ToggleIsEditing(false);
    }

    const PopupEditModal = (groupId: number) => {
        groupStore.OnShowModalEdit(true);
        groupStore.ToggleIsEditing(true);
        groupStore.InitializeEditingGroupInfo(groupId)
    }
    
    const popupConfirmDelete = (GroupID: number) => {
        swal.fire({
          html: "Bạn có muốn xóa nhóm quyên?",
          customClass: {
            confirmButton: "btn btn-gradient-primary mr-1",
            cancelButton: "btn btn-gradient-secondary",
          },
          showClass: {
            popup: "animate__animated animate__flipInX",
          },
          buttonsStyling: false,
          showCancelButton: true,
          confirmButtonText: "Đồng ý",
          cancelButtonText: "Hủy",
        }).then(async (result) => {
          if (result.isConfirmed) {
            groupStore.OnDeleteGroupInfo(GroupID)
          }
        });
    };

    const PopupAuthorizeModal = (record: GroupAuthorizationInfo) => {
        groupStore.OnShowModalAuthorize(true);
        groupStore.GetFunctionAuth(record)
    }

    const onClickButtonSearch = (form: {GroupName: string}) => {
        let { groupInfos, expandedRows } = searchTree(groupStore.groupAuthList, form.GroupName)
        setData([...groupInfos])
        setExpandedRowKeys([...expandedRows])
    }

    const searchTree = (data: GroupAuthorizationInfo[], keyword: string, root?: GroupAuthorizationInfo): SearchTreeResult => {
        let groupInfos: GroupAuthorizationInfo[] = []
        let expandedRows: number[] = []
        data.map((item) => {
            if(item.GroupName.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                if(!item.ParentID) groupInfos = [...groupInfos, item]
                else {
                    if (root) {
                        if (groupInfos.indexOf(root) === -1) groupInfos = [...groupInfos, root]
                        if (expandedRows.indexOf(root.GroupID) === -1) expandedRows = [...expandedRows, root.GroupID]
                      }
                    if (expandedRows.indexOf(item.ParentID) === -1) expandedRows = [...expandedRows, item.ParentID]
                }
            }
            if (item.children) {
                let childrenResult = root ? searchTree(item.children, keyword, root) : searchTree(item.children, keyword, item)
                groupInfos = [...childrenResult.groupInfos.filter(x => groupInfos.indexOf(x) === -1), ...groupInfos]
                expandedRows = [...expandedRows, ...childrenResult.expandedRows.filter(x => expandedRows.indexOf(x) === -1)]
            }
        })
        return { groupInfos, expandedRows }
    }

    const onTableExpand = (expanded: boolean, groupInfo: GroupAuthorizationInfo) => {
        if(expanded) {
            setExpandedRowKeys([...expandedRowKeys, groupInfo.GroupID])
        } else {
            let groupInfoIndex = expandedRowKeys.indexOf(groupInfo.GroupID)
            if (groupInfoIndex > -1) 
            {
                setExpandedRowKeys([...expandedRowKeys.slice(0, groupInfoIndex),...expandedRowKeys.slice(groupInfoIndex + 1)])
            }
        }
    }

    const resetForm = () => {
        groupStore.GetGroupAuthList()
        setExpandedRowKeys([])
    }
    
    return(
        <Card>
            <CardHeader>
                <h4>
                    {t("authorize_group")}
                </h4>
                <Button
                    htmlType="button"
                    className="btn btn-gradient-info"
                    color="gradient-info"
                    onClick={() => PopupAddModal()}
                >
                    {t("X_Trade_Button_Add_New")}
                </Button>
            </CardHeader>
            <CardBody>
                <Form
                    layout={"vertical"}
                    form={form}
                    initialValues={defaultValue}
                    onFinish={onClickButtonSearch}
                    requiredMark={false}
                >
                <Row>
                    <Col lg="6" md="6">
                        <Form.Item
                            label="Tên nhóm quyền"
                            name="GroupName"
                        >
                            <Input
                                size="small"
                                placeholder="Tên nhóm quyền"
                                autoComplete="Off"
                            />
                        </Form.Item>
                    </Col>
                    <Col lg="24" md="24" className="text-center">
                        <Form.Item>
                            <Button
                                htmlType="submit"
                                className="btn btn-gradient-info"
                                color="gradient-info"
                            >
                            {t("X_Trade_Button_Search")}
                            </Button>
                            &nbsp;&nbsp;
                            <Button
                                htmlType="button"
                                className="btn btn-gradient-secondary"
                                color="gradient-secondary"
                                onClick={resetForm}
                            >
                            {t("X_Trade_Button_Reset")}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
                </Form>
                <Row>
                    <Col sm="24" md="24">
                        { data.length > 0 && <Table
                            columns={columns}
                            dataSource={data}
                            rowKey="GroupID"
                            expandable={{defaultExpandAllRows: true}}
                            loading={groupStore.isLoadingData}
                            expandedRowKeys={expandedRowKeys}
                            onExpand={onTableExpand}
                            pagination={false}
                        />}
                    </Col>
                </Row>
            </CardBody>
            <Modal
                isOpen={groupStore.isShowingEditPopup}
                className="modal-lg modal-dialog-centered"
                backdrop={"static"}
            >
                <ModalHeader
                    toggle={() => {groupStore.OnShowModalEdit(!groupStore.isShowingEditPopup)}}
                >
                    <Label for="basicInput">
                        <h4>{groupStore.isEditing ? "Sửa nhóm quyền" : "Thêm nhóm quyền mới"}</h4>
                    </Label>
                </ModalHeader>
                <ModalBody>
                    <FormEdit />
                </ModalBody>
            </Modal>
            <Modal
                isOpen={groupStore.isAuthorizingPopup}
                className="modal-xl modal-dialog-centered"
                backdrop={"static"}
            >
                <ModalHeader
                    toggle={() => {groupStore.OnShowModalAuthorize(!groupStore.isAuthorizingPopup)}}
                >
                    <Label for="basicInput">
                        <h4>Phân quyền</h4>
                    </Label>
                </ModalHeader>
                <ModalBody>
                    <GroupAuthorizeTree />
                </ModalBody>
            </Modal>
            <Modal
                isOpen={groupStore.isViewingUsersPopup}
                className="modal-lg modal-dialog-centered"
                backdrop={"static"}
            >
                <ModalHeader
                    toggle={() => {groupStore.OnShowModalViewUsers(!groupStore.isViewingUsersPopup)}}
                >
                </ModalHeader>
                <ModalBody>
                    <GroupAuthUserList />
                </ModalBody>
            </Modal>
        </Card>
    )
})

export default index;
