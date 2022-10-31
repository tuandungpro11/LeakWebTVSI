// ** Custom Components
import Avatar from "@components/avatar";
import Timeline from "@components/timeline";
import React, { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import { Card, CardHeader, CardTitle, CardBody, Media, TabPane, TabContent, Nav, NavItem, NavLink, Button, PaginationProps, CardText } from "reactstrap";
import { useObserver } from "mobx-react";
import { crmStore } from "../../store/store";
import { Menu, Tooltip } from "antd";
import { Link } from "react-router-dom";
import Table, { ColumnsType } from "antd/lib/table";
import { CornerUpLeft, Edit, Info, List, Trash } from "react-feather";
import { pageSizeTable } from "../../types";
import { Moment } from "../../../../utility/general/Moment";
import { appStore } from "../../../../stores/appStore";
import { CommentSection } from "react-comments-section";
import 'react-comments-section/dist/index.css'
import UserCommentForm from "./UserCommentForm";
import "@styles/base/pages/page-blog.scss";

const UserComment = ({
  comment,
  replies,
  setActiveComment,
  activeComment,
  addComment,
  parentId = null,
}) =>
  useObserver(() => {
    const isEditing =
      activeComment &&
      activeComment.CommentID === comment.CommentID &&
      activeComment.type === "editing";
    const isReplying =
      activeComment &&
      activeComment.CommentID === comment.CommentID &&
      activeComment.type === "replying";
    const timePassed = true;
    const replyId = parentId ? parentId : comment.CommentID;
    return (
      <>
        <Card key={comment.CommentID} className="mb-0">

          <CardBody className="p-0">
            <Media className="mb-1">
              <Avatar className="mr-75" color='light-secondary' content={comment.FullName} initials />
              <Media body className="comment">
                <div className="d-flex">
                  <h6 className="font-weight-bolder mb-25 d-flex" style={{ flex: '1 1 auto' }}>
                    {comment.FullName}
                  </h6>
                  <h6 className="font-weight-bolder mb-25 d-flex">
                    {comment.CreatedDate}
                  </h6>
                </div>
                <CardText>{comment.Content}</CardText>
                <a href="javascript:void();" onClick={() =>
                  setActiveComment({ CommentID: comment.CommentID, type: "replying" })
                }>
                  <div className="d-inline-flex align-items-center">
                    <CornerUpLeft size={12} className="mr-50" />
                    <span>Phản hồi</span>
                  </div>
                </a>
              </Media>
            </Media>
            {isReplying && (
              <UserCommentForm
                submitLabel="Reply"
                handleSubmit={(text) => addComment(text, replyId)}
                hasCancelButton={true}
                comment={comment}
                handleCancel={() => {
                  setActiveComment(null);
                }}
              />
            )}
            {replies.length > 0 && (
              <div className="replies">
                {
                  replies.map((reply) => (
                    <Media key={reply.ReplyID} className="mb-1">
                      <Avatar className="mr-75" color='light-secondary' content={reply.FullName} initials />
                      <Media body className="replies-body">

                        <div className="d-flex">
                          <h6 className="font-weight-bolder mb-25 d-flex" style={{ flex: '1 1 auto' }}>
                            {reply.FullName}
                          </h6>
                          <h6 className="font-weight-bolder mb-25 d-flex">
                            {reply.CreatedDate}
                          </h6>
                        </div>

                        <CardText>{reply.Reply}</CardText>
                      </Media>
                    </Media>
                  ))
                }
              </div>
            )}
          </CardBody>
        </Card>
      </>
    );
  })

export default UserComment;