import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import axios from "axios";
import Select from "react-select";
import { Col, Spin, Alert, List, Button, Modal, Row } from "antd";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const AMMissedImages = () => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [selectedCtgy, updateSelecteCtgy] = useState("");
  const [loading, updateLoading] = useState(false);

  const fetchImages = (ctgry) => {
    updateImagesList([]);
    updateLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=missing&csv=${ctgry}`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          updateLoading(false);
          if (res.body === null) {
            updateNoImage(true);
          } else {
            var needToApproveList = [];
            res.data.body.imageurls.length > 0 &&
              res.data.body.imageurls.map((item) => {
                if (item.split("/")[4] !== "") {
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
      const res = eval("(" + error.response.data + ")");
      Modal.error({
        content: res.body,
        onOk() {},
      });
    }
  };

  const handleItemProcessed = (item) => {
    updateLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=processed&csv=${selectedCtgy}&imageid=${item} `;
      return axios
        .post(
          endPoint,
          {},
          {
            headers: { authorization: token },
          }
        )
        .then((res) => {
          updateLoading(false);
          if (res.body === null) {
            updateNoImage(true);
          } else {
            Modal.success({
              content: "Succesfully Confirmed!!",
              onOk() {
                //window.location.reload();
                fetchImages(selectedCtgy);
              },
            });
          }
          //  } else {
          //    var needToApproveList = [];
          //    res.data.body.imageurls.length > 0 &&
          //      res.data.body.imageurls.map((item) => {
          //        if (item.split("/")[4] !== "") {
          //          needToApproveList.push(item);
          //        }
          //      });
          //  if (needToApproveList.length !== 0) {
          //      updateImagesList(needToApproveList);
          //    } else {
          //      updateNoImage(true);
          //    }
          // }
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

  const handleCategoryChange = (ctgry) => {
    updateSelecteCtgy(ctgry.value);
    fetchImages(ctgry.value);
  };

  const showConfirmModel = (item) => {
    Modal.success({
      content: "Are you sure ?Processed this file!!",
      onOk() {
        handleItemProcessed(item);
      },
    });
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
    <div className="p-md-4 p-1 maintain-height">
      <h3> Un Processed Items</h3>
      <span
        style={{
          width: "300px",
        }}
      >
        <label>Select Items:</label>
        <Select
          onChange={(e) => {
            handleCategoryChange(e);
          }}
          options={[
            { label: "Location", value: "location" },
            { label: "Items", value: "item" },
            { label: "Brand", value: "brand" },
            { label: "Size", value: "size" },
          ]}
        />
      </span>

      <Col lg={24}>
        {images && images.length > 0 ? (
          <List
            bordered
            dataSource={images}
            renderItem={(item) => (
              <List.Item>
                {item.split("/")[4]}

                <div>
                  <Button
                    style={{ float: "right" }}
                    onClick={() => {
                      showConfirmModel(item.split("/")[4]);
                    }}
                  >
                    Processed{" "}
                  </Button>
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
              </List.Item>
            )}
          />
        ) : (
          <Row justify="center" className="my-5">
            {noimageFound && !loading ? (
              <Alert
                message="No Unprocessed images  found at this time!"
                type="info"
              />
            ) : (
              <>
                {!loading && selectedCtgy === "" ? (
                  <Alert
                    message="Please select type of data for continuing!!"
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
export default AMMissedImages;
