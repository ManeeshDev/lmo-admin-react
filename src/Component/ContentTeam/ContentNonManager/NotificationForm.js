import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Switch,
  TimePicker,
  DatePicker,
  InputNumber,
  Modal,
  message,
} from "antd";
import moment from "moment";
import UploadNotificationImage from "./uploadNotificationImages";

const { RangePicker } = DatePicker;
const { Option } = Select;
const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 8,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 2,
    span: 10,
  },
};

export const NotificationForm = (props) => {
  const [form] = Form.useForm();
  const [scheduleTime, setScheduleTime] = useState(
    moment("00:00:00 pm", "HH:mm:ss")
  );
  const [schedule, setSchedule] = useState(false);
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
  const [imageurl, setImageUrl] = useState(null);
  const [apiData, setApiData] = useState({});
  const [showUpload, setShowUpload] = useState(true);
  const [mobileNums, setMobileNums] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [confirmType, setConfirmType] = useState("");
  const [existTime, setExistTime] = useState("");
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (confirmType == form.getFieldValue("user")) {
      setSubmitButtonClicked(!submitButtonClicked);
      setIsModalVisible(false);
    } else {
      // alert("Please select the type you already choosen !");
      message.warning("Please select the type you already choosen !");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFinish = (values) => {
    showModal();
    setApiData({
      ...values,
      time: schedule ? (isEdit ? existTime : scheduleTime) : null,
      imageurl: imageurl,
      updatedAt: Date.now(),
      createdAt: Date.now(),
      mobile: mobileNums,
    });
  };

  const onReset = () => {
    form.resetFields();
    setSchedule(false);
    setEdit(false);
    setExistTime("");
    setSchedule(false);
    setMobileNums([]);
    setImageUrl(null);
  };
  const onSchedule = (value) => {
    setSchedule(value);
  };

  const onScheduleTimeChange = (time, timestring) => {
    // alert(moment(timestring, "HH:mm:ss"));
    setScheduleTime(moment(timestring, "HH:mm:ss"));
    // alert(moment(timestring, "HH:mm:ss"));
    form.setFieldsValue({ time: moment(timestring, "HH:mm:ss") });
  };

  useEffect(() => {
    if (props.editData) {
      setEdit(true);
      const {
        msg,
        time,
        state,
        subtitle,
        title,
        user,
        schedule,
        screen,
        imageurl,
        freq,
        mobile,
      } = props.editData;

      time && setSchedule(true);
      setMobileNums(mobile || []);
      setExistTime(time);
      // alert(moment(new Date(time).toLocaleTimeString("en-US"), "HH:mm:ss"));
      // setScheduleTime(null);
      // setScheduleTime(
      //   moment(new Date().toLocaleTimeString("en-US"), "HH:mm:ss")
      // );
      // setScheduleTime(
      //   moment(new Date(time).toLocaleTimeString("en-US"), "HH:mm:ss")
      // );
      setScheduleTime(moment(time, "HH:mm:ss a"));
      setImageUrl(imageurl);
      form.setFieldsValue({
        msg,
        subtitle,
        title,
        user,
        state,
        screen,
        freq,
        time: moment(new Date(time).toLocaleTimeString("en-US"), "HH:mm:ss a"),
      });
    } else {
      onReset();
    }
  }, [props.editData]);
  function onChange(value, dateString) {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  }

  function onOk(value) {
    // alert(moment("00:00:00 pm", "HH:mm:ss"));
    setScheduleTime(moment(value, "HH:mm:ss"));
    form.setFieldsValue({ time: moment(value, "HH:mm:ss") });

    console.log("onOk: ", value);
  }

  function addMobileNumbers() {
    setMobileNums([...mobileNums, ""]);
  }
  const onMobileChange = (e, i) => {
    setMobileNums(mobileNums.map((x, y) => (y == i ? e.target.value : x)));
  };
  return (
    <>
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item
          name="msg"
          label="Message"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="subtitle"
          label="SubTitle"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="screen"
          label="Screen"
          rules={[
            {
              required: true,
            },
          ]}
        >
          {/* <Input /> */}
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            {props.dropdownValues?.screen?.map((x) => (
              <Option value={x}>{x}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="user"
          label="Type"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            {props.userType.map((opt) => (
              <Option value={opt}>{opt}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="freq"
          label="Frequency"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
            mode="multiple"
          >
            {props.dropdownValues?.freq?.map((x) => (
              <Option value={x}>{x}</Option>
            ))}
          </Select>
        </Form.Item>
        {mobileNums.map((item, i) => {
          return (
            <Form.Item
              name={`Mobile ${i + 1}`}
              label={`Mobile ${i + 1}`}
              rules={[
                {
                  required: false,
                },
              ]}
            >
              {" "}
              <Input value={item} onChange={(e) => onMobileChange(e, i)} />
              <Button
                onClick={() => {
                  setMobileNums(mobileNums.filter((c, d) => !d == i));
                }}
              >
                Remove
              </Button>
            </Form.Item>
          );
        })}

        <Form.Item {...tailLayout}>
          <Button
            onClick={addMobileNumbers}
            style={{ marginLeft: 37 }}
            type="primary"
          >
            + Add Mobile No
          </Button>
        </Form.Item>

        <Form.Item
          name="state"
          label="State"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
            mode="multiple"
          >
            {props.dropdownValues?.states?.map((x) => (
              <Option value={x.displayName}>{x.code}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Schedule"
          label="Schedule"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Switch checked={schedule} disabled={isEdit} onChange={onSchedule} />
        </Form.Item>

        {schedule && (
          <Form.Item
            name="time"
            label="Schedule Time"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <DatePicker
              onChange={onScheduleTimeChange}
              onOk={onOk}
              use12Hours
              disabled={isEdit}
              defaultValue={scheduleTime}
              showTime={{ format: "HH:mm:ss a" }}
            />
          </Form.Item>
        )}
        <Form.Item>
          <UploadNotificationImage
            submit={submitButtonClicked}
            clickType={!!props.editData}
            apiData={apiData}
            imageurl={imageurl}
            changeTab={(x) => props.changeTab(x)}
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 15 }}>
            {!isEdit ? "Submit" : "Update"}
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Confirm"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form.Item
          label="Enter the type"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
            showSearch
            onChange={(value) => setConfirmType(value)}
          >
            {props.userType.map((opt) => (
              <Option value={opt}>{opt}</Option>
            ))}
          </Select>
        </Form.Item>
      </Modal>
    </>
  );
};
