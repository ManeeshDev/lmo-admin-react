import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import axios from "axios";
import ImagePopUp from "../../Common/ImagePopup";
import {
  Col,
  Spin,
  Alert,
  Modal,
  Radio,
  message,
  Button,
  Checkbox,
  Row,
} from "antd";
import Select from "react-select";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const AssignInventory = (props) => {
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
  const fetchImages = (value) => {
    updateLoading(true);
    updateImagesList([]);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=all&ctgy=inventory`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          updateLoading(false);
          if (res.body === null || res.data.body.key.length < 1) {
            updateImagesList([]);
            updateNoImage(true);
          } else {
            var needToApproveList = [];
            res.data.body.key.map((item) => {
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
        const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=assign&ctgy=inventory`;
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
  // const addImageToList = (value, item) => {
  //   var uploadListItem = [...uploadList]
  //   if (value) {
  //     const imageId = item.split("/")[5];
  //     uploadListItem.push(imageId);
  //   } else {
  //     for (var i = 0; i < uploadListItem.length; i++) {
  //       if (item.split("/")[5] === uploadListItem[i]) {
  //         uploadListItem.splice(i, 1);
  //       }
  //     }
  //   }
  //   console.log(uploadListItem)
  //   updateuploadList(uploadListItem);
  // };
  const cancelOptions = () => {
    if (uploadList.length > 0) {
      window.location.reload();
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
        <span
          style={{
            width: "300px",
          }}
        >
          <h3>Private Inventory Items</h3>
        </span>
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
                  <label>
                    Merchant ID:
                    {item
                      .split("/")[5]
                      .substr(0, item.split("/")[5].indexOf("-"))}
                  </label>
                  <br></br>
                  <Checkbox
                    onChange={(e) => {
                      addImageToList(e.target.checked, item);
                    }}
                  >
                    Assign
                  </Checkbox>
                  <br></br>
                  {/* <a href={item} onClick={(e) => download(e)}> */}
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
                message="No Inventory items found at this moment!"
                type="info"
              />
            ) : (
              <Spin
                className="row"
                tip="We are collecting inventory Items  for you ..."
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

export default AssignInventory;
