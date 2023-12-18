import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import ImagePopUp from "../../Common/ImagePopup";
import axios from "axios";
import { Col, Spin, Alert, Modal, Row, Input } from "antd";
import { getMerchantId } from "../../../Utils/helpers";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const ApprovedImages = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [selectedImage, updateSelectedImage] = useState("");
  const [showImagePopup, updateImagePopupDisplay] = useState(false);
  const [backup, setBackup] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const updatePopUpDisplay = (value) => {
    updateImagePopupDisplay(!showImagePopup);
    updateSelectedImage(value ? value : "");
  };

  const fetchImages = () => {
    const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=approve`;
    return axios
      .get(endPoint, {
        headers: { authorization: token },
      })
      .then((res) => {
        if (res.data.body.images.length > 0) {
          var needToApproveList = [];
          res.data.body.images.map((item) => {
            if (item.split("/")[4] === "approved") {
              needToApproveList.push(item);
            }
          });
          if (needToApproveList.length === 0) {
            updateNoImage(true);
          } else {
            updateImagesList(needToApproveList);
            setBackup(needToApproveList);
          }
        } else {
          updateNoImage(true);
        }
      })
      .catch((error) => {
        Modal.error({
          content: error?.message,
          onOk() {},
        });
      });
  };

  const handleSearch = (value) => {
    const getData =
      images.length > 0 ? images.filter((x) => getMerchantId(x) === value) : [];

    updateImagesList(getData);
  };

  const [search, setSearch] = useState("");

  return (
    <div>
      <h3>Approved Images</h3>
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

        {images && images.length > 0 ? (
          <Row>
            {images.map((item) =>
              item.toLowerCase().includes("png") ||
              item.toLowerCase().includes("jpeg") ||
              item.toLowerCase().includes("jpg") ? (
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
                    <label>
                      Merchant ID:
                      {item
                        .split("/")[5]
                        .substr(0, item.split("/")[5].indexOf("-"))}
                    </label>
                  </div>
                </Col>
              ) : (
                ""
              )
            )}
          </Row>
        ) : (
          <Row justify="center" className="my-5">
            {noimageFound ? (
              <Alert message="No Approved Images for you!" type="info" />
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

export default ApprovedImages;
