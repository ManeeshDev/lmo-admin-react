import React from "react";
import { Upload, Modal, Button, Row, Tabs, message } from "antd";

import UploadInventoryItems from "./UploadInventoryItems";
import PrivateInventoryItems from "./PrivateInventoryItems";
import AssignInventory from "./AssignInventory";
import SentNotifications from "./SentNotifications";
import UploadNotificationImages from "./uploadNotificationImages";
import { NotificationForm } from "./NotificationForm";
import { notificationService } from "../../../Utils/NotificationService";
import axios from "axios";
import { moment } from "moment";
const { TabPane } = Tabs;
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
class Notifications extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: "1",
      editData: null,
      notifications: [],
      dropdownValues: null,

      usr_typ: [],
    };
  }
  deleteNotification(record) {
    const isOk = window.confirm("Are you sure want to delete?");
    if (!isOk) return;
    // alert(record);
    const { time, user } = record;
    const endPointPost =
      userRole == "NM"
        ? `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=notif`
        : `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=notif&stscd=delete`;
    const config = {
      headers: {
        Authorization: token,
      },
    };
    var payLoad = { time, user };

    axios
      .post(endPointPost, payLoad, config)
      .then((x) => {
        message.success("deleted successfully");
        this.getNotificationsData();
        // window.location.reload();
      })
      .catch((err) => {
        alert("err");
      });
  }
  approveNotif(record) {
    // const { time, user } = record;
    console.log(record);
    const endPointPost = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=notif&stscd=approve`;
    console.log(endPointPost);

    const config = {
      headers: {
        Authorization: token,
      },
    };
    var payLoad = { time: record?.time, user: record?.user, status: "approve" };
    // { time:record?.time, user:record?.user, status: "approve" }
    axios
      .post(endPointPost, payLoad, config)
      .then((x) => {
        message.success(`Approved Succesfully`);
        this.getNotificationsData();
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    this.getNotificationsData();
    notificationService.getRowEditData().subscribe((data) => {
      console.log("=====>", data);
      if (data) {
        this.setState({ activeTab: "1", editData: data });
      }
    });
  }

  changeTab = (x) => {
    this.getNotificationsData();
    this.setState({ activeTab: "2", editData: null });
  };

  getNotificationsData = async () => {
    try {
      const endPoint =
        userRole == "NM"
          ? `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}?status=notif`
          : `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=notif`;
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.get(endPoint, config);
      console.log("check===>", res);
      if (res.status === 200) {
        const { notifications, dropdownValues } = res.data.body;
        const notificArray = notifications
          .filter((x) => !(x["user"] == "codes"))
          .map((d) => ({
            ...d,
          }));
        console.log("notificArray", notificArray);
        this.setState({
          buttonLoading: false,
          status: false,
          notifications: notificArray,
          dropdownValues: dropdownValues,
          usr_typ: JSON.parse('["customer","merchant","both"]'),
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
      console.log("Errobject", err);
      Modal.error({
        content: "Action Failed, Please report to Manager",
        onOk() {},
      });
    }
  };
  render() {
    return (
      <div>
        <Tabs
          activeKey={this.state.activeTab}
          type="card"
          size="large"
          onChange={(s) => {
            this.setState({ activeTab: s });
          }}
        >
          <TabPane tab="Trigger Notification" key="1" className="tab-height">
            {/* <UploadNotificationImages /> */}
            <NotificationForm
              editData={this.state.editData}
              dropdownValues={this.state.dropdownValues}
              userType={this.state.usr_typ}
              changeTab={(x) => this.changeTab(x)}
            />
          </TabPane>
          <TabPane tab="Sent notifications" key="2" className="tab-height">
            <SentNotifications
              notifications={this.state.notifications}
              deleteNotification={(record) => this.deleteNotification(record)}
              approveNotif={(record) => this.approveNotif(record)}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Notifications;
