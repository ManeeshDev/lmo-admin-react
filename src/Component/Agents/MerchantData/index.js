import React, { useEffect, useState } from "react";
import { Button, Col, Input, Modal, Row, Table, DatePicker, Tabs } from "antd";
import axios from "axios";
import moment from "moment";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import AgentDetails from "./details";
import CsvDownload from "react-json-to-csv";
import MerchantInfo from "./MerchantInfo";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const AgentHome = () => {
  const [data, updateData] = useState([]);
  const [responseData, setResponseData] = useState([]);

  const [showDetail, showSignupDetailPage] = useState(false);

  const [mrch, setMrch] = useState({});

  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
    searchInput: "",
  });

  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [defaultKey, setDefaultKey] = useState("1");

  const defaultDate = moment(new Date()).format("DD-MM-YYYY");
  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultDate);
  const [fireService, setFireService] = useState(false);

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
      dataIndex: "agent_id",
      ...getColumnSearchProps("agent_id"),
    },
    {
      title: "Merchant ID",
      dataIndex: "mrch_id",
      ...getColumnSearchProps("mrch_id"),

      render: (text, record) => (
        <a
          className="tu"
          onClick={() => {
            showSignupDetail(record);
            setDefaultKey("2");
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Merchant Name",
      dataIndex: "mrch_name",
      ...getColumnSearchProps("mrch_name"),

      render: (text, record) => (
        <a
          className="tu"
          onClick={() => {
            showSignupDetail(record);
            setDefaultKey("1");
          }}
        >
          {text}
        </a>
      ),
    },

    {
      title: "Merchant Contact",
      dataIndex: "cntct_nbr",
      ...getColumnSearchProps("cntct_nbr"),
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
      dataIndex: "curr_sts",
    },
    {
      title: "Enrolled Date",
      dataIndex: "enroll_dt",
      render: (text) => (
        <span>{`${moment(text).format("MM/DD/YYYY, h:mm:ss a")}`}</span>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "pymnt_sts",
      render: (text) => <span>{text || "NA"}</span>,
    },
  ];

  useEffect(() => {
    if (!showDetail) fetchMerchantsData();
  }, [showDetail]);

  const showSignupDetail = (record) => {
    showSignupDetailPage(!showDetail);

    if (record) {
      setMrch(record.mrch_id);
    }
  };

  const fetchMerchantsData = async () => {
    setLoading(true);
    try {
      const empid = localStorage.getItem("emp_id");
      // const endPoint = `${process.env.REACT_APP_BASE_URL}/agent/${empid}?mrch=true`;
      const endPoint = `${process.env.REACT_APP_BASE_URL}/agent/${empid}?mrch=true&strtdt=${startDate}&enddt=${endDate}`;
      const res = await axios.get(endPoint, {
        headers: { authorization: token },
      });

      setLoading(false);
      updateData(res.data.body);
      setResponseData(res.data.body);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fireService && fetchMerchantsData();
  }, [fireService]);
  function onChange(value, [startDate, endDate]) {
    console.log("Selklkjlected Time: ", startDate, endDate);
    // console.log("Formatted Selected Time: ", dateString);
    // setDateRange(value);
    if (startDate && endDate) {
      setStartDate(moment(startDate).format("DD-MM-YYYY"));
      setEndDate(moment(endDate).format("DD-MM-YYYY"));
      setFireService(true);

      // const upperLimit = new Date(endDate).getTime(); // u can convert a Date into unix time
      // const lowerLimit = new Date(startDate).getTime();
      // const filteredData = responseData.filter(
      //   (d) =>
      //     lowerLimit <= new Date(d.enroll_dt).getTime() &&
      //     new Date(d.enroll_dt).getTime() <= upperLimit
      // );
      // updateData(filteredData);
    } else {
      // updateData(responseData);
    }
  }
  return (
    <div>
      {showDetail ? (
        <>
          <Tabs defaultActiveKey={defaultKey}>
            <TabPane tab="Transactions" key="1">
              <AgentDetails
                mrch_id={mrch}
                backToPage={() => {
                  showSignupDetail();
                }}
              />{" "}
            </TabPane>
            <TabPane tab="Merchant Details" key="2">
              <MerchantInfo
                mrch_id={mrch}
                backToPage={() => {
                  showSignupDetail();
                }}
              />{" "}
            </TabPane>
          </Tabs>
        </>
      ) : (
        <div className="table-component">
          <Row justify="space-between" align="middle" className="mb-4">
            <Col xs={14}>
              <h4>Merchants List</h4>
              <RangePicker bordered={true} onChange={onChange} />
            </Col>
            <Col xs={8}>
              <Row justify="end">
                <CsvDownload
                  className="ant-btn ant-btn-primary ant-btn-round ant-btn-sm"
                  filename="Merchants List.csv"
                  style={{ marginRight: 5 }}
                  data={data}
                >
                  Download
                </CsvDownload>
                <Button
                  loading={loading}
                  shape="round"
                  size="small"
                  onClick={() => {
                    fetchMerchantsData();
                  }}
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
export default AgentHome;