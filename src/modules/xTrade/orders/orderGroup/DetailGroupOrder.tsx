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

const ListGroupOrder = (valueUpdate: any) =>
  useObserver(() => {
    const [form] = Form.useForm();
    const valueBind = valueUpdate.valuesUpdate;
    const { RangePicker } = DatePicker;

    const { t } = useTranslation();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const listGroupOrder: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index +
          1 +
          (storeOrder.pageIndexDetailGroupOrder - 1) *
            storeOrder.pageSizeDetailGroupOrder,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã khách hàng",
        dataIndex: "CustomerID",
        key: "CustomerID",
        width: 200,
      },
      {
        title: "Số tài khoản",
        dataIndex: "GroupName",
        key: "GroupName",
        width: 200,
      },
      {
        title: "Mã CK",
        dataIndex: "secSymbol",
        key: "secSymbol",
        width: 200,
      },
      {
        title: "Loại lệnh",
        dataIndex: "secSymbol",
        key: "secSymbol",
        width: 200,
      },
      {
        title: "Giá đặt",
        render: function (value: any) {
          return numberUtil.formatNumber(value.price);
        },
        width: 200,
        align: "right",
      },
      {
        title: "KL đặt",
        render: function (value: any) {
          return numberUtil.formatNumber(value.price);
        },
        width: 200,
        align: "right",
      },
    ];
    const [loading, setLoading] = useState(false);

    const onSubmit = () => {
      const param = {
        BranchId: "",
        CustomerID: valueBind.CustormerId,
        AccountNo: "",
        BasketID: valueBind.BasketID,
        PageIndex: storeOrder.pageIndexDetailGroupOrder,
        PageSize: storeOrder.pageSizeDetailGroupOrder,
      };

      storeOrder.getListDetailGroupOrder(param);
    };
    const onClickButtonSearch = () => {
      if (storeOrder.pageIndexDetailGroupOrder == 1) {
        onSubmit();
      } else {
        storeOrder.pageIndexDetailGroupOrder = 1;
      }
    };

    useEffect(() => {
      onSubmit();
    }, [
      storeOrder.pageIndexDetailGroupOrder,
      storeOrder.pageSizeDetailGroupOrder,
    ]);

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
              onFinish={onClickButtonSearch}
              requiredMark={false}
            >
              <Row>
                <Col sm="24" md="24">
                    <Table
                      columns={listGroupOrder}
                      dataSource={storeOrder.dataListDetailGroupOrder}
                      size="small"
                      scroll={{ x: 800, y: 800 }}
                      loading={storeOrder.loadingData}
                      pagination={{
                        showSizeChanger: true,
                        onShowSizeChange:
                          storeOrder.handlePerRowsDetailGroupOrder,
                        pageSizeOptions: pageSizeTable,
                        total: storeOrder.totalRowsDetailGroupOrder,
                        showTotal: showTotal,
                        onChange: storeOrder.handlePageChangeDetailGroupOrder,
                        className: "mt-1 text-right custom-ant-pagination",
                        defaultCurrent: storeOrder.pageIndexDetailGroupOrder,
                        locale: { items_per_page: "/ trang" },
                        current: storeOrder.pageIndexDetailGroupOrder,
                      }}
                    />
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default ListGroupOrder;
