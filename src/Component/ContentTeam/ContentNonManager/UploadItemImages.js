import React from "react";
import { Upload, Modal, Button, Col, message, Row } from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
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

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
var activeFileList = [];

class UploadItemImages extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    activeFileList: [],
    selectdCategory: "",
    buttonLoading: false,
    status: false,
    fileType: "",
    uploadStatus: "",
  };

  componentDidMount() {
    if (window.location.href.split("/")[4] === "RejectedImages") {
      this.setState({ uploadStatus: "uploaditemrejected", fileType: "img" });
    } else {
      this.setState({ uploadStatus: "item" });
    }
  }
  handleCancel = () => {
    window.location.reload();
  };

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  imgProps = {
    onRemove: async (file) => {
      const index = this.state.activeFileList.indexOf(file);
      const newactiveFileList = this.state.activeFileList.slice();
      newactiveFileList.splice(index, 1);
      this.setState({ activeFileList: newactiveFileList });
      activeFileList = newactiveFileList;
    },
    beforeUpload: (file) => {
      return false;
    },
  };

  handleUpload = async () => {
    if (this.state.selectdCategory !== "") {
      var res = "";
      return this.state.activeFileList.length > 0
        ? this.state.activeFileList.map(async (file, index) => {
            this.setState({ buttonLoading: true });
            const ext = file.name.split(".")[1];
            try {
              const endPoint = `${
                process.env.REACT_APP_BASE_URL
              }/${empid}/${userRole}?status=${
                this.state.uploadStatus
              }&imageid=${file.name.trim()}&ctgy=${
                this.state.selectdCategory
              }&csv=${this.state.fileType}`;
              const config = {
                headers: {
                  Authorization: token,
                },
              };
              res = await axios.get(endPoint, config);
              const url = res.data.body.url;
              const upload = await axios.put(url, file.originFileObj);
              if (upload.status === 200) {
                this.setState({ buttonLoading: false, status: true });

                Modal.success({
                  content: "Upload Success",
                  onOk() {},
                });
              } else {
                this.setState({ buttonLoading: false });
                Modal.error({
                  content: "Unable to upload images,please try again later",
                  onOk() {},
                });
              }
            } catch (err) {
              this.setState({ buttonLoading: false });
              const res = eval("(" + err.response.data + ")");
              Modal.error({
                content: res.body,
                onOk() {},
              });
            }
          })
        : false;
    } else {
      Modal.error({
        content: "Please select a category of the items you uploaded",
        onOk() {},
      });
    }
  };

  handleChange = ({ fileList }) => {
    var pngData = [];
    var combineImages = [];
    var jpgData = [];
    if (this.state.fileType === "img") {
      pngData = fileList.filter(
        (file) =>
          file.type === "application/zip" ||
          file.type === "application/octet-stream" ||
          file.type === "application/x-zip" ||
          file.type === "application/x-zip-compressed"
      );
      //  jpgData = fileList.filter((file) => file.type === "image/jpeg");
      combineImages = [...pngData];
    } else {
      jpgData = fileList.filter(
        (file) => file.type === "application/vnd.ms-excel"
      );
      combineImages = [...jpgData];
    }
    const filteredImages = combineImages.filter(
      (item) => item.originFileObj.name.split(".").pop() !== ""
    );
    this.setState({ activeFileList: filteredImages });
  };

  handleCategoryChange = (ctgry) => {
    this.setState({ selectdCategory: ctgry.value });
  };

  handleFileTypeChange = (selectedType) => {
    this.setState({ fileType: selectedType.value });
  };

  render() {
    return (
      <div className="maintain-height p-md-4 p-1">
        <Row justify="space-between" align="middle" className="mb-5">
          <span
            style={{
              width: "300px",
            }}
          >
            {this.state.uploadStatus !== "uploaditemrejected" && (
              <>
                <label>Select Type of Data:</label>
                <Select
                  onChange={(e) => {
                    this.handleFileTypeChange(e);
                  }}
                  options={[
                    { label: "Image File", value: "img" },
                    { label: "CSV File", value: "csv" },
                  ]}
                />
              </>
            )}
            {this.state.fileType !== "" && (
              <div className="mt-3">
                <label>Select Category:</label>
                <Select
                  onChange={(e) => {
                    this.handleCategoryChange(e);
                  }}
                  options={categoryList}
                />
              </div>
            )}
          </span>
          <div>
            <Button
              loading={this.state.buttonLoading}
              className="m-1"
              onClick={this.handleUpload}
              type="primary"
            >
              Submit
            </Button>
            <Button className="m-1" onClick={this.handleCancel}>
              Cancel
            </Button>
          </div>{" "}
        </Row>
        {this.state.fileType === "img" && (
          <Upload
            multiple={true}
            {...this.imgProps}
            activeFileList={this.state.activeFileList}
            onChange={this.handleChange}
            accept=".zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
          >
            <Button>
              <PlusOutlined />
              Upload ZIP file
            </Button>
          </Upload>
        )}
        {this.state.fileType === "csv" && (
          <Upload
            onChange={this.handleChange}
            multiple={true}
            {...this.imgProps}
            activeFileList={this.state.activeFileList}
            accept=".csv"
          >
            <Button>
              <PlusOutlined />
              Upload .csv file
            </Button>
          </Upload>
        )}
        <Modal
          closable={false}
          title="Success"
          visible={this.state.status}
          footer={null}
        >
          <div style={{ padding: "0 2rem" }}>
            <Row justify="center">
              <h3>
                Files Uploaded Successfully
                <br />
              </h3>
            </Row>

            <br />
            <br />

            <Row justify="end">
              <Button
                type="primary"
                shape="round"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Ok
              </Button>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}

export default UploadItemImages;
