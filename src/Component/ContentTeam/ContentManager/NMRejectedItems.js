import React from "react";
import { Tabs } from "antd";
import NMRejectedInventory from "./NMRejectedInventory";
import NeedToRejectImages from "./NeedToRejectImages";
const { TabPane } = Tabs;

class NMRejectedItems extends React.Component {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" type="card" size="large">
          <TabPane tab="NM Rejected Shop Images" key="1" className="tab-height">
            <NeedToRejectImages />
          </TabPane>
          <TabPane
            tab="NM Rejected Inventory Images"
            key="2"
            className="tab-height"
          >
            <NMRejectedInventory />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default NMRejectedItems;
