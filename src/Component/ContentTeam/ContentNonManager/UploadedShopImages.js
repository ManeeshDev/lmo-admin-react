import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import axios from "axios";
import ImagePopUp from "../../Common/ImagePopup";
import { Col, Spin, Alert, Modal, Row } from "antd";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const UploadedShopImages = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [SelectedCategory, updateSelectedCategory] = useState("");
  const [loading, updateLoading] = useState(false);
  const [selectedImage, updateSelectedImage] = useState("");
  const [showImagePopup, updateImagePopupDisplay] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const updatePopUpDisplay = (value) => {
    updateImagePopupDisplay(!showImagePopup);
    updateSelectedImage(value ? value : "");
  };

  const fetchImages = () => {
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=upload`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          if (res.data === null || res.data.body.length < 1) {
            updateImagesList([]);
            updateNoImage(true);
          } else {
            var needToApproveList = [];
            res.data.body.map((item) => {
              if (item.split("/")[4] !== "" && item.split("/")[5] !== "") {
                needToApproveList.push(item);
              }
            });
            if (needToApproveList.length !== 0) {
              updateImagesList(needToApproveList);
            } else {
              updateNoImage(true);
            }
          }
        });
    } catch (error) {
      const res = eval("(" + error.response.data + ")");
      Modal.error({
        content: res.body,
        onOk() {},
      });
    }
  };

  const getMrchId = (val) => {
    const value = val && val.split("/");
    const id = value[value.length - 1] && value[value.length - 1].split("-")[0];
    return id;
  };

  return (
    <div className="p-md-4 p-1 maintain-height">
      <h4>Shop Images Uploaded by you</h4>
      <Col lg={24}>
        {images && images.length > 0 ? (
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

                  <div>
                    <small>Merchant ID:</small>
                    <h5>{getMrchId(item)}</h5>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <Row justify="center" className="my-5">
            {!loading && noimageFound ? (
              <Alert message="No images are uploaded by you!" type="info" />
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

export default UploadedShopImages;
