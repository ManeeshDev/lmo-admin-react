import React, { useState, useEffect } from "react";
import "../../../assets/css/allimages.css";
import axios from "axios";
import ImagePopUp from "../../Common/ImagePopup";
import {
  Spin,
  Alert,
  Radio,
  Modal,
  Button,
  message,
  Pagination,
  Row,
  Col,
  Form,
} from "antd";
import Select from "react-select";
import { getMerchantId } from "../../../Utils/helpers";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const employeeList = localStorage.getItem("employeeList");
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

const NMUploadedItemImages = (props) => {
  const [images, updateImagesList] = useState([]);
  const [noimageFound, updateNoImage] = useState(false);
  const [selectedCategory, updateSelectedCategory] = useState("");
  const [btn, setBtn] = useState(false);
  const [loading, updateLoading] = useState(false);
  const [uploadList, updateuploadList] = useState([]);
  const [textData, updateTextData] = useState([]);
  const [assignList, updateAssignList] = useState([]);
  const [assignbtn, setAssignBtn] = useState(false);
  const [pages, setPages] = useState(0);
  const [selectedImage, updateSelectedImage] = useState("");
  const [showImagePopup, updateImagePopupDisplay] = useState(false);
  const [next, setNext] = useState(20);
  const [skip, setSkip] = useState(0);
  const [current, setCurrent] = useState(1);

  const fetchImages = (selectedCategoryValue) => {
    setBtn(false);
    setNext(20);
    setSkip(0);
    setCurrent(1);
    updateLoading(true);
    updateImagesList([]);
    updateAssignList([]);
    updateuploadList([]);

    try {
      const endPoint = `${
        process.env.REACT_APP_BASE_URL
      }/${empid}/${userRole}?status=item&ctgy=${selectedCategoryValue.trim()}`;
      return axios
        .get(endPoint, {
          headers: { authorization: token },
        })
        .then((res) => {
          updateLoading(false);
          if (res.data.body.images.length === 0) {
            updateNoImage(true);
            updateImagesList([]);
          } else {
            var needToApproveList = [];
            res.data.body.images.map((item) => {
              if (
                item.split("/")[4] !== "" &&
                item.split("/")[5] !== "" &&
                typeof (
                  item.split("/")[4] === "string" &&
                  !item.split("/")[4].includes("function()")
                )
              ) {
                needToApproveList.push(item.replace("+", "%2B"));
              }
            });
            if (needToApproveList.length !== 0) {
              setPages(needToApproveList.length);
              updateImagesList(needToApproveList);
            } else {
              updateNoImage(true);
            }
          }
        });
    } catch (error) {
      updateLoading(false);
    }
  };

  const downloadTxtFile = () => {
    if (selectedCategory !== "") {
      if (textData.length > 0) {
        const element = document.createElement("a");
        const file = new Blob(textData, { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "myFile.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      } else {
        Modal.error({
          content: "No images found for this category try with new one",
          onOk() {},
        });
      }
    } else {
      Modal.error({
        content: "Please select a category of the items",
        onOk() {},
      });
    }
  };

  const handleCategoryChange = (ctgry) => {
    updateSelectedCategory(ctgry.value);
    fetchImages(ctgry.value);
  };

  const handleUpload = () => {
    if (selectedCategory !== "" && uploadList.length > 0) {
      setBtn(true);
      const body = {
        approver_image: uploadList,
      };
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const endPoint = `${
        process.env.REACT_APP_BASE_URL
      }/${empid}/${userRole}?status=itemstatus&ctgy=${selectedCategory.trim()}`;

      return axios
        .post(endPoint, body, config)
        .then((res) => {
          const response = res.data;
          setBtn(false);
          if (response.statusCode === 200) {
            updateuploadList([]);
            Modal.success({
              content: response.body,
              onOk() {
                //window.location.reload();
                fetchImages(selectedCategory);
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
        .catch((e) => {
          setBtn(false);
          Modal.error({
            content: "Action Failed, Please contact Manager",
            onOk() {},
          });
        });
    } else {
      if (selectedCategory === "") {
        Modal.error({
          content: "Please select a category of the items",
          onOk() {},
        });
      } else if (uploadList.length < 1) {
        message.destroy();
        message.error({
          content: "Please approve or reject images to continue..",
          style: {
            marginTop: "5rem",
          },
        });
      }
    }

    setBtn(false);
  };

  const addImageToList = (value, item) => {
    const empId = item.split("/")[4];
    const imageId = item.replace("%2B", "+").split("/")[5];
    if (value === "approve" || value === "reject" || value === "delete") {
      const newImage = {
        id: imageId,
        sts: value,
        emp: empId,
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
      //console.log(uploadList);
    }
  };

  const clearSelections = () => {
    if (selectedCategory !== "") {
      fetchImages(selectedCategory);
    }
  };

  //   const assignImages = () => {
  //     if (assignList && assignList.length > 0) {
  //       console.log(assignList);
  //       setAssignBtn(true);
  //       const body = {
  //         assignes: assignList,
  //       };
  //       console.log(body, "body");
  //       const config = {
  //         headers: {
  //           Authorization: token,
  //         },
  //       };
  //       try {
  //         const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=aprvreassign`;
  //         return axios.post(endPoint, body, config).then((res) => {
  //           const response = res.data;
  //           if (response.statusCode === 200) {
  //             setAssignBtn(false);
  //             updateAssignList([]);
  //             Modal.success({
  //               content: response.body,
  //               onOk() {
  //                 fetchImages();
  //               },
  //             });
  //           } else {
  //             setAssignBtn(false);
  //             Modal.error({
  //               content: response.body,
  //               onOk() {},
  //             });
  //           }
  //         });
  //       } catch (error) {
  //         setAssignBtn(false);
  //         Modal.error({
  //           content: "Something went wrong! try again after some time",
  //           onOk() {},
  //         });
  //       }
  //     }
  //   };
  //   const addImageToAssignList = (emply, item) => {
  //     const imageId = item.split("/")[5];
  //     const empId = item.split("/")[4];
  //     const newImage = {
  //       id: imageId,
  //       emp: emply.value,
  //       oldempid: empId,
  //     };
  //     for (var i = 0; i < assignList.length; i++) {
  //       if (imageId === assignList[i].id) {
  //         assignList.splice(i, 1);
  //       }
  //     }
  //     var uploadListItem = [...assignList, newImage];
  //     updateAssignList(uploadListItem);
  //   };

  const handlePages = (e) => {
    const skipCal = e * 20;
    const startPosition = skipCal - 20;
    setSkip(startPosition);
    setNext(skipCal);

    setCurrent(e);

    updateLoading(true);
    setTimeout(() => {
      updateLoading(false);
    }, 300);

    window.scrollTo(0, 0);
  };

  const fetchNMName = (NM_id) => {
    if (employeeList && employeeList.length > 0 && typeof NM_id === "string") {
      const employe = JSON.parse(employeeList).filter(
        (file) => file.value === NM_id
      );
      return employe && employe[0] && employe[0].label
        ? employe[0].label
        : null;
    } else {
      return null;
    }
  };

  const updatePopUpDisplay = (value) => {
    updateImagePopupDisplay(!showImagePopup);
    updateSelectedImage(value ? value : "");
  };

  return (
    <Col lg={24} className="p-md-4 p-1 maintain-height">
      <h3>Approve /Reject NM Uploaded Item Images</h3>

      <Row justify="space-between" align="middle">
        <Col lg={6}>
          <label>Select Category:</label>
          <Select
            onChange={(e) => {
              handleCategoryChange(e);
            }}
            options={categoryList}
          />
        </Col>{" "}
        <div>
          <Button
            loading={btn}
            className="m-1"
            onClick={handleUpload}
            type="primary"
          >
            Submit
          </Button>

          <Button className="m-1" onClick={clearSelections}>
            Cancel/Clear
          </Button>
        </div>
      </Row>

      <Col lg={24}>
        {selectedCategory === "" && !loading ? (
          <Row justify="center" className="my-5">
            <Alert
              message="Please select a category to continue!"
              type="info"
            />
          </Row>
        ) : (
          <>
            {images && images.length > 0 && !loading ? (
              <Row>
                {images.slice(skip, next).map((item) => (
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
                        Item : {item.replace("%2B", "+").split("/")[5]}
                      </label>
                      <br></br>
                      <label style={{ color: "red" }}>
                        Non Manager: {fetchNMName(item.split("/")[4])}
                      </label>
                      <div>
                        <small>Mercahnt ID</small>
                        <h5 className="mb-0">{getMerchantId(item)}</h5>
                      </div>
                      <hr className="p-0" />
                      <Radio.Group
                        onChange={(e) => {
                          addImageToList(e.target.value, item);
                        }}
                      >
                        <Radio value="approve" style={{ color: "blue" }}>
                          Approve
                        </Radio>
                        <Radio value="reject" style={{ color: "red" }}>
                          Reject
                        </Radio>
                        <Radio value="delete" style={{ color: "blue" }}>
                          Delete Image
                        </Radio>
                        <Radio value="deassign" style={{ color: "red" }}>
                          Clear
                        </Radio>
                      </Radio.Group>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <Row justify="center" className="my-5">
                {noimageFound && !loading ? (
                  <Alert message="No Item Images found!" type="info" />
                ) : (
                  <Spin
                    className="row"
                    tip="We are collecting images for you ..."
                  />
                )}
              </Row>
            )}
          </>
        )}
      </Col>

      <ImagePopUp
        selectedImage={selectedImage}
        updatePopUpDisplay={updatePopUpDisplay}
        showImagePopup={showImagePopup}
      />
      {pages > 0 ? (
        <Row justify={"center"}>
          <Pagination
            onChange={handlePages}
            current={current}
            total={pages / 2}
            showSizeChanger={false}
            hideOnSinglePage={true}
          />
        </Row>
      ) : (
        ""
      )}
    </Col>
  );
};

export default NMUploadedItemImages;
