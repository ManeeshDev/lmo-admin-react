import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "../Common/Sidebar";
import Header from "../Common/Header";

import { SettingOutlined, UsergroupAddOutlined } from "@ant-design/icons";

const { Content, Footer } = Layout;

function ContainerHolder(props) {
  const Component = props.component;

  const links = [
    {
      name: "Home",
      path: "/agents",
      icon: <UsergroupAddOutlined />,
    },

    {
      name: "Profile",
      path: "/agents/profile",
      icon: <SettingOutlined />,
    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <Layout>
      <Header setOpen={setOpen} />
      <Layout>
        {/* <Sidebar setVisible={setOpen} visible={open} links={links} /> */}
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
}

export default ContainerHolder;
