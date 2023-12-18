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
import CustomerOrderDetails from "./CustomerOrderDetails";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const { TabPane } = Tabs;

const Orders = (props) => {
  const [data, updateData] = useState([]);
  const [showDetail, showSignupDetailPage] = useState(false);
  const [selectedId, updateSelectedID] = useState("");
  const [selectedStatus, updateSelectedStatus] = useState("");
  const location = useLocation();

  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
    searchInput: "",
  });

  const [loading, setLoading] = useState(false);
  const [filterId, setFilterId] = useState("1");
  const [customerId, setCustomerId] = useState("");
  const [paginationPayLoad, setPaginationPayLoad] = useState(null);
  useEffect(() => {
    fetchOrders();
  }, [filterId]);
  // useEffect(() => {
  //   viewOrderDetails();
  // }, [customerId]);

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
      title: "Customer ID",
      dataIndex: "cust_id",
      ...getColumnSearchProps("cust_id"),
    },
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
  ];

  useEffect(() => {
    if (!showDetail) fetchOrders();
  }, [showDetail]);

  const showSignupDetail = (status, mrch_id) => {
    showSignupDetailPage(!showDetail);
    updateSelectedStatus(status);
    updateSelectedID(mrch_id);
  };

  const fetchOrders = async () => {
    setLoading(true);
    updateData([]);
    console.log("paginationPayLoad", paginationPayLoad);
    try {
      const empid = localStorage.getItem("emp_id");
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=order&id=${filterId}`;
      const res = await axios.post(
        endPoint,
        {},
        {
          headers: { authorization: token },
          data: paginationPayLoad,
        }
      );
      setLoading(false);

      setPaginationPayLoad(res.data?.body?.key);
      updateData(res.data?.body?.orders);
    } catch (error) {
      setLoading(false);
      if (error.response.status === 401) {
        removeSession();
      }
    }
  };
  const [orderDetailsData, setOrderDetailsData] = useState([]);

  const viewOrderDetails = async () => {
    setLoading(true);
    setCustomerOrderDetail(true);
    setOrderDetailsData([]);
    try {
      const empid = localStorage.getItem("emp_id");
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=search&id=${customerId}`;
      const res = await axios.post(
        endPoint,
        {},
        {
          headers: { authorization: token },
          body: {},
        }
      );
      setLoading(false);
      setOrderDetailsData(res.data?.body?.orders);
    } catch (error) {
      setLoading(false);
      if (error.response.status === 401) {
        removeSession();
      }
    }
  };

  useEffect(() => {
    // console.log("location", location);
    const { status, mrch_id } = { ...location.state };
    status && mrch_id && showSignupDetail(status, mrch_id);
  }, []);
  const [customerOrderDetail, setCustomerOrderDetail] = useState(false);

  return (
    <div>
      {customerOrderDetail ? (
        <CustomerOrderDetails
          data={orderDetailsData}
          customerId={customerId}
          loading={loading}
          backToPage={() => {
            setCustomerOrderDetail(false);
            setCustomerId("");
          }}
        />
      ) : (
        <div className="table-component">
          <Row justify="space-between" align="middle" className="mb-4">
            <Col xs={14}>
              <h4>Orders</h4>
            </Col>
            <Col xs={8}>
              <Row justify="end">
                <CsvDownload
                  className="ant-btn ant-btn-primary ant-btn-round ant-btn-sm"
                  filename="Merchants SignUp List.csv"
                  style={{ marginRight: 5 }}
                  data={data}
                >
                  Download
                </CsvDownload>
                <Button
                  loading={loading}
                  shape="round"
                  size="small"
                  onClick={fetchOrders}
                  type="primary"
                  icon={<SyncOutlined />}
                >
                  Refresh
                </Button>
              </Row>
            </Col>
          </Row>

          <Col lg={8} className="mb-4">
            <Card
              title="Customer Id"
              extra={
                <Button
                  type="primary"
                  disabled={customerId.length !== 10}
                  onClick={viewOrderDetails}
                >
                  Submit
                </Button>
              }
            >
              <Input
                placeholder="Enter Customer Id"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
            </Card>
          </Col>
          {filterId && (
            <Col lg={24} className="mb-4">
              <Tabs
                defaultActiveKey={filterId}
                value={filterId}
                onChange={(key) => {
                  setPaginationPayLoad({});
                  setFilterId(key);
                }}
              >
                <TabPane tab="CREATE" key="1"></TabPane>
                <TabPane tab="READY" key="2"></TabPane>
                <TabPane tab="DELIVERY" key="3"></TabPane>
                <TabPane tab="CANCEL" key="4"></TabPane>
                <TabPane tab="COMPLETED" key="5"></TabPane>
              </Tabs>
            </Col>
          )}
          <Col lg={24} className="table-overflow">
            <Table
              loading={loading}
              rowKey={(record) => record.mrch_id}
              columns={columns}
              dataSource={data}
              bordered
              pagination={false}
            />

            <Button
              style={{ float: "right" }}
              type="link"
              disabled={!paginationPayLoad?.hasOwnProperty("updated_timestamp")}
              onClick={() => fetchOrders()}
            >
              Next
            </Button>
          </Col>
        </div>
      )}
    </div>
  );
};
export default Orders;
