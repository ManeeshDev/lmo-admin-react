import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Table,
  Rate,
  Radio,
  message,
  Button,
  Spin,
  List,
  Divider,
  Modal,
} from "antd";
import moment from "moment";
import axios from "axios";
import { SaveOutlined } from "@ant-design/icons";

// import { v4 as uuid } from "uuid";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

function ReviewsList() {
  const [data, setData] = useState([]);

  const [postData, setPostData] = useState([]);

  const [btn, setBtn] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=feedback`;
      const res = await axios.get(endPoint, {
        headers: { authorization: token },
      });

      setData(res.data.body);
    } catch (error) {
      // console.log(error);
    }
    setLoading(false);
  };

  const handleAction = (sts, comments, index) => {
    const request = {
      comments,
      sts,
      mrch_id: comments.mrch_id.toString(),
      idx: index,
      id: comments.rvw_id,
    };

    let copy = postData;
    copy.map((x, i) => {
      if (x.id === request.id) {
        copy.splice(i, 1);
      }
    });

    setPostData([...postData, request]);
  };

  const handleClear = (value) => {
    let copy = postData;
    copy.map((x, i) => {
      if (x.id === value.rvw_id) {
        copy.splice(i, 1);
      }
    });

    setPostData(copy);
  };

  const handleSave = async () => {
    setBtn(true);
    if (postData.length > 0) {
      try {
        const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=feedback`;
        const res = await axios.post(
          endPoint,
          { approver_image: postData },
          {
            headers: { authorization: token },
          }
        );

        if (res.data.statusCode) {
          Modal.success({
            title: "Saved Successfully",
            onOk() {
              window.location.reload();
            },
          });
        }
      } catch (error) {
        Modal.error({
          title: "Action Failed, Please report to manager",
          onOk() {
            window.location.reload();
          },
        });
      }
    } else {
      message.destroy();
      message.error("No Action to Perform!");
    }
    setBtn(false);
  };

  const header = [
    "Merchant ID",
    "Feedback",
    "Reason",
    "Rating",
    // "Availed Date",
    "Action",
  ];

  return (
    <Col lg={24}>
      <Spin spinning={loading}>
        <Row justify="space-between">
          <h4>Customer Reviews</h4>

          <Row>
            <Button
              className="mr-4"
              danger
              shape="round"
              loading={btn}
              onClick={() => window.location.reload()}
            >
              Reset / Clear
            </Button>
            <Button
              type="primary"
              danger
              shape="round"
              icon={<SaveOutlined />}
              loading={btn}
              onClick={handleSave}
            >
              Submit
            </Button>
          </Row>
        </Row>

        <Divider />

        <List className="demo-loadmore-list" bordered itemLayout="horizontal">
          <div className="d-flex justify-content-between p-2 ">
            {header.map((x, i) => (
              <h6 className="col-2 text-primary" key={i}>
                {x}
              </h6>
            ))}
          </div>
          {data.map((x, i) =>
            x.comments_wait.map((y, j) => (
              <List.Item key={j} className="p-3 d-flex justify-content-between">
                <h6 className="col-2">{y.mrch_id}</h6>
                <h6 className="col-2 text-wrap">{y.cust_fdbk}</h6>
                <div className="col-2">
                  {y.cust_reason ? (
                    <h6 className="text-danger text-wrap"> {y.cust_reason} </h6>
                  ) : (
                    "NA"
                  )}
                </div>
                <h6 className="col-2">
                  <Rate defaultValue={y.cust_rating} disabled />
                </h6>
                {/* <div className="col-2">
                  {y.ofr_avld_dt ? (
                    <h6 className="text-primary"> {y.ofr_avld_dt} </h6>
                  ) : (
                    "NA"
                  )}
                </div> */}

                <Radio.Group
                  className="col-2"
                  onChange={(e) => handleAction(e.target.value, y, j)}
                >
                  <Radio value={"approve"}>Approve</Radio>
                  <Radio value={"reject"}>Reject</Radio>
                </Radio.Group>
                {/* <div>
                    <span
                      className="badge badge-danger"
                      onClick={() => handleClear(y)}
                    >
                      clear
                    </span>
                  </div> */}
              </List.Item>
            ))
          )}
        </List>
      </Spin>
    </Col>
  );
}

export default ReviewsList;
