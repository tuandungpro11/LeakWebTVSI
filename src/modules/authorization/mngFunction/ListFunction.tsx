import { Form, Input, Menu, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import { Activity, Delete, Edit, List, Twitch } from "react-feather";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import withReactContent from "sweetalert2-react-content";
import { functionStore } from "../store/functionStore";
import { FunctionAuth, FunctionInfo, pageSizeTable, SearchFunctionTreeResult } from "../type";
import PerfectScrollbar from "react-perfect-scrollbar";
import FormUpdate from "./FormUpdate";
import Swal from "sweetalert2";
import RightFunctionList from "./RightFunctionList";
// import FormDetail from "./FormDetail";

const ListFunction = () =>
  useObserver(() => {
    const [form] = Form.useForm(); 
    const { t } = useTranslation();
    const [tableData, setTableData] = useState<FunctionAuth[]>([])
    const MySwal = withReactContent(Swal);
    const [searchValue, setSearchValue] = useState<string>("")
    const [expandedRowKeys, setExpandedRowKeys]  = useState<number[]>([])

    useEffect(() => {
      functionStore.GetFunctionAuthList()
    }, [])

    useEffect(() => {
      setTableData([...functionStore.functionAuthList])
    }, [functionStore.functionAuthList])
    
    const columns: ColumnsType<FunctionAuth> = [
      {
        title: 'Tên chức năng',
        dataIndex: 'FunctionName',
        key: 'FunctionName',
      },
      {
        title: 'Mã chức năng',
        dataIndex: 'FunctionCode',
        key: 'FunctionCode',
        width: '12%',
      },
      {
        title: 'Ứng dụng',
        dataIndex: 'AppName',
        width: '30%',
        key: 'AppName',
      },
      {
        title: "Action",
        render: function (value: FunctionAuth) {
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
                                onClick={() => PopupEditModal(value.FunctionID)}
                            >
                                {t("X_Trade_Button_Update")}
                            </Menu.Item>
                            <Menu.Item
                                key="delete"
                                icon={<Delete size={14} />}
                                onClick={() => PopupConfirmDelete(value.FunctionID)}
                            >
                                {t("X_Trade_Button_Delete")}
                            </Menu.Item>
                            <Menu.Item
                                key="permissionmgmt"
                                icon={<Activity size={14} />}
                                onClick={() => PopupRightMgmtModal(value.FunctionID)}
                            >
                                Quản lý quyền
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
    ];

    const defaultValue = {
      appName: "",
    };

    const PopupEditModal = (functionID: number) => {
      functionStore.ToggleEditing(true)
      functionStore.onShowModalEdit(true)
      functionStore.InitializeEditingFunctionInfo(functionID)
    }

    const PopupConfirmDelete = (functionID: number) => {
      MySwal.fire({
        html: "Bạn có muốn xóa chức năng?",
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
          functionStore.OnDeleteFunctionInfo(functionID)
        }
      });
    }

    const PopupRightMgmtModal = (functionID: number) => {
      functionStore.GetRightFunctionList(functionID)
      functionStore.onShowModalAuthorize(true)
    }

    const resetForm = () => {
      form.resetFields();
      setExpandedRowKeys([])
      setTableData([...functionStore.functionAuthList])
    };
    const onTableExpand = (expanded: boolean, functionAuth: FunctionAuth) => {
      if(expanded) {
          setExpandedRowKeys([...expandedRowKeys, functionAuth.FunctionID])
      } else {
          let functionAuthIndex = expandedRowKeys.indexOf(functionAuth.FunctionID)
          if (functionAuthIndex > -1) 
          {
              setExpandedRowKeys([...expandedRowKeys.slice(0, functionAuthIndex),...expandedRowKeys.slice(functionAuthIndex + 1)])
          }
      }
  }
    const onClickButtonSearch = (form: {FunctionName: string}) => {
      let { functionAuths, expandedRows } = searchTree(functionStore.functionAuthList, form.FunctionName)
      setTableData([...functionAuths])
      setExpandedRowKeys([...expandedRows])
    };
    const PopupAddNew = () => {
      functionStore.ToggleEditing(false)
      functionStore.onShowModalEdit(true)
      functionStore.InitializeEditingFunctionInfo()
    };

    const searchTree = (data: FunctionAuth[], keyword: string, root?: FunctionAuth): SearchFunctionTreeResult => {
      let functionAuths: FunctionAuth[] = []
      let expandedRows: number[] = []
      if(keyword.trim().length === 0) return { functionAuths: [...data], expandedRows }
      data.map((item) => {
          if(item.FunctionName.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
              if(!item.ParentID) functionAuths = [...functionAuths, item]
              else {
                  if (root) {
                      if (functionAuths.indexOf(root) === -1) functionAuths = [...functionAuths, root]
                      if (expandedRows.indexOf(root.FunctionID) === -1) expandedRows = [...expandedRows, root.FunctionID]
                    }
                  if (expandedRows.indexOf(item.ParentID) === -1) expandedRows = [...expandedRows, item.ParentID]
              }
          }
          if (item.children) {
              let childrenResult = root ? searchTree(item.children, keyword, root) : searchTree(item.children, keyword, item)
              functionAuths = [...childrenResult.functionAuths.filter(x => functionAuths.indexOf(x) === -1), ...functionAuths]
              expandedRows = [...expandedRows, ...childrenResult.expandedRows.filter(x => expandedRows.indexOf(x) === -1)]
          }
      })
      return { functionAuths, expandedRows }
  }

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("authorize_function_title")}</h4>
            <Button
              htmlType="button"
              className="btn btn-gradient-info"
              color="gradient-info"
              onClick={() => PopupAddNew()}
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
                  <Form.Item label={t("authorize_function_name")} name="FunctionName">
                    <Input
                      size="small"
                      placeholder={t("authorize_function_name")}
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
              <Col lg="24" md="24" className="text-center">
                {tableData.length > 0 && <Table
                  columns={columns}
                  dataSource={tableData}
                  size="small"
                  scroll={{ y: 500 }}
                  loading={functionStore.loadingData}
                  rowKey="FunctionID"
                  expandable={{defaultExpandAllRows: true}}
                  expandedRowKeys={expandedRowKeys}
                  onExpand={onTableExpand}
                  pagination={false}
                />}
              </Col>
            </Row>
          </CardBody>
            <Modal
              isOpen={functionStore.isShowPopupModalEdit}
              toggle={() =>
                (functionStore.isShowPopupModalEdit = !functionStore.isShowPopupModalEdit)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (functionStore.isShowPopupModalEdit = !functionStore.isShowPopupModalEdit)
                }
              >
                <Label for="basicInput">
                  <h4>{functionStore.isEditing ? t("authorize_function_update_form_title") : t("authorize_function_add_new_form_title")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormUpdate />
              </ModalBody>
            </Modal>
            <Modal
              isOpen={functionStore.isShowPopupModalAuthorize}
              toggle={() => functionStore.onShowModalAuthorize(!functionStore.isShowPopupModalAuthorize)}
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() => functionStore.onShowModalAuthorize(!functionStore.isShowPopupModalAuthorize)}
              >
                <Label for="basicInput">
                  <h4>{t("authorize_group")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <RightFunctionList/>
              </ModalBody>
            </Modal>
        </Card>
      </Fragment>
    );
  });

export default ListFunction;
