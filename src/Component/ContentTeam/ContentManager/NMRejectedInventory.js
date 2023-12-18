import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import axios from "axios";
import ImagePopUp from "../../Common/ImagePopup";
import { Spin, Alert, Button, Modal, message, Checkbox, Row, Col } from "antd";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const employeeList = localStorage.getItem("employeeList");

const NMRejectedInventory = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [loading, updateLoading] = useState(false);
  const [uploadList, updateuploadList] = useState([]);
  const [assignList, updateAssignList] = useState([]);
  const [btn, setBtn] = useState(false);
  const [assignbtn, setAssignBtn] = useState(false);
  const [selectedImage, updateSelectedImage] = useState("");
  const [showImagePopup, updateImagePopupDisplay] = useState(false);
  useEffect(() => {
    fetchImages();
  }, []);
  const fetchImages = () => {
    updateuploadList([]);
    updateLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=reject&ctgy=inventory`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          updateLoading(false);
          if (res.data.body.length === 0) {
            updateImagesList([]);
            updateNoImage(true);
          } else {
            var needToApproveList = [];
            res.data.body.map((item) => {
              if (item.split("/")[4] !== "" && item.split("/")[5] !== "") {
                needToApproveList.push(item);
              }
            });
            if (needToApproveList.length === 0) {
              updateNoImage(true);
              updateuploadList([]);
            } else {
              updateImagesList(needToApproveList);
            }
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

  const uploadImages = () => {
    if (uploadList.length > 0) {
      setBtn(true);
      const body = {
        approver_image: uploadList,
      };
      const config = {
        headers: {
          Authorization: token,
        },
      };
      try {
        const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=reject&ctgy=inventory`;
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
    const empId = item.split("/")[4];
    const imageId = item.split("/")[5];
    const id = `${empId}/${imageId}`;
    if (value) {
      const newImage = {
        id: id,
        sts: "approve",
      };
      for (var i = 0; i < uploadList.length; i++) {
        if (id === uploadList[i].id) {
          uploadList.splice(i, 1);
        }
      }

      var uploadListItem = [...uploadList, newImage];
      updateuploadList(uploadListItem);
    } else {
      for (var i = 0; i < uploadList.length; i++) {
        if (id === uploadList[i].id) {
          uploadList.splice(i, 1);
        }
      }
    }
  };
  const clearSelections = () => {
    if (uploadList.length > 0 || assignList.length > 0) {
      fetchImages();
    }
  };
  const fetchNMName = (NM_id) => {
    const employe = JSON.parse(employeeList).filter(
      (file) => file.value === NM_id
    );
    return employe && employe.length > 0 ? employe[0].label : "";
  };
  const updatePopUpDisplay = (value) => {
    updateImagePopupDisplay(!showImagePopup);
    updateSelectedImage(value ? value : "");
  };
  return (
    <div>
      <Row justify="space-between" align="middle">
        <h3> NM Rejected Inventory Images</h3>
        <span>
          <Button
            diasbled={uploadList.length > 0 ? false : true}
            loading={btn}
            className="m-1"
            onClick={uploadImages}
            type="primary"
          >
            Submit
          </Button>
          <Button className="m-1" onClick={clearSelections}>
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
                    src={item}
                    onClick={() => {
                      updatePopUpDisplay(item);
                    }}
                  />
                  <label style={{ color: "red" }}>
                    Non Manager: {fetchNMName(item.split("/")[4])}
                  </label>
                  <br></br>
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
                    Approve
                  </Checkbox>
                  <br></br>
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
                message="No images found rejected by Non Managers!!"
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
      </Col>
      <ImagePopUp
        selectedImage={selectedImage}
        updatePopUpDisplay={updatePopUpDisplay}
        showImagePopup={showImagePopup}
      />
    </div>
  );
};

export default NMRejectedInventory;
