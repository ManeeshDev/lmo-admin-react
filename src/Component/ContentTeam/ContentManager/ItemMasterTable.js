import React from "react";
import { Table, Input, Button, Space, PageHeader, Modal, Row } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import categoryList from "../../../Utils/categoryList";

class ItemMasterTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      searchedColumn: "",
      data: [],
      loading: false,
      imagePopup: false,
      selectedImage: "",
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    fetch(this.props.JSON_url)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        json.map((item) => {
          const ctgy_name = categoryList.filter(
            (ctgy) => ctgy.ctgy == item.category
          );
          item.category = ctgy_name[0].name;
          var sub_ctgy_array = [];
          item.sub_category.map((sub_ctgy) => {
            ctgy_name[0].subCtgy.map((value) => {
              if (value.code == sub_ctgy) {
                sub_ctgy_array.push(value.name);
              }
            });
          });
          item.sub_category = sub_ctgy_array.toString()
        });
        this.setState({ data: json, loading: false });
      });
  }
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text : ""}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
      loading: false,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  render() {
    const columns = [
      {
        title: "Item Image",
        dataIndex: "imageurl",
        width: "28%",
        render: (image_url) => (
          <>
            <img
              style={{ cursor: "pointer" }}
              alt="no image"
              src={image_url}
              height="50px"
              width="50px"
              onClick={() => {
                this.setState({ imagePopup: true, selectedImage: image_url });
              }}
            />
          </>
        ),
      },
      {
        title: "Item",
        dataIndex: "item",
        width: "40%",
        ...this.getColumnSearchProps("item"),
      },
      {
        title: "Category",
        dataIndex: "category",
        key: `category`,
        width: "30%",
        ...this.getColumnSearchProps("category"),
      },
      {
        title: "Sub Category",
        dataIndex: "sub_category",
        key: `sub_category`,
        width:"40%",
        ...this.getColumnSearchProps("sub_category"),
      },
    ];
    return (
      <div className="detail-page">
        <PageHeader
          className="site-page-header"
          onBack={() => this.props.viewItemMasterTable()}
          title={"Item Master Json"}
        />
        <Table
         pagination={{ defaultPageSize: 500 }}
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
        />
        <Modal
          closable={true}
          visible={this.state.imagePopup}
          footer={null}
          onCancel={() => {
            this.setState({ imagePopup: false, selectedImage: "" });
          }}
        >
          <div style={{ padding: "0 2rem" }}>
            <Row justify="center">
              <img width="450px" height="450px" src={this.state.selectedImage} />{" "}
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}
export default ItemMasterTable;
