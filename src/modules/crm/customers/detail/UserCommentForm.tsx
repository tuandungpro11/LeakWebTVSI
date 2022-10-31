// ** Custom Components
import Avatar from "@components/avatar";
import Timeline from "@components/timeline";
import React, { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import { Card, CardHeader, CardTitle, CardBody, Media, TabPane, TabContent, Nav, NavItem, NavLink, Button, PaginationProps } from "reactstrap";
import { useObserver } from "mobx-react";
import { crmStore } from "../../store/store";
import { Menu, Tooltip } from "antd";
import { Link } from "react-router-dom";
import Table, { ColumnsType } from "antd/lib/table";
import { Edit, Info, List, Trash } from "react-feather";
import { pageSizeTable } from "../../types";
import { Moment } from "../../../../utility/general/Moment";
import { appStore } from "../../../../stores/appStore";
import { CommentSection } from "react-comments-section";
import 'react-comments-section/dist/index.css'
import {
  SendOutlined,
  DeleteOutlined
} from '@ant-design/icons';

interface Props {
  handleSubmit?: any,
  submitLabel?: string,
  hasCancelButton: boolean,
  handleCancel?: any,
  initialText?: string,
  comment?: any,
}

const UserCommentForm = (props: Props) =>
  useObserver(() => {
    const [text, setText] = useState(props.initialText);
    const isTextareaDisabled = false;
    const onSubmit = (event) => {
      console.log(text);
      event.preventDefault();
      props.handleSubmit(text);
      setText("");
    };
    console.log();
    return (
      <Media className="mb-1">
        <Avatar className="mr-75" color='light-secondary' content={props.comment?.FullName ?? appStore.account.LoginName} initials />
        <Media body className="comment-input">
          <form onSubmit={onSubmit} className="d-flex">
            <textarea
              className="comment-form-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={1}
              placeholder={"Nhập nội dung"}
            />
            <Button.Ripple className='btn-icon rounded-circle' color='flat-primary' 
              onClick={onSubmit} >
              <SendOutlined />
            </Button.Ripple>
            {props.hasCancelButton && (
              <Button.Ripple className='btn-icon rounded-circle' color='flat-primary'
                onClick={props.handleCancel} >
                <DeleteOutlined />
              </Button.Ripple>
            )}
          </form>
        </Media>
      </Media>
    );
  })

export default UserCommentForm;