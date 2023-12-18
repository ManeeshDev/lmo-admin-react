import React, { useEffect, useState } from "react";
import { Button, Input, Row, Table, Col } from "antd";
import axios from "axios";
import moment from "moment";
import NewSignupDetail from "./NewSignupDetail";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { removeSession } from "../../../Utils/Session";
import CsvDownload from "react-json-to-csv";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const base_url = process.env.REACT_APP_BASE_URL;

const IncorrectShopAreas = (props) => {
  const [data, updateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetail, showSignupDetailPage] = useState(false);
  const [selectedId, updateSelectedID] = useState("");
  const [selectedStatus, updateSelectedStatus] = useState("");

  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
    searchInput: "",
  });

  useEffect(() => {
    fetchShopDetails();
  }, [showDetail]);

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
      title: "Merchant ID",
      dataIndex: "mrch_id",
      ...getColumnSearchProps("mrch_id"),
      render: (text, record) => (
        <a
          className="tu"
          onClick={() => {
            showDetailPage(record.mrch_sts_cd, text);
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
      title: "Shop Address",
      dataIndex: "shp_adr",
    },
    {
      title: "Status Updated On",
      dataIndex: "row_upd_dt",
      render: (text) => <span>{moment(text).format("ll")}</span>,
    },
  ];

  const showDetailPage = (status, mrch_id) => {
    showSignupDetailPage(!showDetail);
    updateSelectedStatus(status);
    updateSelectedID(mrch_id);
  };

  const fetchShopDetails = async () => {
    setLoading(true);

    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=shopError`;
      const res = await axios.get(endPoint, {
        headers: { authorization: token },
      });
      var resultArray = [];
      res.data.body.map((item) => {
        if (item !== null) resultArray.push(item);
      });
      updateData(resultArray);
    } catch (err) {
      if (err.response.status === 401) {
        removeSession();
      }
    }
    setLoading(false);
  };

  return (
    <div>
      {showDetail ? (
        <NewSignupDetail
          mrchid={selectedId}
          sts_cd={selectedStatus}
          backToPage={() => {
            showDetailPage();
          }}
        />
      ) : (
        <div className="table-component">
          <Row justify="space-between" align="middle" className="mb-4">
            <Col xs={14}>
              <h4>Incorrect Shop Areas</h4>{" "}
            </Col>
            <Col xs={8}>
              <Row justify="end">
                <CsvDownload
                  className="ant-btn ant-btn-primary ant-btn-round ant-btn-sm"
                  filename="Incorrect Shop Areas.csv"
                  style={{ marginRight: 5 }}
                  data={data?.finalResult || []}
                >
                  Download
                </CsvDownload>
                <Button
                  loading={loading}
                  shape="round"
                  size="small"
                  onClick={fetchShopDetails}
                  type="primary"
                  icon={<SyncOutlined />}
                >
                  Refresh
                </Button>
              </Row>
            </Col>
          </Row>
          <Col lg={24} className="table-overflow">
            <Table
              pagination={{ pageSize: 50 }}
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
export default IncorrectShopAreas;
