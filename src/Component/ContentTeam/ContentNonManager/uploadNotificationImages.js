import React from "react";
import { Upload, Modal, Button, Row, message } from "antd";
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

class UploadNotificationImage extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    activeFileList: [],
    buttonLoading: false,
    status: false,
    submit: false,
    editing: !this.props?.apiData?.imageurl == null,
    existFile: [],
    show: true,
  };

  handleCancel = () => {
    window.location.reload();
  };
  componentDidUpdate(prevProps) {
    if (prevProps?.imageurl !== this.props?.imageurl) {
      if (this.props.imageurl == null) {
        this.setState({ activeFileList: [] });
      } else {
        this.setState({ activeFileList: [] }, () => {
          this.setState({
            activeFileList: [
              ...this.state.activeFileList,
              {
                uid: "-1",
                name: "image.png",
                existImage: true,

                url: this.props?.imageurl || "",
              },
            ],
          });
        });
      }
    }
    console.log("prevProps", prevProps);
    if (prevProps.submit !== this.props.submit) {
      this.handleUpload();
      // Modal.success({
      //   content: "Upload Successfully",
      //   onOk() {
      //     window.location.reload();
      //   },
      // });
    }
  }
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
    // this.submit = !this.submit;
    if (this.state.activeFileList?.length === 0) {
      alert("please select an image");
      return;
    }
    var res = "";
    const isExistingImage = this.state.activeFileList.every(
      (x) => x?.existImage
    );
    return this.state.activeFileList.length > 0
      ? this.state.activeFileList.map(async (file, index) => {
          this.setState({ buttonLoading: true });
          const ext = file.name.split(".")[1];
          try {
            const endPoint =
              userRole == "NM"
                ? `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=shop&imageid=${file.name}&ctgy=ntf`
                : `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=shop&id=${file.name}&ctgy=ntf`;
            const endPointPost =
              userRole == "NM"
                ? `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=notif`
                : `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=notif`;
            const config = {
              headers: {
                Authorization: token,
              },
            };
            if (isExistingImage) {
              var payLoad = {
                ...this.props.apiData,
                imageurl: this.props?.imageurl,
              };
            } else {
              res = await axios.get(endPoint, config);
              const url = res.data.body.url;

              const upload = await axios.put(url, file.originFileObj);
              var payLoad = {
                ...this.props.apiData,
                imageurl: res.data.body.domain,
              };
            }

            axios
              .post(endPointPost, payLoad, config)
              .then((x) => {
                message.success(
                  `Notification has been ${
                    isExistingImage ? "updated" : "sent"
                  } Successfully `
                );
                this.props.changeTab(1);
                // window.location.reload();
              })
              .catch((err) => console.log(err));
            if (res.status === 200) {
              this.setState({ buttonLoading: false, status: false });
              // Modal.success({
              //   content: "Upload Successfully",
              //   onOk() {
              //     //window.location.reload();
              //   },
              // });

              message.success("Upload successfully");
            } else {
              this.setState({ buttonLoading: false });
              // Modal.error({
              //   content: "Action Failed, Please report to Manager",
              //   onOk() {},
              // });
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
  onNotificationSubmit = (formData) => {};
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;

    return (
      <div>
        {/* <Row justify="space-between">
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
        </Row> */}
        {/* 
        <Upload
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
        </Upload> */}

        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          maxCount={1}
          {...this.imgProps}
          fileList={this.state.activeFileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          <PlusOutlined />
          <div className="ant-upload-text">Upload</div>
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

export default UploadNotificationImage;
