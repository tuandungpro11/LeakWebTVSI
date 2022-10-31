import { Form, Input, Menu, PaginationProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React, { Fragment } from "react";
import { useState } from "react";
import { Delete, Edit, List, Twitch } from "react-feather";
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
import {
  bankAccountStatusOption,
  customSMSelectStyles,
  pageSizeTable,
} from "../type";
import PerfectScrollbar from "react-perfect-scrollbar";
import Swal from "sweetalert2";
import { selectThemeColors } from "../../../utility/Utils";
import Select from "react-select";
import { userType } from "../../dashboard/types";

const FormAuthorize = (valueUpdateFrom:any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [valueLoad, setValueLoad] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);
    const valueBind= valueUpdateFrom.valueUpdateFrom;
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;

    const listTitleColumn: ColumnsType<any> = [
      {
        title: "Thêm mới",
        dataIndex: "CustomerId",
        key: "CustomerId",
        fixed: "left",
        align: "left",
        width: 150,
      },
      {
        title: "Mã quyền",
        dataIndex: "CUSTOMERNAME",
        key: "CUSTOMERNAME",
        align: "left",
        width: 200,
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
                      icon={<Twitch size={14} />}
                      onClick={() => popupGroupAuthorization(value)}
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
    const popupGroupAuthorization = (value: any) => {
      setValueUpdate(value);
      functionStore.onShowModalAuthorize(true);
    };
    const popupConfirmDel = (value: any) => {
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
          const paramDel = {};
          // functionStore.onDeleteBankById(paramDel);
        }
      });
    };

    return (
      <Fragment>
        <Card>
          <CardBody>
            <Row>
              <Col sm="24" md="24">
                <Table
                  columns={listTitleColumn}
                  dataSource={functionStore.dataListFunction}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={functionStore.loadingData}
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
              </Col>
            </Row>
          </CardBody>
          <PerfectScrollbar>
            <Modal
              isOpen={functionStore.isShowPopupModalUpdate}
              toggle={() =>
                (functionStore.isShowPopupModalUpdate =
                  !functionStore.isShowPopupModalUpdate)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (functionStore.isShowPopupModalUpdate =
                    !functionStore.isShowPopupModalUpdate)
                }
              >
                <Label for="basicInput">
                  <h4>{t("authorize_function_detail_authorize_title")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <FormDetailAuthorize valueUpdate={valueUpdate} />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
        </Card>
      </Fragment>
    );
  });

export default FormAuthorize;
