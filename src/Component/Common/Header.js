import React from "react";
import { Row, Layout, Popover, Avatar, Button } from "antd";
import { PoweroffOutlined, UserOutlined } from "@ant-design/icons";
import { removeSession } from "../../Utils/Session";

const user_name = localStorage.getItem("user_name");
const phone_number = localStorage.getItem("phone_number");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");
const locality = localStorage.getItem("locale");

const { Header } = Layout;

const HeaderComponent = ({ setOpen }) => {
  const content = (
    <div className="profilePopup">
      <p>
        Logged In as: <span className="res"> {user_name}</span>{" "}
      </p>
      <p>
        User Role:{" "}
        <span className="res"> {userRole === "AG" ? "Agents" : userRole}</span>{" "}
      </p>
      <p>
        Employee Id: <span className="res"> {empid}</span>{" "}
      </p>
      <p>
        {" "}
        Locality: <span className="res"> {locality}</span>{" "}
      </p>
      <p>
        Phone Number : <span className="res"> {phone_number}</span>{" "}
      </p>

      <Button
        onClick={removeSession}
        className="bg-danger text-light border-0"
        icon={<PoweroffOutlined />}
      >
        Logout
      </Button>
    </div>
  );
  return (
    <Header
      // style={{ position: "fixed", zIndex: 999, width: "100%" }}
      className="bg-black lmo-navbar shadow "
    >
      {" "}
      <div className="d-flex justify-content-around align-items-center">
        <div onClick={() => setOpen(true)} className="logo">
          <img src={require("../../assets/img/logo.png")} height="50px" />
        </div>
      </div>
      <h4
        className="header-title"
        style={{ color: "white", marginBottom: "0", marginLeft: "2rem" }}
      >
        {userRole === "M" || userRole === "AM" || userRole === "NM"
          ? "Content Team Admin Portal"
          : userRole === "ONM" || userRole === "OM"
          ? "Operation Team Admin Portal"
          : userRole === "AG"
          ? "LMO Agents"
          : userRole === "PHG"
          ? "Photographers Team"
          : userRole === "HR"
          ? "HR Team"
          : null}{" "}
      </h4>
      <div className="d-flex align-items-center cursor-pointer ml-4">
        <Popover placement="bottomRight" content={content} trigger="click">
          <span className="d-none  d-md-flex align-items-center text-white">
            <UserOutlined className="mr-1 mr-md-2" /> {user_name}
          </span>
          <span className="d-flex d-md-none  bg-warning p-2 shadow rounded">
            <UserOutlined />
          </span>
        </Popover>
      </div>
    </Header>
  );
};

export default HeaderComponent;
