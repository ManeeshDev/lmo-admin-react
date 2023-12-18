import React, { useRef } from "react";
import { Modal, Row, Carousel, Col } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

const ImageSlider = ({ sliderVisible, images, setSliderVisible }) => {
  const slider = useRef(null);

  return (
    <Modal
      closable={true}
      visible={sliderVisible}
      footer={null}
      onCancel={() => {
        setSliderVisible(!sliderVisible);
      }}
      style={{ top: 10 }}
    >
      <Row justify="center">
        <Col lg={24} className="position-relative image-container">
          <Carousel ref={slider} autoplay effect="fade">
            {images && images.length > 0 ? (
              images.map((itm, ndx) => (
                <div key={ndx} className="d-flex justify-content-center">
                  {itm.image_url.includes("mp4") ? (
                    <video
                      className="overview__generator--img"
                      className="shadow rounded mx-1"
                      controls
                      controlsList="nodownload"
                      style={{ width: "100%" }}
                    >
                      <source src={itm.image_url} type="video/mp4" /> Your
                      browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      className="image_popup bg-secondary"
                      src={itm.image_url}
                      alt="itemVIew"
                    />
                  )}
                </div>
              ))
            ) : (
              <Row className="mt-5" justify="center">
                <img src={process.env.REACT_APP_NO_PREVIEW_IMAGE} alt="loder" />
              </Row>
            )}
          </Carousel>
          {images.length > 1 ? (
            <div className="slide-btns">
              <div className="left-btn" onClick={() => slider.current.prev()}>
                <ArrowLeftOutlined className="mr-2" />
                {"Prev"}
              </div>
              <div className="right-btn" onClick={() => slider.current.next()}>
                {"Next"} <ArrowRightOutlined className="ml-2" />
              </div>
            </div>
          ) : (
            ""
          )}
        </Col>
      </Row>
    </Modal>
  );
};
export default ImageSlider;
