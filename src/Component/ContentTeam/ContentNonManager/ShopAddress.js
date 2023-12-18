import React, { useEffect, useState } from "react";
import { Table, Col, Row, Button, Space, Input } from "antd";
import axios from "axios";
import moment from "moment";
import { SyncOutlined, EditOutlined } from "@ant-design/icons";
import { removeSession } from "../../../Utils/Session";
import CsvDownload from "react-json-to-csv";
import { useHistory } from "react-router";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const base_url = process.env.REACT_APP_BASE_URL;

const ShopAddress = (props) => {
  const [data, updateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);

  const history = useHistory();
  const { TextArea } = Input;
  const columns = [
    {
      title: "Merchant ID",
      dataIndex: "mrch_id",
      render: (text) => (
        <a
          onClick={() => {
            openEditMerchantForm(text);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Shop Name",
      dataIndex: "shp_nm",
    },
    {
      title: "Shop Address",
      dataIndex: "shp_adr",
      render: (text, record) => (
        <>
          {editData?.mrch_id == record.mrch_id ? (
            <TextArea
              value={editData["shp_adr"]}
              onChange={(e) =>
                setEditData({ ...editData, shp_adr: e.target.value })
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
      title: "Shop Area",
      dataIndex: "shp_area",
    },
    {
      title: "Shop Pincode",
      dataIndex: "shp_pincd",
      render: (text, record) => (
        <>
          {editData?.mrch_id == record.mrch_id ? (
            <TextArea
              value={editData["shp_pincd"]}
              onChange={(e) =>
                setEditData({ ...editData, shp_pincd: e.target.value })
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
      title: "Sub Category",
      dataIndex: "mrch_sub_ctgy",
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {editData?.mrch_id == record?.mrch_id ? (
            <Button
              type="primary"
              props
              onClick={() => {
                // console.log(editData);
                // api goes here
                setEditData(null);
              }}
            >
              Save
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                setEditData(record);
              }}
            >
              Edit
            </Button>
          )}
        </Space>
      ),
    },
  ];
  const openEditMerchantForm = (id) => {
    const status = data.find((x) => x["mrch_id"] == id)?.["mrch_sts_cd"];
    if (status && id) {
      history.push("/OperationTeam/Newsignups", {
        status,
        mrch_id: id,
      });
    }
  };
  useEffect(() => {
    fetchShopDetails();
  }, []);

  const fetchShopDetails = async () => {
    setLoading(true);

    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=address`;
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
      <div className="table-component">
        <Row justify="space-between" align="middle" className="mb-4">
          <Col xs={14}>
            <h4>Shop Addresses </h4>{" "}
          </Col>
          <Col xs={8}>
            <Row justify="end">
              <CsvDownload
                className="ant-btn ant-btn-primary ant-btn-round ant-btn-sm"
                filename="Shop Addresses.csv"
                style={{ marginRight: 5 }}
                data={data || []}
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
    </div>
  );
};
export default ShopAddress;
