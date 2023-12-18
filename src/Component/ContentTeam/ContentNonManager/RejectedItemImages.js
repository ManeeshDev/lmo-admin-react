import React, { useState, useEffect } from "react";

import "../../../assets/css/allimages.css";

import axios from "axios";
import { Tabs, Spin, Alert, Modal, Row, Col } from "antd";
import ImagePopUp from "../../Common/ImagePopup";
import Select from "react-select";
import { getMerchantId } from "../../../Utils/helpers";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const categoryList = [
  { label: "artsclasses", value: "artsclasses" },
  { label: "beautyjewelry", value: "beautyjewelry" },
  { label: "fashion", value: "fashion" },
  { label: "food", value: "food" },
  { label: "furniture", value: "furniture" },
  { label: "kids", value: "kids" },
  { label: "retail", value: "retail" },
  { label: "automotive", value: "automotive" },
  { label: "electronicsinstruments", value: "electronicsinstruments" },
  { label: "healthfitness", value: "healthfitness" },
  { label: "homehardware", value: "homehardware" },
  { label: "pets", value: "pets" },
  { label: "photographytravel", value: "photographytravel" },
  { label: "recreationlodging", value: "recreationlodging" },
];
const RejectedItemImages = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [selectedCategory, updateSelectedCategory] = useState("");
  const [loading, updateLoading] = useState(false);
  const [selectedImage, updateSelectedImage] = useState("");
  const [showImagePopup, updateImagePopupDisplay] = useState(false);
  const updatePopUpDisplay = (value) => {
    updateImagePopupDisplay(!showImagePopup);
    updateSelectedImage(value ? value : "");
  };

  const fetchImages = (value) => {
    updateLoading(true);
    updateImagesList([]);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=itemrejected&ctgy=${value}`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          updateLoading(false);
          if (res.data.body.images.length === 0) {
            updateNoImage(true);
          } else {
            updateImagesList(res.data.body.images);
          }
        });
    } catch (error) {
      updateLoading(false);
      const res = eval("(" + error.response.data + ")");
      Modal.error({
        content: res.body,
        onOk() {},
      });
    }
  };

  const handleCategoryChange = (ctgry) => {
    updateSelectedCategory(ctgry.value);
    fetchImages(ctgry.value);
  };

  const download = async (event) => {
    event.preventDefault();
    const image_url = event.target.href;
    const response = await fetch(image_url);
    if (response.status === 200) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = image_url.split("/")[5];
      document.body.appendChild(link);
      link.click();
      link.remove();
      return { success: true };
    }
  };

  return (
    <div className="maintain-height p-md-4 p-1">
      <Row justify="space-between" align="middle">
        <span
          style={{
            width: "300px",
          }}
        >
          <label>Select Category:</label>
          <Select
            onChange={(e) => {
              handleCategoryChange(e);
            }}
            options={categoryList}
          />
        </span>
      </Row>
      <Col lg={24}>
        {selectedCategory === "" && !loading ? (
          <Row justify="center" className="my-5">
            <Alert
              message="Please select a category of rejected item to continue!"
              type="info"
            />
          </Row>
        ) : (
          <>
            {images && images.length > 0 && !loading ? (
              <Row>
                {images.map((item) => (
                  <Col lg={6}>
                    <div className="column">
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
                      <label>Item : {item.split("/")[4]}</label>

                      <div className="download-btn">
                        <a href={item} download>
                          <i
                            className="fa fa-download "
                            style={{ padding: ".5rem" }}
                          ></i>
                          Download
                        </a>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <Row justify="center" className="my-5">
                {noimageFound && !loading ? (
                  <Alert
                    message="No Rejected  Item Images found!"
                    type="info"
                  />
                ) : (
                  <Spin
                    className="row"
                    tip="We are collecting images for you ..."
                  />
                )}
              </Row>
            )}
          </>
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

export default RejectedItemImages;
