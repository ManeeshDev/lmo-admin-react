import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import axios from "axios";
import { Col, Spin, Alert, List, Modal, Row } from "antd";
import ItemMasterTable from "./ItemMasterTable";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const ItemMasterCSVList = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [SelectedCategory, updateSelectedCategory] = useState("");
  const [loading, updateLoading] = useState(false);
  const [selectedFile, updateSelectedFile] = useState("");
  const [showTable, showItemMasterTable] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    updateLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=readmaster`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          updateLoading(false);
          if (res.data === null || res.data.body.images.length < 1) {
            updateImagesList([]);
            updateNoImage(true);
          } else {
            var needToApproveList = [];
            res.data.body.images.map((item) => {
              if (
                item.split("/")[4] !== "" &&
                item.split("/")[5] !== "" &&
                item.includes(".json")
              ) {
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

  const viewItemMasterTable = (item) => {
    if (item) {
      updateSelectedFile(item);
    }
    showItemMasterTable(!showTable);
  };

  return (
    <div>
      {showTable ? (
        <ItemMasterTable
          viewItemMasterTable={viewItemMasterTable}
          JSON_url={selectedFile}
        />
      ) : (
        <>
          {" "}
          <h3>Item Master CSV List </h3>
          <Col lg={24}>
            {!loading && images && images.length > 0 ? (
              <List
                bordered
                dataSource={images}
                renderItem={(item) => (
                  <List.Item>
                    {item.split("/")[3]}
                    <span
                      onClick={() => viewItemMasterTable(item)}
                      style={{ float: "right", cursor: "pointer" }}
                    >
                      <i
                        className="fa fa-eye "
                        style={{ padding: ".5rem" }}
                      ></i>
                      View
                    </span>
                  </List.Item>
                )}
              />
            ) : (
              <Row justify="center">
                {!loading && noimageFound && images.length === 0 ? (
                  <Alert message="No Item Master Files Found!" type="info" />
                ) : (
                  <>
                    {loading ? (
                      <Spin
                        className="row"
                        tip="We are collecting File List for you ..."
                      />
                    ) : (
                      <Alert
                        message="Please Select Category of item for Continuing!..."
                        type="info"
                      />
                    )}
                  </>
                )}
              </Row>
            )}
          </Col>
        </>
      )}
    </div>
  );
};

export default ItemMasterCSVList;
