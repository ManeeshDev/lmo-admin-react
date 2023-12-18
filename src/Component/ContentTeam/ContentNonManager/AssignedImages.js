import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import ImagePopUp from "../../Common/ImagePopup";
import axios from "axios";
import {
  Tabs,
  Spin,
  Alert,
  Button,
  Col,
  Modal,
  message,
  Checkbox,
  Row,
} from "antd";
import { getMerchantId } from "../../../Utils/helpers";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const AssignedImages = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [uploadList, updateuploadList] = useState([]);
  const [checked, updateChecked] = useState(false);
  const [btn, setBtn] = useState(false);
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
    updateLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=assign`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          updateLoading(false);
          if (res.data.body.length === 0) {
            updateNoImage(true);
          } else {
            var needToApproveList = [];
            res.data.body.map((item) => {
              if (item.split("/")[4] !== "" && item.split("/")[5] !== "") {
                needToApproveList.push(item);
              }
            });
            if (needToApproveList.length === 0) {
              updateImagesList([]);
              updateNoImage(true);
            } else {
              updateImagesList(needToApproveList);
            }
          }
        });
    } catch (error) {
      updateLoading(false);
    }
  };

  const uploadImages = () => {
    if (uploadList.length > 0) {
      setBtn(true);
      const body = {
        emp_image: uploadList,
      };
      const config = {
        headers: {
          Authorization: token,
        },
      };
      try {
        const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=reject`;
        return axios.post(endPoint, body, config).then((res) => {
          const response = res.data;
          if (response.statusCode === 200) {
            updateuploadList([]);
            setBtn(false);
            Modal.success({
              content: response.body,
              onOk() {
                window.location.reload();
              },
            });
          } else {
            setBtn(false);
            Modal.error({
              content: response.body,
              onOk() {},
            });
          }
        });
      } catch (error) {
        setBtn(false);
        const res = eval("(" + error.response.data + ")");
        Modal.error({
          content: res.body,
          onOk() {},
        });
      }
    } else {
      message.destroy();
      message.error({
        content: "Please approve or reject images to continue..",
        style: {
          marginTop: "5rem",
        },
      });
    }
  };
  const addImageToList = (value, item) => {
    if (value) {
      const imageId = item.split("/")[5];
      var uploadListItem = uploadList;
      uploadListItem.push(imageId);
      updateuploadList(uploadListItem);
    } else {
      for (var i = 0; i < uploadList.length; i++) {
        if (item.split("/")[5] === uploadList[i]) {
          uploadList.splice(i, 1);
        }
      }
    }
  };
  const cancelOptions = () => {
    if (uploadList.length > 0) {
      fetchImages();
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
      <Row justify="space-between" align="middle">
        <h3>Reject/Download Assigned Shop Images</h3>
        <span>
          <Button
            loading={btn}
            style={{ margin: "1rem" }}
            onClick={uploadImages}
            type="primary"
          >
            Submit
          </Button>
          <Button style={{ margin: "1rem" }} onClick={cancelOptions}>
            Cancel/Clear
          </Button>
        </span>
      </Row>

      <Col lg={24}>
        {!loading && images && images.length > 0 ? (
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

                  <Checkbox
                    onChange={(e) => {
                      addImageToList(e.target.checked, item);
                    }}
                  >
                    Reject
                  </Checkbox>
                  {/* <Radio.Group
                  onChange={(e) => {
                    addImageToList(e.target.value, item);
                  }}
                  checked={checked}
                >
                  <Radio value="reject" style={{ color: "blue" }}>
                    Reject
                  </Radio>
                  <Radio value="clear" style={{ color: "red" }}>
                    UnReject
                  </Radio>
                </Radio.Group> */}
                  <div className="download-btn">
                    <a href={item} download>
                      <i className="fa fa-download mr-2"></i>
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
              <Alert message="No Assigned Images for you!" type="info" />
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

export default AssignedImages;
