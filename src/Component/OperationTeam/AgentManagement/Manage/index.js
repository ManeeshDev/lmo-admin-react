import React, { useEffect, useState } from "react";
import { Button, Col, Input, Modal, Row, Table } from "antd";
import axios from "axios";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import AgentDetails from "../form";
import Axios from "axios";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const AgentManagement = () => {
  const [data, updateData] = useState([]);
  const [showDetail, showSignupDetailPage] = useState(false);

  const [agent, setAgent] = useState({});

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
      dataIndex: "agent_id",
      ...getColumnSearchProps("agent_id"),
      render: (text, record) => (
        <a
          className="tu"
          onClick={() => {
            showSignupDetail(record);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Agent Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Agent Contact",
      dataIndex: "contact",
      ...getColumnSearchProps("contact"),
    },
    {
      title: "Agent Area",
      dataIndex: "area",
      render: (text, x) => (
        <span>
          {text}, {x.district}
        </span>
      ),
    },
    {
      title: "Agent Status",
      dataIndex: "status",
    },
    {
      title: "Enrolled Date",
      dataIndex: "enrolled_dt",
      render: (text) => <span>{text}</span>,
    },
  ];

  useEffect(() => {
    if (!showDetail) fetchAgentsData();
  }, [showDetail]);

  const showSignupDetail = (record) => {
    showSignupDetailPage(!showDetail);

    if (record) {
      setAgent(record);
    }
  };

  const fetchAgentsData = async () => {
    setLoading(true);
    try {
      const empid = localStorage.getItem("emp_id");
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=agent`;
      const res = await axios.get(endPoint, {
        headers: { authorization: token },
      });
      setLoading(false);

      const { body } = res.data;

      if (body.message) {
        Modal.warning({ title: body.message });
      } else {
        updateData(res.data.body);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const updateAgent = async (values) => {
    setLoading(true);

    const updatedJson = {
      ...agent,
      ...values,
      contact: values.phone_number,
    };

    delete updatedJson.phone_number;

    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=agent`;
      const res = await Axios.put(endPoint, updatedJson, {
        headers: { authorization: token },
      });
      if (res) {
        Modal.success({
          title: "Agent Detials Updated Suceessfully",
          onOk() {
            showSignupDetail();
          },
        });
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div>
      {showDetail ? (
        <AgentDetails
          data={agent}
          backToPage={() => {
            showSignupDetail();
          }}
          loading={loading}
          onSignUp={updateAgent}
        />
      ) : (
        <div className="table-component">
          <Row justify="space-between" align="middle" className="mb-4">
            <Col xs={14}>
              <h4>Agent Management</h4>
            </Col>
            <Col xs={8}>
              <Row justify="end">
                <Button
                  loading={loading}
                  shape="round"
                  size="small"
                  onClick={fetchAgentsData}
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
export default AgentManagement;
