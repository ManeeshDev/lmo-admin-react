import React, { useEffect, useState } from "react";

import axios from "axios";
import moment from "moment";
import { Button, Row, Col, Table, Statistic } from "antd";

const token = localStorage.getItem("token");
const empid = localStorage.getItem("emp_id");

function MerchantDetails({ mrch_id, backToPage }) {
  const [loading, setLoading] = useState(false);
  const [data, updateData] = useState({});

  useEffect(() => {
    fetchMerchantsData();
  }, []);

  const fetchMerchantsData = async () => {
    setLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/agent/${empid}?mrch=${mrch_id}`;
      const res = await axios.get(endPoint, {
        headers: { authorization: token },
      });
      setLoading(false);
      updateData(res.data.body);
    } catch (err) {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Amount Paid",
      dataIndex: "amt_pd",
    },
    {
      title: "Paid for",
      dataIndex: "paidforservice",
    },
    {
      title: "Transaction date",
      dataIndex: "created_timestamp",
      render: (x) => <span>{moment(x).format("lll")}</span>,
    },
  ];

  return (
    <div className="table-component">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col xs={14}>
          <h4>Merchants Transactions</h4>
        </Col>
        <Col xs={8}>
          <Row justify="end">
            <Button
              loading={loading}
              shape="round"
              size="small"
              onClick={backToPage}
              type="primary"
            >
              Go Back
            </Button>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Statistic
            title={
              <b>
                Total Amount Generated
                <br /> <small> for completed transactions</small>
              </b>
            }
            value={data.total_paid ? data.total_paid : ""}
            prefix={<span>&#x20B9;</span>}
            valueStyle={{ fontWeight: "bold", color: "green" }}
          />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={24} className="table-overflow">
          <Table loading={loading} columns={columns} dataSource={data.Tran} />
        </Col>
      </Row>
    </div>
  );
}

export default MerchantDetails;
