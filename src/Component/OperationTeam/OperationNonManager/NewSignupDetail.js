import React, { useState, useEffect, useRef } from "react";
import {
  Spin,
  Form,
  Input,
  PageHeader,
  Button,
  Select,
  Modal,
  Row,
  Col,
  Divider,
  Alert,
  message,
  Checkbox,
  List,
} from "antd";
import AreaSearch from "./AreaSearch";
import axios from "axios";
import { CopyOutlined, MessageOutlined } from "@ant-design/icons";
import statusCodeJson from "../../../Utils/statusCodeJson";
import moment from "moment";
import ImagePopUp from "../../Common/ImagePopup";
import { removeSession } from "../../../Utils/Session";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const NewSignupDetail = (props) => {
  const [merchant_details, updateDetails] = useState("");
  const [statusCodes, updateStatusCodes] = useState("");
  const [btn, setBtn] = useState(false);
  const [loading, updateLoading] = useState(false);
  const [businessAreas, setBusinessAreas] = useState([]);
  const GSTRef = useRef(null);
  const [area_cd, updateAreaCode] = useState("");
  const [selectedStatus, updateSelectedStatus] = useState(null);
  const [post_status, updatePostStatus] = useState("");

  const [showImagePopup, updateImagePopupDisplay] = useState(false);
  const [selectedImage, updateSelectedImage] = useState("");

  const [docsKeys, setDocskeys] = useState([]);

  const updatePopUpDisplay = (value) => {
    updateImagePopupDisplay(!showImagePopup);
    updateSelectedImage(value ? value : "");
  };

  const [docs, setDocs] = useState([]);

  const [see, setSee] = useState(false);

  useEffect(() => {
    if (window.location.href.split("/")[4] === "Newsignups") {
      updatePostStatus("mrchdtl");
      fetchMerchantDetails("mrchdtl");
    } else {
      updatePostStatus("dataError");
      fetchMerchantDetails("mrchdtlError");
    }
  }, []);

  const getBsnsAreas = (e) => {
    setBusinessAreas(e);
  };

  const fetchMerchantDetails = (get_status) => {
    updateLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=${get_status}&mrchid=${props.mrchid}&stscd=${props.sts_cd}`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          updateLoading(false);

          const { kyc_sts, kyc, mrchdtl } = res.data.body;

          if (mrchdtl.message) {
            Modal.error({
              content: mrchdtl.message,
              onOk() {
                props.backToPage();
              },
            });
          } else if (res.data.body) {
            updateDetails(mrchdtl);

            let kycKeys = [];
            if (kyc_sts.length > 0) {
              kycKeys = kyc_sts;
              setDocskeys(kyc_sts);
            }

            setDocs(kyc);

            const unique = [...mrchdtl.statusKeys, ...kycKeys];
            let allStatusKeys = [...new Set(unique)];

            console.log(allStatusKeys, "allStatusKeys");

            var statusArray = [];
            allStatusKeys &&
              allStatusKeys.map((item) => {
                var label = statusCodeJson.filter(
                  (status) => status.code === item
                );
                var itemdata = {
                  label: label.length > 0 ? label[0].value : "",
                  value: item,
                };
                statusArray.push(itemdata);
              });
            setBusinessAreas(mrchdtl.business_areas);
            updateStatusCodes(statusArray);
          }
        });
    } catch (err) {
      if (err.response.status === 401) {
        removeSession();
      }
    }

    updateLoading(false);
  };

  const CopyTextToClipBoard = (e) => {
    GSTRef && GSTRef.current && GSTRef.current.select();
    document.execCommand("copy");
    e.target.focus();
    message.success({
      content: "Copied!..",
      style: {
        marginTop: "5rem",
      },
    });
  };

  const getAreaCode = (name, code) => {
    //console.log("getcode");
  };

  const onFinish = async (values) => {
    setBtn(true);

    try {
      if (selectedStatus) {
        const body = values;
        body.row_insrt_dt = merchant_details.row_insrt_dt;
        body.business_areas = businessAreas ? businessAreas : [];
        body.mrch_sts = merchant_details.mrch_sts;
        body.shp_cty = values.shp_cty
          ? values.shp_cty
          : merchant_details.shp_cty;
        const pincode = values.shp_cty
          ? values.shp_cty.split("-")[1]
          : merchant_details.shp_cty.split("-")[1];
        body.shp_pincd = parseInt(pincode);

        delete body.mrch_ctgy;
        delete body.mrch_sub_ctgy;
        delete body.ctgyCheck;
        delete body.subctgyCheck;
        delete body.shp_areaCheck;
        delete body.gstCheck;

        const finalJson = {
          ...body,
          remarks: [
            ...merchant_details.remarks,
            { message: body.remarks, createdAt: new Date() },
          ],
        };

        const config = {
          headers: {
            Authorization: token,
          },
        };

        let endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=${post_status}&mrchid=${props.mrchid}&stscd=${props.sts_cd}`;

        if (docsKeys.length > 0 && docsKeys.includes(selectedStatus)) {
          endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=mrchdocs&mrchid=${props.mrchid}&stscd=${selectedStatus}&ctgy=${merchant_details.mrch_ctgy_cd}`;
        }

        const res = await axios.post(endPoint, finalJson, config);

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

    setBtn(false);
  };

  const SendUploadLink = async () => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=link&mrchid=${props.mrchid}`;
      const res = await axios.post(endPoint, {}, config);
      setBtn(false);
      Modal.success({
        content: res.data.body,
        onOk() {},
      });
    } catch (err) {
      //console.log(err);
    }
  };

  const deleteImage = async (img) => {
    const imageId = img.split("/");
    const imgId = imageId[imageId.length - 1];

    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=kycimg&kycimg=${imgId}`;
      const res = await axios.put(endPoint, {}, config);

      if (res.data.body) {
        Modal.success({
          title: res.data.body,
          onOk() {
            fetchMerchantDetails("mrchdtl");
          },
        });
      } else {
        Modal.error({
          title: "Action Failed! Please contact Operation Manager",
        });
      }
    } catch (err) {
      Modal.error({
        title: "Action Failed! Please contact Operation Manager",
      });
    }
  };

  return (
    <div className="detail-page">
      {merchant_details && !loading ? (
        <>
          <PageHeader
            className="site-page-header"
            onBack={() => props.backToPage()}
            title={"Merchant Details"}
          />
          <Row justify="center" style={{ marginBottom: "2rem" }}>
            <Alert
              banner
              message={
                "Do Not Go Back or Cancel without Changing Status and adding Remarks"
              }
            />
          </Row>

          <Form layout="vertical" onFinish={onFinish}>
            <Row justify="space-around">
              <Col lg={10}>
                <Form.Item
                  name="mrch_name"
                  initialValue={merchant_details.mrch_name}
                  label="Merchant Name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="shp_nm"
                  initialValue={merchant_details.shp_nm}
                  label=" Shop Name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="cntct_nbr"
                  label="Phone Number"
                  initialValue={merchant_details.cntct_nbr}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="mrch_ctgy"
                  initialValue={merchant_details.mrch_ctgy}
                  label={
                    <Col className="label-checks" lg={24}>
                      <Row align="middle" justify="space-between">
                        <span>Merchant Category</span>
                        <Form.Item
                          name="ctgyCheck"
                          valuePropName="checked"
                          rules={[
                            {
                              validator: (_, value) =>
                                value
                                  ? Promise.resolve()
                                  : Promise.reject("Please Check Category"),
                            },
                          ]}
                        >
                          <Checkbox />
                        </Form.Item>
                      </Row>
                    </Col>
                  }
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  name="mrch_sub_ctgy"
                  initialValue={merchant_details.mrch_sub_ctgy}
                  label={
                    <Col className="label-checks" lg={24}>
                      <Row align="middle" justify="space-between">
                        <span>Merchant Sub Category</span>
                        <Form.Item
                          name="subctgyCheck"
                          valuePropName="checked"
                          rules={[
                            {
                              validator: (_, value) =>
                                value
                                  ? Promise.resolve()
                                  : Promise.reject("Please Check Sub Category"),
                            },
                          ]}
                        >
                          <Checkbox />
                        </Form.Item>
                      </Row>
                    </Col>
                  }
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  name="gst"
                  className="form-div"
                  label={
                    <Col className="label-checks" lg={24}>
                      <Row align="middle" justify="space-between">
                        <span>GST</span>
                        <Form.Item
                          name="gstCheck"
                          valuePropName="checked"
                          rules={[
                            {
                              validator: (_, value) =>
                                value
                                  ? Promise.resolve()
                                  : Promise.reject("Please Validate Gst"),
                            },
                          ]}
                        >
                          <Checkbox />
                        </Form.Item>
                      </Row>
                      <Button shape="round" onClick={CopyTextToClipBoard}>
                        {" "}
                        <CopyOutlined />
                        COPY GST
                      </Button>

                      <Button type="primary" style={{ margin: "2rem 2rem" }}>
                        <a
                          href="https://services.gst.gov.in/services/searchtp"
                          target="_blank"
                        >
                          Click to Validate GST
                        </a>
                      </Button>
                    </Col>
                  }
                  initialValue={merchant_details.gst}
                  rules={[
                    {
                      min: 15,
                      max: 15,
                      message: "Enter 15 Characters GSTIN.",
                    },
                  ]}
                >
                  <Input ref={GSTRef} />
                </Form.Item>

                <Alert
                  banner
                  message={
                    "If Merchant operates whole disrtrict, select option with district keyword. Ex: If merchant support whole Guntur district, then select Guntur District, Guntur"
                  }
                />

                <AreaSearch
                  name="business_areas"
                  label="Business Area"
                  required={false}
                  width={"100%"}
                  multiple={"multiple"}
                  businessAreas={merchant_details.business_areas}
                  bsnAreas={getBsnsAreas}
                  area_cd={getAreaCode}
                />

                <AreaSearch
                  name="shp_cty"
                  label="Shop City"
                  required={false}
                  width={"100%"}
                  multiple={""}
                  businessAreas={merchant_details.shp_cty}
                  bsnAreas={getBsnsAreas}
                  area_cd={getAreaCode}
                  disabled={true}
                />

                <Form.Item label="Area Code">
                  <Input disabled={true} value={merchant_details.shp_area_cd} />
                </Form.Item>

                <Form.Item
                  name="shp_adr"
                  label="Shop Addresses"
                  initialValue={merchant_details.shp_adr}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col lg={10}>
                <Form.Item
                  name="mrch_sts_cd"
                  initialValue={
                    statusCodeJson.filter(
                      (status) => status.code === merchant_details.mrch_sts_cd
                    )[0].value
                  }
                  label="Status"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    onChange={(e) => {
                      updateSelectedStatus(e);
                    }}
                    options={statusCodes}
                  />
                </Form.Item>

                {selectedStatus === 900 ? (
                  <Button
                    type="ghost"
                    shape="round"
                    style={{ marginBottom: "2rem" }}
                    onClick={SendUploadLink}
                  >
                    Send Upload Link
                  </Button>
                ) : null}

                {merchant_details.remarks.length > 0 ? (
                  <>
                    <h5>Previous Remarks</h5>
                    <List
                      itemLayout="horizontal"
                      className="remarks-list"
                      loadMore={
                        <Button type="link" onClick={() => setSee(!see)}>
                          {" "}
                          {see ? "See Less.." : "See More"}
                        </Button>
                      }
                    >
                      {merchant_details.remarks
                        .slice(0, see ? merchant_details.remarks.length : 1)
                        .map((item, i) => (
                          <>
                            <List.Item
                              key={i}
                              actions={[
                                <a key="list-loadmore-edit">
                                  {moment(item.createdAt).format("lll")}
                                </a>,
                              ]}
                            >
                              <List.Item.Meta
                                avatar={<MessageOutlined />}
                                title={
                                  <Row align="middle" justify="space-between">
                                    <Col lg={24}>
                                      <span>{item.message}</span>
                                    </Col>
                                  </Row>
                                }
                              />
                            </List.Item>
                          </>
                        ))}
                    </List>
                  </>
                ) : (
                  ""
                )}

                <Form.Item
                  name="remarks"
                  label="Remarks"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>

                {docs.length > 0 ? (
                  <>
                    <Divider orientation="center">KYC Documnets</Divider>

                    <Row>
                      {docs.map((x, i) => (
                        <Col key={i} lg={11} className="m-2">
                          <div
                            onClick={() => {
                              updatePopUpDisplay(x);
                            }}
                          >
                            {x.split("/")[4].split(".")[1] === "mp4" ? (
                              <video
                                className="video"
                                controls
                                controlsList="nodownload"
                                style={{ width: "100%" }}
                              >
                                <source src={x} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <img
                                src={x}
                                alt="docs"
                                style={{
                                  width: "100%",
                                }}
                              />
                            )}
                          </div>
                          <Button
                            onClick={() => deleteImage(x)}
                            className="w-100"
                            type="primary"
                            danger
                          >
                            Remove
                          </Button>
                        </Col>
                      ))}
                    </Row>
                  </>
                ) : (
                  ""
                )}

                <Divider />
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={btn}>
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
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      ) : (
        <Row justify="center" className="my-5">
          <Spin tip="Hold on!! We are collecting Merchant Details for you ..." />
        </Row>
      )}

      <ImagePopUp
        selectedImage={selectedImage}
        updatePopUpDisplay={updatePopUpDisplay}
        showImagePopup={showImagePopup}
      />
    </div>
  );
};
export default NewSignupDetail;
