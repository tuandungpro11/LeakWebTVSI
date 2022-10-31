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

const UserBasicInfo = (userInfo: any) =>
  useObserver(() => {
    const userDetail = userInfo.userSelected;
    const [expandBank, setExpandBank] = useState(true);
    const [expandAccount, setExpandAccount] = useState(true);
    return (
      <Fragment>
        <Row justify="center">
          <Col sm={24} md={11}>
            <div className='divider divider-primary'>
              <div className='divider-text'>Cơ bản</div>
            </div>
            <ListInfo className="list-unstyled custom-list-unstyled">
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Họ và tên</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.FullName}</ListItemValue>
              </ListItem>
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Ngày sinh</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Birthday}</ListItemValue>
              </ListItem>
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Giới tính</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Gender}</ListItemValue>
              </ListItem>
              {/* <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Loại giấy tờ</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Gender}</ListItemValue>
              </ListItem> */}
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">CMT/CCCD</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.CardId}</ListItemValue>
              </ListItem>
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Ngày cấp</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.IssueDate}</ListItemValue>
              </ListItem>
              {/* <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Ngày hết hạn</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Gender}</ListItemValue>
              </ListItem> */}
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Nơi cấp</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.IssuePlace}</ListItemValue>
              </ListItem>
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Số điện thoại 1</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Phone01}</ListItemValue>
              </ListItem>
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Số điện thoại 2</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Phone02}</ListItemValue>
              </ListItem>
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Email</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Email}</ListItemValue>
              </ListItem>
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Địa chỉ</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.Address}</ListItemValue>
              </ListItem>
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Ngày mở TK</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.OpenAccDate}</ListItemValue>
              </ListItem>
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Sale ID</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.SaleID}</ListItemValue>
              </ListItem>
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Họ tên sale</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.SaleName}</ListItemValue>
              </ListItem>
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Chi nhánh</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.BranchName}</ListItemValue>
              </ListItem>
            </ListInfo>
          </Col>
          <Col sm={24} md={1}></Col>
          <Col sm={24} md={11}>
            <div className='divider divider-primary'>
              <div className='divider-text'>Dịch vụ</div>
            </div>
            <ListInfo className="list-unstyled custom-list-unstyled">
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Tài khoản giao dịch ký quỹ</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">
                  <CustomInput
                    type="checkbox"
                    className="custom-control-Primary"
                    id="Primary"
                    label="Đăng ký"
                    defaultChecked={crmStore.detailCustomer?.CustomerType !== null && crmStore.detailCustomer?.CustomerTypeGroup !== null}
                    inline
                    disabled
                  />
                </ListItemValue>
              </ListItem>
              <ListItemSmall className="mb-75 d-flex">
                <ListItemValue className="d-flex me-25">Loại khách hàng</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.CustomerType}</ListItemValue>
              </ListItemSmall>
              <ListItemSmall className="mb-75 d-flex">
                <ListItemValue className="d-flex me-25">Nhóm ký quỹ</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">{crmStore.detailCustomer?.CustomerTypeGroup}</ListItemValue>
              </ListItemSmall>
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Phương thức nhận KQGD</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">
                  <CustomInput
                    type="checkbox"
                    className="custom-control-Primary"
                    id="Primary"
                    label="SMS"
                    defaultChecked={crmStore.detailCustomer?.TradingResultSmsMethod}
                    inline
                    disabled
                  />
                  <CustomInput
                    type="checkbox"
                    className="custom-control-Primary"
                    id="Primary"
                    label="Email"
                    defaultChecked={crmStore.detailCustomer?.TradingResultEmailMethod}
                    inline
                    disabled
                  />
                </ListItemValue>
              </ListItem>
              <ListItem className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25">Ngân hàng chuyển tiền</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">
                  <CustomInput
                    type="checkbox"
                    className="custom-control-Primary"
                    id="Primary"
                    label="Đăng ký"
                    defaultChecked={crmStore.detailCustomer?.CustomerBankInfo !== null}
                    inline
                    disabled
                  />
                </ListItemValue>
              </ListItem>
              <ListItemSmall className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25"></ListItemValue>
                <ListItemValue className="d-flex justify-content-end">
                  
                  <Button.Ripple color='flat-primary' onClick={() => setExpandBank(!expandBank)}>{expandBank ? 'Thu gọn' : 'Mở rộng'}</Button.Ripple>
                </ListItemValue>
              </ListItemSmall>
              {
                expandBank && crmStore.detailCustomer?.CustomerBankInfo.map((bank) => (
                  <ListItem className="mb-h1">
                    <Toast className="custom-toast-account">
                      <ToastHeader className="custom-toast-header-account">
                        <div className="d-flex bank-name">{bank.BankBranchName}</div>
                      </ToastHeader>
                      <ToastBody>
                      Số tài khoản: {bank.BankAccount} <br/>
                      Chủ tài khoản: {bank.BankAccountName} <br/>
                      <span style={{color: bank.StatusColor}}>{bank.StatusName}</span>
                      </ToastBody>
                    </Toast>
                  </ListItem>
                ))
              }
              <ListItem className="mb-75 d-flex mt-1">
                <ListItemValue className="d-flex fw-bolder me-25">Tài khoản đối ứng</ListItemValue>
                <ListItemValue className="d-flex justify-content-end">
                  <CustomInput
                    type="checkbox"
                    className="custom-control-Primary"
                    id="Primary123"
                    label="Đăng ký"
                    defaultChecked={crmStore.detailCustomer?.CustomerInternalInfo !== null}
                    inline
                    disabled
                  />
                </ListItemValue>
              </ListItem>
              <ListItemSmall className="mb-75 d-flex">
                <ListItemValue className="d-flex fw-bolder me-25"></ListItemValue>
                <ListItemValue className="d-flex justify-content-end">
                  
                  <Button.Ripple color='flat-primary' onClick={() => setExpandAccount(!expandAccount)}>{expandAccount ? 'Thu gọn' : 'Mở rộng'}</Button.Ripple>
                </ListItemValue>
              </ListItemSmall>
              {
                expandAccount && crmStore.detailCustomer?.CustomerInternalInfo.map((bank) => (
                  <ListItem className="mb-h1">
                    <Toast className="custom-toast-account">
                      <ToastHeader className="custom-toast-header-info">
                        <div className="d-flex bank-name">{bank.InternalAccountNo}</div>
                        <div className="d-flex bank-name justify-content-end" style={{color: bank.StatusColor}}>{bank.StatusName}</div>
                      </ToastHeader>
                      <ToastBody>
                      Chủ tài khoản: {bank.InternalAccountName} <br/>
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

export default UserBasicInfo;

const ListInfo = styled.ul``;
const ListItem = styled.li``;
const ListItemSmall = styled.li`
  font-size: .85rem;
`;
const ListItemValue = styled.span`
  flex: 1 auto;
`;