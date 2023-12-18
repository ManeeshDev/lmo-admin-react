import React from "react";
import { Upload, Modal, Button, Tabs, message, Alert, Row } from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import Select from "react-select";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

class UploadInventoryItems extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    activeFileList: [],
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
    message.destroy();
    if (this.state.selectdUser !== "") {
      return this.state.activeFileList.length > 0
        ? this.state.activeFileList.map(async (file, index) => {
            this.setState({ buttonLoading: true });
            const ext = file.name.split(".")[1];
            var res = "";
            try {
              const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=shop&imageid=${file.name}&ctgy=inventory`;
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
                  content: upload.body,
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
        <div>
          <Button
            loading={this.state.buttonLoading}
            style={{ margin: "1rem" }}
            onClick={this.handleUpload}
            type="primary"
          >
            Submit
          </Button>
          <Button style={{ margin: "1rem" }}>Cancel</Button>
        </div>
        <br></br>
        <div style={{ margin: "2rem" }}>
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

export default UploadInventoryItems;
