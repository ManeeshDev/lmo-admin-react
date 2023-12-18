import React from "react";
import { Modal, Form, Input, Button, Row } from "antd";

const ForgotPassword = ({
  visible,
  onCancel,
  onCreate,
  setPassword,
  loading,
  resendConfirmationCode,
}) => {
  return (
    <Modal
      onCancel={onCancel}
      visible={visible}
      title="Forgot Password"
      footer={null}
    >
      <Form
        onFinish={onCreate}
        layout="vertical"
        style={{ padding: "1rem 3rem 3rem 3rem" }}
      >
        <Form.Item name="username" label="Mobile Number">
          <Input placeholder="Enter Mobile Number" />
        </Form.Item>

        {setPassword ? (
          <>
            <Form.Item name="new_password" label="New Password">
              <Input.Password />
            </Form.Item>

            <Form.Item name="code" label="OTP">
              <Input />
            </Form.Item>

            <Row justify="end">
              <Button type="link" onClick={() => resendConfirmationCode()}>
                Resend Code again?
              </Button>
            </Row>
          </>
        ) : (
          ""
        )}
        <Form.Item>
          <Button
            loading={loading}
            htmlType="submit"
            shape="round"
            type="primary"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ForgotPassword;
