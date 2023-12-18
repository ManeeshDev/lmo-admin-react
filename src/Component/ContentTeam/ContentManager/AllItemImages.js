import React from "react";
import { Tabs, Col } from "antd";
import NMUploadedItemImages from "./NMUploadedItemImages";
import UploadItemCSVFile from "./UploadItemCSVFile";
import UploadedItemList from "../ContentNonManager/UploadedItemImages";
const { TabPane } = Tabs;
const userRole = localStorage.getItem("loggedIn_user_role");
class AllItemImages extends React.Component {
  render() {
    return (
      <div>
        <Col lg={24}>
          <Tabs
            defaultActiveKey={userRole === "AM" ? "1" : "2"}
            type="card"
            size="large"
          >
            {userRole === "AM" ? (
              <TabPane tab="NM Uploaded Item Images" key="1">
                <NMUploadedItemImages />
              </TabPane>
            ) : null}
            <TabPane tab="Upload CSV Item List" key="2">
              <UploadItemCSVFile />
            </TabPane>
            <TabPane tab="Download CSV Item List" key="3">
              <UploadedItemList />
            </TabPane>
          </Tabs>
        </Col>
      </div>
    );
  }
}

export default AllItemImages;
