import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import axios from "axios";
import {
  Tabs,
  Spin,
  Alert,
  Button,
  Radio,
  Modal,
  message,
  Row,
  Col,
} from "antd";
import { employeeList } from "../../../Utils/Session";
import Select from "react-select";
import ImagePopUp from "../../Common/ImagePopup";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const empList = localStorage.getItem("employeeList");

const AssignedInventoryItems = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [uploadList, updateuploadList] = useState([]);
  const [NMList, UpdateNMList] = useState([]);
  const [btn, setBtn] = useState(false);
  const [loading, updateLoading] = useState(false);
  const [selectedImage, updateSelectedImage] = useState("");
  const [showImagePopup, updateImagePopupDisplay] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    updateLoading(true);
    updateuploadList([]);
    const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=assign&ctgy=inventory`;
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
          res.data.body.key.map((item) => {
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

          var parsed = JSON.parse(empList);

          UpdateNMList(parsed);
          employeeList(parsed);
        }
      })
      .catch((e) => {
        updateLoading(false);
        Modal.error({
          content: "Action Failed",
          onOk() {},
        });
      });
  };

  const uploadImages = () => {
    if (uploadList.length > 0) {
      setBtn(true);
      const body = {
        assignes: uploadList,
      };
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=assign&ctgy=inventory`;
      return axios
        .post(endPoint, body, config)
        .then((res) => {
          const response = res.data;
          if (response.statusCode === 200) {
            setBtn(false);
            updateuploadList([]);
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
        })
        .catch((error) => {
          setBtn(false);
          Modal.error({
            content: "Something went wrong! try again after some time",
            onOk() {},
          });
        });
    } else {
      message.destroy();
      message.error({
        content: "Please assign images to  NM to continue..",
        style: {
          marginTop: "5rem",
        },
      });
    }
  };

  const addImageToList = (emply, item) => {
    const imageId = item.split("/")[5];
    const newImage = {
      id: imageId,
      emp: emply.value,
    };
    for (var i = 0; i < uploadList.length; i++) {
      if (imageId === uploadList[i].id) {
        uploadList.splice(i, 1);
      }
    }
    var uploadListItem = [...uploadList, newImage];
    updateuploadList(uploadListItem);
  };

  const cancelOptions = () => {
    if (uploadList.length > 0) {
      fetchImages();
    }
  };

  const updatePopUpDisplay = (value) => {
    updateImagePopupDisplay(!showImagePopup);
    updateSelectedImage(value ? value : "");
  };

  return (
    <div className="p-md-4 p-1 maintain-height">
      <Row justify="space-between">
        <h3>Assign Inventory Images</h3>
        <Row>
          <Button
            style={{ margin: "1rem" }}
            loading={btn}
            onClick={uploadImages}
            type="primary"
          >
            Submit
          </Button>
          <Button style={{ margin: "1rem" }} onClick={cancelOptions}>
            Cancel/Clear
          </Button>
        </Row>
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
                  <label>
                    Merchant ID:
                    {item
                      .split("/")[5]
                      .substr(0, item.split("/")[5].indexOf("-"))}
                  </label>
                  <br></br>
                  <label>Non Managers:</label>
                  <Select
                    className="position-relative"
                    style={{ zIndex: 99 }}
                    onChange={(e) => {
                      addImageToList(e, item);
                    }}
                    options={NMList}
                  />
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <Row justify="center" className="my-5">
            {noimageFound & !loading ? (
              <Alert
                message="No inventory items found new for assigning!"
                type="info"
              />
            ) : (
              <Spin
                className="row"
                tip="We are collecting inventory items for you ..."
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

export default AssignedInventoryItems;
