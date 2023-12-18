import React, { useEffect, useState } from "react";
import { Button, Checkbox, Col, Input, Row, Spin, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import AreaSearch from "../../OperationTeam/OperationNonManager/AreaSearch";
import Highlighter from "react-highlight-words";
import Axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";

const token = localStorage.getItem("token");

function Home() {
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
      title: "Shop Name",
      dataIndex: "shp_nm",
      ...getColumnSearchProps("shp_nm"),
      render: (text, x) => (
        <Link
          to={`/photographers/${x.mrch_id}/${x.mrch_ctgy_cd}/${x.mrch_sub_ctgy_cd}`}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Merchant Name",
      dataIndex: "mrch_name",
      ...getColumnSearchProps("mrch_name"),
    },
    {
      title: "Merchant Contact",
      dataIndex: "cntct_nbr",
      ...getColumnSearchProps("cntct_nbr"),
    },
    {
      title: "Merchant Address",
      dataIndex: "shp_adr",
      render: (text, x) => (
        <span>
          {text}, {x.shp_area}
        </span>
      ),
    },
    {
      title: "Merchant Sub Category",
      dataIndex: "mrch_sub_ctgy",
    },
    {
      title: "Enrolled Date",
      dataIndex: "enroll_dt",
      render: (text) => <span>{moment(text).format("ll")}</span>,
    },
  ];

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMerchants("ap-krsh-520");
  }, []);

  const fetchMerchants = async (code) => {
    setLoading(true);
    try {
      const fetch = await Axios.get(
        `${process.env.REACT_APP_BASE_URL}/phtgrhr?area=${code}`,
        {
          headers: { authorization: token },
        }
      );
      const response = fetch.data;
      setData(response.body);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Merchants List</h2>
      <Row>
        <Col lg={6}>
          <label>Select Area</label>
          <AreaSearch area_cd={(e) => fetchMerchants(e)} />
        </Col>

        <Col lg={24} className="table-overflow">
          <Spin spinning={loading}>
            <Table
              loading={loading}
              rowKey={(record) => record.mrch_id}
              columns={columns}
              dataSource={data}
              bordered
            />
          </Spin>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
