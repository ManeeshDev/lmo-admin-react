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
  Dropdown,
  Input,
  message,
  Row,
  Col,
} from "antd";
import { employeeList } from "../../../Utils/Session";
import Select from "react-select";
import ImagePopUp from "../../Common/ImagePopup";
import { EmployeeOptions, getMerchantId } from "../../../Utils/helpers";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const ApprovedImages = (props) => {
  const [images, updateImagesList] = useState([]);
  const [backup, setBackup] = useState([]);
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
            res.data.body.key.map((item) => {
              if (item.split("/")[4] !== "") {
                needToApproveList.push(item);
              }
            });
            if (needToApproveList.length === 0) {
              updateNoImage(true);
              updateuploadList([]);
            } else {
              updateImagesList(needToApproveList);
              setBackup(needToApproveList);
            }
            var parsed = res.data.body.employees;

            const options = EmployeeOptions(parsed);

            UpdateNMList(options);
            employeeList(options);
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
        assignes: uploadList,
      };

      const config = {
        headers: {
          Authorization: token,
        },
      };
      try {
        const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=assign`;
        return axios.post(endPoint, body, config).then((res) => {
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
        });
      } catch (error) {
        setBtn(false);
        Modal.error({
          content: "Something went wrong! try again after some time",
          onOk() {},
        });
      }
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
    const imageId = item.split("/")[4];
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

  const handleSearch = (value) => {
    const getData =
      images.length > 0 ? images.filter((x) => getMerchantId(x) === value) : [];

    updateImagesList(getData);
  };

  const [search, setSearch] = useState("");

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <h3>Assign Images</h3>
        <span>
          <Button
            className="m-1"
            loading={btn}
            onClick={uploadImages}
            type="primary"
          >
            Submit
          </Button>
          <Button className="m-1" onClick={cancelOptions}>
            Cancel/Clear
          </Button>
        </span>
      </div>

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
                  <label>
                    Merchant ID:
                    {item
                      .split("/")[4]
                      .substr(0, item.split("/")[4].indexOf("-"))}
                  </label>
                  <br></br>
                  <label>Non Managers:</label>
                  <Select
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
              <Alert message="No Images found new for assigning!" type="info" />
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
    </>
  );
};

export default ApprovedImages;
