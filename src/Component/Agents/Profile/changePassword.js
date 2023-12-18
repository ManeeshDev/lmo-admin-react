import React, { useState } from "react";
import { Form, Input, Col, Button, message, Row } from "antd";
import { Auth } from "aws-amplify";
import Amplify from "aws-amplify";
import { removeSession } from "../../../Utils/Session";

function ChangePassword(props) {
  Amplify.configure({
    Auth: {
      region: process.env.REACT_APP_AGENT_COGNITO_USER_POOL_REGION,
      userPoolId: process.env.REACT_APP_AGENT_COGNITO_USER_POOL_ID,
      userPoolWebClientId:
        process.env.REACT_APP_AGENT_COGNITO_USER_POOL_WEB_CLIENT_ID,
    },
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    console.log(e);

    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log(user, "user");
        return Auth.changePassword(user, e.oldPassword, e.newPassword);
      })
      .then((data) => {
        message.loading("Passowrd Changed Successfully, Please Login again", 2);

        setTimeout(() => {
          removeSession();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });

    setLoading(false);
  };

  return (
    <Col lg={8} className="ml-0 ml-md-4">
      <Form scrollToFirstError onFinish={handleSubmit}>
        <label>
          <strong> Old Password:</strong>
        </label>
        <Form.Item
          name="oldPassword"
          rules={[
            {
              required: true,
              message: "Please input current Password!",
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
          <Input.Password size="large" />
        </Form.Item>
        <label>
          <strong> New Password:</strong>
        </label>
        <Form.Item
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Please input new Password!",
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
          hasFeedback
        >
          <Input.Password size="large" />
        </Form.Item>
        <label>
          <strong>Confirm Password:</strong>
        </label>
        <Form.Item
          name="confirm"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }

                return Promise.reject("Passwords do not match!");
              },
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item>
          <Button loading={loading} htmlType="submit" type="primary" danger>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Col>
  );
}
export default ChangePassword;
