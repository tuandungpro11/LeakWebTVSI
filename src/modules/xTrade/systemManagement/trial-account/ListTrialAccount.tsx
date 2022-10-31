import { Form, Input, Menu, PaginationProps, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { List, Trash2, UserCheck, UserX } from "react-feather";
import { useTranslation } from "react-i18next";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { storeSystemManagement } from "../../store/SystemManagementStore";
import AddTrialAccount from "./AddTrialAccount";
import Select from "react-select";
import { customSMSelectStyles, trialAccountStatus } from "../../types";
import { selectThemeColors } from "../../../../utility/Utils";
import { Moment } from "../../../../utility/general/Moment";
import PerfectScrollbar from "react-perfect-scrollbar";

const ListTrialAccount = () =>
  useObserver(() => {
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [form] = Form.useForm();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const MySwal = withReactContent(Swal);
    const { t } = useTranslation();
    const [valueLoad, setValueLoad] = useState(false);
    const handlePageChangeCustomerAccount = (page: any) => {
      setPageIndex(page);
    };
    const handlePerRowsChangeCustomerAccount = (newpage: any, page: any) => {
      setPageSize(page);
    };

    const onSubmit = () => {
      const formValue = form.getFieldsValue();
      handlePageChangeCustomerAccount(1);
      let url = "";
      if (
        formValue.custCode &&
        formValue.custCode !== null &&
        formValue.custCode.trim() !== ""
      ) {
        url += "custCode=" + formValue.custCode.trim() + "&";
      }
      url += "status=" + formValue.status.value;
      storeSystemManagement.GetListTrialAccount(url);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    const exportAccount = () => {
      const formValue = form.getFieldsValue();
      handlePageChangeCustomerAccount(1);
      let url = "";
      if (
        formValue.custCode &&
        formValue.custCode !== null &&
        formValue.custCode.trim() !== ""
      ) {
        url += "custCode=" + formValue.custCode.trim() + "&";
      }
      url += "status=" + formValue.status.value;
      storeSystemManagement.ExportTrialAccount(url, 'DANH_SACH_DANG_KY_TRAI_NGHIEM_XTRADE');
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    const changeAccountStatus = (item: any, status: number) => {
      const title = status === 1 ? "active" : "inactive";
      MySwal.fire({
        html: "Bạn có muốn " + title + " tài khoản " + item.CustCode + "?",
        customClass: {
          confirmButton: "btn btn-gradient-success mr-1",
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
          const url = "?custCode=" + item.CustCode + "&status=" + status;
          storeSystemManagement.ChangeTrialAccountStatus(url);
        }
      });
    };

    const addNewAccount = () => {
      storeSystemManagement.onShowAddTrialAccount(true);
    };

    const setStatusColor = (item: any) => {
      if (item.Status === 1) {
        return (
          <Badge pill color="light-success" className="me-1">
            {item.StatusText}
          </Badge>
        );
      } else {
        return (
          <Badge pill color="light-danger" className="me-1">
            {item.StatusText}
          </Badge>
        );
      }
    };

    const customerAccountColumn: ColumnsType<any> = [
      {
        title: "STT",
        key: "STT",
        render: (v, s, index) => index + 1 + (pageIndex - 1) * pageSize,
        width: 50,
        align: "center",
      },
      {
        title: t("Customer_Code"),
        key: "CustCode",
        dataIndex: "CustCode",
      },
      {
        title: t("X_Trade_Status"),
        key: "StatusText",
        render: (v, r, i) => {
          return <>{setStatusColor(v)}</>;
        },
        align: "center",
      },
      {
        title: t("Created_Date"),
        key: "CreatedDate",
        render: (v, r, i) => {
          return Moment.formatDateNew(v.CreatedDate, "DD-MM-yyyy");
        },
        align: "center",
      },
      {
        title: "Action",
        render: (v, record, index) => (
          <Fragment key={index}>
            {v.Status === 1 ? (
              <>
                <Tooltip placement="left" title={"Inactive tài khoản"}>
                  <Button.Ripple
                    className="btn-icon"
                    color="flat-danger"
                    id="positionLeftInactive"
                    onClick={() => changeAccountStatus(v, 0)}
                    size="sm"
                  >
                    <UserX size={18} />
                  </Button.Ripple>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip placement="left" title={"Active tài khoản"}>
                  <Button.Ripple
                    className="btn-icon"
                    color="flat-success"
                    id="positionLeftActive"
                    onClick={() => changeAccountStatus(v, 1)}
                    size="sm"
                  >
                    <UserCheck size={18} />
                  </Button.Ripple>
                </Tooltip>
              </>
            )}
          </Fragment>
        ),
        width: 150,
        fixed: "right",
        align: "center",
      },
    ];

    // useEffect(() => {
    //   onSubmit();
    // }, []);

    const resetForm = () => {
      form.resetFields();
      onSubmit();
    };

    const valueDefault = {
      custCode: "",
      status: trialAccountStatus[0],
    };

    useEffect(() => {
      storeSystemManagement.listTrialAccount = [];
      storeSystemManagement.listTrialAccount.length = 0;
    }, [])

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("User_Management")}</h4>
            <Button
              htmlType="button"
              className="btn btn-gradient-info"
              color="gradient-info"
              onClick={() => addNewAccount()}
            >
              {t("X_Trade_Button_Add_New")}
            </Button>
          </CardHeader>
          <CardBody>
            <Row>
              <Col sm="24">
                <Form
                  layout={"vertical"}
                  form={form}
                  initialValues={valueDefault}
                  onFinish={onSubmit}
                  requiredMark={false}
                >
                  <Row>
                    <Col lg="6" md="6">
                      <Form.Item label={t("Customer_Code")} name="custCode">
                        <Input
                          size="small"
                          placeholder={t("Customer_Code")}
                          autoComplete="Off"
                        />
                      </Form.Item>
                    </Col>

                    <Col lg="6" md="6">
                      <Form.Item label={t("X_Trade_Status")} name="status">
                        <Select
                          options={trialAccountStatus}
                          isClearable={false}
                          theme={selectThemeColors}
                          className="react-select react-select-sm"
                          classNamePrefix="select"
                          styles={customSMSelectStyles}
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
                        &nbsp;&nbsp;
                        <Button
                          htmlType="button"
                          className="btn btn-gradient-success"
                          color="gradient-success"
                          onClick={exportAccount}
                        >
                          {t("X_Trade_Button_Export")}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Col sm="24" md="24">
                <Table
                  className="mt-1"
                  columns={customerAccountColumn}
                  dataSource={storeSystemManagement.listTrialAccount}
                  size="small"
                  scroll={{ x: 800, y: 800 }}
                  loading={storeSystemManagement.loadingData}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange: handlePerRowsChangeCustomerAccount,
                    pageSizeOptions: [10, 25, 50, 100],
                    defaultPageSize: 10,
                    current: pageIndex,
                    total: storeSystemManagement.listTrialAccount.length,
                    onChange: handlePageChangeCustomerAccount,
                    className: "mt-1 text-right custom-ant-pagination",
                    locale: { items_per_page: "/ trang" },
                    showTotal: showTotal,
                  }}
                />
              </Col>
            </Row>
          </CardBody>
          <Modal
            isOpen={storeSystemManagement.isShowAddTrialAccount}
            toggle={() =>
            (storeSystemManagement.isShowAddTrialAccount =
              !storeSystemManagement.isShowAddTrialAccount)
            }
            className="modal-lg modal-dialog-centered"
            backdrop={"static"}
          >
            <ModalHeader
              toggle={() =>
              (storeSystemManagement.isShowAddTrialAccount =
                !storeSystemManagement.isShowAddTrialAccount)
              }
            >
              <h4>{t("Create_User")}</h4>
            </ModalHeader>
            <ModalBody>
              <AddTrialAccount />
            </ModalBody>
          </Modal>
        </Card>
      </Fragment>
    );
  });

export default ListTrialAccount;
