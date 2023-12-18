import React from "react";
import { Tabs } from "antd";
import ItemMasterCSVList from "./ItemMasterCSVList";
import UploadItemMasterCSVList from "./UploadItemMasterCSVList";
const { TabPane } = Tabs;

class InventoryItems extends React.Component {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" type="card" size="large">
          <TabPane tab="Upload Item Master List" key="1" className="tab-height">
            <UploadItemMasterCSVList />
          </TabPane>
          <TabPane tab="View Item Master List" key="2" className="tab-height">
            <ItemMasterCSVList />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default InventoryItems;
