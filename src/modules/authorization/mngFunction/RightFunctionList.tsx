import { Menu, PaginationProps, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React, { useState } from "react";
import { Activity, Delete, Edit, List, Plus } from "react-feather";
import { useTranslation } from "react-i18next";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { functionStore } from "../store/functionStore";
import { GroupInfoByRight, RightFunctionInfo } from "../type";
import { pageSizeTable } from "../constant";
import { Button, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import GroupsByRightList from "./GroupsByRightList";

const RightFunctionList = () => useObserver(() => {
    const { t } = useTranslation();
    const MySwal = withReactContent(Swal);
    const [selectedRightID, setSelectedRightID] = useState<number>(0)
    const showTotal: PaginationProps["showTotal"] = (total: number) =>
    `Tổng ${total} bản ghi`;
    
    const renderAction = (record: RightFunctionInfo) => {
        return <></>
    }

    const OnAddRightFunctionClicked = (rightCode: string, functionID: number) => {
        functionStore.AddRightFunctionInfo(rightCode, functionID)
    }

    const PopupDeleteModal = (rightCode: string, functionID: number) => {
        MySwal.fire({
            html: "Bạn có muốn xóa quyền?",
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
        }).then((result) => {
            if (result.isConfirmed) {
                functionStore.OnDeleteRightFunction(rightCode, functionID)
            }
        });
    }

    const PopupGroupsByRightList = (rightID: number) => {
        functionStore.GetGroupByRight(rightID)
        functionStore.onShowModalGroupByRights(true)
    }

    const rightListComlumns: ColumnsType<RightFunctionInfo> = [
        {
            title: "Tên quyền",
            dataIndex: "RightName",
            key: "RightName"
        },
        {
            title: "Mã quyền",
            dataIndex: "RightCode",
            key: "RightCode"
        },
        {
            title: "Action",
            render: (record: RightFunctionInfo) => 
                (<>
                    
                    {record.IsRight ? 
                        <Menu
                            mode="horizontal"
                            defaultSelectedKeys={["SubMenu"]}
                            className="menu-corg"
                        >
                            <Menu.SubMenu key="SubMenu" icon={<List size={18} />}>
                                <Menu.Item
                                    key="delete"
                                    icon={<Delete size={14} />}
                                    onClick={() => PopupDeleteModal(record.RightCode, record.FunctionID)}
                                >
                                    {t("X_Trade_Button_Delete")}
                                </Menu.Item>
                                <Menu.Item
                                    key="groupRight"
                                    icon={<Activity size={14} />}
                                    onClick={() => PopupGroupsByRightList(record.FunctionID)}
                                >
                                    Nhóm quyền
                                </Menu.Item>
                            </Menu.SubMenu>
                        </Menu>
                        : 
                        <Button
                            key="add"
                            className="btn btn-gradient-success"
                            color="gradient-success"
                            icon={<Plus size={14} />}
                            onClick={() => OnAddRightFunctionClicked(record.RightCode, record.FunctionID)}
                        >
                            Thêm
                        </Button>
                    }
                </>)
        }
    ]

    const groupsByRightListColumns: ColumnsType<GroupInfoByRight> = [
        {
            title: "Tên nhóm quyền",
            render: (record: GroupInfoByRight) => <>{record.GroupName}</>
        }, 
        {
            title: "Mã nhóm quyền",
            render: (record: GroupInfoByRight) => <>{record.GroupCode}</>
        },
        {
            title: "Cấp quyền cha",
            render: (record: GroupInfoByRight) => <>{record.ParentName}</>
        }
    ]

    return (
        <>
            <Table
                columns={rightListComlumns}
                dataSource={functionStore.rightFunctionList}
                scroll={{ x: 600, y: 800 }}
                rowKey="RightCode"
                pagination={{
                    showSizeChanger: true,
                    onShowSizeChange: functionStore.handlePerRowsListFunction,
                    pageSizeOptions: pageSizeTable,
                    total: functionStore.totalRowsListFunction,
                    showTotal: showTotal,
                    onChange: functionStore.handlePageChangeListFunction,
                    className: "mt-1 text-right custom-ant-pagination",
                    defaultCurrent: functionStore.pageIndexListFunction,
                    locale: { items_per_page: "/ trang" },
                    current: functionStore.pageIndexListFunction,
                  }}
            />
            <Modal
                isOpen={functionStore.isShowPopupGroupByRights}
                toggle={() => {
                    functionStore.onShowModalGroupByRights(!functionStore.isShowPopupGroupByRights)
                }}
            >
                <ModalHeader toggle={() => {
                    functionStore.onShowModalGroupByRights(!functionStore.isShowPopupGroupByRights)
                }}>
                    <Label for="basicInput">
                        <h4>Nhóm quyền</h4>
                    </Label> 
                </ModalHeader>
                <ModalBody>
                <Table
                    columns={groupsByRightListColumns}
                    dataSource={functionStore.groupsByRightList}
                    loading={functionStore.loadingGroupByRightList}
                    scroll={{ y: 800 }}
                    rowKey="GroupID"
                />
                </ModalBody>
            </Modal>
        </>
    )
})

export default RightFunctionList