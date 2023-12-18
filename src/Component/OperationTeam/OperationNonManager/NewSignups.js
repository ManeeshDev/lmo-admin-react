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
} from "antd";
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

const NewSignups = (props) => {
  const [data, updateData] = useState([]);
  const [showDetail, showSignupDetailPage] = useState(false);
  const [selectedId, updateSelectedID] = useState("");
  const [selectedStatus, updateSelectedStatus] = useState("");
  const [number, setNumber] = useState("");
  const location = useLocation();

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
      title: "Agent ID",
      dataIndex: "agent",
      ...getColumnSearchProps("agent"),
    },
    {
      title: "Merchant ID",
      dataIndex: "mrch_id",
      ...getColumnSearchProps("mrch_id"),

      render: (text, record) => (
        <a
          className="tu"
          onClick={() => {
            showSignupDetail(record.mrch_sts_cd, text);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Shop Name",
      dataIndex: "shp_nm",
      ...getColumnSearchProps("shp_nm"),
    },
    {
      title: "Shop Area",
      dataIndex: "shp_area",
      ...getColumnSearchProps("shp_area"),
    },
    {
      title: "Merchant Status",
      dataIndex: "mrch_sts",
    },
    {
      title: "Created At",
      dataIndex: "row_insrt_dt",
      render: (text) => (
        <Tag>{`${moment(text).format("DD/MM/YYYY , hh:mm a")}`}</Tag>
      ),
    },
  ];

  useEffect(() => {
    if (!showDetail) fetchNewSignups();
  }, [showDetail]);

  const showSignupDetail = (status, mrch_id) => {
    showSignupDetailPage(!showDetail);
    updateSelectedStatus(status);
    updateSelectedID(mrch_id);
  };

  const fetchNewSignups = async () => {
    setLoading(true);
    try {
      const empid = localStorage.getItem("emp_id");
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=signup`;
      const res = await axios.get(endPoint, {
        headers: { authorization: token },
      });
      setLoading(false);
      updateData(res.data.body);
    } catch (error) {
      setLoading(false);
      if (error.response.status === 401) {
        removeSession();
      }
    }
  };

  const confirmMerchant = async () => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=otp&mrchid=${number}`;
      const res = await axios.post(endPoint, {}, config);

      if (res.data.body) {
        Modal.success({ title: "User OTP Confirmed" });
        setNumber("");
      } else {
        Modal.error({
          title: "Action Failed! Please contact Operation Manager",
        });
      }
    } catch (err) {
      if (err) {
        Modal.error({
          title: "Action Failed! Please contact Operation Manager",
        });
      }
    }
  };

  useEffect(() => {
    // console.log("location", location);
    const { status, mrch_id } = { ...location.state };
    status && mrch_id && showSignupDetail(status, mrch_id);
  }, []);

  return (
    <div>
      {showDetail ? (
        <NewSignupDetail
          mrchid={selectedId}
          sts_cd={selectedStatus}
          backToPage={() => {
            showSignupDetail();
          }}
        />
      ) : (
        <div className="table-component">
          <Row justify="space-between" align="middle" className="mb-4">
            <Col xs={14}>
              <h4>New Merchant Signup</h4>
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
                  onClick={fetchNewSignups}
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
              title="Confirm Merchant OTP"
              extra={
                <Button
                  type="primary"
                  disabled={number.length !== 10}
                  onClick={confirmMerchant}
                >
                  Submit
                </Button>
              }
            >
              <Input
                placeholder="Enter Merchant Login Mobile Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </Card>
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
      )}
    </div>
  );
};
export default NewSignups;
