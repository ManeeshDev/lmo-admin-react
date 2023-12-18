import React from "react";
import { Upload, Modal, Button, Col, message, Alert, Row } from "antd";
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

class AMUploadItems extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    activeFileList: [],
    selectdCategory: "",
    buttonLoading: false,
    selectedUser: "",
    status: false,
  };

  fileprops = {
    onRemove: (file) => {
      this.setState((state) => {
        const index = state.activeFileList.indexOf(file);
        const newFileList = state.activeFileList.slice();
        newFileList.splice(index, 1);
        return {
          activeFileList: newFileList,
        };
      });
    },
    beforeUpload: (file) => {
      this.setState((state) => ({
        activeFileList: [...state.activeFileList, file],
      }));
      return false;
    },
  };

  handleUpload = async () => {
    var res = "";
    message.destroy();
    if (this.state.selectdUser !== "") {
      return this.state.activeFileList.length > 0
        ? this.state.activeFileList.map(async (file, index) => {
            this.setState({ buttonLoading: true });
            const ext = file.name.split(".")[1];
            try {
              var endPoint = "";
              if (
                this.state.selectedUser === "category" &&
                this.state.selectdCategory !== ""
              ) {
                endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=index&csv=${this.state.selectedUser}&ctgy=${this.state.selectdCategory}`;
              } else if (
                this.state.selectedUser === "category" &&
                this.state.selectdCategory === ""
              ) {
                this.setState({ buttonLoading: false });
                return message.error({
                  content: "Please select a category to continue..",
                  style: {
                    marginTop: "5rem",
                  },
                });
              } else {
                endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=index&csv=${this.state.selectedUser}`;
              }

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
              } else {
                this.setState({ buttonLoading: false });
                Modal.error({
                  content: "Something went wrong please try again",
                  onOk() {},
                });
              }
            } catch (err) {
              this.setState({ buttonLoading: false });
              Modal.error({
                content: res.data.body,
                onOk() {},
              });
            }
          })
        : message.error({
            content: "Please upload .csv file to continue..",
            style: {
              marginTop: "5rem",
            },
          });
    } else {
      Modal.error({
        content: "Please select type of the items you uploaded",
        onOk() {},
      });
    }
  };
  handleUserChange = (user) => {
    this.setState({ selectedUser: user.value });
  };

  handleCategoryChange = (ctgry) => {
    this.setState({ selectdCategory: ctgry.value, uploadList: [] });
  };

  handleChange = ({ fileList }) => {
    const jpgData = fileList.filter(
      (file) => file.type === "application/vnd.ms-excel"
    );
    const combineImages = [...jpgData];
    this.setState({ activeFileList: combineImages });
  };

  render() {
    return (
      <div className="maintain-height p-md-4 p-1">
        <h3>Upload .CSV file</h3>
        <Row align="middle" justify="space-between">
          <span
            style={{
              width: "300px",
            }}
          >
            <label>Select Type of Data:</label>
            <Select
              onChange={(e) => {
                this.handleUserChange(e);
              }}
              options={[
                { label: "All products", value: "allproducts" },
                { label: "Category", value: "category" },
                { label: "Brand", value: "brand" },
                { label: "Size", value: "size" },
              ]}
            />
            {this.state.selectedUser && this.state.selectedUser === "category" && (
              <>
                <label>Select Category:</label>
                <Select
                  onChange={(e) => {
                    this.handleCategoryChange(e);
                  }}
                  options={categoryList}
                />
              </>
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
            <Button className="m-1">Cancel</Button>
          </div>
        </Row>
        <Col lg={24} className="mt-5">
          {this.state.selectedUser !== "" ? (
            <Upload
              onChange={this.handleChange}
              multiple={true}
              {...this.fileprops}
              activeFileList={this.state.activeFileList}
              accept=".csv"
            >
              <Button>
                <PlusOutlined />
                Upload .csv file
              </Button>
            </Upload>
          ) : (
            <Row justify="center">
              <Alert
                message="Please select type of data for continuing!!"
                type="info"
              />
            </Row>
          )}
        </Col>
        <Modal
          closable={false}
          title="Success"
          visible={this.state.status}
          footer={null}
        >
          <div style={{ padding: "0 2rem" }}>
            <Row justify="center">
              <h3>
                CSV Files Uploaded Successfully
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

export default AMUploadItems;
