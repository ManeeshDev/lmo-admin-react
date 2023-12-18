import React from "react";
import { Modal, Row } from "antd";
const ImagePopUp = (props) => {
  return (
    <Modal
      closable={true}
      visible={props.showImagePopup}
      footer={null}
      // style={{ top: 50 }}
      onCancel={() => {
        props.updatePopUpDisplay();
      }}
      className="image-popup"
    >
      <div style={{ padding: "0", overflow: "auto" }}>
        <Row justify="center">
          {!props.selectedImage.includes(".mp4") ? (
            <img style={{ width: "100%" }} src={props.selectedImage} />
          ) : (
            <video
              className="overview__generator--img"
              className="shadow rounded mx-1"
              controls
              controlsList="nodownload"
              style={{ width: "100%" }}
            >
              <source src={props.selectedImage} type="video/mp4" /> Your browser
              does not support the video tag.
            </video>
          )}
        </Row>
      </div>
    </Modal>
  );
};
export default ImagePopUp;
