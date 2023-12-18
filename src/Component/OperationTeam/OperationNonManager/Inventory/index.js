import {
  AutoComplete,
  Badge,
  Button,
  Checkbox,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Select,
  Skeleton,
  Spin,
  Table,
  Tabs,
} from "antd";
import Axios from "axios";
import React, { useState } from "react";
import categoryList from "../../../../Utils/categoryList";
import { removeSession } from "../../../../Utils/Session";
import {
  DeleteFilled,
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import ImageUploader from "../../../Common/imageUploader";
import moment from "moment";
import { Link } from "react-router-dom";

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

const ctgyData = categoryList;

const userRole = localStorage.getItem("loggedIn_user_role");
const token = localStorage.getItem("token");
const empid = localStorage.getItem("emp_id");

const path = window.location.pathname;

const codes = [5800, 6000, 6500, 3000, 3100, 1900, 1800];

function Inventory() {
  const NMpage = path.includes("ContentTeam");

  const [loading, setLoading] = useState(false);

  const [view, setView] = useState(1);

  const [number, setNumber] = useState("");

  const [data, setData] = useState([]);

  const [subCtgyOptions, setSubCtgyOptions] = useState([]);

  const [ctgy, setCtgy] = useState();

  const [subctgy, setSubCtgy] = useState();

  const [mrch, setMrch] = useState(null);

  const [brands, setBrands] = useState([]);

  const [brand, setBrand] = useState("");

  const [sizes, setSizes] = useState([]);

  const [size, setSize] = useState("");

  const [searchItems, setSearchItems] = useState([]);

  const [assign, setAssign] = useState([]);

  const [verify, setVerify] = useState(false);

  const [stop, setStop] = useState(false);

  const [search, setSearch] = useState(false);

  const [imgData, setImgData] = useState({
    visible: false,
    data: null,
  });

  function handleChange(value) {
    setCtgy(value);
    const data = ctgyData.filter((x) => x.ctgy === value)[0].subCtgy;
    setSubCtgyOptions(data);
    setSubCtgy();
    setData();
  }

  const getSubctgyName = (val, ctgy) => {
    let result = "NA";
    const getCtgy = ctgyData.filter((x) => x.ctgy == ctgy);
    if (getCtgy.length > 0) {
      getCtgy.map((x) =>
        x.subCtgy.filter((y) => {
          if (y.code == val) {
            result = `${y.name}_${y.code}`;
          }
        })
      );
    }

    return result;
  };

  const fetchInventory = async (ctgy, subctgy) => {
    setLoading(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${userRole}/invtry`;
      const res = await Axios.get(endPoint, {
        headers: { authorization: token },
        params: {
          ctgy,
          subctgy,
        },
      });

      if (res?.data) {
        const { body } = res.data;

        const modify_subctgy = body.map((x) => {
          return {
            ...x,
            codes:
              x.subctgy_cd.length > 0
                ? x.subctgy_cd.map((y) => {
                    return getSubctgyName(y, ctgy);
                  })
                : [],
          };
        });
        setData(modify_subctgy);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        removeSession();
      }
    }

    setLoading(false);
  };

  const searchInventory = async (item) => {
    setSearch(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${userRole}/invtry`;
      const res = await Axios.get(endPoint, {
        headers: { authorization: token },
        params: {
          ctgy,
          item,
        },
      });

      if (res?.data) {
        const { body } = res.data;
        setSearchItems(body);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        removeSession();
      }
    }
    setSearch(false);
  };

  const fetchBrands = async (brand) => {
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${userRole}/brand`;
      const res = await Axios.get(endPoint, {
        headers: { authorization: token },
        params: {
          brand,
          ctg: ctgy,
        },
      });

      if (res?.data) {
        const { body } = res.data;
        if (body.length > 0) {
          setBrands(body.map((x) => x.brand));
        }
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        removeSession();
      }
    }
  };

  const createBrands = async () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);

    const body = {
      brand,
      id: randomNum.toString(),
      category: ctgy.toString(),
      item: "brand",
    };
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${userRole}/brand`;
      const res = await Axios.post(endPoint, body, {
        headers: { authorization: token },
      });

      if (res?.data?.body) {
        message.success("Brand created successfully");
        // setBrands([...brands, brand]);
      } else {
        message.error("action failed, Please add this brand later");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        removeSession();
      }
    }
  };

  const fetchSizes = async (size) => {
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${userRole}/size`;
      const res = await Axios.get(endPoint, {
        headers: { authorization: token },
        params: {
          size,
        },
      });

      if (res?.data) {
        const { body } = res.data;
        if (body.length > 0) {
          setSizes(body.map((x) => x.finalresult));
        }
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        removeSession();
      }
    }
  };

  const createSize = async () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);

    const body = {
      size,
      id: randomNum.toString(),
      category: "size",
    };
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${userRole}/size`;
      const res = await Axios.post(endPoint, body, {
        headers: { authorization: token },
      });

      if (res?.data?.body) {
        message.success("Size created successfully");
        // setBrands([...brands, brand]);
      } else {
        message.error("action failed, Please add this size later");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        removeSession();
      }
    }
  };

  const verifyMerchant = async (mrchid) => {
    setVerify(true);
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm`;
      const res = await Axios.get(endPoint, {
        headers: { authorization: token },
        params: {
          status: "id",
          mrchid,
        },
      });
      const { body } = res.data;
      setMrch(body);
      const check = codes.includes(body.sts_cd);
      if (check) {
        setStop(true);
      } else {
        const ctgycd = body.mrch_ctgy_cd;
        setCtgy(parseInt(ctgycd));

        const data = ctgyData.filter((x) => x.ctgy === ctgycd)[0].subCtgy;
        setSubCtgyOptions(data);

        setSubCtgy(parseInt(body.subctgy_cd));
        fetchInventory(ctgycd, body.subctgy_cd);
        setAssign([]);
      }
    } catch (err) {
      if (err.response.status === 401) {
        removeSession();
      }
    }
    setVerify(false);
  };

  const [show, setshow] = useState();

  const columns = [
    //select
    {
      title: (
        <div>
          {" "}
          <Button
            icon={<PlusOutlined />}
            size="small"
            type="primary"
            onClick={() =>
              setData([
                {
                  brand: "",
                  category: data.length > 0 ? data[0].category : "NA",
                  color: [],
                  description: "",
                  image_url: [],
                  item: "",
                  itemid: JSON.stringify(Date.now()),
                  size: [],
                  subctgy: data.length > 0 ? data[0].subctgy : [],
                  subctgy_cd: data.length > 0 ? data[0].subctgy_cd : [],
                  create: true,
                  codes:
                    data.length > 0
                      ? data[0].subctgy_cd.map((y) => {
                          return getSubctgyName(y, ctgy);
                        })
                      : [],
                },
                ...data,
              ])
            }
          ></Button>
        </div>
      ),
      dataIndex: "itemid",
      key: "itemid",
      render: (text, x) => (
        <div>
          <Checkbox
            disabled={view == 1}
            checked={assign.filter((t) => t.itemid === text).length > 0}
            onChange={(e) => {
              if (e.target.checked) {
                setAssign([...assign, x]);
              } else {
                let copy = [...assign];
                const idx = copy.findIndex((ix) => ix.itemid === text);
                copy.splice(idx, 1);
                setAssign(copy);
              }
            }}
          />
        </div>
      ),
    },
    //Item
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      render: (text, _, i) => (
        <AutoComplete
          value={text}
          style={{ width: 200 }}
          onSelect={(e) => {
            const item = JSON.parse(e);
            let copy = [...data];
            copy[0] = {
              ...item,
              codes:
                item.subctgy_cd.length > 0
                  ? item.subctgy_cd.map((y) => {
                      return getSubctgyName(y, ctgy);
                    })
                  : [],
            };
            setData(copy);
            setSearchItems([]);
          }}
          onSearch={(e) => searchInventory(e)}
          onChange={(e) => {
            handleSelect(e, "item", 0);
            setshow(i);
          }}
          placeholder="Search item"
        >
          {show === i
            ? searchItems.map((x, j) => (
                <Option key={j} value={JSON.stringify(x)}>
                  {x.item}
                </Option>
              ))
            : null}
        </AutoComplete>
      ),
    },
    //desc
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, _, index) => (
        <Input.TextArea
          style={{ minWidth: 120 }}
          name="description"
          onChange={(e) => handleChangeInput(e, index)}
          value={text}
        />
      ),
    },
    //brand
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (text, _, index) => (
        <Select
          value={text}
          style={{ minWidth: 180 }}
          showArrow={false}
          showSearch
          onSearch={(e) => {
            if (e.length > 0) fetchBrands(e);
          }}
          onChange={(e) => handleSelect(e, "brand", index)}
          dropdownRender={(menu) => (
            <div>
              {menu}
              <Divider style={{ margin: "4px 0" }} />
              <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
                <Input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  style={{ flex: "auto" }}
                />
                <a
                  style={{
                    flex: "none",
                    padding: "8px",
                    display: "block",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    createBrands();
                    setBrand("");
                    setBrands([...brands, brand]);
                  }}
                >
                  <PlusOutlined /> Add item
                </a>
              </div>
            </div>
          )}
        >
          {brands.map((item) => (
            <Option key={item}>{item}</Option>
          ))}
        </Select>
      ),
    },
    //size
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (text, _, i) => (
        <Select
          value={text}
          style={{ minWidth: 180 }}
          showArrow={false}
          showSearch
          mode="multiple"
          onSearch={(e) => {
            if (e.length > 0) fetchSizes(e);
          }}
          onChange={(e) => handleSelect(e, "size", i)}
          dropdownRender={(menu) => (
            <div>
              {menu}
              <Divider style={{ margin: "4px 0" }} />
              <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
                <Input
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  style={{ flex: "auto" }}
                />
                <a
                  style={{
                    flex: "none",
                    padding: "8px",
                    display: "block",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    createSize();
                    setSize("");
                    setSizes([...sizes, size]);
                  }}
                >
                  <PlusOutlined /> Add item
                </a>
              </div>
            </div>
          )}
        >
          {sizes.map((item) => (
            <Option key={item}>{item}</Option>
          ))}
        </Select>
      ),
    },
    //color
    // {
    //   title: "color",
    //   dataIndex: "color",
    //   key: "color",
    //   render: (text, _, i) => (
    //     <Select
    //       value={text}
    //       style={{ minWidth: 180 }}
    //       onChange={(e) => handleSelect(e, "color", i)}
    //       mode="multiple"
    //     >
    //       {[10, 20, 30, 40, 50, 60].map((x, i) => (
    //         <Option value={x} key={i}>
    //           {x}
    //         </Option>
    //       ))}
    //     </Select>
    //   ),
    // },
    //images
    {
      title: "Images",
      dataIndex: "image_url",
      key: "image_url",
      render: (text, data, index) => (
        <div>
          <Button
            type="link"
            onClick={() => setImgData({ visible: true, data, index })}
          >
            View{" "}
            <span className="mx-2">
              {" "}
              <Badge count={text.length} />
            </span>{" "}
            / upload
          </Button>
        </div>
      ),
    },
    //sub categories
    {
      title: "Sub categories",
      dataIndex: "codes",
      key: "codes",
      render: (text, data, i) => (
        <Select
          value={text}
          style={{ minWidth: 180 }}
          showArrow={false}
          showSearch
          mode="multiple"
          onChange={(e) => {
            handleSelect(e, "codes", i);
          }}
        >
          {subCtgyOptions.map((item) => (
            <Option key={item.code} value={`${item.name}_${item.code}`}>
              {`${item.name}_${item.code}`}
            </Option>
          ))}
        </Select>
      ),
    },
    //action
    {
      title: "Action",
      dataIndex: "color",
      key: "color",
      render: (color, data) => (
        <Row>
          <Button
            className="ml-4"
            onClick={() => createAction(data)}
            type="primary"
            shape="round"
          >
            {data.create ? "Create" : "Update"}
          </Button>
        </Row>
      ),
    },
  ];

  const handleChangeInput = (e, i) => {
    let copy = [...data];
    copy[i][e.target.name] = e.target.value;

    setData(copy);
  };

  const handleSelect = (e, name, i) => {
    let copy = [...data];
    copy[i][name] = e;

    setData(copy);
  };

  const assignAction = async (val) => {
    setVerify(true);
    const randomNum = Math.floor(100000 + Math.random() * 900000);

    let nameExist = 0;

    const invtry_item = assign.map((y, i) => {
      const {
        brand,
        category,
        color,
        description,
        itemid,
        image_url,
        item,
        size,
      } = y;

      if (!item) {
        nameExist++;
      } else if (size.length === 0) {
        nameExist++;
      }

      const imgs =
        image_url.length > 0
          ? image_url.map((x) => {
              return {
                image_url: x,
              };
            })
          : [];

      return {
        brand,
        created_timestamp: Date.now(),
        ctgy_name: category,
        description: description ? description : "NA",
        item,
        itemImages: imgs,
        item_id: itemid,
        key: randomNum + i,
        stock: false,
        updated_timestamp: Date.now(),
        attributes: size.map((x) => {
          return {
            color,
            discount: "",
            mrp: "",
            qty: 1,
            size: x,
            tax: "",
          };
        }),
      };
    });

    const itemObj = {
      updated_timestamp: Date.now(),
      created_timestamp: Date.now(),
      inventory: [
        {
          ctgy_name: `LMO Inventory - ${moment().format("DD/MM/YYYY")}`,
          ctgyid: JSON.stringify(Date.now()),
          invtry_item,
        },
      ],
    };

    if (!stop)
      if (nameExist === 0) {
        try {
          const endPoint = `${process.env.REACT_APP_BASE_URL}/${userRole}/mrch`;
          const res = await Axios["post"](endPoint, itemObj, {
            headers: { authorization: token },
            params: {
              subctgy: mrch.subctgy_cd,
              mrch: val,
            },
          });

          if (res?.data) {
            const { body } = res.data;
            if (body) {
              message.success(body);
              window.location.reload();
            }
          }
        } catch (error) {
          if (error?.response?.status === 401) {
            removeSession();
          }
        }
      } else {
        message.info(
          "Please Make sure all Items have Item name and atleast one size"
        );
      }
    else message.error("Cannot Assign, as merchant is not eligible");
    setVerify(false);
  };

  const createAction = async (e) => {
    setLoading(true);

    const {
      color,
      brand,
      size,
      description,
      image_url,
      item,
      category,
      itemid,
      create,
      codes,
    } = e;

    let allCodes = [],
      allNames = [];

    codes.map((x) => {
      const str = x.split("_");
      if (str.length > 0) {
        const code_ = str[1];
        const name_ = str[0];
        allCodes.push(code_);
        allNames.push(name_);
      }
    });

    const body = {
      color,
      brand: brand ? brand : "NA",
      size: size,
      dscrp: description ? description : "NA",
      sub_categories: allNames,
      categoryvalue: category,
      imageurl: image_url,
      sub_category_cd: allCodes,
      item,
      id: itemid,
      category: ctgy.toString(),
    };

    const method = create ? "post" : "put";

    delete body["create"];

    if (item && size.length > 0) {
      try {
        const endPoint = `${process.env.REACT_APP_BASE_URL}/${userRole}/invtry`;
        const res = await Axios[method](endPoint, body, {
          headers: { authorization: token },
        });

        if (res?.data) {
          const { body } = res.data;
          if (body) {
            message.success(body);
            setImgData({ visible: false, data: [] });
          }
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          removeSession();
        }
      }
    } else {
      message.error(
        "Cannot create empty Item, please enter Item name and size"
      );
    }

    setLoading(false);
  };

  const checkCode = codes.includes(mrch?.sts_cd);

  return (
    <div>
      <Row justify="space-between">
        <h4>Inventory</h4>
      </Row>
      <hr className="my-2" />

      <Col lg={24} className="mb-4">
        <Tabs
          defaultActiveKey={view}
          onChange={(e) => {
            setView(e);
            setData([]);
            setCtgy();
            setSubCtgy();
            setAssign([]);
            setNumber();
          }}
        >
          <TabPane tab="Own Inventory" key={1}>
            <Row>
              <div>
                <label className="d-block">Select Category</label>
                <Select
                  value={ctgy}
                  style={{ width: 200 }}
                  onChange={handleChange}
                >
                  {ctgyData.map((x, i) => (
                    <Option value={x.ctgy} key={i}>
                      {x.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="ml-3">
                <label className="d-block">Select Sub Category</label>
                <Select
                  value={subctgy}
                  style={{ width: 200 }}
                  onChange={(e) => {
                    fetchInventory(ctgy, e);
                    setSubCtgy(e);
                  }}
                >
                  {subCtgyOptions.map((x, i) => (
                    <Option value={x.code} key={i}>
                      {x.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </Row>
          </TabPane>
          {!NMpage ? (
            <TabPane tab="Assign to Merchant" key={2}>
              <Row justify="space-between">
                <Col lg={8}>
                  <Search
                    placeholder="Enter Merchant ID"
                    allowClear
                    value={number}
                    loading={verify}
                    enterButton={
                      <>
                        Assign
                        <Badge className="ml-2" count={assign.length} />
                      </>
                    }
                    size="large"
                    onChange={(e) => {
                      const { value } = e.target;
                      setNumber(value);
                      if (value.length === 10) {
                        verifyMerchant(value);
                      }
                    }}
                    onSearch={(e) => assignAction(e)}
                  />
                </Col>

                {mrch?.sts_cd ? (
                  <Col lg={10} className="ml-2">
                    <div
                      className="text-center py-2 shadow rounded"
                      style={{
                        background: !checkCode ? "#A5D6A7" : "#FFAB91",
                      }}
                    >
                      {!checkCode ? (
                        <Row justify="space-between">
                          <Col lg={12}>
                            <span>Category</span>: <b>{mrch?.mrch_ctgy}</b>
                          </Col>
                          <Col lg={12}>
                            <span>Sub Category</span>:{" "}
                            <b>{mrch?.mrch_sub_ctgy}</b>{" "}
                          </Col>
                        </Row>
                      ) : (
                        "Cannot Add Inventory"
                      )}
                    </div>
                  </Col>
                ) : (
                  ""
                )}
              </Row>
            </TabPane>
          ) : (
            ""
          )}{" "}
        </Tabs>
      </Col>

      <Spin spinning={loading}>
        <Col lg={24} className="table-overflow">
          <Table
            pagination={{ defaultPageSize: 100 }}
            columns={columns}
            dataSource={data}
          />
        </Col>
      </Spin>

      <Modal
        title={
          <span>
            Images for Item
            <b className="text-danger"> {imgData?.data?.item}</b>
          </span>
        }
        centered
        okText="Save Changes"
        visible={imgData.visible}
        onOk={() => createAction(data[imgData.index])}
        onCancel={() => setImgData({ visible: false, data: null })}
        width={800}
      >
        <Spin spinning={loading}>
          <Row>
            {imgData?.data?.image_url?.length > 0
              ? imgData?.data?.image_url.map((x, i) => (
                  <div className="position-relative m-1">
                    <img
                      className=" rounded bg-secondary"
                      key={i}
                      style={{
                        width: "125px",
                        height: "125px",
                        objectFit: "contain",
                      }}
                      src={x}
                    />
                    <Row
                      className="bg-light p-1 text-danger rounded shadow position-absolute"
                      style={{ top: 0, right: 0 }}
                    >
                      <DeleteFilled
                        onClick={(e) => {
                          let copy = [...data];

                          const imgIdx = copy[
                            imgData.index
                          ].image_url.findIndex((img) => img === x);

                          copy[imgData.index].image_url.splice(imgIdx, 1);
                          setData(copy);
                        }}
                      />
                    </Row>
                  </div>
                ))
              : "No Images"}
          </Row>
          <ImageUploader
            clear={true}
            returnImage={(e) => {
              let copy = [...data];
              const imgs = copy[imgData.index].image_url;
              copy[imgData.index].image_url = [...imgs, e];
              setData(copy);
            }}
            pathParams={{ ctgy }}
            path={`${userRole}/invtryimg`}
          />
        </Spin>
      </Modal>
    </div>
  );
}

export default Inventory;
