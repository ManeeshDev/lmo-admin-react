import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
  Tag,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

import Highlighter from "react-highlight-words";
import Axios from "axios";
import moment from "moment";
import { RefreshToken } from "../../Common/Login";
import numeral from "numeral";
import AreaSearch from "../../OperationTeam/OperationNonManager/AreaSearch";
import ImageUploader from "../../Common/imageUploader";

const token = localStorage.getItem("token");
const empid = localStorage.getItem("emp_id");

function HRHome() {
  const [form] = Form.useForm();

  const [view, setView] = useState("view"); // view or create

  // for storing dept & subdept select values---
  const [value, setValue] = useState({
    dept: "",
    sub_dept: "",
  });

  const [empId, setEmpId] = useState("");

  const [data, setData] = useState([]); // full data

  const [departments, setDepartments] = useState([]); // only departments

  const [employees, setemployees] = useState([]); // only employess

  const [subDept, setSubDept] = useState([]); // sub_dept based on dept selected

  const [fields, setFields] = useState([]); // form fields

  const [loading, setLoading] = useState(false);

  const [employee, setEmployee] = useState({}); // single employee to view and update

  const [images, setImages] = useState([]);

  //for departments data sub_dept toggle
  const [click, setClick] = useState(null);

  // table search code---
  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
    searchInput: "",
  });

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            state.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => state.searchInput.select());
      }
    },
    render: (text) =>
      state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({ searchText: "" });
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "emp_id",
      ...getColumnSearchProps("emp_id"),
    },
    {
      title: "Employee Name",
      dataIndex: "emp_name",
      ...getColumnSearchProps("emp_name"),
    },

    {
      title: "Employee Address",
      dataIndex: "address",
      render: (text, x) => (
        <span>
          {text}, {x.shp_area}
        </span>
      ),
    },
    {
      title: "Manager",
      dataIndex: "imm_manager",
    },
    {
      title: "Department",
      dataIndex: "dept",
      render: (text, x) => (
        <span>
          {text}, {x.sub_dept}
        </span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Joining Date",
      dataIndex: "start_date",
      render: (text) => <span>{moment(text).format("ll")}</span>,
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (text, x) => (
        <Button
          type="primary"
          onClick={() => {
            const mrktngFolks = !departments.includes(x.dept);
            setView("create");
            if (mrktngFolks) {
              setValue({
                dept: "Marketing",
                sub_dept: "Franchise",
              });
            } else {
              setValue({
                dept: x.dept,
                sub_dept: x.sub_dept,
              });
            }

            const items = mrktngFolks
              ? data.filter((y) => y.dept === "Marketing")
              : data.filter((y) => y.dept === x.dept);
            data.filter((y) => console.log(y.dept === x.dept, y.dept, x.dept));
            if (items?.length > 0) {
              const newData = JSON.parse(items[0]?.sub_dept);
              const formKeys = items[0]?.form;
              setSubDept(newData);
              setFields(formKeys);
            }

            setEmployee(x);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (view === "view") {
      fetchEmployees();
    }

    if (employee.emp_id) {
      fetchImages();
    }
  }, [view]);

  const fetchEmployees = async (code) => {
    setLoading(true);
    try {
      const fetch = await Axios.get(`${process.env.REACT_APP_BASE_URL}/hr`, {
        headers: { authorization: token },
      });
      const response = fetch?.data?.body?.Items;

      const depts = response?.filter((x) => x.emp_id === "dept");
      const deptsNames = depts.map((x) => x.dept);
      const empData = response?.filter((x) => x.emp_id !== "dept");
      setDepartments(deptsNames);
      setemployees(empData);
      setData(depts);
    } catch (error) {
      if (error.response.status === 401) {
        RefreshToken();
      }
    }
    setLoading(false);
  };

  const createEmployee = async (e) => {
    const emp = {
      ...e,
      ...value,
      start_date: moment(e.start_date).format("YYYY-MM-DD"),
      end_date: e.end_date ? moment(e.end_date).format("YYYY-MM-DD") : "",
      emp_id: employee.emp_id ? employee.emp_id : empId,
      status: true,
    };

    try {
      const fetch = await Axios.post(
        `${process.env.REACT_APP_BASE_URL}/hr`,
        emp,
        {
          headers: { authorization: token },
        }
      );
      const response = fetch?.data?.body;
      console.log(fetch);
      if (response) {
        Modal.success({
          title: response,
          onOk() {
            window.location.reload();
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchImages = async () => {
    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/hr/${empid}`;
      const res = await Axios.get(endPoint, {
        headers: { authorization: token },
        params: {
          empid: employee && employee.emp_id ? employee.emp_id : empId,
          status: true,
        },
      });
      if (res.data?.body) {
        const { key } = res.data.body;
        setImages(key);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh" }}>
      <Tabs>
        <Tabs.TabPane key="1" tab="Employees">
          <Row justify="space-between">
            <h4>
              {view === "view" ? "Employees List" : "Create New Employee"}{" "}
            </h4>
            {view === "create" ? (
              <Button onClick={() => window.location.reload()}>Go back</Button>
            ) : (
              <Radio.Group
                value={view}
                buttonStyle="solid"
                onChange={(e) => setView(e.target.value)}
              >
                <Radio.Button value="view">View List</Radio.Button>
                <Radio.Button value="create">Create New</Radio.Button>
              </Radio.Group>
            )}{" "}
          </Row>
          <Row justify="center">
            {view === "create" ? (
              <Col lg={14} className="mb-5">
                <label className="d-block">Select Department</label>
                <Select
                  value={value.dept}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    setValue({ sub_dept: "", dept: e });
                    const items = data.filter((x) => x.dept === e);
                    if (items?.length > 0) {
                      const data = JSON.parse(items[0]?.sub_dept);
                      const formKeys = items[0]?.form;
                      setSubDept(data);
                      setFields(formKeys);
                    }

                    const dep = e.split(" ");

                    let depId;
                    if (dep?.length > 1) {
                      depId = `${dep[0].charAt(0)}${dep[1].charAt(0)}`;
                    } else {
                      depId = `${dep[0].slice(0, 2).toUpperCase()}`;
                    }

                    const emp_id = `LM${depId}${numeral(
                      employees?.length + 1
                    ).format("000")}`;

                    setEmpId(emp_id);
                  }}
                >
                  {departments.map((x, i) => (
                    <Select.Option key={i} value={x}>
                      {x}
                    </Select.Option>
                  ))}
                </Select>

                <label className="d-block mt-4">Select Sub Department</label>
                <Select
                  value={value.sub_dept}
                  style={{ width: "100%" }}
                  onChange={(e) => setValue({ ...value, sub_dept: e })}
                >
                  {subDept.map((x, i) => (
                    <Select.Option key={i} value={x}>
                      {x}
                    </Select.Option>
                  ))}
                </Select>

                <Form
                  form={form}
                  layout="vertical"
                  className="mt-3"
                  initialValues={
                    employee
                      ? {
                          ...employee,
                          start_date: moment(employee.start_date),
                          end_date: employee.end_date
                            ? moment(employee.end_date)
                            : null,
                        }
                      : {}
                  }
                  onFinish={createEmployee}
                >
                  <Row justify="space-between">
                    {fields
                      .filter((y) => !["status"].includes(y.key))
                      .map((x, i) => (
                        <Col lg={11} key={i}>
                          {x.type === "text" ? (
                            x.key === "emp_id" ? (
                              <Form.Item
                                initialValue={
                                  employee.emp_id ? employee.emp_id : empId
                                }
                                label={x.label}
                                name={x.key}
                              >
                                <Input disabled />
                              </Form.Item>
                            ) : (
                              <Form.Item label={x.label} name={x.key}>
                                <Input />
                              </Form.Item>
                            )
                          ) : x.type === "date" ? (
                            <Form.Item label={x.label} name={x.key}>
                              <DatePicker
                                format={"DD-MM-YYYY"}
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          ) : x.type === "textArea" ? (
                            <Form.Item label={x.label} name={x.key}>
                              <Input.TextArea />
                            </Form.Item>
                          ) : x.type === "select" ? (
                            <Form.Item
                              rules={[{ required: x.required }]}
                              label={x.label}
                              name={x.key}
                            >
                              <Select style={{ width: "100%" }}>
                                {x.options.map((y, j) => (
                                  <Select.Option value={y} key={j}>
                                    {y}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          ) : x.type === "area_cd" ? (
                            <AreaSearch
                              label="Area"
                              area_cd={(e) =>
                                setValue({ ...value, area_cd: e })
                              }
                            />
                          ) : (
                            ""
                          )}
                        </Col>
                      ))}
                  </Row>

                  {images?.length > 0 ? (
                    <>
                      <Divider orientation="left">Uploaded Images</Divider>
                      <div>
                        {images.map((x, i) => (
                          <img
                            className="m-2"
                            src={x}
                            key={i}
                            alt="kyc"
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "contain",
                            }}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  {value.dept ? (
                    <ImageUploader
                      pathParams={{
                        kyc: true,
                        empid: empId,
                        dept: value.dept,
                      }}
                      path="hr"
                      fetchData={fetchImages}
                    />
                  ) : (
                    ""
                  )}

                  <Row>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>

                    <Button
                      className="ml-4"
                      htmlType="reset"
                      onClick={() => form.resetFields()}
                    >
                      Cancel
                    </Button>
                  </Row>
                </Form>
              </Col>
            ) : (
              <Col lg={24} className="table-overflow">
                <Spin spinning={loading}>
                  <Table
                    loading={loading}
                    rowKey={(record) => record.emp_id}
                    columns={columns}
                    dataSource={employees}
                    bordered
                  />
                </Spin>
              </Col>
            )}
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="Departments">
          <h4>Departments List</h4>
          <Row justify="space-between">
            {departments.map((x, i) => (
              <Col key={i} lg={5}>
                <Card
                  className="mb-2"
                  hoverable
                  onClick={() => {
                    const items = data.filter((z) => z.dept === x);
                    if (items?.length > 0) {
                      const data = JSON.parse(items[0]?.sub_dept);
                      setSubDept(data);
                      if (click === x) {
                        setClick("");
                      } else {
                        setClick(x);
                      }
                    }
                  }}
                  key={i}
                >
                  <h5> {x}</h5>
                  {click === x ? (
                    <>
                      <Divider orientation="center">Sub Departments</Divider>

                      <ul>
                        {subDept.map((y, ix) => (
                          <li key={ix}>{y}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    ""
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default HRHome;
