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

const FormDetailAuthorize = (valueUpdateFrom:any) =>
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
        title: "Tên nhóm quyền",
        dataIndex: "CustomerId",
        key: "CustomerId",
        fixed: "left",
        align: "left",
        width: 150,
      },
      {
        title: "Mã nhóm quyền",
        dataIndex: "CUSTOMERNAME",
        key: "CUSTOMERNAME",
        align: "left",
        width: 200,
      },
      {
        title: "Cấp quyền",
        dataIndex: "CUSTOMERNAME",
        key: "CUSTOMERNAME",
        align: "left",
        width: 200,
      },
    ];

    const defaultValue = {
      appName: "",
    };
    const onSubmit = () => {};

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
        </Card>
      </Fragment>
    );
  });

export default FormDetailAuthorize;
