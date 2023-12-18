import { Button, Col, Row } from "antd";
import React from "react";
import { QRCode } from "react-qrcode-logo";

import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

import "../../../assets/css/qrcode.css";

function GenerateQR() {
  const merchants = [
    {
      id: "7569908379",
      name: `Jai Matha Glass House`,
    },
    {
      id: "8374059598",
      name: `RK DISTRIBUTORS`,
    },
  ];

  const onButtonClick = () => {
    return merchants.map((x, i) => {
      let domElement = document.getElementById(`my-node-${i}`);
      htmlToImage
        .toPng(domElement)
        .then(function (dataUrl) {
          console.log(dataUrl);
          const pdf = new jsPDF();
          pdf.addImage(dataUrl, "PNG", 0, 0);
          pdf.save(`${Date.now()}.pdf`);
        })
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        });
    });
  };

  return (
    <div>
      <Row justify="space-between">
        <h4>Generate QR codes</h4>

        <Button shape="round" type="primary" onClick={onButtonClick}>
          Generate
        </Button>
      </Row>
      <hr />
      <Row className="mt-3" justify="center">
        <Col>
          {merchants.map((x, i) => (
            <div id={`my-node-${i}`} key={i} className="qr-wrapper">
              <div>
                <div className="d-flex align-items-center justify-content-center">
                  <img src={require("./whitelogo.png")} />
                </div>
                <h1 className="mt-3 text-center text-white mb-0">{x.name}</h1>

                <div className="mt-3 text-center">
                  <h4 className=" text-white">Scan and Shop</h4>
                  <Row justify="center" className="mt-3">
                    <QRCode
                      value={`https://yourlmo.com/${x.id}`}
                      qrStyle="dots"
                    />
                  </Row>
                </div>
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
}

export default GenerateQR;
