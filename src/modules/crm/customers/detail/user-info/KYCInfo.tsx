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

const KYCInfo = (userInfo: any) =>
  useObserver(() => {
    const userDetail = userInfo.userSelected;
    const [expandInfo, setExpandInfo] = useState(true);
    const [expandAccount, setExpandAccount] = useState(true);
    useEffect(() => {
      if (userDetail) {
        // crmStore.getCustomerInfo(userDetail.id);
        crmStore.getKYCCustomerInfo("000515");
      }
    }, [])
    return (
      <Fragment>
        <Row justify="center">
          <Col sm={24} md={24}>
            <ListInfo className="list-unstyled custom-list-unstyled">
              <Row>
              {
                crmStore.detailKYCCustomer?.KycSelecteds.map((item) => (
                  <Col sm={24} md={12}>
                    <ListItem className="mb-75 d-flex flex-column">
                    <ListItemValue className="d-flex fw-bolder me-25 mb-1">{item.KycName}</ListItemValue>
                    <ListItemValue className="d-flex flex-column">
                      {
                        item.KycValue?.map((subItem) => (
                          <ListInfo className="list-unstyled custom-list-unstyled">
                            <ListItem className="mb-75 d-flex">
                              <ListItemValue className="d-flex">
                                <CustomInput
                                  type="checkbox"
                                  className="custom-control-Primary"
                                  id="Primary123"
                                  label={subItem.Name}
                                  defaultChecked
                                  inline
                                  disabled
                                />
                              </ListItemValue>
                            </ListItem>
                          </ListInfo>
                        ))
                      }
                    </ListItemValue>
                  </ListItem>
                  </Col>
                ))
              }
              </Row>
            </ListInfo>
          </Col>
        </Row>
      </Fragment>
    );
  });

export default KYCInfo;

const ListInfo = styled.ul``;
const ListItem = styled.li``;
const ListItemSmall = styled.li`
  font-size: .85rem;
`;
const ListItemValue = styled.span`
  flex: 1 auto;
`;