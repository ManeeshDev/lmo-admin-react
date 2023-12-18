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
  Space,
} from "antd";
import axios from "axios";
import moment from "moment";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { withRouter } from "react-router";
import CsvDownload from "react-json-to-csv";
import { removeSession } from "./../../../Utils/Session";
import TextArea from "rc-textarea";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const DoorbusterSettlement = ({ history }) => {
  const [data, updateData] = useState([]);
  const [showDetail, showSignupDetailPage] = useState(false);
  const [selectedId, updateSelectedID] = useState("");
  const [selectedStatus, updateSelectedStatus] = useState("");
  const [editData, setEditData] = useState(null);

  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
    searchInput: "",
  });

  const [loading, setLoading] = useState(false);

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
      record[dataIndex]
        ?.toString()
        ?.toLowerCase()
        .includes(value.toLowerCase()),
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
          textToHighlight={text.toString() || ""}
        />
      ) : (
        text || "NA"
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

  const payAPI = async ({ mrch_id, tran_id }) => {
    setLoading(true);
    try {
      const empid = localStorage.getItem("emp_id");
      const endPoint = `${
        process.env.REACT_APP_BASE_URL
      }/${empid}/${userRole}/onm?status=settle&mrchid=${mrch_id}&id=${
        tran_id?.split("#")?.[1]
      }`;
      const res = await axios.post(
        endPoint,
        {},
        {
          headers: { authorization: token },
        }
      );
      setLoading(false);
      message.success("Paid successfully");
      // const result = res.data.body;
      setEditData(null);
      fetchNewSignups();
    } catch (err) {
      setLoading(false);
      if (err?.response?.status === 401) {
        removeSession();
      }
    }
  };

  const saveEditedRow = async () => {
    setLoading(true);
    try {
      const empid = localStorage.getItem("emp_id");
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=settle`;
      const res = await axios.post(
        endPoint,
        {
          doorbuster: editData,
        },
        {
          headers: { authorization: token },
        }
      );
      setLoading(false);
      message.success("Doorbuster details has been updated");
      // const result = res.data.body;
      setEditData(null);
      fetchNewSignups();
    } catch (err) {
      setLoading(false);
      if (err?.response?.status === 401) {
        removeSession();
      }
    }
  };

  const columns = [
    {
      title: "Merchant ID",
      dataIndex: "mrch_id",
      ...getColumnSearchProps("mrch_id"),

      render: (text, record) => (
        <a href={`/OperationTeam/merchant-status/${text}`}>{text}</a>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      ...getColumnSearchProps("amount"),
      render: (text, record) => (
        <>
          {editData?.mrch_id == record.mrch_id ? (
            <Input
              value={editData["amount"]}
              onChange={(e) =>
                setEditData({ ...editData, amount: e.target.value })
              }
              rows={4}
            />
          ) : (
            <span>{text}</span>
          )}
        </>
      ),
    },
    {
      title: "Bidding Price",
      dataIndex: "bidding_price",
      ...getColumnSearchProps("bidding_price"),
    },
    {
      title: "Agreed Amount",
      dataIndex: "total_agreed_amount",
      ...getColumnSearchProps("total_agreed_amount"),
      render: (text, record) => (
        <>
          {editData?.mrch_id == record.mrch_id ? (
            <Input
              value={editData["total_agreed_amount"]}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  total_agreed_amount: e.target.value,
                })
              }
              rows={4}
            />
          ) : (
            <span>{text}</span>
          )}
        </>
      ),
    },

    {
      title: "Customer Paid",
      dataIndex: "customer_paid",
      ...getColumnSearchProps("customer_paid"),
    },
    {
      title: "Item(s) Sold",
      dataIndex: "itemssold",
      ...getColumnSearchProps("itemssold"),
      render: (text, record) => (
        <>
          {editData?.mrch_id == record.mrch_id ? (
            <Input
              value={editData["itemssold"]}
              onChange={(e) =>
                setEditData({ ...editData, itemssold: e.target.value })
              }
              rows={4}
            />
          ) : (
            <span>{text}</span>
          )}
        </>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_timestamp",
      render: (text) => `${moment(text).format("MM/DD/YYYY h:mm a")}`,
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {userRole === "OM" && (
            <Button
              block
              onClick={() => {
                editData?.mrch_id == record.mrch_id
                  ? saveEditedRow()
                  : setEditData(record);
              }}
            >
              {editData?.mrch_id == record.mrch_id ? "Save" : "Edit"}
            </Button>
          )}
          <Button
            type="primary"
            onClick={() => {
              payAPI(record);
            }}
          >
            Pay
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchNewSignups();
  }, []);

  const fetchNewSignups = async () => {
    setLoading(true);
    try {
      const empid = localStorage.getItem("emp_id");
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=settle`;
      const res = await axios.get(endPoint, {
        headers: { authorization: token },
      });
      setLoading(false);

      const result = res.data.body;
      if (result.message) {
        Modal.warning({ title: result.message });
      } else {
        updateData(res.data.body);
      }
    } catch (err) {
      setLoading(false);
      if (err?.response?.status === 401) {
        removeSession();
      }
    }
  };

  return (
    <div>
      <div className="table-component">
        <Row justify="space-between" align="middle" className="mb-4">
          <Col xs={14}>
            <h4 className="mb-1"> Doorbuster Settlement</h4>
            <small>Doorbuster Settlement List</small>
          </Col>
          <Col xs={8}>
            <Row justify="end">
              <CsvDownload
                className="ant-btn ant-btn-primary ant-btn-round ant-btn-sm"
                filename="Merchant Status List.csv"
                style={{ marginRight: 5 }}
                data={data || []}
              >
                Download
              </CsvDownload>
              <Button
                loading={loading}
                shape="round"
                size="small"
                onClick={fetchNewSignups}
                type="primary"
                icon={<SyncOutlined />}
              >
                {loading ? "Loading" : "Refresh"}
              </Button>
            </Row>
          </Col>
        </Row>

        <Col lg={6} className="mb-4">
          <Button type="primary" onClick={() => {}}>
            + Add New
          </Button>
        </Col>

        <Col lg={24} className="table-overflow">
          <Table
            loading={loading}
            rowKey={(record) => record.mrch_id}
            columns={columns}
            dataSource={data}
            bordered
          />
        </Col>
      </div>
    </div>
  );
};
export default withRouter(DoorbusterSettlement);
