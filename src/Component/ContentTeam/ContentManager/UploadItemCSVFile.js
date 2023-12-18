import React from "react";
import { Upload, Modal, Button, Tabs, message, Alert, Row } from "antd";
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

class UploadCSVFile extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    activeFileList: [],
    selectdCategory: "",
    buttonLoading: false,
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
    message.destroy();
    if (this.state.selectdCategory !== "") {
      return this.state.activeFileList.length > 0
        ? this.state.activeFileList.map(async (file, index) => {
            this.setState({ buttonLoading: true });
            try {
              const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=itemlist&ctgy=${this.state.selectdCategory}`;
              const config = {
                headers: {
                  Authorization: token,
                },
              };
              const res = await axios.get(endPoint, config);
              const url = res.data.body.url;
              const upload = await axios.put(url, file.originFileObj);
              if (upload.status === 200) {
                this.setState({ buttonLoading: false, status: true });
              } else {
                this.setState({ buttonLoading: false });
                Modal.error({
                  content: res.data.body,
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
        <h3>Upload Item List as .CSV file</h3>
        <Row justify="space-between" align="middle">
          {" "}
          <span
            style={{
              width: "300px",
            }}
          >
            <label>Select Category:</label>
            <Select
              onChange={(e) => {
                this.handleCategoryChange(e);
              }}
              options={categoryList}
            />
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
        <div className="mt-4">
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
            <Alert
              style={{ margin: "16rem 34rem", width: "250px" }}
              message="Please select type of data for continuing!!"
              type="info"
            />
          )}
        </div>
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

export default UploadCSVFile;
