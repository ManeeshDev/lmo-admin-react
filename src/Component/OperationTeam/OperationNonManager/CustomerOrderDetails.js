import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  Row,
  Table,
  Tag,
  Radio,
  Tabs,
  PageHeader,
  Alert,
  Descriptions,
  Form,
} from "antd";
import Segmented from "antd";
import axios from "axios";
import moment from "moment";
import NewSignupDetail from "./NewSignupDetail";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { removeSession } from "../../../Utils/Session";
import { useLocation } from "react-router";
import CsvDownload from "react-json-to-csv";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const { TabPane } = Tabs;

const CustomerOrderDetails = (props) => {
  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
    searchInput: "",
  });
  const [CurrentRecord, setCurrentRecord] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setCurrentRecord({});
    setIsModalVisible(false);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            state.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => state.searchInput.select());
      }
    },
    render: (text) =>
      state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({ searchText: "" });
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      ...getColumnSearchProps("order_id"),
    },
    {
      title: "Shop Name",
      dataIndex: "shop_name",
      ...getColumnSearchProps("shop_name"),
    },
    {
      title: "Shop Area",
      dataIndex: "shop_address",
      ...getColumnSearchProps("shop_address"),
    },
    {
      title: "Total Amount",
      dataIndex: "total_price",
    },
    {
      title: "Delivery Mode",
      dataIndex: "delivery_mode",
    },
    {
      title: "Created At",
      dataIndex: "created_timestamp",
      render: (text) => (
        <Tag>{`${moment(text).format("DD/MM/YYYY , hh:mm a")}`}</Tag>
      ),
    },

    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <Button
          onClick={() => {
            setCurrentRecord(record);

            showModal();
          }}
          type="link"
        >
          View More
        </Button>
      ),
    },
  ];

  const orderHistoryColumns = [
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
    },
  ];
  return (
    <div className="detail-page">
      <>
        <PageHeader
          className="site-page-header"
          title={"Customer Order Details"}
          onBack={() => props.backToPage()}
        />
        {props.data?.[0]?.cust_id && (
          <Col lg={24} className="table-overflow">
            <Descriptions title="Customer Info">
              <Descriptions.Item label="Customer ID">
                {props.data?.[0]?.cust_id}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {props.data?.[0]?.cust_name}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        )}

        <Col lg={24} className="table-overflow">
          <Table
            loading={props.loading}
            id={(record) => record.cust_id}
            rowKey={(record) => record.cust_id}
            columns={columns}
            dataSource={props.data}
            bordered
          />
        </Col>
        <Modal
          title="Order History"
          visible={isModalVisible}
          onCancel={handleCancel}
          onOk={handleCancel}
          width={1000}
        >
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            autoComplete="off"
          >
            {CurrentRecord?.order_history && (
              <>
                <Table
                  dataSource={CurrentRecord?.order_history?.map((ele, i) => ({
                    key: i,
                    comments: ele?.comments,
                    status: ele?.status,
                    timestamp: `${moment(ele?.timestamp).format(
                      "DD/MM/YYYY , hh:mm a"
                    )}`,
                  }))}
                  columns={orderHistoryColumns}
                />
              </>
            )}

            <Descriptions title="Additional Info">
              {Object.keys(CurrentRecord)
                ?.slice()
                ?.map((label) => (
                  <Descriptions.Item label={label}>
                    {typeof CurrentRecord?.[label] == "string" &&
                      CurrentRecord[label]}
                  </Descriptions.Item>
                ))}
            </Descriptions>
          </Form>
        </Modal>
      </>
    </div>
  );
};
export default CustomerOrderDetails;
