import React from "react";
import { Col, Row } from "antd";


export default function Page404() {
  return (
    <Col lg={24} style={{ marginTop: "5rem", marginBottom: "8rem" }}>
      <Row justify="center">
        <Col lg={8}>
          <div style={{height="300px"}} >Page not found</div>
        </Col>
      </Row>
    </Col>
  );
}
