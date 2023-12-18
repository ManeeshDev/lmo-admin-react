import React, { useState, useEffect } from "react";
import { Layout, Row, Popover, Avatar, Button } from "antd";
import Sidebar from "../Common/Sidebar";
import Header from "../Common/Header";
import {
  UserOutlined,
  UploadOutlined,
  FolderOutlined,
  FormOutlined,
  FileProtectOutlined,
  FileZipOutlined,
  NotificationOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  FileExcelOutlined,
  CloudUploadOutlined,
  FileUnknownOutlined,
  FileImageOutlined,
  BoxPlotOutlined,
} from "@ant-design/icons";

const { Content, Footer } = Layout;

export default (props) => {
  const Component = props.component;

  const user_name = localStorage.getItem("user_name");
  const phone_number = localStorage.getItem("phone_number");
  const userRole = localStorage.getItem("loggedIn_user_role");
  const empid = localStorage.getItem("emp_id");
  const locality = localStorage.getItem("locale");

  const content = (
    <div className="profilePopup">
      <p>User Name: {user_name}</p>
      <p>User Role: {userRole}</p>
      <p>Employee Id: {empid}</p>
      <p>Locality: {locality}</p>
      <p>Phone Number : {phone_number}</p>
    </div>
  );

  const amLinks = [
    {
      name: "All Shop Images",
      path: "/ContentTeam/AllShopImages",
      icon: <FolderOpenOutlined />,
    },
    {
      name: "Search All Images",
      path: "/ContentTeam/SearchImages",
      icon: <FileSearchOutlined />,
    },
    {
      name: "All Item Images",
      path: "/ContentTeam/AllItemImages",
      icon: <FolderOutlined />,
    },
    {
      name: "Category Items for Search",
      path: "/ContentTeam/AMUploadItems",
      icon: <FileSearchOutlined />,
    },
    {
      name: "Item Master List",
      path: "/ContentTeam/ItemMasterList",
      icon: <CloudUploadOutlined />,
    },
    {
      name: "Missed Items",
      path: "/ContentTeam/AMMissedItems",
      icon: <FileUnknownOutlined />,
    },
    {
      name: "Inventory Items",
      path: "/ContentTeam/AMInventoryItems",
      icon: <UploadOutlined />,
    },
    {
      name: "Upload CSV File",
      path: "/ContentTeam/AMUploadText",
      icon: <FileZipOutlined />,
    },
    {
      name: "Approved Shop Images",
      path: "/ContentTeam/ApprovedImages",
      icon: <FileProtectOutlined />,
    },
    {
      name: "Approve/Reject Shop Images",
      path: "/ContentTeam/ApproveImage",
      icon: <FormOutlined />,
    },
    {
      name: "NM Rejected Images",
      path: "/ContentTeam/NeedToRejectImage",
      icon: <FileExcelOutlined />,
    },
    {
      name: "Customer Reviews",
      path: "/ContentTeam/Feedback",
      icon: <NotificationOutlined />,
    },
  ];

  const managerLinks = [
    {
      name: "Images",
      path: "/ContentTeam/AllImages",
      icon: <FolderOpenOutlined />,
    },
    amLinks[1],
    {
      name: "Assign Images",
      path: "/ContentTeam/AssignImage",
      icon: <UserOutlined />,
    },
    amLinks[2],
    amLinks[6],
    amLinks[8],
    amLinks[9],
    amLinks[10],
    amLinks[11],
  ];

  const nmLinks = [
    managerLinks[0],
    {
      name: "Assigned Images",
      path: "/ContentTeam/AssignedImages",
      icon: <UserOutlined />,
    },
    {
      name: "Need to Upload",
      path: "/ContentTeam/UploadImage",
      icon: <CloudUploadOutlined />,
    },
    {
      name: "Uploaded Images",
      path: "/ContentTeam/UploadedImage",
      icon: <FolderOutlined />,
    },
    {
      name: "Inventory Items",
      path: "/ContentTeam/InventoryItems",
      icon: <FileImageOutlined />,
    },
    {
      name: "Rejected Images",
      path: "/ContentTeam/RejectedImages",
      icon: <FileExcelOutlined />,
    },
    {
      name: "Own Inventory",
      path: "/ContentTeam/Inventory/new/add",
      icon: <BoxPlotOutlined />,
    },

    {
      name: "Notifications",
      path: "/ContentTeam/Notifications",
      icon: <NotificationOutlined />,
    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <Layout>
      <Header setOpen={setOpen} />
      <Layout>
        {userRole === "M" ? (
          <Sidebar setVisible={setOpen} visible={open} links={managerLinks} />
        ) : userRole === "AM" ? (
          <Sidebar setVisible={setOpen} visible={open} links={amLinks} />
        ) : (
          <Sidebar setVisible={setOpen} visible={open} links={nmLinks} />
        )}{" "}
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              marginTop: 24,
              minHeight: 280,
            }}
          >
            <Component />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            ©2020, LMO. All rights reserved.{" "}
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
