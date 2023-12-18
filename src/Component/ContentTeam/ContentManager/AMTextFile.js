import React from "react";
import { Tabs } from "antd";
import AMUploadTextFile from "./AMUploadTextFile";
import AMFormattedTextFile from "./AMFormattedTextFile";

const { TabPane } = Tabs;

class AMTextFile extends React.Component {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" type="card" size="large">
          <TabPane tab="Upload CSV File" key="1" className="tab-height">
            <AMUploadTextFile />
          </TabPane>
          <TabPane tab="Formatted CSV File" key="2" className="tab-height">
            <AMFormattedTextFile />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default AMTextFile;
