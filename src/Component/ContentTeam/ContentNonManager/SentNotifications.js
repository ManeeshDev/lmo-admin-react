import React, { useEffect, useState, useLayoutEffect } from "react";
import { Table, Tag, Space, Button, Tooltip, message } from "antd";
import { notificationService } from "./../../../Utils/NotificationService";
import moment from "moment";
import axios from "axios";
const userRole = localStorage.getItem("loggedIn_user_role");
const token = localStorage.getItem("token");
const empid = localStorage.getItem("emp_id");
export default function SentNotifications(props) {
  const columns = [
    {
      title: "Message",
      dataIndex: "msg",
      key: "msg",
      render: (text) =>
        text?.length > 15 ? (
          <Tooltip title={text}>
            <span>{`${text.substr(0, 15)} ...`}</span>
          </Tooltip>
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) =>
        text?.length > 15 ? (
          <Tooltip title={text}>
            <span>{`${text.substr(0, 15)} ...`}</span>
          </Tooltip>
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: "SubTitle",
      dataIndex: "subtitle",
      key: "subtitle",
      render: (text) =>
        text?.length > 15 ? (
          <Tooltip title={text}>
            <span>{`${text.substr(0, 15)} ...`}</span>
          </Tooltip>
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: "Frequency",
      dataIndex: "freq",
      key: "freq",
      render: (c) =>
        Array.isArray(c) && c.map((x) => <Tag color="geekblue">{x}</Tag>),
    },
    {
      title: "Screen",
      dataIndex: "screen",
      key: "screen",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Type",
      dataIndex: "user",
      key: "user",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      render: (c) =>
        Array.isArray(c) && c.map((x) => <Tag color="geekblue">{x}</Tag>),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (c) =>
        Array.isArray(c) && c.map((x) => <Tag color="geekblue">{x}</Tag>),
    },
    {
      title: "Schedule Time",
      dataIndex: "time",
      key: "time",
      render: (text) => `${moment(text).format("MM/DD/YYYY, h:mm:ss a")}`,
    },
    {
      title: "Image",
      dataIndex: "imageurl",
      key: "imageurl",
      render: (imageurl) => (
        <img src={imageurl} alt={"image"} width="60" height="60" />
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {userRole === "OM" && record?.status == "pending" && (
            <Button
              type="primary"
              onClick={() => {
                props.approveNotif(record);
              }}
            >
              Approve
            </Button>
          )}
          <Button
            type="primary"
            onClick={() => {
              notificationService.clearRowEditData();
              notificationService.setRowEditData(record);
            }}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => props.deleteNotification(record)}
            props
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const [editData, setEditData] = useState(null);

  useEffect(() => {}, []);

  useEffect(() => {
    const subscription = notificationService
      .getRowEditData()
      .subscribe((data) => {
        console.log("=====>", data);
        if (data) {
          setEditData(data);
        }
      });

    // return unsubscribe method to execute when component unmounts
    return subscription.unsubscribe();
  }, []);
  console.log("props.notifications", props.notifications);
  return (
    <div style={{ overflow: "auto" }}>
      <Table columns={columns} dataSource={props.notifications} />
    </div>
  );
}
