import React, { useEffect, useState } from "react";
import { Table, Col, Row, Button } from "antd";
import axios from "axios";
import moment from "moment";
import { SyncOutlined } from "@ant-design/icons";
import { removeSession } from "../../../Utils/Session";
import CsvDownload from "react-json-to-csv";
import { useHistory } from "react-router";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const base_url = process.env.REACT_APP_BASE_URL;

const IncorrectShopAreas = (props) => {
  const [data, updateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

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
      title: "Shop Area",
      dataIndex: "shp_area",
    },
    {
      title: "Merchant Status",
      dataIndex: "mrch_sts",
    },
    {
      title: "Status Updated On",
      dataIndex: "row_upd_dt",
      render: (text) => <span>{moment(text).format("ll")}</span>,
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
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=dataError`;
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
            <h4>Incorrect ctgy or Subctgy </h4>{" "}
          </Col>
          <Col xs={8}>
            <Row justify="end">
              <CsvDownload
                className="ant-btn ant-btn-primary ant-btn-round ant-btn-sm"
                filename="Incorrect ctgy or Subctgy.csv"
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
export default IncorrectShopAreas;
