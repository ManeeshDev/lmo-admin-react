import React from "react";
import { Tabs } from "antd";
import UploadInventoryItems from "./UploadInventoryItems";
import PrivateInventoryItems from "./PrivateInventoryItems";
import AssignInventory from "./AssignInventory";
const { TabPane } = Tabs;

class InventoryItems extends React.Component {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" type="card" size="large">
          <TabPane
            tab="Assigned Inventory Items"
            key="1"
            className="tab-height"
          >
            <PrivateInventoryItems />
          </TabPane>
          <TabPane
            tab="Merchant Uploaded Inventory Items"
            key="2"
            className="tab-height"
          >
            <AssignInventory />
          </TabPane>
          <TabPane tab="Upload Inventory Items" key="3" className="tab-height">
            <UploadInventoryItems />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default InventoryItems;
