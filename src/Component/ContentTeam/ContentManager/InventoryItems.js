import React from "react";
import { Tabs } from "antd";
import UploadInventoryItems from "./UploadInventoryItems";
import NMInventoryItems from "./NMInventoryItems";
import AssignInventoryItems from "./AssignInventoryItems";
import ViewInventory from "./ViewInventory";
const { TabPane } = Tabs;

class InventoryItems extends React.Component {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" type="card" size="large">
          <TabPane tab="Assign Inventory Items" key="1" className="tab-height">
            <AssignInventoryItems />
          </TabPane>
          <TabPane
            tab="NM Uploaded Inventory Items"
            key="2"
            className="tab-height"
          >
            <NMInventoryItems />
          </TabPane>
          <TabPane tab="Upload Inventory Items" key="3" className="tab-height">
            <UploadInventoryItems />
          </TabPane>
          <TabPane tab="Search Inventory Items" key="4" className="tab-height">
            <ViewInventory />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default InventoryItems;
