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
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { withRouter } from "react-router";
import { removeSession } from "../../../../Utils/Session";
import CsvDownload from "react-json-to-csv";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const MerchantStatus = ({ history }) => {
  const [data, updateData] = useState([]);
  const [showDetail, showSignupDetailPage] = useState(false);
  const [selectedId, updateSelectedID] = useState("");
  const [selectedStatus, updateSelectedStatus] = useState("");

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
        <a href={`/OperationTeam/merchant-status/${text}`}>{text}</a>
      ),
    },
    {
      title: "Merchant Name",
      dataIndex: "mrch_name",
      ...getColumnSearchProps("mrch_name"),
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
      title: "Shop Status",
      dataIndex: "mrch_shp_sts_cd",
    },
    {
      title: "Enrolled Date",
      dataIndex: "enroll_dt",
      render: (text) => (
        <Tag>{`${moment(text).format("DD/MM/YYYY , hh:mm a")}`}</Tag>
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
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=mrch`;
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
      if (err.response.status === 401) {
        removeSession();
      }
    }
  };

  return (
    <div>
      <div className="table-component">
        <Row justify="space-between" align="middle" className="mb-4">
          <Col xs={14}>
            <h4 className="mb-1"> Merchant Status List</h4>
            <small>Merchants whose enrollment is not completed</small>
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
          <h6>Search for a Merchant</h6>
          <Input
            placeholder="Enter Merchant ID"
            suffix={<SearchOutlined />}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length === 10) {
                history.push(`/OperationTeam/merchant-status/${value}`);
              }
            }}
          />
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
export default withRouter(MerchantStatus);
