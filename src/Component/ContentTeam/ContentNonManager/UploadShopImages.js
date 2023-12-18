import React from "react";
import { Upload, Modal, Button, Row } from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class UploadShopImages extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    activeFileList: [],
    buttonLoading: false,
    status: false,
  };

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
    },
    beforeUpload: (file) => {
      return false;
    },
  };

  handleUpload = async () => {
    var res = "";
    return this.state.activeFileList.length > 0
      ? this.state.activeFileList.map(async (file, index) => {
          this.setState({ buttonLoading: true });
          const ext = file.name.split(".")[1];
          try {
            const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=shop&imageid=${file.name}`;
            const config = {
              headers: {
                Authorization: token,
              },
            };
            res = await axios.get(endPoint, config);
            // const url = res.data.body.url;
            // const upload = await axios.put(url, file.originFileObj);

            if (res.status === 200) {
              this.setState({ buttonLoading: false, status: false });
              Modal.success({
                content: "Upload Successfully",
                onOk() {
                  window.location.reload();
                },
              });
            } else {
              this.setState({ buttonLoading: false });
              Modal.error({
                content: "Action Failed, Please report to Manager",
                onOk() {},
              });
            }
          } catch (err) {
            this.setState({ buttonLoading: false });
            Modal.error({
              content: "Action Failed, Please report to Manager",
              onOk() {},
            });
          }
        })
      : false;
  };

  handleChange = ({ fileList }) => {
    const pngData = fileList.filter((file) => file.type === "image/png");
    const jpgData = fileList.filter((file) => file.type === "image/jpeg");
    const combineImages = [...pngData, ...jpgData];
    this.setState({ activeFileList: fileList });
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;

    return (
      <div>
        <Row justify="space-between">
          <h5>NM Shop Image Upload</h5>
          <span>
            <Button
              loading={this.state.buttonLoading}
              style={{ margin: "1rem" }}
              onClick={this.handleUpload}
              type="primary"
            >
              Submit
            </Button>
            <Button style={{ margin: "1rem" }} onClick={this.handleCancel}>
              Cancel
            </Button>
          </span>
        </Row>

        <Upload
          multiple={true}
          {...this.imgProps}
          listType="picture-card"
          activeFileList={this.state.activeFileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          // accept=".png, .jpg, .jpeg"
        >
          <div>
            <PlusOutlined />
            <div className="ant-upload-text">Upload</div>
          </div>
        </Upload>
        <Modal
          closable={false}
          title="Success"
          visible={this.state.status}
          footer={null}
        >
          <div style={{ padding: "0 2rem" }}>
            <Row justify="center">
              <h3>
                Images Uploaded Successfully
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

export default UploadShopImages;
