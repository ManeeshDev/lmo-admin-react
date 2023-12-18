import React, { useState } from "react";
import { Input, Spin, Alert, message, Tabs, Row, Col, Tag } from "antd";
import axios from "axios";
import Select from "react-select";
import InventoryTable from "./InventoryTable";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const { Search } = Input;
const { TabPane } = Tabs;

const ViewInventory = (props) => {
  const [imageList, updateImageList] = useState([]);
  const [loading, updateLoading] = useState(false);
  const [userInput, UpdateUserInput] = useState("");
  const [noimageFound, updateNoImage] = useState(false);
  const [selectedCtgy, updateSelectedCtgy] = useState("");

  const [err, setErr] = useState("");

  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  const fetchImages = (userInput) => {
    updateImageList([]);
    if (userInput.length === 10) {
      updateLoading(true);

      var endPoint = `${
        process.env.REACT_APP_BASE_URL
      }/${empid}/${userRole}?status=search&imageid=${Capitalize(
        userInput
      )}&ctgy=inventory`;

      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          updateLoading(false);
          if (res.data.body === null || res.data.body === {}) {
            updateNoImage(true);
          } else {
            var needToApproveList = [];
            res.data.body.invt &&
              res.data.body.invt.length > 0 &&
              res.data.body.invt.split("$$$").map((data) => {
                let obj = JSON.parse(data);
                for (var key in obj) {
                  if (obj.hasOwnProperty(key)) {
                    var val = obj[key];
                    needToApproveList.push(val);
                  }
                }
              });
            if (needToApproveList.length !== 0) {
              var list = removeDuplicates(needToApproveList, "name");
              updateImageList(list);
            } else {
              updateNoImage(true);
            }
          }
        })
        .catch((err) => {
          const res = eval("(" + err.response.data + ")");
          setErr(res.body);
        });
    } else {
      message.destroy();
      message.error({
        content: "Please enter 10 digit merchant ID..",
        style: {
          marginTop: "5rem",
        },
      });
    }

    updateLoading(false);
  };

  const handleInputChange = (value) => {
    setErr("");
    updateLoading(false);

    updateImageList([]);
    if (value !== "" && value.length === 10) {
      updateLoading(true);
      UpdateUserInput(value);
      fetchImages(value);
    }
  };

  return (
    <div style={{ padding: "2rem 3rem" }}>
      <h3>Search for Merchant View of Inventory items</h3>
      <label>Please Enter Full Merchant Id</label>
      <Search
        placeholder="Input Merchant Id"
        enterButton="Search"
        size="large"
        onChange={(e) => {
          handleInputChange(e.target.value);
        }}
        onSearch={() => fetchImages(userInput)}
      />
      <Row justify="center">
        {!loading && !err && imageList && imageList.length > 0 ? (
          <Col lg={22} style={{ margin: "4rem" }}>
            <Tabs tabPosition={"top"}>
              {imageList &&
                imageList.map((x, i) => (
                  <TabPane tab={x.name} key={i}>
                    <InventoryTable
                      parentIndex={i}
                      data={x.items}
                      columns={[
                        {
                          title: "Item",
                          dataIndex: "item",
                          key: `item`,
                        },
                        {
                          title: "Item Image",
                          dataIndex: "image_url",
                          render: (text) =>
                            text ? (
                              <img src={text} alt="item_image" height="50px" />
                            ) : (
                              <Tag color="magenta">No Preview</Tag>
                            ),
                        },
                        {
                          title: "Brand",
                          dataIndex: "brand",
                          key: `brand`,
                        },
                        {
                          title: "Size",
                          dataIndex: "size",
                          key: `size`,
                        },
                        {
                          title: "MRP",
                          dataIndex: "mrp",
                          key: `mrp`,
                        },
                        {
                          title: "Tax",
                          dataIndex: "tax",
                          key: `tax`,
                        },
                        {
                          title: "Description",
                          dataIndex: "description",
                          key: `description`,
                        },
                      ]}
                    />
                  </TabPane>
                ))}
            </Tabs>
          </Col>
        ) : (
          <div style={{ margin: "10rem 4rem" }}>
            {noimageFound && !loading ? (
              <Alert showIcon message="No result found!" type="info" />
            ) : err ? (
              <Alert showIcon message={err} type="error" />
            ) : (
              <>
                {!loading &&
                selectedCtgy === "" &&
                userInput === "" &&
                userInput.length < 10 &&
                userRole === "AM" ? (
                  <Alert
                    showIcon
                    message="Please enter Merchant id for searching!!"
                    type="info"
                  />
                ) : (
                  <>
                    {loading && (
                      <Spin
                        className="row"
                        tip="We are collecting images for you ..."
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </Row>
    </div>
  );
};

export default ViewInventory;
