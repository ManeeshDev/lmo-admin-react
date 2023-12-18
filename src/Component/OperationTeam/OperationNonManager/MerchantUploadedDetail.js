import React, { useState, useEffect } from "react";
import { Spin, Button, Select, Modal, PageHeader, Input, Col, Row } from "antd";
import axios from "axios";
import { ArrowLeftOutlined } from "@ant-design/icons";
import statusCodeJson from "../../../Utils/statusCodeJson";
import { removeSession } from "../../../Utils/Session";
import { useHistory } from "react-router";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const base_url = process.env.REACT_APP_BASE_URL;

const MerchantPending = (props) => {
  const [documnt_lst, updateDocumntLst] = useState("");
  const [statusCodes, updateStatusCodes] = useState("");
  const [btn, setBtn] = useState(false);
  const [loading, updateLoading] = useState(false);
  const [selectedStatus, updateSelectedStatus] = useState(null);

  const [ctgy, setCtgy] = useState(0);
  const history = useHistory();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    updateLoading(true);
    try {
      const endPoint = `${base_url}/${empid}/${userRole}/onm?status=mrchdocs&mrchid=${props.mrchid}&stscd=${props.sts_cd}`;
      const res = await axios.get(endPoint, {
        headers: { authorization: token },
      });
      updateLoading(false);

      if (res.data.body.message) {
        Modal.error({
          content: res.data.body.message,
          onOk() {
            props.backToPage();
          },
        });
      } else if (res.data.body) {
        let { result, statusKeys } = res.data.body;
        updateDocumntLst(result);

        const urlParser = result[0].split("/")[4].split("-")[1];
        setCtgy(parseInt(urlParser));

        var statusArray = [];
        statusKeys &&
          statusKeys.map((item) => {
            var label = statusCodeJson.filter((status) => status.code === item);
            var itemdata = {
              label: label[0].value,
              value: item,
            };
            statusArray.push(itemdata);
          });
        updateStatusCodes(statusArray);
      }
    } catch (err) {
      if (err.response.status === 401) {
        removeSession();
      }
    }
    updateLoading(false);
  };

  const openEditMerchantForm = () => {
    console.log(props.selectedRecord);
    if (props.selectedRecord?.sts_cd && props.selectedRecord?.mrch_id) {
      history.push("/OperationTeam/Newsignups", {
        status: props.selectedRecord?.mrch_sts_cd,
        mrch_id: props.selectedRecord?.mrch_id,
      });
    }
  };

  const onFinish = async () => {
    try {
      setBtn(true);
      if (selectedStatus) {
        const config = {
          headers: {
            Authorization: token,
          },
        };
        const endPoint = `${base_url}/${empid}/${userRole}/onm?status=mrchdocs&mrchid=${props.mrchid}&stscd=${selectedStatus}&ctgy=${ctgy}`;
        const res = await axios.post(endPoint, {}, config);
        setBtn(false);
        Modal.success({
          content: res.data.body,
          onOk() {
            props.backToPage();
          },
        });
      } else {
        setBtn(false);
        Modal.warning({
          content: "Please change the status before proceeding...",
          onOk() {},
        });
      }
    } catch (err) {
      Modal.error({
        content: "Action Failed! Please report to Manager.",
        onOk() {},
      });
    }
  };

  return (
    <div className="detail-page">
      <PageHeader
        className="site-page-header"
        onBack={() => props.backToPage()}
        title={"Merchant Uploaded Documents"}
      />
      {/* <Button
        shape="round"
        size="small"
        onClick={() => {
          openEditMerchantForm();
        }}
        type="primary"
      >
        Edit Details
      </Button> */}
      {documnt_lst && documnt_lst.length > 0 && !loading ? (
        <>
          openEditMerchantForm
          <Col lg={12} className="upload-status-form">
            <div>
              <b>Update Status</b>
            </div>

            <Select
              style={{ marginBottom: "1rem", width: "100%" }}
              placeholder="Select Status:"
              onChange={(e) => {
                updateSelectedStatus(e);
              }}
              options={statusCodes}
            />
            <Button
              type="primary"
              onClick={() => {
                onFinish();
              }}
            >
              Submit
            </Button>
            <Button
              style={{ marginLeft: "2rem" }}
              onClick={() => {
                props.backToPage();
              }}
            >
              Cancel
            </Button>
          </Col>
          <div className="row">
            {documnt_lst.map((item) => (
              <div className="uploaded_dcmnt">
                {item.split("/")[4].split(".")[1] === "mp4" ? (
                  <video className="video" controls controlsList="nodownload">
                    <source src={item} type="video/mp4" />
                    {/* <source src="movie.ogg" type="video/ogg" /> */}
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={item} />
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <Row justify="center" className="my-5">
          <Spin tip="Hold on!! We are collecting Merchant Details for you ..." />
        </Row>
      )}
    </div>
  );
};
export default MerchantPending;
