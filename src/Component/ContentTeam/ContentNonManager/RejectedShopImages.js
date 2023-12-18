import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import ImagePopUp from "../../Common/ImagePopup";
import axios from "axios";
import { Tabs, Spin, Alert, Modal, Col, Row } from "antd";
import { getMerchantId } from "../../../Utils/helpers";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const RejectedShopImages = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
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
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=reject`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          if (res.data.body.length === 0) {
            updateNoImage(true);
          } else {
            updateImagesList(res.data.body);
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
    <div>
      <h5 className="mx-2 mb-4"> Rejected Shop Images</h5>
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
                    <small>Mercahnt ID</small>
                    <h5 className="mb-0">{getMerchantId(item)}</h5>
                  </div>
                  <hr className="p-0" />

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
            {noimageFound ? (
              <Alert message="No Rejected Images found!" type="info" />
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

export default RejectedShopImages;
