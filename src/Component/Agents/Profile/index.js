import React, { useEffect, useState } from "react";
import { Button, Row, Col, Statistic, Divider, Spin, Result } from "antd";

import axios from "axios";
import moment from "moment";
import ChangePassword from "./changePassword";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

function Profile() {
  const [loading, setLoading] = useState(false);
  const [data, updateData] = useState({});

  useEffect(() => {
    fetchMerchantsData();
  }, []);

  const fetchMerchantsData = async () => {
    setLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/agent/${empid}?profile=true`;
      const res = await axios.get(endPoint, {
        headers: { authorization: token },
      });
      setLoading(false);
      updateData(res.data.body);
    } catch (err) {
      setLoading(false);
    }
  };

  const renderCol = (label, labelValue) => {
    return (
      <Col md={4} className="mx-2 mb-4">
        <Statistic
          title={<span style={{ fontWeight: "500" }}>{label}</span>}
          value={labelValue ? labelValue : ""}
          valueStyle={{
            fontSize: "16px",
            fontWeight: "600",
            textTransform: "capitalize",
          }}
        />
      </Col>
    );
  };

  return (
    <div>
      <h4 className="mb-4">Agent Profile</h4>

      <Spin spinning={loading}>
        <Divider orientation="left">Details</Divider>

        {data.agent_id ? (
          <Row>
            <Col lg={24}>
              <Row justify="space-between">
                {renderCol("Agent ID", data.agent_id)}
                {renderCol("Name", data.name)}
                {renderCol("Contact", data.contact)}
                {renderCol("Gst", data.gst)}
                {renderCol("Status", data.status)}
                {renderCol("Enrolled date", data.enrolled_dt)}
                {renderCol("Address", data.address)}
                {renderCol("Area", data.area)}
                {renderCol("District", data.district)}
                {renderCol("Contract areas", data.contract_areas)}
                {renderCol("Contract term", data.contract_term)}
                {renderCol(
                  "Free Onboard commission",
                  data.freeonboard_commission
                )}
                {renderCol(
                  "Paid Onboard commission",
                  data.paidonboard_commission
                )}
                {renderCol(
                  "Merchant Commission Term",
                  data.merchant_commission_term
                )}
                {renderCol("district", data.district)}
              </Row>
            </Col>
          </Row>
        ) : (
          <Result
            status="warning"
            title="Your Profile is not Linked, Please Contact our team"
            subTitle="Only Linked profiles can see their profile details, This happens if OTP is not confirmed at the time of signup. "
          />
        )}
        <Divider orientation="left">Change Password</Divider>
        <ChangePassword />
      </Spin>
    </div>
  );
}

export default Profile;
