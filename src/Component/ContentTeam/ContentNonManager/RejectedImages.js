import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import axios from "axios";
import { Tabs, Spin, Alert } from "antd";
import RejectedItemImages from "./RejectedItemImages";
import RejectedShopImages from "./RejectedShopImages";
import UploadItemImages from "./UploadItemImages";
const { TabPane } = Tabs;
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const RejectedImages = (props) => {
  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" size="large">
        <TabPane tab="Rejected Shop Image" key="1" className="tab-height">
          <RejectedShopImages />
        </TabPane>
        <TabPane tab="Rejected Item Image" key="2" className="tab-height">
          <RejectedItemImages />
        </TabPane>
        <TabPane
          tab="Upload Rejected Item Image"
          key="3"
          className="tab-height"
        >
          <UploadItemImages />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default RejectedImages;
