// ** Custom Components
import Avatar from "@components/avatar";
import Timeline from "@components/timeline";
import React, { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import { Card, CardHeader, CardTitle, CardBody, Media, TabPane, TabContent, Nav, NavItem, NavLink, Button, PaginationProps } from "reactstrap";
import { useObserver } from "mobx-react";
import { crmStore } from "../../store/store";
import { Col, Menu, Progress, Rate, Row, Tooltip } from "antd";
import { Link } from "react-router-dom";
import Table, { ColumnsType } from "antd/lib/table";
import { Edit, Info, List, Trash } from "react-feather";
import { pageSizeTable } from "../../types";
import { Moment } from "../../../../utility/general/Moment";
import { appStore } from "../../../../stores/appStore";
import { CommentSection } from "react-comments-section";
import 'react-comments-section/dist/index.css'
import UserComment from "./UserComment";
import UserCommentForm from "./UserCommentForm";
import { numberUtil } from "../../../../utility/general/NumberUtil";

const UserRating = (userInfo: any) =>
  useObserver(() => {
    const [backendComments, setBackendComments] = useState([]);
    const [activeComment, setActiveComment] = useState(null);
    const userDetail = userInfo.userSelected;
    const addComment = (text, parentId) => {
      if(!parentId && text && text.trim().length > 0) {
        const paramComment = {
          UserName: appStore.account.LoginName,
          CustCode: "",
          LeadID: userDetail.id,
          Content: text.trim(),
          FullName: appStore.account.LoginName,
          Rate: rate
        }
        crmStore.CreateComment(paramComment);
      }
      if(parentId && text && text.trim().length > 0) {
        const paramComment = {
          UserName: appStore.account.LoginName,
          CommentID: parentId,
          Reply: text.trim(),
          FullName: appStore.account.LoginName,
        }
        crmStore.CreateReply(paramComment);
      }
    };

    useEffect(() => {
      if(!crmStore.creatingComment) {
        setActiveComment(null);
        initData();
      }
    }, [crmStore.creatingComment])

    useEffect(() => {
      if (crmStore.activeTabPotential === 4) {
        initData();
      }
    }, [crmStore.activeTabPotential]);

    const initData = () => {
      const param = {
        UserName: "admin",
        CustCode: userDetail.id
      }
      crmStore.getListCustomerComment(param);
    }

    const deleteComment = () => {

    }

    const updateComment = () => {

    }

    const currentUserId = () => {

    }

    const [rate, setRate] = useState(0);

    return (
      <Row>
        <Col lg={12}>
          <div className="d-flex rating-container">
            <div className="rating-number">
              <span>{`${crmStore.totalCustomerRating?.AvgStar ? numberUtil.formatIndexNumber(crmStore.totalCustomerRating?.AvgStar, null, 1) :  0}`}</span> / 5
            </div>
            <div className="rating-star">
              <div className="d-flex">
                <Rate disabled defaultValue={5} count={5} />
                <Progress strokeColor={"#616161"} percent={(crmStore.totalCustomerRating?.StarFive / crmStore.sumCustomerRating) * 100} showInfo={false} />
              </div>
              <div className="d-flex">
                <Rate disabled defaultValue={4} count={4} />
                <Progress strokeColor={"#616161"} percent={(crmStore.totalCustomerRating?.StarFour / crmStore.sumCustomerRating) * 100} showInfo={false} />
              </div>
              <div className="d-flex">
                <Rate disabled defaultValue={3} count={3} />
                <Progress strokeColor={"#616161"} percent={(crmStore.totalCustomerRating?.StarThree / crmStore.sumCustomerRating) * 100} showInfo={false} />
              </div>
              <div className="d-flex">
                <Rate disabled defaultValue={2} count={2} />
                <Progress strokeColor={"#616161"} percent={(crmStore.totalCustomerRating?.StarTwo / crmStore.sumCustomerRating) * 100} showInfo={false} />
              </div>
              <div className="d-flex">
                <Rate disabled defaultValue={1} count={1} />
                <Progress strokeColor={"#616161"} percent={(crmStore.totalCustomerRating?.StarOne / crmStore.sumCustomerRating) * 100} showInfo={false} />
              </div>
              <div className="d-flex justify-content-end">
                {`${crmStore.sumCustomerRating} x???p h???ng`}
              </div>
            </div>

          </div>
        </Col>
        <Col lg={12}>
          <div className="comments">
            <div className="d-flex align-items-center mb-1">
              Ch???m ????? x???p h???ng <Rate className="ml-1" defaultValue={rate} onChange={(value: number) => setRate(value)}/>
            </div>
            <UserCommentForm submitLabel="Write" handleSubmit={addComment} hasCancelButton={false} />
            <div className="comments-container">
              {crmStore.listCustomerComment.map((rootComment) => (
                <UserComment
                  key={rootComment.CommentID}
                  comment={rootComment}
                  replies={rootComment.Replies}
                  activeComment={activeComment}
                  setActiveComment={setActiveComment}
                  addComment={addComment}
                />
              ))}
            </div>
          </div>
        </Col>
      </Row>

    );
  });

export default UserRating;