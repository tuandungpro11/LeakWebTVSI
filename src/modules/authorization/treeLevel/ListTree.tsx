import { Form, Input, Menu, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import { Activity, Delete, Edit, List, Twitch, User } from "react-feather";
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
import { treeLevelStore } from "../store/treeLevelStore";
import { pageSizeTable, SearchTreeResult_TreLevel, SystemLeveInfo } from "../type";
import PerfectScrollbar from "react-perfect-scrollbar";
import FormAddNew from "./FormAddNew";
import FormUpdate from "./FormUpdate";
import Swal from "sweetalert2";
import FormDetail from "./FormDetail";
import { TableRowSelection } from "antd/lib/table/interface";
import { appStore } from "../../../stores/appStore";

const ListTree = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueLoad, setValueLoad] = useState(false);
    const [valueUpdate, setValueUpdate] = useState<SystemLeveInfo[]>([]);
    const [dataTable, setDataTable] = useState<SystemLeveInfo[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
    const MySwal = withReactContent(Swal);
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const columns: ColumnsType<SystemLeveInfo> = [
      {
        title: "Mã",
        dataIndex: "Code",
        key: "Code",
      },
      {
        title: "SysLevelID",
        dataIndex: "SysLevelID",
        key: "SysLevelID",
        width: "10%",
      },
      {
        title: "Tên",
        dataIndex: "Name",
        key: "Name",
        width: "12%",
      },
      {
        title: "Mã CN",
        dataIndex: "BranchCode",
        width: "10%",
        key: "BranchCode",
      },
      {
        title: "Loại cấp độ",
        dataIndex: "LevelType",
        width: "10%",
        key: "LevelType",
      },
      {
        title: "Trạng thái",
        dataIndex: "Status",
        width: "10%",
        key: "Status",
        render: (value: number) => (
          <>{value === 1 ? "Hoạt động" : "Không hoạt động"}</>
        ),
      },
      {
        title: "Người dùng",
        width: "10%",
        render: (record: any) => (
          <>
            <Button color="info" onClick={() => viewUserList(record)}>Xem</Button>
          </>
        ),
      },
      {
        title: "Action",
        render: function (value: any) {
          return (
            <>
              <Fragment>
                <Menu
                  mode="horizontal"
                  defaultSelectedKeys={["SubMenu"]}
                  className="menu-corg"
                >
                  <Menu.SubMenu key="SubMenu" icon={<List size={18} />}>
                    <Menu.Item
                      key="twwo"
                      icon={<Edit size={14} />}
                      onClick={() => popupUpdate(value)}
                    >
                      {t("X_Trade_Button_Update")}
                    </Menu.Item>
                    <Menu.Item
                      key="three"
                      icon={<Delete size={14} />}
                      onClick={() => popupConfirmDel(value)}
                    >
                      {t("X_Trade_Button_Delete")}
                    </Menu.Item>
                    {/* <Menu.Item
                      key="authorize"
                      icon={<Activity size={14} />}
                      // onClick={() => PopupAuthorizeModal(value)}
                    >
                      Phân quyền
                    </Menu.Item> */}
                  </Menu.SubMenu>
                </Menu>
              </Fragment>
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
    const onSubmit = () => {};
    const resetForm = () => {
      treeLevelStore.GetSystemLevelList();
      setExpandedRowKeys([]);
    };
    const onClickButtonSearch = (form: { BranchCode: string }) => {
      let { groupInfosTree, expandedRows } = searchTree(
        treeLevelStore.dataListTreeLevel,
        form.BranchCode
      );
      setDataTable([...groupInfosTree]);
      setExpandedRowKeys([...expandedRows]);
      console.log(expandedRows);
    };

    const searchTree = (
      data: SystemLeveInfo[],
      keyword: string,
      root?: SystemLeveInfo
    ): SearchTreeResult_TreLevel => {
      let groupInfosTree: SystemLeveInfo[] = [];
      let expandedRows: number[] = [];
      data.map((item) => {
        if (item.Code.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
          if (!item.ParentID) groupInfosTree = [...groupInfosTree, item];
          else {
            if (root) {
              if (groupInfosTree.indexOf(root) === -1)
                groupInfosTree = [...groupInfosTree, root];
              if (expandedRows.indexOf(root.SysLevelID) === -1)
                expandedRows = [...expandedRows, root.SysLevelID];
            }
            if (expandedRows.indexOf(item.ParentID) === -1)
              expandedRows = [...expandedRows, item.ParentID];
          }
        }
        if (item.children) {
          let childrenResult = root
            ? searchTree(item.children, keyword, root)
            : searchTree(item.children, keyword, item);
          groupInfosTree = [
            ...childrenResult.groupInfosTree.filter(
              (x: SystemLeveInfo) => groupInfosTree.indexOf(x) === -1
            ),
            ...groupInfosTree,
          ];
          expandedRows = [
            ...expandedRows,
            ...childrenResult.expandedRows.filter(
              (x: number) => expandedRows.indexOf(x) === -1
            ),
          ];
        }
      });
      return { groupInfosTree, expandedRows };
    };

    const onTableExpand = (expanded: boolean, groupInfo: SystemLeveInfo) => {
      if (expanded) {
        setExpandedRowKeys([...expandedRowKeys, groupInfo.SysLevelID]);
      } else {
        let groupInfoIndex = expandedRowKeys.indexOf(groupInfo.SysLevelID);
        if (groupInfoIndex > -1) {
          setExpandedRowKeys([
            ...expandedRowKeys.slice(0, groupInfoIndex),
            ...expandedRowKeys.slice(groupInfoIndex + 1),
          ]);
        }
      }
    };

    const PopupAddNew = () => {
      treeLevelStore.onShowModalAddNew(true);
    };
    const popupUpdate = (value:any) => {
      setValueUpdate(value);
      treeLevelStore.onShowModalUpdate(true);
    };
    const popupConfirmDel = (value: SystemLeveInfo) => {
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
          const paramDel = {
            UserName: appStore.account.LoginName,
            SysLevelID: value.SysLevelID,
          };
          treeLevelStore.DeleteSystemLevelInfo(paramDel);
        }
      });
    };

    const viewUserList = (value: any) => {
      // setValueUpdate(treeLevelStore.selectedData);
      console.log("click")
      setValueUpdate(value);
      treeLevelStore.onShowModalDetail(true);
    };

    useEffect(() => {
      treeLevelStore.GetSystemLevelList();
    }, []);

    useEffect(() => {
      setDataTable([...treeLevelStore.dataListTreeLevel]);
    }, [treeLevelStore.dataListTreeLevel]);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("authorization_system_level_title")}</h4>
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
                  <Form.Item
                    label={t("X_Trade_Branch_Bank_No")}
                    name="BranchCode"
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Branch_Bank_No")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                {/* <Col lg="6" md="6">
                  <Form.Item label={t("SaleId")} name="saleId">
                    <Input
                      size="small"
                      placeholder={t("SaleId")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col> */}
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
                {dataTable.length > 0 && <Table
                  columns={columns}
                  dataSource={dataTable}
                  size="small"
                  scroll={{ y: 600 }}
                  loading={treeLevelStore.loadingData}
                  onExpand={onTableExpand}
                  expandedRowKeys={expandedRowKeys}
                  expandable={{defaultExpandAllRows: true}}
                  rowKey="SysLevelID"
                  pagination={false}
                />}
              </Col>
            </Row>
          </CardBody>
          <PerfectScrollbar>
            <Modal
              isOpen={treeLevelStore.isShowPopup}
              toggle={() =>
                (treeLevelStore.isShowPopup = !treeLevelStore.isShowPopup)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (treeLevelStore.isShowPopup = !treeLevelStore.isShowPopup)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorize_level_add_new")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormAddNew />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          <PerfectScrollbar>
            <Modal
              isOpen={treeLevelStore.isShowPopupModalUpdate}
              toggle={() =>
                (treeLevelStore.isShowPopupModalUpdate =
                  !treeLevelStore.isShowPopupModalUpdate)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (treeLevelStore.isShowPopupModalUpdate =
                    !treeLevelStore.isShowPopupModalUpdate)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorize_level_update")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormUpdate valueUpdate={valueUpdate} />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
          <PerfectScrollbar>
            <Modal
              isOpen={treeLevelStore.isShowPopupModalDetail}
              toggle={() =>
                (treeLevelStore.isShowPopupModalDetail =
                  !treeLevelStore.isShowPopupModalDetail)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (treeLevelStore.isShowPopupModalDetail =
                    !treeLevelStore.isShowPopupModalDetail)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorize_level_detail")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormDetail valueUpdate={valueUpdate} />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
        </Card>
      </Fragment>
    );
  });

export default ListTree;
