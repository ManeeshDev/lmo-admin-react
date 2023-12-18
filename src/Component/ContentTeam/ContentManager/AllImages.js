import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import axios from "axios";
import { Tabs, Spin, Alert, Row, Col, Input } from "antd";
import ImagePopUp from "../../Common/ImagePopup";
import { employeeList } from "../../../Utils/Session";
import { getMerchantId } from "../../../Utils/helpers";

const { TabPane } = Tabs;

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const AllImages = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [selectedImage, updateSelectedImage] = useState("");
  const [showImagePopup, updateImagePopupDisplay] = useState(false);
  const [err, setErr] = useState("");
  const [backup, setBackup] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    var status = "";
    if (userRole === "NM") {
      status = "all";
    } else {
      status = "assign";
    }
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=${status}`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          if (res.body === null) {
            updateNoImage(true);
          } else {
            var needToApproveList = [];
            res.data.body.key.map((item) => {
              if (item.split("/")[4] !== "") {
                needToApproveList.push(item);
              }
            });
            if (res.data.body && res.data.body.employees) {
              var parsed = res.data.body.employees;
              var NMEmployeeList = [];
              parsed.map((item) => {
                if (item.Role === "NM") {
                  var NMValue = {
                    value: item.emp_id,
                    label: item.name,
                  };
                  NMEmployeeList.push(NMValue);
                }
              });
              employeeList(NMEmployeeList);
            }
            if (needToApproveList.length !== 0) {
              updateImagesList(needToApproveList);
              setBackup(needToApproveList);
            } else {
              updateNoImage(true);
            }
          }
        })
        .catch((err) => {
          const res = eval("(" + err.response.data + ")");
          setErr(res.body);
        });
    } catch (error) {
      // console.log(error, "error");
    }
  };

  const updatePopUpDisplay = (value) => {
    updateImagePopupDisplay(!showImagePopup);
    updateSelectedImage(value ? value : "");
  };

  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    const getData =
      images.length > 0 ? images.filter((x) => getMerchantId(x) === value) : [];

    updateImagesList(getData);
  };

  return (
    <div>
      <h3>All Images</h3>
      <Col lg={24}>
        <Col lg={6}>
          <Input
            placeholder="Search merchant Id"
            onChange={(e) => {
              setSearch(e.target.value);

              if (e.target.value.length > 9) {
                handleSearch(e.target.value);
              } else {
                updateImagesList(backup);
              }
            }}
            value={search}
          />
        </Col>

        {!err && images && images.length > 0 ? (
          <Row>
            {images.map((item) => (
              <Col lg={6}>
                <div className="column" style={{ height: "274px" }}>
                  <img
                    src={
                      item && !item.includes(".mp4")
                        ? item
                        : process.env.REACT_APP_PLAY_IMAGE
                    }
                    onClick={() => {
                      updatePopUpDisplay(item);
                    }}
                  />
                  <label>
                    Merchant ID:
                    {item
                      .split("/")[4]
                      .substr(0, item.split("/")[4].indexOf("-"))}
                  </label>
                  <br></br>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <Row justify="center" className="my-5">
            {noimageFound ? (
              <Alert showIcon message="No result found!" type="info" />
            ) : err ? (
              <Alert showIcon message={err} type="error" />
            ) : (
              <Spin
                className="row"
                tip="We are collecting images for you ..."
              />
            )}
          </Row>
        )}
      </Col>
      <ImagePopUp
        selectedImage={selectedImage}
        updatePopUpDisplay={updatePopUpDisplay}
        showImagePopup={showImagePopup}
      />
    </div>
  );
};

export default AllImages;
