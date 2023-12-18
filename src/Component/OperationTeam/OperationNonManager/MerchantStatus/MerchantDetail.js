import React, { useEffect, useState } from "react";

import axios from "axios";
import moment from "moment";
import {
  Button,
  Row,
  Col,
  Table,
  Statistic,
  Skeleton,
  Divider,
  Tooltip,
  Empty,
} from "antd";
import { Redirect, withRouter } from "react-router";
import { removeSession } from "../../../../Utils/Session";
import ImageSlider from "../../../Common/ImageSlider";
const token = localStorage.getItem("token");
const empid = localStorage.getItem("emp_id");
const userRole = localStorage.getItem("loggedIn_user_role");

function MerchantDetails({ match, history }) {
  const [loading, setLoading] = useState(false);
  const [data, updateData] = useState({});

  const mrchid = match.params.mrch_id;

  const [inv, setInv] = useState([]);
  const [show, setshow] = useState(false);

  useEffect(() => {
    fetchMerchantsData();

    return () => {
      setshow(false);
    };
  }, []);

  const [images, setImages] = useState([]);
  const [visible, setVisible] = useState(false);

  const fetchMerchantsData = async () => {
    setLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm`;
      const res = await axios.get(endPoint, {
        headers: { authorization: token },
        params: {
          status: "id",
          mrchid,
        },
      });
      setLoading(false);
      updateData(res.data.body);
    } catch (err) {
      setLoading(false);
      if (err.response.status === 401) {
        removeSession();
      }
    }
  };

  const fetchMerchantsInv = async () => {
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm`;
      const { data } = await axios.get(endPoint, {
        headers: { authorization: token },
        params: {
          status: "inventory",
          mrchid,
        },
      });
      setshow(true);

      setInv(data.body.inventory);
    } catch (err) {
      if (err.response.status === 401) {
        removeSession();
      }
    }
  };

  const details = [
    { label: "Name", value: data.mrch_name },
    { label: "Contact Number", value: data.cntct_nbr },
    { label: "Merchant Status", value: data.mrch_sts },
    { label: "Shop Name", value: data.shp_nm },
    { label: "Shop Status", value: data.mrch_shp_sts_cd },
    { label: "Category", value: data.mrch_ctgy },
    { label: "Sub Category", value: data.mrch_sub_ctgy },
    { label: "Shop Area", value: data.shp_area },
    { label: "Shop Address", value: data.shp_adr },
    { label: "Shop Pincode", value: data.shp_pincd },
    { label: "GST Number", value: data.gst },
    { label: "Enrolled Date", value: moment(data.enroll_dt).format("lll") },
  ];

  const ctgry = data?.mrch_ctgy_cd;

  let Itemcolumns = [
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Price", dataIndex: "mrp", key: "mrp" },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (x) => (x ? x : "NA"),
    },
    { title: "Quantity", dataIndex: "qty", key: "qty" },
    {
      title: "Colors",
      dataIndex: "color",
      key: "color",
      render: (x) => (
        <Row>
          {x &&
            x.map((x) => (
              <span
                className="px-2 m-1 rounded shadow text-white"
                style={{ backgroundColor: x }}
              >
                {x}
              </span>
            ))}
        </Row>
      ),
    },
  ];

  if (ctgry == "70") {
    Itemcolumns = [
      ...Itemcolumns,
      {
        title: "Class Mode",
        dataIndex: "class_mode",
        key: "class_mode",
        render: (x) => (
          <Row>
            {x && x.map((y) => <span className="m-1 text-dark">{y},</span>)}
          </Row>
        ),
      },
      {
        title: "Class Duration",
        dataIndex: "class_duration",
        key: "class_duration",
      },
      {
        title: "Class Days",
        dataIndex: "class_days",
        key: "class_days",
        render: (x) => (
          <Row>
            {x && x.map((y) => <span className="m-1 text-dark">{y},</span>)}
          </Row>
        ),
      },
    ];
  }

  const artsLabel = {
    name: "Class Name",
    brand: "Tutor Name",
    size: "Class Size",
    mrp: "Fee",
  };

  const columns = [
    {
      title: ctgry == "70" ? artsLabel.name : "Item",
      dataIndex: "item",
      key: "item",
    },
    {
      title: ctgry == "70" ? artsLabel.brand : "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (x) =>
        x?.length > 15 ? (
          <Tooltip title={x}>
            <span>{`${x.substring(0, 15)} (see more..) `}</span>
          </Tooltip>
        ) : (
          x
        ),
      width: "10%",
    },
    {
      title: "Images",
      dataIndex: "itemImages",
      key: "itemImages",
      render: (x) => (
        <>
          {x && x.length > 0 ? (
            <p
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setImages(x);
                setVisible(true);
              }}
            >
              View Images
            </p>
          ) : (
            "No Images"
          )}
        </>
      ),
    },

    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (x) =>
        x ? (
          <span className="badge badge-success">Available</span>
        ) : (
          <span className="badge badge-danger">Out of stock</span>
        ),
    },
  ];

  const openEditMerchantForm = () => {
    history.push("/OperationTeam/Newsignups", {
      status: data?.sts_cd,
      mrch_id: data?.mrch_id,
    });
  };

  return (
    <div className="table-component">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col xs={14}>
          <h4>Merchant Details</h4>
        </Col>
        <Col xs={8}>
          <Row justify="end">
            <Button
              loading={loading}
              shape="round"
              size="small"
              onClick={() => history.goBack()}
              type="primary"
            >
              Go Back
            </Button>

            {
              <Button
                shape="round"
                size="small"
                onClick={() => {
                  openEditMerchantForm();
                }}
                type="primary"
              >
                Edit Details
              </Button>
            }
          </Row>
        </Col>
      </Row>

      {!loading ? (
        <Row>
          {details.map((item, index) => (
            <Col key={index} md={6}>
              <div className="m-2">
                <p className="mb-0">{item.label}</p>
                <h6 style={{ fontWeight: 500 }}>{item.value}</h6>
              </div>
            </Col>
          ))}

          <Col lg={24} className="mt-4">
            <Divider orientation="left">Shop Images</Divider>
            {data.shp_pics_url
              ? data.shp_pics_url.map((x, i) => (
                  <img
                    className="mr-2 mb-2 rounded border border-dark bg-secondary"
                    style={{
                      height: "150px",
                      width: "150px",
                      objectFit: "contain",
                    }}
                    key={i}
                    src={x}
                    alt="shop"
                  />
                ))
              : "No Images uploaded"}
          </Col>

          <Col lg={24} className="mt-4">
            {!show ? (
              <Button
                className="mb-4"
                onClick={fetchMerchantsInv}
                type="primary"
              >
                Show Inventory
              </Button>
            ) : inv?.length > 0 ? (
              inv.map((x, i) => (
                <div key={i} className="mt-3 mt-md-0">
                  <Divider orientation="left">Inventory</Divider>

                  <h5>
                    Items in{" "}
                    <span className="text-danger text-uppercase">
                      {" "}
                      {x.ctgy_name}{" "}
                    </span>
                  </h5>

                  <Col lg={24} className="table-overflow">
                    <Table
                      columns={columns}
                      expandable={{
                        expandedRowRender: (record) => (
                          <Table
                            columns={Itemcolumns}
                            dataSource={record.attributes}
                            pagination={false}
                          />
                        ),
                        rowExpandable: (record) =>
                          record.name !== "Not Expandable",
                      }}
                      dataSource={x.invtry_item}
                      pagination={false}
                    />
                  </Col>
                </div>
              ))
            ) : (
              "No Inventory Found!"
            )}
          </Col>
        </Row>
      ) : (
        <Skeleton round />
      )}

      <ImageSlider
        sliderVisible={visible}
        images={images}
        setSliderVisible={setVisible}
      />
    </div>
  );
}

export default withRouter(MerchantDetails);
