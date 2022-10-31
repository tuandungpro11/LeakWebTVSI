// ** Custom Components
import Avatar from "@components/avatar";
import Timeline from "@components/timeline";
import React, { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import { Card, CardHeader, CardTitle, CardBody, Media, TabPane, TabContent, Nav, NavItem, NavLink, Button, PaginationProps, FormGroup, Input, Label, CustomInput, Toast, ToastHeader, ToastBody } from "reactstrap";
import { useObserver } from "mobx-react";
import { Col, Row } from "antd";
import styled from "@emotion/styled";
import { crmStore } from "../../../store/store";

const ExtendInfo = (userInfo: any) =>
  useObserver(() => {
    const userDetail = userInfo.userSelected;
    const [expandInfo, setExpandInfo] = useState(true);
    const [expandAccount, setExpandAccount] = useState(true);
    return (
      <Fragment>
        <Row justify="center">
          <Col sm={24} md={16}>
            <ListInfo className="list-unstyled custom-list-unstyled">
              {
                crmStore.detailCustomer?.CustomerExtend.map((item) => (
                  <ListItem className="mb-75 d-flex">
                    <ListItemValue className="d-flex fw-bolder me-25">{item.CategoryTypeName}</ListItemValue>
                    <ListItemValue className="d-flex justify-content-end">
                      {item.ValueName}
                    </ListItemValue>
                  </ListItem>
                ))
              }
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Thông tin Hoa Kỳ</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">
                  {crmStore.detailCustomer?.InfoUsa ? "Có" : "Không"}
                </ListItemValue>
              </ListItem>
              <ListItemSmall className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25"></ListItemValue>
                <ListItemValue className="d-flex justify-content-end">

                  <Button.Ripple color='flat-primary' onClick={() => setExpandInfo(!expandInfo)}>{expandInfo ? 'Thu gọn' : 'Mở rộng'}</Button.Ripple>
                </ListItemValue>
              </ListItemSmall>
              {
                expandInfo && (
                  <>
                    <ListItemSmall className="mb-75 d-flex">
                      <ListItemValue className="d-flex me-25 pr-1">1. Khách hàng là công dân Hoa Kỳ hoặc đối tượng cư trú tại Hoa Kỳ.</ListItemValue>
                      <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Info01 ? "Có" : "Không"}</ListItemValue>
                    </ListItemSmall>
                    <ListItemSmall className="mb-75 d-flex">
                      <ListItemValue className="d-flex me-25 pr-1">2. Khách hàng có nơi sinh tại Hoa Kỳ.</ListItemValue>
                      <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Info02 ? "Có" : "Không"}</ListItemValue>
                    </ListItemSmall>
                    <ListItemSmall className="mb-75 d-flex">
                      <ListItemValue className="d-flex me-25 pr-1">3. Khách hàng có địa chỉ nhân thư hoặc địa chỉ lưu ký tại Hoa Kỳ.</ListItemValue>
                      <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Info03 ? "Có" : "Không"}</ListItemValue>
                    </ListItemSmall>
                    <ListItemSmall className="mb-75 d-flex">
                      <ListItemValue className="d-flex me-25 pr-1">4. Khách hàng có số điện thoại liên lạc tại Hoa Kỳ.</ListItemValue>
                      <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Info04 ? "Có" : "Không"}</ListItemValue>
                    </ListItemSmall>
                    <ListItemSmall className="mb-75 d-flex">
                      <ListItemValue className="d-flex me-25 pr-1">5. Khách hàng có lệnh định kỳ chuyển khoản vào một tài khoản mở tại Hoa Kỳ hay nhận chỉ thị thường xuyên từ một địa chỉ tại Hoa Kỳ.</ListItemValue>
                      <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Info05 ? "Có" : "Không"}</ListItemValue>
                    </ListItemSmall>
                    <ListItemSmall className="mb-75 d-flex">
                      <ListItemValue className="d-flex me-25 pr-1">6. Khách hàng có giấy ủy quyền hoặc đơn ủy quyền ký còn hiệu lực cấp cho một đối tượng có địa chỉ tại Hoa Kỳ liên quan tới tài khoản của Khách hàng.</ListItemValue>
                      <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Info06 ? "Có" : "Không"}</ListItemValue>
                    </ListItemSmall>
                    <ListItemSmall className="mb-75 d-flex">
                      <ListItemValue className="d-flex me-25 pr-1">7. Khách hàng có sử dụng địa chỉ nhận thư hộ hoặc giữ thư tại Hoa Kỳ.</ListItemValue>
                      <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Info07 ? "Có" : "Không"}</ListItemValue>
                    </ListItemSmall>
                  </>
                )
              }
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Thông tin cổ đông</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">
                  {crmStore.detailCustomer?.ShareHolderInfo !== null ? "Có" : "Không"}
                </ListItemValue>
              </ListItem>
              <ListItemSmall className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25"></ListItemValue>
                <ListItemValue className="d-flex justify-content-end">

                  <Button.Ripple color='flat-primary' onClick={() => setExpandAccount(!expandAccount)}>{expandAccount ? 'Thu gọn' : 'Mở rộng'}</Button.Ripple>
                </ListItemValue>
              </ListItemSmall>
              {
                expandAccount && crmStore.detailCustomer?.ShareHolderInfo.map((bank) => (
                  <ListItem className="mb-h1">
                    <Toast className="custom-toast-account">
                      <ToastHeader className="custom-toast-header-info">
                        <div className="d-flex bank-name">{bank.StockCode}</div>
                      </ToastHeader>
                      <ToastBody className="toast-body-share-holder d-flex">
                        {
                          bank.ShareType_1 && (
                            <div className="d-flex share-holder-info">Cổ đông lớn</div>
                          )
                        }
                        {
                          bank.ShareType_2 && (
                            <div className="d-flex share-holder-info">Cổ đông nội bộ</div>
                          )
                        }
                        {
                          bank.ShareType_3 && (
                            <div className="d-flex share-holder-info">Người liên quan đến cổ đông lớn</div>
                          )
                        }
                        {
                          bank.ShareType_4 && (
                            <div className="d-flex share-holder-info">Sắp thành cổ đông lớn</div>
                          )
                        }
                      </ToastBody>
                    </Toast>
                  </ListItem>
                ))
              }
            </ListInfo>
          </Col>
        </Row>
      </Fragment>
    );
  });

export default ExtendInfo;

const ListInfo = styled.ul``;
const ListItem = styled.li``;
const ListItemSmall = styled.li`
  font-size: .85rem;
`;
const ListItemValue = styled.span`
  flex: 1 auto;
`;