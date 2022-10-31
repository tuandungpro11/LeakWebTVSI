import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import DataTable from "react-data-table-component";
import { Book, ChevronDown, Delete, Edit, List, Loader } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
  UncontrolledButtonDropdown,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Moment } from "../../../../utility/general/Moment";
import { numberUtil } from "../../../../utility/general/NumberUtil";
import { SuccessProgressToast } from "../../../../views/extensions/toastify/ToastTypes";
import { storeOrder } from "../../store/OrdersStore";
import { customSMSelectStyles, pageSizeTable } from "../../types";
import PerfectScrollbar from "react-perfect-scrollbar";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import {
  DatePicker,
  Form,
  Input,
  Menu,
  Pagination,
  PaginationProps,
} from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import DetailGroupOrder from "./DetailGroupOrder";

const ListGroupOrder = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const [valueDate, setvalueDate] = useState(new Date());
    const { t } = useTranslation();
    const { register, getValues, errors, handleSubmit, control } = useForm();
    const [valueUpdate, setValueUpdate] = useState([]);
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueLoad, setValueLoad] = useState(false);
    const listGroupOrder: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (storeOrder.pageIndexGroupOrder - 1) * storeOrder.pageSizeGroupOrder,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã khách hàng",
        dataIndex: "CustomerID",
        key: "CustomerID",
        align: "left",
        width: 200,
      },
      {
        title: "Tên nhóm",
        dataIndex: "GroupName",
        key: "GroupName",
        align: "left",
        width: 200,
      },
      {
        title: "Mã CK",
        dataIndex: "secSymbol",
        key: "secSymbol",
        align: "left",
        width: 200,
      },
      {
        title: "Ngày tạo",
        render: function (value: any) {
          return Moment.formatDateNew(value.createdDate, "DD/MM/yyyy hh:mm:ss");
        },
        align: "center",
        width: 150,
      },
      {
        title: "Chi nhánh",
        dataIndex: "Branch",
        key: "Branch",
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
                      key="two"
                      icon={<Book size={14} />}
                      onClick={() => popupDetail(value)}
                    >
                      {t("X_Trade_Button_Update")}
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </Fragment>
            </>
          );
        },
        width: 80,
        align: "center",
      },
    ];
    const [loading, setLoading] = useState(false);

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        BranchId: "",
        CustomerID:
          valueForm.CustormerId == undefined ? "" : valueForm.CustormerId.trim(),
        AccountNo: "",
        PageIndex: storeOrder.pageIndexGroupOrder,
        PageSize: storeOrder.pageSizeGroupOrder,
      };

      storeOrder.getListGroupOrder(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (storeOrder.pageIndexGroupOrder == 1) {
        onSubmit();
      } else {
        storeOrder.pageIndexGroupOrder = 1;
      }
    };

    const popupDetail = (value: any) => {
      setValueUpdate(value);
      storeOrder.onShowModalUpdate(true);
    };

    const resetForm = () => {
      form.resetFields();
      if (storeOrder.pageIndexGroupOrder == 1) {
        onSubmit();
      } else {
        storeOrder.pageIndexGroupOrder = 1;
      }
    };
    const defaultValue = {
      CustomerId: "",
    };

    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [storeOrder.pageIndexGroupOrder, storeOrder.pageSizeGroupOrder]);

    useEffect(()=>{
      storeOrder.dataListGroupOrder=[];
      storeOrder.totalRowsGroupOrder=0;
    },[])

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Group_Order")}</h4>
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
                    label={t("X_Trade_Customer_Id")}
                    name="CustormerId"
                  >
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Customer_Id")}
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 6) {
                          form.setFieldsValue({CustormerId: object.target.value.slice(0, 6)})
                        }
                      }}
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
                    {/* &nbsp;&nbsp;
                    <Button
                      htmlType="button"
                      className="btn btn-gradient-success"
                      color="gradient-success"
                    >
                      {t("X_Trade_Button_Export")}
                    </Button> */}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col sm="24" md="24">
                    <Table
                      columns={listGroupOrder}
                      dataSource={storeOrder.dataListGroupOrder}
                      size="small"
                      scroll={{ x: 800, y: 800 }}
                      loading={storeOrder.loadingData}
                      pagination={{
                        showSizeChanger: true,
                        onShowSizeChange: storeOrder.handlePerRowsGroupOrder,
                        pageSizeOptions: pageSizeTable,
                        total: storeOrder.totalRowsGroupOrder,
                        showTotal: showTotal,
                        onChange: storeOrder.handlePageChangeGroupOrder,
                        className: "mt-1 text-right custom-ant-pagination",
                        defaultCurrent: storeOrder.pageIndexGroupOrder,
                        locale: { items_per_page: "/ trang" },
                        current: storeOrder.pageIndexGroupOrder,
                      }}
                    />
                </Col>
              </Row>
            </Form>
          </CardBody>
          <PerfectScrollbar>
            <Modal
              isOpen={storeOrder.isShowPopupModalUpdate}
              toggle={() =>
                (storeOrder.isShowPopupModalUpdate =
                  !storeOrder.isShowPopupModalUpdate)
              }
              className="modal-lg modal-dialog-centered"
              backdrop={"static"}
            >
              <ModalHeader
                toggle={() =>
                  (storeOrder.isShowPopupModalUpdate =
                    !storeOrder.isShowPopupModalUpdate)
                }
              >
                <Label for="basicInput">
                  <h4>{t("X_Trade_Detail_Group_Order")}</h4>
                </Label>
              </ModalHeader>
              <ModalBody>
                <DetailGroupOrder valueUpdate={valueUpdate} />
              </ModalBody>
            </Modal>
          </PerfectScrollbar>
        </Card>
      </Fragment>
    );
  });

export default ListGroupOrder;
