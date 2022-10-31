import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  CustomInput,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Moment } from "../../../../../utility/general/Moment";
import { numberUtil } from "../../../../../utility/general/NumberUtil";
import { store } from "../../../store/FunctionStore";
import { customSMSelectStyles, listAPI, pageSizeTable } from "../../../types";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import {
  DatePicker,
  Form,
  Input,
  Menu,
  Pagination,
  PaginationProps,
  Tooltip,
} from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { Delete, List, Trash } from "react-feather";
import { appStore } from "../../../../../stores/appStore";
import PerfectScrollbar from "react-perfect-scrollbar";
import { kMaxLength } from "buffer";
import FormChangeStatus from "./ChangeStatus";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../../../views/extensions/toastify/ToastTypes";

const ListRightBuy = () =>
  useObserver(() => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const [valueDate, setvalueDate] = useState(new Date());
    const { t } = useTranslation();
    const { register, getValues, errors, handleSubmit, control } = useForm();
    const showTotal: PaginationProps["showTotal"] = (total) =>
      `Tổng ${total} bản ghi`;
    const [valueLoad, setValueLoad] = useState(false);
    const listStatus = [
      { value: -1, label: "Tất cả" },
      { value: 1, label: "Chờ xử lý" },
      { value: 2, label: "Đang xử lý" },
      { value: 3, label: "Đã xử lý" },
      { value: 4, label: "Bị từ chối" },
      { value: 5, label: "Hủy" },
    ];
    const listHistoryLogin: ColumnsType<any> = [
      {
        title: "STT",
        //   selector: "id",
        render: (v, s, index) =>
          index + 1 + (store.pageIndexRightBuy - 1) * store.pageSizeRightBuy,
        width: 50,
        align: "center",
        fixed: "left",
      },
      {
        title: "Trạng thái",
        render: function (value: any) {
          if (value.Status == 1) {
            return "Chờ xử lý";
          }
          if (value.Status == 2) {
            return "Đang xử lý";
          }
          if (value.Status == 3) {
            return "Đã xử lý";
          }
          if (value.Status == 4) {
            return "Bị từ chối";
          }
          if (value.Status == 5) {
            return "Hủy";
          }
        },
        align: "left",
        width: 200,
      },
      {
        title: "Lý do từ chối",
        dataIndex: "Reason",
        key: "Reason",
        align: "left",
        width: 200,
      },
      {
        title: "Thời gian đăng ký",
        render: function (value: any) {
          return value.RightDate == null
            ? ""
            : Moment.formatDateNew(value.RightDate, "DD/MM/yyyy HH:mm:ss");
        },
        align: "center",
        width: 200,
      },
      {
        title: "Ngày hết hạn đăng ký",
        render: function (value: any) {
          return value.CONFIRMDATE == null
            ? ""
            : Moment.formatDateNew(value.CONFIRMDATE, "DD/MM/yyyy");
        },
        align: "center",
        width: 200,
      },
      {
        title: "Mã KH",
        dataIndex: "CustomerId",
        key: "CustomerId",
        align: "left",
        width: 200,
      },
      {
        title: "Mã số KH",
        dataIndex: "CustomerNo",
        key: "CustomerNo",
        align: "left",
        width: 200,
      },
      {
        title: "Số TK",
        dataIndex: "AccountNo",
        key: "AccountNo",
        align: "left",
        width: 200,
      },
      {
        title: "Tên KH",
        dataIndex: "CustomerName",
        key: "CustomerName",
        align: "left",
        width: 200,
      },
      {
        title: "Mã CK hưởng quyền",
        dataIndex: "NEWSHARECODE",
        key: "NEWSHARECODE",
        align: "left",
        width: 200,
      },
      {
        title: "Ngày GD không hưởng quyền",
        render: function (value: any) {
          return Moment.formatDateNew(value.CloseDate, "DD/MM/yyyy");
        },
        align: "center",
        width: 200,
      },
      {
        title: "SL hưởng quyền",
        render: function (value: any) {
          return numberUtil.formatNumber(value.Volume);
        },
        align: "right",
        width: 200,
      },
      {
        title: "Mã CK được mua",
        dataIndex: "Symbol",
        key: "Symbol",
        align: "left",
        width: 200,
      },
      {
        title: "Tỷ lệ",
        render: function (value: any) {
          return (
            numberUtil.formatNumber(value.Old) +
            ":" +
            numberUtil.formatNumber(value.New)
          );
        },
        align: "right",
        width: 200,
      },
      {
        title: "Giá mua",
        render: function (value: any) {
          return numberUtil.formatNumber(value.Price);
        },
        align: "right",
        width: 200,
      },
      {
        title: "SL CK còn được mua",
        render: function (value: any) {
          return numberUtil.formatNumber(value.CompUnitNew);
        },
        align: "right",
        width: 200,
      },
      {
        title: "SL đăng ký mua/chuyển nhượng",
        render: function (value: any) {
          return numberUtil.formatNumber(value.CompUnitConfirm);
        },
        align: "right",
        width: 200,
      },
      {
        title: "Số tiền đã nộp",
        render: function (value: any) {
          return numberUtil.formatNumber(value.Amount);
        },
        align: "right",
        width: 200,
      },
      {
        title: "Số hợp đồng",
        dataIndex: "ContractNo",
        key: "ContractNo",
        align: "left",
        width: 200,
      },
      {
        title: "Loại giao dịch",
        render: function (value: any) {
          if (value.XType == 1) {
            return "Cổ tức bằng cổ phiếu";
          }
          if (value.XType == 2) {
            return "Cổ phiếu thưởng";
          }
          if (value.XType == 3) {
            return "Cổ tức bằng tiền";
          }
          if (value.XType == 4) {
            return "Chuyển nhượng";
          }
          if (value.XType == 0) {
            return "Quyền mua cổ phiếu/trái phiếu";
          }
        },
        align: "left",
        width: 200,
      },
      {
        title: "Action",
        render: function (value: any) {
          if (value.Status == 1 || value.Status == 2) {
            return (
              <>
                <Fragment>
                  <Menu
                    mode="horizontal"
                    defaultSelectedKeys={["SubMenu"]}
                    className="menu-corg"
                  >
                    <Menu.SubMenu key="SubMenu" icon={<List size={18} />}>
                      <Menu.Item key="two" onClick={() => changeStatus(value)}>
                        {t("X_Trade_Processing")}
                      </Menu.Item>
                    </Menu.SubMenu>
                  </Menu>
                </Fragment>
              </>
            );
          } else if (value.Status == 3) {
            return (
              <Tooltip placement="left" title={"Hủy"}>
                <Button.Ripple
                  className="btn-icon"
                  color="flat-danger"
                  id="positionLeftInactive"
                  onClick={() => deleteRecord(value)}
                  size="sm"
                >
                  <Trash size={18} />
                </Button.Ripple>
              </Tooltip>
            )
          }
        },
        fixed: "right",
        width: 80,
        align: "center",
      },
    ];

    const deleteRecord = (itemDelete: any) => {
      MySwal.fire({
        html: `Bạn có chắc chắn hủy bản ghi này?`,
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
          const param = {
            Id: itemDelete.id,
            Status: 5,
            Reason: null,
            UpdatedBy: appStore.account.LoginName,
          };
          store.updateChangeStatusRightBuy(param);
        }
      });
    }

    const [loading, setLoading] = useState(false);
    const [valueUpdate, setValueUpdate] = useState([]);
    const MySwal = withReactContent(Swal);

    const onSubmit = () => {
      const valueForm = form.getFieldsValue();
      if (
        valueForm.AccountNo &&
        valueForm.AccountNo.trim() != "" &&
        valueForm.AccountNo.trim().length != 7
      ) {
        toast(ErrorToast("Hãy điền số tài khoản 7 số"));
        return;
      }
      if (
        valueForm.CustormerId &&
        valueForm.CustormerId.trim() != "" &&
        valueForm.CustormerId.trim().length != 6
      ) {
        toast(ErrorToast("Hãy điền số tài khoản 6 số"));
        return;
      }
      const param = {
        UserId: appStore.account.LoginName,
        CustomerId:
          valueForm.CustormerId == undefined
            ? ""
            : valueForm.CustormerId.trim(),
        AccountNo:
          valueForm.AccountNo == undefined ? "" : valueForm.AccountNo.trim(),
        ContractNo:
          valueForm.ContractNo == undefined ? "" : valueForm.ContractNo.trim(),
        RightDateFrom: "",
        RightDateTo: "",
        Status:
          valueForm.cbxStatus == undefined ? -1 : valueForm.cbxStatus.value,
        Symbol:
          valueForm.Symbol == undefined
            ? ""
            : valueForm.Symbol.trim().toUpperCase(),
        UserIdEdit: "",
        BranchId: "",
        CustomerType: -1,
        PendingStatusId: -1,
        PageIndex: store.pageIndexRightBuy,
        PageSize: store.pageSizeRightBuy,
      };

      store.getListRightBuy(param);
      if (!valueLoad) {
        setValueLoad(true);
      }
    };
    const onClickButtonSearch = () => {
      if (store.pageIndexRightBuy == 1) {
        onSubmit();
      } else {
        store.pageIndexRightBuy = 1;
      }
    };

    const resetForm = () => {
      form.resetFields();
      if (store.pageIndexRightBuy == 1) {
        onSubmit();
      } else {
        store.pageIndexRightBuy = 1;
      }
    };
    const defaultValue = {
      CustomerId: "",
      AccountNo: "",
      ContractNo: "",
      Status: -1,
      Symbol: "",
      UserIdEdit: "",
      BranchId: "",
      CustomerType: -1,
      PendingStatusId: -1,
      txtDate: "",
    };
    const changeStatus = (value: any) => {
      setValueUpdate(value);
      store.onShowModalUpdate(true);
    };
    const exportListRightBuy = () => {
      const valueForm = form.getFieldsValue();
      const param = {
        UserId: appStore.account.LoginName,
        CustomerId: valueForm.CustormerId == undefined
          ? ""
          : valueForm.CustormerId.trim(),
        AccountNo: valueForm.AccountNo == undefined ? "" : valueForm.AccountNo.trim(),
        ContractNo: valueForm.ContractNo == undefined ? "" : valueForm.ContractNo.trim(),
        RightDateFrom: "",
        RightDateTo: "",
        Status: valueForm.cbxStatus == undefined ? -1 : valueForm.cbxStatus.value,
        Symbol: valueForm.Symbol == undefined
          ? ""
          : valueForm.Symbol.trim().toUpperCase(),
        UserIdEdit: "",
        BranchId: "",
        CustomerType: -1,
        PendingStatusId: -1,
      };
      store.ExportListUI(
        listAPI.ExportListRightBuy,
        param,
        "DANH_SACH_TRANG_THAI_DANG_KY_QUYEN_MUA"
      );
      if (!valueLoad) {
        setValueLoad(true);
      }
    };

    useEffect(() => {
      if (valueLoad) {
        onSubmit();
      }
    }, [store.pageIndexRightBuy, store.pageSizeRightBuy]);
    useEffect(() => {
      store.dataRightBuy = [];
      store.totalRowsRightBuy = 0;
    }, []);

    return (
      <Fragment>
        <Card>
          <CardHeader className="custom-card-header">
            <h4>{t("X_Trade_Right_Buy_Title")}</h4>
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
                  <Form.Item label={t("X_Trade_Bank_Account")} name="AccountNo">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Bank_Account")}
                      autoComplete="Off"
                      type="number"
                      onChange={(object) => {
                        if (object.target.value.length > 7) {
                          form.setFieldsValue({
                            AccountNo: object.target.value.slice(0, 7),
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
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
                          form.setFieldsValue({
                            CustormerId: object.target.value.slice(0, 6),
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Sec_Code")} name="Symbol">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Sec_Code")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Contract_No")} name="ContractNo">
                    <Input
                      size="small"
                      placeholder={t("X_Trade_Contract_No")}
                      autoComplete="Off"
                    />
                  </Form.Item>
                </Col>
                <Col lg="6" md="6">
                  <Form.Item label={t("X_Trade_Status")} name="cbxStatus">
                    <Select
                      options={listStatus}
                      defaultValue={listStatus[0]}
                      isClearable={false}
                      control={control}
                      theme={selectThemeColors}
                      className="react-select react-select-sm"
                      classNamePrefix="select"
                      styles={customSMSelectStyles}
                    />
                  </Form.Item>
                </Col>
                {/* <Col lg="6" md="6">
                  <Form.Item style={{ position: "absolute", bottom: "0px" }}>
                    <CustomInput
                      inline
                      type="checkbox"
                      id="chkTime"
                      label={t("X_Trade_Warning")}
                      defaultChecked={false}
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
                    &nbsp;&nbsp;
                    <Button
                      htmlType="button"
                      className="btn btn-gradient-success"
                      color="gradient-success"
                      onClick={exportListRightBuy}
                    >
                      {t("X_Trade_Button_Export")}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col sm="24" md="24">
                  <Table
                    columns={listHistoryLogin}
                    dataSource={store.dataRightBuy}
                    size="small"
                    scroll={{ x: 800, y: 800 }}
                    loading={store.loadingData}
                    pagination={{
                      showSizeChanger: true,
                      onShowSizeChange: store.handlePerRowsChangeListRightBuy,
                      pageSizeOptions: pageSizeTable,
                      total: store.totalRowsRightBuy,
                      showTotal: showTotal,
                      onChange: store.handlePageChangeListRightBuy,
                      className: "mt-1 text-right custom-ant-pagination",
                      defaultCurrent: store.pageIndexRightBuy,
                      locale: { items_per_page: "/ trang" },
                      current: store.pageIndexRightBuy,
                    }}
                  />
                </Col>
              </Row>
            </Form>
          </CardBody>
          <Modal
            isOpen={store.isShowPopupModalUpdate}
            toggle={() =>
              (store.isShowPopupModalUpdate = !store.isShowPopupModalUpdate)
            }
            className="modal-lg modal-dialog-centered"
            backdrop={"static"}
          >
            <ModalHeader
              toggle={() =>
                (store.isShowPopupModalUpdate = !store.isShowPopupModalUpdate)
              }
            >
              <Label for="basicInput">
                <h4>{t("X_Trade_Processing")}</h4>
              </Label>
            </ModalHeader>
            <ModalBody>
              <FormChangeStatus valueUpdate={valueUpdate} />
            </ModalBody>
          </Modal>
        </Card>
      </Fragment>
    );
  });

export default ListRightBuy;
