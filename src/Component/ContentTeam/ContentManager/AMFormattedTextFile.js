import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import axios from "axios";
import { Tabs, Spin, Alert, List, Modal, Col, Row } from "antd";
const { TabPane } = Tabs;

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const AMFormattedTextFile = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [selectedImage, updateSelectedImage] = useState("");
  const [showImagePopup, updateImagePopupDisplay] = useState(false);
  const [loading, updateLoading] = useState(false);
  useEffect(() => {
    fetchImages();
  }, []);
  const fetchImages = () => {
    updateImagesList([]);
    updateLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=itemformat`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          updateLoading(false);
          if (
            res.data.body.allproducts.length === 0 &&
            res.data.body.itemsformat.length === 0
          ) {
            updateNoImage(true);
          } else {
            var AllFiles = [];
            res.data.body.allproducts &&
              res.data.body.allproducts.map((item) => {
                if (item.split("/")[4] !== "") {
                  AllFiles.push(item);
                }
              });

            res.data.body.itemsformat &&
              res.data.body.itemsformat.map((item) => {
                if (item.split("/")[4] !== "") {
                  AllFiles.push(item);
                }
              });
            updateImagesList(AllFiles);
          }
        });
    } catch (error) {
      updateLoading(false);
      // console.log(error, "error");
    }
  };
  const handleDelete = (file) => {
    updateLoading(true);
    const image_id = file.split("/")[4];
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=deleteitemformat&imageid=${image_id}`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          Modal.success({
            content: res.data.body,
            onOk() {
              fetchImages();
            },
          });
        })
        .catch((err) => {
          const res = eval("(" + err.response.data + ")");
          Modal.error({
            content: res.body,
            onOk() {},
          });
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
      <h3>All products CSV files</h3>
      <Col lg={24}>
        {!loading && images && images.length > 0 ? (
          <List
            bordered
            dataSource={images}
            renderItem={(item) => (
              <List.Item>
                {item.split("/")[4]}
                <a
                  href={item}
                  download
                  style={{ float: "right", color: "blue", pointer: "cursor" }}
                >
                  <i
                    className="fa fa-download "
                    style={{ padding: ".5rem" }}
                  ></i>
                  Download
                </a>
                <a
                  style={{ float: "right", color: "red", pointer: "cursor" }}
                  onClick={() => {
                    handleDelete(item);
                  }}
                >
                  <i className="fa fa-trash " style={{ padding: ".5rem" }}></i>
                  Delete
                </a>
              </List.Item>
            )}
          />
        ) : (
          <Row justify="center" className="my-5">
            {!loading && noimageFound ? (
              <Alert message="No  new text files found!" type="info" />
            ) : (
              <Spin className="row" tip="We are collecting Files for you ..." />
            )}
          </Row>
        )}
      </Col>
    </div>
  );
};

export default AMFormattedTextFile;
