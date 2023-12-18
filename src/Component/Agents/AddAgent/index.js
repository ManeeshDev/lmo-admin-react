import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Table,
} from "antd";

import Axios from "axios";
import moment from "moment";
import AreaSearch from "../../OperationTeam/OperationNonManager/AreaSearch";
import { useEffect } from "react";
import numeral from "numeral";
import ImageUploader from "../../Common/imageUploader";
import { ArrowLeftOutlined } from "@ant-design/icons";

const empid = localStorage.getItem("emp_id");
const token = localStorage.getItem("token");
const locale = localStorage.getItem("locale");

function AddAgent() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [view, setView] = useState("view");

  const [value, setValue] = useState({});

  const [data, setData] = useState([]);

  const [fields, setFields] = useState([]);

  const [agent, setAgent] = useState({});

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (view === "view") {
      fetchAgents();
      setAgent({});
      setImages([]);
    }

    if (agent.emp_id) {
      fetchImages();
    }

    form.resetFields();
  }, [view]);

  const columns = [
    {
      title: "Agent ID",
      dataIndex: "emp_id",
    },
    {
      title: "Name",
      dataIndex: "emp_name",
    },
    {
      title: "Contact",
      dataIndex: "contact",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Agent Area",
      dataIndex: "area_cd",
    },
    {
      title: "Action",
      dataIndex: "area_cd",
      render: (x, y) => (
        <Button
          onClick={() => {
            setAgent(y);
            setValue({ ...value, area_cd: agent.area_cd });
            setView("create");
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const newEmpId = `${empid}-${numeral(data.length + 1).format("000")}`;

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/agent/${empid}`;
      const res = await Axios.get(endPoint, {
        headers: { authorization: token },
        params: {
          agnt: "true",
        },
      });
      if (res.data?.body) {
        const { agnt_list, form } = res.data.body;
        setData(agnt_list);
        setFields(form.form);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/agent/${empid}`;
      const res = await Axios.get(endPoint, {
        headers: { authorization: token },
        params: {
          empid: agent && agent.emp_id ? agent.emp_id : newEmpId,
        },
      });
      if (res.data?.body) {
        const { key } = res.data.body;
        setImages(key);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const createEmployee = async (e) => {
    const emp = {
      ...e,
      ...value,
      area_cd: value.area_cd ? value.area_cd : agent.area_cd,
      start_date: moment(e.start_date).format("YYYY-MM-DD"),
      end_date: e.end_date ? moment(e.end_date).format("YYYY-MM-DD") : "",
      status: true,
      dept: locale,
    };

    try {
      const fetch = await Axios.post(
        `${process.env.REACT_APP_BASE_URL}/agent/${empid}`,
        emp,
        {
          headers: { authorization: token },
          params: {
            agnt: "true",
          },
        }
      );
      const response = fetch?.data?.body;

      if (response) {
        Modal.success({
          title: response,
          onOk() {
            window.location.reload();
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Row>
      <Col lg={24} className="mb-4">
        <Row justify="space-between">
          <h4>Agent Management</h4>

          {!agent.emp_id ? (
            <Radio.Group
              value={view}
              buttonStyle="solid"
              onChange={(e) => {
                setView(e.target.value);
              }}
            >
              <Radio.Button value="view">View List</Radio.Button>

              <Radio.Button value="create">Create New</Radio.Button>
            </Radio.Group>
          ) : (
            <Button
              type="primary"
              onClick={(e) => {
                window.location.reload();
              }}
            >
              <Row align="middle">
                <ArrowLeftOutlined className="mr-2" /> Go back
              </Row>
            </Button>
          )}
        </Row>
      </Col>
      {view === "create" ? (
        <Col lg={24}>
          <h6>Add Agent</h6>

          <Form
            form={form}
            layout="vertical"
            className="mt-3"
            onFinish={(e) =>
              images.length > 0
                ? createEmployee(e)
                : message.info("Please Upload Agent KYC")
            }
            initialValues={
              agent
                ? {
                    ...agent,
                    start_date: moment(agent.start_date),
                    end_date: agent.end_date ? moment(agent.end_date) : "",
                  }
                : {}
            }
          >
            <Row justify="space-between">
              {fields
                .filter((y) => !["status"].includes(y.key))
                .map((x, i) => (
                  <Col lg={7} key={i}>
                    {x.type === "text" ? (
                      x.key === "emp_id" ? (
                        <Form.Item
                          initialValue={newEmpId}
                          label={x.label}
                          name={x.key}
                        >
                          <Input disabled />
                        </Form.Item>
                      ) : x.key === "mgr_id" ? (
                        <Form.Item
                          initialValue={empid}
                          label={x.label}
                          name={x.key}
                        >
                          <Input disabled />
                        </Form.Item>
                      ) : (
                        <Form.Item label={x.label} name={x.key}>
                          <Input />
                        </Form.Item>
                      )
                    ) : x.type === "date" ? (
                      <Form.Item label={x.label} name={x.key}>
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    ) : x.type === "textArea" ? (
                      <Form.Item label={x.label} name={x.key}>
                        <Input.TextArea />
                      </Form.Item>
                    ) : x.type === "select" ? (
                      <Form.Item
                        rules={[{ required: x.required }]}
                        label={x.label}
                        name={x.key}
                      >
                        <Select style={{ width: "100%" }}>
                          {x.options.map((y, j) => (
                            <Select.Option value={y} key={j}>
                              {y}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    ) : x.type === "area_cd" ? (
                      <AreaSearch
                        label="Area"
                        businessAreas={agent.area_cd}
                        area_cd={(e) => console.log("object")}
                        area_vl={(e) => setValue({ ...value, area_cd: e })}
                      />
                    ) : (
                      ""
                    )}
                  </Col>
                ))}
            </Row>

            {images.length > 0 ? (
              <>
                <Divider orientation="left">Uploaded Images</Divider>
                <div>
                  {images.map((x, i) => (
                    <img
                      className="m-2"
                      src={x}
                      key={i}
                      alt="kyc"
                      style={{
                        height: "100px",
                        width: "100px",
                        objectFit: "contain",
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              ""
            )}

            <ImageUploader
              pathParams={{
                kyc: true,
                empid: agent && agent.emp_id ? agent.emp_id : newEmpId,
              }}
              path={`/agent/${empid}`}
              fetchData={fetchImages}
            />

            <Row className="my-4" align="middle">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>

              <Button
                className="ml-4"
                onClick={(e) => {
                  window.location.reload();
                }}
              >
                {" "}
                Cancel
              </Button>
            </Row>
          </Form>
        </Col>
      ) : (
        <Col lg={24}>
          <Spin spinning={loading}>
            <Table columns={columns} dataSource={data} />
          </Spin>{" "}
        </Col>
      )}
    </Row>
  );
}

export default AddAgent;
