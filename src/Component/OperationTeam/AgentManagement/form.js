import React from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Tooltip,
  Select,
  DatePicker,
  Divider,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { useForm } from "antd/lib/form/Form";

const ModalFormComponent = ({ onSignUp, loading, data, backToPage }) => {
  const children = [];

  let values = {};
  if (data) {
    values = {
      ...data,
      phone_number: data.contact,
    };
  }

  const disabledDate = (current) => {
    const startDate = moment().startOf("day");
    const endData = moment().subtract(30, "days");

    return current >= startDate || current < endData;
  };

  const [form] = Form.useForm();

  return (
    <Col className="m-2" lg={24} xs={24}>
      <div>
        <Row align="middle" justify="space-between" className="mb-4">
          <h3>Agents {data && data.name ? "Details" : "Sign up"}</h3>

          {data && data.name ? (
            <Button type="primary" shape="round" onClick={() => backToPage()}>
              Go Back
            </Button>
          ) : (
            ""
          )}
        </Row>
        <Col lg={12}>
          <Form
            form={form}
            onFinish={onSignUp}
            layout="vertical"
            initialValues={values}
          >
            <Row align="middle" justify="space-between">
              <Col lg={12} xs={22} className="m-1">
                {" "}
                <Form.Item
                  name="name"
                  label="Agent Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input Agent Name!",
                    },
                  ]}
                >
                  <Input placeholder="Agent Name" aria-label="Agent Name" />
                </Form.Item>
              </Col>

              <Col lg={12} xs={22} className="m-1">
                {" "}
                <Form.Item
                  label="Mobile Number"
                  name="phone_number"
                  rules={[
                    {
                      required: true,
                      pattern: new RegExp(/^[0-9]*$/i),
                      message: "must be number only!",
                    },
                    {
                      min: 10,
                      max: 10,
                      message: "Mobile Number should be exact 10.",
                    },
                  ]}
                >
                  <Input
                    placeholder="Mobile Number"
                    aria-label="Mobile Number"
                  />
                </Form.Item>
              </Col>

              <Col lg={12} xs={22} className="m-1">
                {" "}
                <Form.Item
                  label="Agent ID"
                  name="agent_id"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Agent ID" aria-label="Agent ID" />
                </Form.Item>
              </Col>

              <Col lg={12} xs={22} className="m-1">
                {" "}
                <Form.Item
                  label="Agent Area"
                  name="area"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Agent Area" aria-label="Agent Area" />
                </Form.Item>
              </Col>

              {data && data.name ? (
                ""
              ) : (
                <>
                  <Col lg={24}>
                    <Row>
                      <Col lg={12} xs={22} className="mr-4">
                        {" "}
                        <Form.Item
                          name="password"
                          label={
                            <Tooltip
                              placement="right"
                              color="#fc0c00"
                              title="Password Must contain 8 Characters, One UpperCase and One Alphabet Mandatory"
                            >
                              Password <InfoCircleOutlined className="ml-2" />
                            </Tooltip>
                          }
                          hasFeedback
                          rules={[
                            {
                              required: true,
                              message: "Please input Password!",
                            },
                            {
                              pattern: new RegExp(
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@.$!%*?&]+$/
                              ),
                              message:
                                "Must contain at least one number and one uppercase and lowercase letter",
                            },
                            {
                              min: 8,
                              message: "at least 8 or more characters",
                            },
                          ]}
                        >
                          <Input.Password />
                        </Form.Item>
                      </Col>

                      <Col lg={12} xs={22} className="m-1">
                        {" "}
                        <Form.Item
                          name="cpassword"
                          dependencies={["password"]}
                          hasFeedback
                          label="Confirm Password"
                          rules={[
                            {
                              required: true,
                              message: "Please confirm your password!",
                            },
                            ({ getFieldValue }) => ({
                              validator(rule, value) {
                                if (
                                  !value ||
                                  getFieldValue("password") === value
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  "Passwords do not match!"
                                );
                              },
                            }),
                          ]}
                        >
                          <Input.Password />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </>
              )}
            </Row>

            <Divider />

            <Row justify="end">
              <Button
                className="mr-4"
                type="default"
                shape="round"
                onClick={() => form.resetFields()}
              >
                Reset
              </Button>
              <Form.Item>
                <Button
                  id="signup"
                  htmlType="submit"
                  shape="round"
                  type="primary"
                  danger
                  size="medium"
                  loading={loading}
                >
                  {data && data.name ? "Update" : "SignUp"}
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Col>
      </div>
    </Col>
  );
};

export default ModalFormComponent;
