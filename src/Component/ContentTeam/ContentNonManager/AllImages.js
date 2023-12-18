import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
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
  Input,
} from "antd";

import ImagePopUp from "../../Common/ImagePopup";
import { getMerchantId } from "../../../Utils/helpers";

const { TabPane } = Tabs;

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const base_url = process.env.REACT_APP_BASE_URL;

const AllImages = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [uploadList, updateuploadList] = useState([]);
  const [checked, updateChecked] = useState(false);
  const [btn, setBtn] = useState(false);
  const [loading, updateLoading] = useState(false);
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
    updateLoading(true);
    var status = "";
    const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=all`;
    return axios
      .get(endPoint, {
        headers: { authorization: token },
      })
      .then((res) => {
        updateLoading(false);
        if (
          res.body === null ||
          (res.data.body.key && res.data.body.key.length < 1)
        ) {
          updateImagesList([]);
          updateNoImage(true);
        } else {
          var needToApproveList = [];
          if (res.data.body.key) {
            res.data.body.key.map((item) => {
              if (item.split("/")[4] !== "" && item.split("/")[5] !== "") {
                needToApproveList.push(item);
              }
            });
          }
          if (needToApproveList.length !== 0) {
            updateImagesList(needToApproveList);
            setBackup(needToApproveList);
          } else {
            updateNoImage(true);
          }
        }
      })
      .catch((e) => {
        updateLoading(false);
        Modal.error({
          content: "Action Failed, Please contact Manager",
          onOk() {},
        });
      });
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
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=assign`;
      return axios
        .post(endPoint, body, config)
        .then((res) => {
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
        })
        .catch((error) => {
          setBtn(false);
          Modal.error({
            content: "Action Failed, Please contact Manager",
            onOk() {},
          });
        });
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
      const imageId = item.split("/")[4];
      var uploadListItem = uploadList;
      uploadListItem.push(imageId);
      updateuploadList(uploadListItem);
    } else {
      for (var i = 0; i < uploadList.length; i++) {
        if (item.split("/")[4] === uploadList[i]) {
          uploadList.splice(i, 1);
        }
      }
    }
  };

  const cancelOptions = () => {
    if (uploadList.length > 0) {
      window.location.reload();
    }
  };

  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    const getData =
      images.length > 0 ? images.filter((x) => getMerchantId(x) === value) : [];

    updateImagesList(getData);
  };

  return (
    <div>
      <Row justify="space-between" align="middle">
        <h3>All Images</h3>

        <div>
          <Button
            loading={btn}
            className="m-1"
            onClick={uploadImages}
            type="primary"
          >
            Submit
          </Button>
          <Button className="m-1" onClick={cancelOptions}>
            Cancel
          </Button>
        </div>
      </Row>
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
                    Assign
                  </Checkbox>
                  {/* <Radio.Group
                  onChange={(e) => {
                    addImageToList(e.target.value, item);
                  }}
                  checked={checked}
                >
                  <Radio value="assign" style={{ color: "blue" }}>
                    Assign
                  </Radio>
                  <Radio value="deassign" style={{ color: "red" }}>
                    De Assign
                  </Radio>
                </Radio.Group> */}
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <Row justify="center" className="my-5">
            {noimageFound && !loading ? (
              <Alert
                message="No new Images found  for assigning!"
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

export default AllImages;
