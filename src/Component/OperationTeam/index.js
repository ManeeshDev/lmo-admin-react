import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "../Common/Sidebar";
import Header from "../Common/Header";

import {
  UserOutlined,
  UploadOutlined,
  ClockCircleOutlined,
  CloseSquareOutlined,
  UsergroupAddOutlined,
  UserSwitchOutlined,
  QrcodeOutlined,
  SolutionOutlined,
  AppstoreOutlined,
  MoneyCollectTwoTone,
  BoxPlotOutlined,
  NotificationOutlined,
  InfoCircleOutlined,
  CheckSquareOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

const { Content, Footer } = Layout;

function ContainerHolder(props) {
  const Component = props.component;

  const links = [
    {
      name: "New SignUp",
      path: "/OperationTeam/Newsignups",
      icon: <UserOutlined />,
    },
    {
      name: "Uploaded Documents",
      path: "/OperationTeam/MerchantUploaded",
      icon: <UploadOutlined />,
    },
    {
      name: "Pending Documents",
      path: "/OperationTeam/pendingDocuments",
      icon: <ClockCircleOutlined />,
    },
    {
      name: "Incorrect Shop Address",
      path: "/OperationTeam/IncorrectShopArea",
      icon: <CloseSquareOutlined />,
    },
    {
      name: "Incorrect Ctgy or SubCtgy or Shop Area",
      path: "/OperationTeam/IncorrectDetails",
      icon: <CloseSquareOutlined />,
    },

    {
      name: "Agent Signup",
      path: "/OperationTeam/Agents/signup",
      icon: <UsergroupAddOutlined />,
    },

    {
      name: "Inventory",
      path: "/OperationTeam/inventory",
      icon: <AppstoreOutlined />,
    },

    {
      name: "Month day Offer",
      path: "/OperationTeam/monthdayoffer",
      icon: <MoneyCollectTwoTone />,
    },
    {
      name: "Orders",
      path: "/OperationTeam/order",
      icon: <FileDoneOutlined />,
    },

    {
      name: "Merchant Status",
      path: "/OperationTeam/merchant-status",
      icon: <SolutionOutlined />,
    },

    {
      name: "Shop Address",
      path: "/ContentTeam/ShopAddress",
      icon: <InfoCircleOutlined />,
    },
    {
      name: "Notifications",
      path: "/ContentTeam/Notifications",
      icon: <NotificationOutlined />,
    },
    {
      name: "Onboard Settlement",
      path: "/ContentTeam/OnboardSettlement",
      icon: <CheckSquareOutlined />,
    },
    {
      name: "Doorbuster Settlement",
      path: "/ContentTeam/DoorbusterSettlement",
      icon: <CheckCircleOutlined />,
    },

    // {
    //   name: "Generate QR Code",
    //   path: "/OperationTeam/generate-qr",
    //   icon: <QrcodeOutlined />,
    // },
  ];

  const [open, setOpen] = useState(false);

  return (
    <Layout>
      <Header setOpen={setOpen} />
      <Layout>
        <Sidebar setVisible={setOpen} visible={open} links={links} />
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
