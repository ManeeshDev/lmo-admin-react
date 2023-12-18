import React from "react";
import { Modal, Form, Input, Button, Row } from "antd";

const ModalFormComponent = ({
  visible,
  onCancel,
  onCreate,
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
        <Form.Item name="code" label="OTP">
          <Input />
        </Form.Item>

        <Row justify="end">
          <Button type="link" onClick={() => resendConfirmationCode()}>
            Resend Code again?
          </Button>
        </Row>

        <Form.Item>
          <Button htmlType="submit" shape="round" type="primary">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalFormComponent;
