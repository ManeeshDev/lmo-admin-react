import React from "react";
import { Modal, Form, Input, Button, Row } from "antd";

const ModalFormComponent = ({
  visible,
  onCancel,
  onCreate,
  loading,
  resendConfirmationCode,
}) => {
  return (
    <Modal
      onCancel={onCancel}
      visible={visible}
      title="OTP Verification"
      footer={null}
    >
      <Form onFinish={onCreate} layout="vertical">
        <div style={{ width: "35%", margin: "0 auto" }}>
          <Form.Item
            name="code"
            label="Enter OTP"
            rules={[
              {
                required: true,
                message: "Please input OTP!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <Row justify="space-between">
          <Button type="link" danger onClick={() => resendConfirmationCode()}>
            Resend Code again?
          </Button>

          <Form.Item>
            <Button
              loading={loading}
              danger
              htmlType="submit"
              shape="round"
              type="primary"
            >
              Submit
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalFormComponent;
