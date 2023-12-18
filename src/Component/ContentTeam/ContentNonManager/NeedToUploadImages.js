import React from "react";
import { Tabs } from "antd";
import UploadItemImages from "./UploadItemImages";
import UploadShopImages from "./UploadShopImages";
const { TabPane } = Tabs;

class NeedToUploadImages extends React.Component {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" type="card" size="large">
          <TabPane tab="Upload Shop Image" key="1" className="tab-height">
            <UploadShopImages />
          </TabPane>
          <TabPane tab="Upload Item Image" key="2" className="tab-height">
            <UploadItemImages />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default NeedToUploadImages;
