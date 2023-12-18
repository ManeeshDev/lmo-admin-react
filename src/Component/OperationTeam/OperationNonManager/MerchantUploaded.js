import React, { useEffect, useState } from "react";
import { Button, Col, Input, Row, Table } from "antd";
import axios from "axios";
import MerchantUploadedDetail from "./MerchantUploadedDetail";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";

import moment from "moment";

import Highlighter from "react-highlight-words";
import { removeSession } from "../../../Utils/Session";
import CsvDownload from "react-json-to-csv";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const MerchantUploaded = (props) => {
  const [data, updateData] = useState([]);
  const [showDetail, showDetailPage] = useState(false);
  const [selectedId, updateSelectedID] = useState("");
  const [selectedRecord, updateSelectedRecord] = useState(null);

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
            DisplayDetailPage(record.mrch_sts_cd, text, record);
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
      title: "Merchant Status",
      dataIndex: "mrch_sts",
    },
    {
      title: "Doc Uploaded Date",
      dataIndex: "row_upd_dt",
      render: (text) => <span>{moment(text).format("lll")}</span>,
    },
  ];

  useEffect(() => {
    if (!showDetail) fetchMerchantUploaded();
  }, [showDetail]);

  const DisplayDetailPage = (status, mrch_id, record) => {
    showDetailPage(!showDetail);
    updateSelectedStatus(status);
    updateSelectedID(mrch_id);
    updateSelectedRecord(record);
  };

  const fetchMerchantUploaded = async () => {
    setLoading(true);

    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=uploaded`;
      const res = await axios.get(endPoint, {
        headers: { authorization: token },
      });
      updateData(res.data.body);
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
        <MerchantUploadedDetail
          mrchid={selectedId}
          sts_cd={selectedStatus}
          selectedRecord={selectedRecord}
          backToPage={() => {
            DisplayDetailPage();
          }}
        />
      ) : (
        <div className="table-component">
          <Row justify="space-between" align="middle" className="mb-4">
            <Col xs={14}>
              <h4>Merchant Uploaded Documents</h4>
            </Col>
            <Col xs={8}>
              <Row justify="end">
                <CsvDownload
                  className="ant-btn ant-btn-primary ant-btn-round ant-btn-sm"
                  filename="Merchants Uploaded Documents.csv"
                  style={{ marginRight: 5 }}
                  data={data}
                >
                  Download
                </CsvDownload>
                <Button
                  loading={loading}
                  shape="round"
                  size="small"
                  onClick={fetchMerchantUploaded}
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
export default MerchantUploaded;
