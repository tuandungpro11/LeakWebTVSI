// ** React Imports
import { Link, Redirect } from "react-router-dom";

// ** Custom Components

import Avatar from "@components/avatar";

// ** Third Party Components

import { Card, CardBody, CardText, Button, Row, Col } from "reactstrap";
import {
  DollarSign,
  TrendingUp,
  User,
  Check,
  Star,
  Flag,
  Phone,
  Info,
} from "react-feather";
import styled from "@emotion/styled";
import React, { useEffect } from "react";
import { crmStore } from "../../store/store";
import { Moment } from "../../../../utility/general/Moment";
import { Collapse, Form, Tooltip } from "antd";
import { useObserver } from "mobx-react";
import {
  RollbackOutlined,
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";
import { PotentialCustomer } from "../../types";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import TextArea from "antd/lib/input/TextArea";
import { appStore } from "../../../../stores/appStore";

const UserInfoCard = (userInfo: any) =>
  useObserver(() => {
    const userDetail = userInfo.userSelected;
    const { Panel } = Collapse;
    useEffect(() => {
      if (userDetail) {
        crmStore.getLeadInfo(userDetail.id);
      }
    }, [])

    useEffect(() => {
      if (crmStore.detailLead) {
        renderUserImg();
      }
    }, [crmStore.detailLead])
    // ** render user img
    const renderUserImg = () => {
      const stateNum = Math.floor(Math.random() * 6),
        states = [
          "light-success",
          "light-danger",
          "light-warning",
          "light-info",
          "light-primary",
          "light-secondary",
        ],
        color = states[stateNum];
      return (
        <Avatar

          initials

          color={color}

          className="rounded mt-3 mb-2"

          content={crmStore.detailLead?.LeadName ?? "Người dùng"}

          contentStyles={{

            borderRadius: 0,

            fontSize: "calc(36px)",

            width: "100%",

            height: "100%",
          }}

          style={{

            height: "110px",

            width: "110px",
          }}
        />
      );
    };
    
    const [formDelete] = Form.useForm();
    const MySwal = withReactContent(Swal);
    const deleteCustomer = () => {
      formDelete.setFieldsValue({reason: ""})
      MySwal.fire({
        html: (
          <>
            <label htmlFor="" className="mb-1" style={{ fontSize: '1rem' }}>Lý do</label>
            <Form form={formDelete}>
              <Form.Item name="reason">
                <TextArea rows={2} placeholder={"Nhập lí do"} />
              </Form.Item>

            </Form>
          </>
        ),
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
            UserName: appStore.account.LoginName,
            LeadID: crmStore.detailLead?.LeadID,
            Reason: formDelete.getFieldsValue().reason,
          };
          crmStore.DeletePotentialAccount(param);
        }
      });
    }

    return (
      <Card>
        {crmStore.doneDeleteAccount && <Redirect to="/crm/potential-customer" /> }
        <CardBody>
          <Row>

            <Col
              xl="24"
              lg="24"
              className="d-flex flex-column justify-content-between border-container-lg"
            >

              <div className="user-avatar-section">

                <div className="d-flex justify-content-center">
                  {renderUserImg()}
                </div>
              </div>
              <div className="d-flex flex-column align-items-center text-center">


                <div className="user-info mb-1">


                  <h4 className="mb-0">
                    {crmStore.detailLead?.LeadName}
                  </h4>
                  <CardText tag="span">
                    <span style={{ color: `${crmStore.detailLead?.StatusColor}` }}>{crmStore.detailLead?.StatusName}</span>
                  </CardText>
                </div>
              </div>
              <h4 className="fw-bolder border-bottom pb-50 mb-1 custom-list-unstyled">Thông tin</h4>
              <div className="info-container">
                <ListInfo className="list-unstyled custom-list-unstyled">
                  <ListItem className="mb-75 d-flex">
                    <ListItemValue className="d-flex fw-bolder me-25">Số điện thoại</ListItemValue>
                    <ListItemValue className="d-flex justify-content-end">{crmStore.detailLead?.Mobile}</ListItemValue>
                  </ListItem>
                  <ListItem className="mb-75 d-flex">
                    <ListItemValue className="d-flex fw-bolder me-25">Email</ListItemValue>
                    <ListItemValue className="d-flex justify-content-end">{crmStore.detailLead?.Email}</ListItemValue>
                  </ListItem>
                  <ListItem className="mb-75 d-flex">
                    <ListItemValue className="d-flex fw-bolder me-25">Địa chỉ</ListItemValue>
                    <ListItemValue className="d-flex justify-content-end">{crmStore.detailLead?.Address}</ListItemValue>
                  </ListItem>
                  <ListItem className="mb-75 d-flex">
                    <ListItemValue className="d-flex fw-bolder me-25">Loại hình</ListItemValue>
                    <ListItemValue className="d-flex justify-content-end">{crmStore.detailLead?.ProfileName}</ListItemValue>
                  </ListItem>
                  <ListItem className="mb-75 d-flex">
                    <ListItemValue className="d-flex fw-bolder me-25">Sale ID</ListItemValue>
                    <ListItemValue className="d-flex justify-content-end">{crmStore.detailLead?.SaleID}</ListItemValue>
                  </ListItem>
                  <ListItem className="mb-75 d-flex">
                    <ListItemValue className="d-flex fw-bolder me-25">Họ tên sale</ListItemValue>
                    <ListItemValue className="d-flex justify-content-end">{crmStore.detailLead?.FullName}</ListItemValue>
                  </ListItem>
                  <ListItem className="mb-75 d-flex">
                    <ListItemValue className="d-flex fw-bolder me-25">Chi nhánh</ListItemValue>
                    <ListItemValue className="d-flex justify-content-end">{crmStore.detailLead?.BranchID}</ListItemValue>
                  </ListItem>
                  <ListItem className="mb-75 d-flex">
                    <ListItemValue className="d-flex fw-bolder me-25">Ngày tạo</ListItemValue>
                    <ListItemValue className="d-flex justify-content-end">{Moment.formatDateNew(crmStore.detailLead?.CreatedDate, "HH:mm - DD/MM/yyyy")}</ListItemValue>
                  </ListItem>
                  <ListItem className="mb-75 d-flex">
                    <ListItemValue className="d-flex fw-bolder me-25">Ngày cập nhật cuối</ListItemValue>
                    <ListItemValue className="d-flex justify-content-end">{Moment.formatDateNew(crmStore.detailLead?.UpdatedDate, "HH:mm - DD/MM/yyyy")}</ListItemValue>
                  </ListItem>
                </ListInfo>
                <Collapse className="custom-collapse" ghost expandIconPosition="end">
                  <Panel header="Thông tin mở rộng" key="1">
                    <ListInfo className="list-unstyled">
                      {crmStore.detailLead?.LeadAttribute.map((item: any) => (
                        <ListItem className="mb-75 d-flex">
                          <ListItemValue className="d-flex fw-bolder me-25">{item.AttributeName}</ListItemValue>
                          <ListItemValue className="d-flex justify-content-end">{item.CategoryName}</ListItemValue>
                        </ListItem>
                      ))}

                    </ListInfo>
                  </Panel>
                </Collapse>
              </div>
              <div className="d-flex justify-content-center pt-2">
                <Tooltip placement="left" title={"Cập nhật"}>
                  <Button.Ripple
                  color="primary"
                  >
                    <Link
                        to={{ pathname: `/crm/potential-customer/edit/${crmStore.detailLead?.LeadID}`, state: { from: 'detail' } }}
                        className="user-name text-truncate mb-0 text-gray-dark"
                      ><EditOutlined /></Link>
                  </Button.Ripple>
                </Tooltip>
                <Tooltip placement="left" title={"Xóa"}>
                  <Button.Ripple className="ml-1" color="danger" outline onClick={() => deleteCustomer()}>
                    <DeleteOutlined />
                  </Button.Ripple>
                </Tooltip>
                <Tooltip placement="left" title={"quay lại"}>
                  <Button.Ripple
                    color="secondary"
                    className="ml-1"
                  >
                    <Link
                      to={`/crm/potential-customer`}
                      className="user-name text-truncate mb-0 text-white"
                    ><RollbackOutlined /></Link>
                  </Button.Ripple>

                </Tooltip>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  });

export default UserInfoCard;

const ListInfo = styled.ul``;
const ListItem = styled.li``;
const ListItemValue = styled.span`
  flex: 1 auto;
`;
