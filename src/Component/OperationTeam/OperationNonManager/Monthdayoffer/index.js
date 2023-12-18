import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Table,
} from "antd";
import axios from "axios";
import moment from "moment";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { withRouter } from "react-router";
import { removeSession } from "../../../../Utils/Session";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const Monthdayoffer = ({ history }) => {
  const [data, updateData] = useState([]);

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

  useEffect(() => {
    fetchMerchantOfferItems();
  }, []);

  const fetchMerchantOfferItems = async () => {
    setLoading(true);
    try {
      const empid = localStorage.getItem("emp_id");
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=mdo`;
      const { data } = await axios.get(endPoint, {
        headers: { authorization: token },
      });
      setLoading(false);

      const result = data.body;
      if (result.message) {
        Modal.warning({ title: result.message });
      } else {
        updateData(data.body);
      }
    } catch (err) {
      setLoading(false);
      if (err.response.status === 401) {
        removeSession();
      }
    }
  };

  const changeStatus = async (sts, mrchid, id, price) => {
    try {
      const empid = localStorage.getItem("emp_id");
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm`;
      const { data } = await axios.put(
        endPoint,
        {},
        {
          headers: { authorization: token },
          params: {
            stscd: sts ? "accept" : null,
            mrchid,
            id,
            price: price ? price : null,
            status: "mdo",
          },
        }
      );

      const result = data.body;
      Modal.warning({ title: result, onOk: () => fetchMerchantOfferItems() });
    } catch (err) {
      if (err.response.status === 401) {
        removeSession();
      }
    }
  };

  const columns = [
    {
      title: "Merchant ID",
      dataIndex: "mrchid",
      ...getColumnSearchProps("mrchid"),
    },
    {
      title: "Shop Name",
      dataIndex: "shopname",
      ...getColumnSearchProps("shopname"),
    },
    {
      title: "Item Name",
      dataIndex: "item",
      ...getColumnSearchProps("item"),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      ...getColumnSearchProps("brand"),
    },
    {
      title: "Size",
      dataIndex: "attributes",
      render: (text) => <span>{text?.map((x) => x.size)}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "monthqty",
    },
    {
      title: "Actual Price",
      dataIndex: "actualprice",
      render: (text) => <span className="text-success">Rs. {text}</span>,
    },
    {
      title: "Offer Price",
      dataIndex: "offerprice",
      render: (text) => <span>Rs. {text}</span>,
    },
    {
      title: "LMO Bidding Price",
      dataIndex: "lmoprice",
      render: (text) => <span className="text-danger">Rs. {text}</span>,
    },
    {
      title: "Sub Category",
      dataIndex: "subctgy",
      ...getColumnSearchProps("subctgy"),
    },
    {
      title: "Area",
      dataIndex: "area",
      ...getColumnSearchProps("area"),
    },

    {
      title: "Actions",
      dataIndex: "area",
      render: (_, record) => (
        <Row>
          <Button
            onClick={() =>
              changeStatus("accept", record.mrchid, record.itemid, null)
            }
            type="primary"
            className="m-2"
          >
            Accept
          </Button>
          <Button
            onClick={() => {
              let price = record.lmoprice;

              return Modal.confirm({
                title: (
                  <>
                    <h6>Please Enter Bidding Price</h6>

                    <div className="mb-4">
                      <small>
                        Merchant Bidding price : Rs.{record.lmoprice}
                      </small>
                    </div>

                    <InputNumber
                      className="w-75"
                      placeholder="enter amount"
                      value={price}
                      onChange={(e) => (price = e)}
                    />
                  </>
                ),
                onOk: () =>
                  changeStatus(null, record.mrchid, record.itemid, price),
              });
            }}
            className="m-2"
          >
            Modify
          </Button>
        </Row>
      ),
    },
  ];

  return (
    <div>
      <div className="table-component">
        <Row justify="space-between" align="middle" className="mb-4">
          <Col xs={14}>
            <h4 className="mb-1"> Month Day Offer</h4>
          </Col>
          <Col xs={8}>
            <Row justify="end">
              <Button
                loading={loading}
                shape="round"
                size="small"
                onClick={fetchMerchantOfferItems}
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
    </div>
  );
};
export default withRouter(Monthdayoffer);
