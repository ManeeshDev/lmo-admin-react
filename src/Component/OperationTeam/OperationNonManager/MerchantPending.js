import React, { useEffect, useState } from "react";
import { Table, Row, Button, Modal, Select, message, Form, Col } from "antd";
import axios from "axios";
import moment from "moment";
import { SyncOutlined } from "@ant-design/icons";
import statusCodeJson from "../../../Utils/statusCodeJson";
import { removeSession } from "../../../Utils/Session";
import CsvDownload from "react-json-to-csv";
import { useHistory } from "react-router";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const base_url = process.env.REACT_APP_BASE_URL;

const MerchantPending = (props) => {
  const [data, updateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStatus, showStatusPopup] = useState(false);
  const [selectedMerchant, updateSelectedMerchant] = useState("");
  const [selectedStatus, updateSelectedStatus] = useState("");
  const [statusCodes, updateStatusCodes] = useState("");
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
      className: "column-money",
      dataIndex: "shp_nm",
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
    {
      title: "Action",
      dataIndex: "mrch_id",
      render: (text) => (
        <Button
          danger
          onClick={() => {
            showPopupModal(text);
          }}
        >
          Change status
        </Button>
      ),
    },
  ];
  const openEditMerchantForm = (id) => {
    const status = data.finalResult.find((x) => x["mrch_id"] == id)?.[
      "mrch_sts_cd"
    ];
    if (status && id) {
      history.push("/OperationTeam/Newsignups", {
        status,
        mrch_id: id,
      });
    }
  };

  useEffect(() => {
    fetchMerchantUploaded();
  }, []);
  const showPopupModal = (merch_id) => {
    updateSelectedMerchant(merch_id);
    showStatusPopup(true);
    updateSelectedStatus("");
  };
  const ChangeStatus = () => {
    if (selectedStatus !== "") {
      setLoading(true);
      const body = {};
      const config = {
        headers: {
          Authorization: token,
        },
      };
      try {
        const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=mrchPending&mrchid=${selectedMerchant}&stscd=${selectedStatus}`;
        return axios.post(endPoint, body, config).then((res) => {
          if (res.data.statusCode === 200) {
            message.success(res.data.body.message);
            updateSelectedMerchant("");
            showStatusPopup(false);
            updateStatusCodes("");
            updateSelectedStatus("");
            fetchMerchantUploaded();
            // window.location.reload();
          }
        });
      } catch (err) {
        //console.log(err);
      }
      setLoading(false);
    } else {
      message.destroy();
      message.error("Please select the status before submitting");
    }
  };
  const fetchMerchantUploaded = async () => {
    setLoading(true);
    updateSelectedStatus("");
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=mrchPending`;
      const res = await axios.get(endPoint, {
        headers: { authorization: token },
      });
      let { result, stsCodes } = res.data.body;
      var statusArray = [];
      stsCodes &&
        stsCodes.map((item) => {
          var label = statusCodeJson.filter((status) => status.code === item);
          var itemdata = {
            label: label[0].value,
            value: item,
          };
          statusArray.push(itemdata);
        });
      updateStatusCodes(statusArray);
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
      <div className="table-component">
        <Row justify="space-between" align="middle" className="mb-4">
          <Col xs={14}>
            <h4>Pending Documents from Merchant</h4>
          </Col>
          <Col xs={8}>
            <Row justify="end">
              <CsvDownload
                className="ant-btn ant-btn-primary ant-btn-round ant-btn-sm"
                filename="Pending Documents from Merchant.csv"
                style={{ marginRight: 5 }}
                data={data?.finalResult || []}
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
            dataSource={data.finalResult}
            bordered
          />
        </Col>
      </div>

      <Modal
        maskClosable={true}
        destroyOnClose
        closable={true}
        title="Change the status of the merchant account"
        visible={showStatus}
        footer={null}
        onCancel={() => {
          showStatusPopup(false);
        }}
      >
        <Form preserve={false}>
          <div style={{ padding: "0 2rem" }}>
            <Row justify="center">
              <h3>Select the status for proceeding</h3>
              <Select
                style={{ marginBottom: "1rem", width: "100%" }}
                placeholder="Select Status:"
                onChange={(e) => {
                  updateSelectedStatus(e);
                }}
                options={statusCodes}
              />
            </Row>

            <br />
            <br />

            <Row justify="end">
              <Button
                type="primary"
                shape="round"
                onClick={() => {
                  ChangeStatus();
                }}
              >
                Ok
              </Button>
            </Row>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
export default MerchantPending;
