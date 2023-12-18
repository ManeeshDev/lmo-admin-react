import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  message,
  PageHeader,
  Popconfirm,
  Row,
  Spin,
  Tabs,
} from "antd";

import Axios from "axios";
import { withRouter } from "react-router";
import { DeleteFilled } from "@ant-design/icons";
import ImagePopUp from "../../Common/ImagePopup";
import ImageUploader from "../../Common/imageUploader";

const token = localStorage.getItem("token");

const { TabPane } = Tabs;

function UploadSection({ match, history }) {
  const [data, setData] = useState([]);

  const [invData, setInvData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [view, setView] = useState("1");

  const [showImagePopup, updateImagePopupDisplay] = useState(false);

  const [selectedImage, updateSelectedImage] = useState("");

  const { mrch_id, ctgy_cd, subCtgy_cd } = match.params;

  const updatePopUpDisplay = (value) => {
    updateImagePopupDisplay(!showImagePopup);
    updateSelectedImage(value ? value : "");
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    const shopParams = {
      shpimg: "images",
      mrch: mrch_id,
      ctgy: ctgy_cd,
      subctgy: subCtgy_cd,
    };

    const invParams = {
      invimg: "images",
      mrch: mrch_id,
      ctgy: ctgy_cd,
    };

    setLoading(true);
    try {
      const fetch = await Axios.get(
        `${process.env.REACT_APP_BASE_URL}/phtgrhr`,
        {
          headers: { authorization: token },
          params: view === "1" ? shopParams : invParams,
        }
      );
      const response = fetch.data;
      setData(response.body);
      if (view === "1") {
        setData(response.body);
      } else {
        setInvData(response.body);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const shopImageParams = {
    shpimg: "pre",
    mrch: mrch_id,
    ctgy: ctgy_cd,
    subctgy: subCtgy_cd,
  };

  const invParams = {
    invimg: "pre",
    mrch: mrch_id,
    ctgy: ctgy_cd,
  };

  const deleteImage = async (imgid) => {
    const delShp = {
      imgid,
      shpimg: "del",
    };

    const delInv = {
      imgid,
      invimg: "del",
      mrch: mrch_id,
      ctgy: ctgy_cd,
    };

    setLoading(true);
    try {
      const res = await Axios.post(
        `${process.env.REACT_APP_BASE_URL}/phtgrhr`,
        {},
        {
          headers: { authorization: token },
          params: view === "1" ? delShp : delInv,
        }
      );
      const response = res.data;
      if (response) {
        fetchData();
        message.success(response.body);
      }
    } catch (err) {
      console.log({ err });
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    try {
      const fetch = await Axios.post(
        `${process.env.REACT_APP_BASE_URL}/phtgrhr`,
        {},
        {
          headers: { authorization: token },
          params: {
            mrch: mrch_id,
            sts: "true",
          },
        }
      );
      const response = fetch.data;
      if (response) {
        message.success("Status Verified");
        history.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <PageHeader
        style={{ background: "e5e5e5" }}
        title={"Merchant File Uploads"}
        onBack={() => history.goBack()}
        extra={
          <Row>
            <Popconfirm
              title="Are you sure want to verify?"
              onConfirm={handleVerify}
              okText="Confirm"
            >
              <Button
                // onClick={handleVerify}
                type="primary"
                shape="round"
                className="bg-success mr-3"
              >
                Verify Shop
              </Button>
            </Popconfirm>
            <Button onClick={fetchData} type="primary" shape="round">
              Refresh
            </Button>
          </Row>
        }
      />

      <Row justify="center">
        <Col lg={20} className="mb-5">
          <Spin spinning={loading}>
            <Tabs activeKey={view} onChange={(e) => setView(e)}>
              <TabPane tab="Shop Images" key="1">
                <h5>Shop Images</h5>

                <Row>
                  {data?.length > 0
                    ? data.map((x, i) => (
                        <Col className="border border-dark m-2 rounded" key={i}>
                          <img
                            style={{
                              height: "150px",
                              width: "150px",
                              objectFit: "contain",
                            }}
                            src={x}
                            alt="shop"
                            onClick={() => {
                              updatePopUpDisplay(x);
                            }}
                          />
                          <div
                            className="position-absolute"
                            style={{ top: -10, right: -10 }}
                          >
                            <Button
                              onClick={() => {
                                let img = x.split("/");
                                deleteImage(img[img.length - 1]);
                              }}
                              shape="circle"
                              danger
                              type="primary"
                            >
                              <Row align="middle" justify="center">
                                <DeleteFilled className="mt-1" />
                              </Row>{" "}
                            </Button>
                          </div>{" "}
                        </Col>
                      ))
                    : "No Images Uploaded"}
                </Row>

                <ImageUploader
                  fetchData={fetchData}
                  pathParams={shopImageParams}
                  path={"phtgrhr"}
                />
              </TabPane>
              <TabPane tab="Inventory Upload" key="2">
                <h5>Inventory Images</h5>

                <Row>
                  {invData?.length > 0
                    ? invData.map((x, i) => (
                        <Col className="border border-dark m-2 rounded" key={i}>
                          <img
                            style={{
                              height: "150px",
                              width: "150px",
                              objectFit: "contain",
                            }}
                            src={x}
                            alt="shop"
                            onClick={() => {
                              updatePopUpDisplay(x);
                            }}
                          />
                          <div
                            className="position-absolute"
                            style={{ top: -10, right: -10 }}
                          >
                            <Button
                              onClick={() => {
                                let img = x.split("/");
                                deleteImage(img[img.length - 1]);
                              }}
                              shape="circle"
                              danger
                              type="primary"
                            >
                              <Row align="middle" justify="center">
                                <DeleteFilled className="mt-1" />
                              </Row>{" "}
                            </Button>
                          </div>{" "}
                        </Col>
                      ))
                    : "No Images Uploaded"}
                </Row>

                <ImageUploader
                  fetchData={fetchData}
                  pathParams={invParams}
                  path={"phtgrhr"}
                />
              </TabPane>
            </Tabs>
          </Spin>
        </Col>
      </Row>

      <ImagePopUp
        selectedImage={selectedImage}
        updatePopUpDisplay={updatePopUpDisplay}
        showImagePopup={showImagePopup}
      />
    </div>
  );
}

export default withRouter(UploadSection);
