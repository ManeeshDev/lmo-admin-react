import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import axios from "axios";
import { Tabs, Spin, Alert, List, Modal, Row, Col } from "antd";
import Select from "react-select";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const categoryList = [
  { label: "artsclasses", value: "artsclasses" },
  { label: "beautyjewelry", value: "beautyjewelry" },
  { label: "fashion", value: "fashion" },
  { label: "food", value: "food" },
  { label: "furniture", value: "furniture" },
  { label: "kids", value: "kids" },
  { label: "retail", value: "retail" },
  { label: "automotive", value: "automotive" },
  { label: "electronicsinstruments", value: "electronicsinstruments" },
  { label: "healthfitness", value: "healthfitness" },
  { label: "homehardware", value: "homehardware" },
  { label: "pets", value: "pets" },
  { label: "photographytravel", value: "photographytravel" },
  { label: "recreationlodging", value: "recreationlodging" },
];

const UploadedItemImages = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [SelectedCategory, updateSelectedCategory] = useState("");
  const [loading, updateLoading] = useState(false);

  const fetchImages = (Category) => {
    updateLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=itemimagelist&ctgy=${Category}`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          updateLoading(false);
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
      updateLoading(false);
      const res = eval("(" + error.response.data + ")");
      Modal.error({
        content: res.body,
        onOk() {},
      });
    }
  };

  const handleCategoryChange = (ctgry) => {
    updateSelectedCategory(ctgry.value);
    fetchImages(ctgry.value);
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
    <div className="maintain-height p-md-4 p-1">
      <h3>Item Images Uploaded by you</h3>
      <div>
        <label>Select Category:</label>
        <Select
          onChange={(e) => {
            handleCategoryChange(e);
          }}
          options={categoryList}
        />
      </div>
      <Col lg={24} className="px-4 mt-4">
        {images && images.length > 0 ? (
          <List
            className="w-100"
            bordered
            dataSource={images}
            renderItem={(item) => (
              <List.Item className=" d-flex flex-wrap">
                <p className="font-weight-bold">{item.split("/")[5]}</p>
                <div className="download-btn">
                  <a href={item} download>
                    <i
                      className="fa fa-download "
                      style={{ padding: ".5rem" }}
                    ></i>
                    Download
                  </a>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Row justify="center" className="my-5">
            {!loading && noimageFound ? (
              <Alert message="No images are uploaded by you!" type="info" />
            ) : (
              <>
                {!loading && SelectedCategory === "" ? (
                  <Alert
                    message="Please select a category to continue!"
                    type="info"
                  />
                ) : (
                  <Spin
                    className="row"
                    tip="We are collecting images for you ..."
                  />
                )}
              </>
            )}
          </Row>
        )}
      </Col>
    </div>
  );
};

export default UploadedItemImages;
