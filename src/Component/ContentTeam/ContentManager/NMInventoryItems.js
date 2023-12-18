import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import axios from "axios";
import Select from "react-select";
import {
  Tabs,
  Spin,
  Alert,
  Button,
  Radio,
  Modal,
  message,
  List,
  Checkbox,
  Col,
  Row,
} from "antd";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const employeeList = localStorage.getItem("employeeList");

const NMInventoryItems = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [loading, updateLoading] = useState(false);
  const [uploadList, updateuploadList] = useState([]);
  const [checked, updateChecked] = useState(false);
  const [btn, setBtn] = useState(false);
  const [assignList, updateAssignList] = useState([]);
  const [assignbtn, setAssignBtn] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    updateLoading(true);
    updateuploadList([]);
    setBtn(false);
    const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=approve&ctgy=inventory`;
    return axios
      .get(endPoint, {
        headers: { authorization: token },
      })
      .then((res) => {
        updateLoading(false);
        if (res.data.body.images.length > 0) {
          var needToApproveList = [];
          res.data.body.images.map((item) => {
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
        } else {
          updateImagesList([]);
          updateNoImage(true);
        }
      })
      .catch((error) => {
        updateLoading(false);
        const res = eval("(" + error.response.data + ")");
        Modal.error({
          content: res.body,
          onOk() {},
        });
      });
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
        const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=approve&ctgy=inventory`;
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

  const approveAllImges = (status) => {
    if (images && images.length > 0) {
      var imageArray = [];
      images.map((item) => {
        const empId = item.split("/")[4];
        const imageId = item.split("/")[5];
        const id = `${empId}/${imageId}`;
        const newImage = {
          id: id,
          sts: status,
        };
        imageArray.push(newImage);
      });
      updateuploadList(imageArray);
      uploadImages();
    } else {
      message.warning({
        content: "No images found to continue..",
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
        id: imageId,
        sts: "approve",
      };
      for (var i = 0; i < uploadList.length; i++) {
        if (imageId === uploadList[i].id) {
          uploadList.splice(i, 1);
        }
      }

      var uploadListItem = [...uploadList, newImage];
      updateuploadList(uploadListItem);
    } else {
      for (var i = 0; i < uploadList.length; i++) {
        if (imageId === uploadList[i].id) {
          uploadList.splice(i, 1);
        }
      }
    }
  };

  const cancelOptions = () => {
    if (uploadList.length > 0 || assignList.length > 0) {
      fetchImages();
    }
  };

  const fetchNMName = (NM_id) => {
    const employe = JSON.parse(employeeList).filter(
      (file) => file.value === NM_id
    );
    return employe[0].label;
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
      <Row justify="space-between">
        <h3>NM Uploaded Inventory Items</h3>
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
          <List
            bordered
            dataSource={images}
            renderItem={(item) => (
              <List.Item>
                <Row justify="space-between">
                  <Checkbox
                    onChange={(e) => {
                      addImageToList(e.target.checked, item);
                    }}
                  >
                    Approve
                  </Checkbox>
                  |
                  <p className="ml-2 mb-0 text-danger font-weight-bold">
                    {" "}
                    {item.split("/")[5]}
                  </p>
                </Row>

                <a
                  href={item}
                  download
                  style={{ float: "right", pointer: "cursor" }}
                >
                  <i
                    className="fa fa-download "
                    style={{ padding: ".5rem" }}
                  ></i>
                  Download
                </a>
              </List.Item>
            )}
          />
        ) : (
          <Row justify="center" className="my-5">
            {noimageFound && !loading ? (
              <Alert message="No inventory items uploaded yet!" type="info" />
            ) : (
              <Spin
                className="row"
                tip="We are collecting inventory items for you ..."
              />
            )}
          </Row>
        )}
      </Col>
    </div>
  );
};

export default NMInventoryItems;
