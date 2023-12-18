import React, { useState } from "react";
import {
  Input,
  Spin,
  Alert,
  message,
  Modal,
  Row,
  Col,
  Checkbox,
  Button,
} from "antd";
import axios from "axios";
import Select from "react-select";
import ImagePopUp from "../../Common/ImagePopup";
import { getMerchantId } from "../../../Utils/helpers";
import { DeleteOutlined } from "@ant-design/icons";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const { Search } = Input;

const categoryList = [
  { label: "shop Images", value: "shop" },
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

const SearchImages = () => {
  const [imageList, updateImageList] = useState([]);
  const [loading, updateLoading] = useState(false);
  const [userInput, UpdateUserInput] = useState("");
  const [noimageFound, updateNoImage] = useState(false);
  const [selectedCtgy, updateSelectedCtgy] = useState("");
  const [selectedImage, updateSelectedImage] = useState("");
  const [showImagePopup, updateImagePopupDisplay] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [remove, setRemove] = useState([]);

  const updatePopUpDisplay = (value) => {
    updateImagePopupDisplay(!showImagePopup);
    updateSelectedImage(value ? value : "");
  };

  const fetchImages = async (userInput) => {
    if ((userRole === "AM" && selectedCtgy !== "") || userRole === "M") {
      updateLoading(true);
      updateImageList([]);
      try {
        var endPoint = "";
        if (userRole === "AM") {
          endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=search&imageid=${userInput}&ctgy=${selectedCtgy}`;
        } else {
          endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=search&imageid=${userInput}&ctgy=shop`;
        }

        const res = await axios.get(endPoint, {
          headers: { authorization: token },
        });
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
            updateImageList(needToApproveList);
          } else {
            updateNoImage(true);
          }
        }
      } catch (error) {
        const res = eval("(" + error.response.data + ")");
        Modal.error({
          content: res.body,
          onOk() {},
        });
      }
    } else {
      message.destroy();
      message.error({
        content: "Please select a category to continue..",
        style: {
          marginTop: "5rem",
        },
      });
    }
  };

  const handleInputChange = (value) => {
    if (value) {
      updateImageList([]);
      UpdateUserInput(value);
      if (value.length === 10) {
        updateLoading(true);

        fetchImages(value);
      }
    } else {
      updateImageList([]);
    }
  };

  const handleCategoryChange = (ctgry) => {
    updateImageList([]);
    updateSelectedCtgy(ctgry.value);
  };

  const delteImages = async () => {
    setDeleting(true);
    try {
      var endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=delete`;

      return axios
        .post(
          endPoint,
          { approver_image: remove },
          {
            headers: { authorization: token },
          }
        )
        .then((res) => {
          if (res) {
            Modal.success({
              title: res.data.body,
              onOk() {
                setRemove([]);
                fetchImages(userInput);
              },
            });
          }
        });
    } catch (error) {
      const res = eval("(" + error.response.data + ")");
      Modal.error({
        content: res.body,
        onOk() {},
      });
    }
    setDeleting(false);
  };

  return (
    <div>
      <h3>Search for images here</h3>
      {userRole === "AM" ? (
        <div className="w-25 mb-4">
          <label>Select Category of Images:</label>
          <Select
            onChange={(e) => {
              handleCategoryChange(e);
            }}
            options={categoryList}
          />
        </div>
      ) : null}

      <Search
        placeholder="input search text"
        enterButton="Search"
        size="large"
        value={userInput}
        onChange={(e) => {
          handleInputChange(e.target.value);
        }}
        onSearch={(e) => handleInputChange(e.target.value)}
      />

      <Col lg={24} className="mt-4">
        <Row justify="space-between">
          <p>
            {selectedCtgy} Search for {userInput}
          </p>

          {remove.length > 0 ? (
            <Button
              type="primary"
              danger
              shape="round"
              icon={<DeleteOutlined />}
              onClick={delteImages}
              loading={deleting}
            >
              Delete Images
            </Button>
          ) : (
            ""
          )}
        </Row>
      </Col>

      <Col lg={24}>
        {!loading && imageList && imageList.length > 0 ? (
          <Row>
            {imageList.map((item, ind) => (
              <Col lg={6}>
                <div key={ind} className="column">
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
                  <Row justify="space-between">
                    {selectedCtgy === "shop" ? (
                      <div>
                        <label>
                          Merchant Id:
                          {getMerchantId(item)}
                        </label>
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
                    ) : (
                      <label>Item : {item.split("/")[4]}</label>
                    )}

                    <Checkbox
                      checked={remove.includes(item)}
                      onClick={(e) => {
                        if (!remove.includes(item)) {
                          setRemove([...remove, item]);
                        } else {
                          const copy = [...remove];
                          const getIDX = copy.indexOf(item);
                          copy.splice(getIDX, 1);
                          setRemove(copy);
                        }
                      }}
                    />
                  </Row>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <Row justify="center" className="my-5">
            {noimageFound && !loading ? (
              <Alert message="No result found!" type="info" />
            ) : (
              <>
                {!loading &&
                selectedCtgy === "" &&
                userInput === "" &&
                userRole === "AM" ? (
                  <Alert
                    message="Please select Category of data  you are searching for!!"
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

export default SearchImages;
