import React from "react";
import "../../../assets/css/allimages.css";
import axios from "axios";
import { Tabs, Spin, Alert, Col } from "antd";
import UploadedItemImages from "./UploadedItemImages";
import UploadedShopImages from "./UploadedShopImages";
const { TabPane } = Tabs;

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const UploadedImages = (props) => {
  return (
    <Col lg={24}>
      <Tabs defaultActiveKey="1" type="card" size="large">
        <TabPane tab="Uploaded Shop Image" key="1">
          <UploadedShopImages />
        </TabPane>
        <TabPane tab="Uploaded Item Image List" key="2">
          <UploadedItemImages />
        </TabPane>
      </Tabs>
    </Col>
  );
};

export default UploadedImages;
