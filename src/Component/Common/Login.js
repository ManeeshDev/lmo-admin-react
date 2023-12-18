import React, { useState } from "react";
import { Auth, Amplify } from "aws-amplify";
import { Form, Input, Button, Row, Col, message, Radio } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { isLoggedIn, employeeList, removeSession } from "../../Utils/Session";
import ForgotPassword from "./ForgotPassword";
import axios from "axios";
import ConfrimForm from "./Confirm";
import { EmployeeOptions } from "../../Utils/helpers";

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [setPassword, setSetPassword] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const [role, setRole] = useState("admin");

  const [btn, setBtn] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const [cognito, setCognito] = useState({
    region: process.env.REACT_APP_COGNITO_USER_POOL_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID,
  });

  Amplify.configure({
    Auth: {
      region: cognito.region,
      userPoolId: cognito.userPoolId,
      userPoolWebClientId: cognito.userPoolWebClientId,
    },
  });

  const handleForgotPasswordInit = async (values) => {
    setLoading(true);

    const userName = `+91${values.username}`;

    setUsername(userName);

    if (values.code) {
      Auth.forgotPasswordSubmit(userName, values.code, values.new_password)
        .then((data) => {
          setForgotPassword(false);
          setSetPassword(false);
          message.info("Password Changed Successfully");
          window.location.reload();
        })
        .catch((err) => message.error(err.message));
    } else {
      try {
        const user = await Auth.forgotPassword(userName);
        if (user) {
          setSetPassword(true);
        }
      } catch (error) {
        message.error(error.message);
      }
    }

    setLoading(false);
  };

  async function resendConfirmationCode() {
    try {
      const send = await Auth.resendSignUp(username);
      if (send) {
        message.success("code resent successfully");
      }
    } catch (err) {
      //console.log("error resending code: ", err);
    }
  }

  const showForgotPassword = (value) => {
    setForgotPassword(value);
  };

  const fetchEmployeeList = (token, loggedIn_user_role, empID, path) => {
    var status = "";
    if (loggedIn_user_role === "AM" || loggedIn_user_role === "M") {
      try {
        const endPoint = `${process.env.REACT_APP_BASE_URL}/${empID}/${loggedIn_user_role}?status=assign`;
        return axios
          .get(endPoint, {
            headers: { authorization: token },
          })
          .then((res) => {
            if (res !== null && res.data.body && res.data.body.employees) {
              var parsed = res.data.body.employees;
              const options = EmployeeOptions(parsed);

              employeeList(options);
              window.location.href = path;
            }
          });
      } catch (error) {
        //console.log(error, "error");
        message.error("Something went wrong, Please try again later.");
      }
    }
  };

  const onFinish = async (values) => {
    setBtn(true);
    let username = values.username;
    const password = values.password;

    if (role === "agent") {
      username = `+91${values.username}`;
    }

    try {
      const user = await Auth.signIn(username, password);
      if (user.username) {
        message.success("Login Successfull");
        const token = user.signInUserSession.idToken.jwtToken;
        if (token) {
          setBtn(false);
          var base64Url = token.split(".")[1];
          var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          var jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );
        }
        var decodedToken = JSON.parse(jsonPayload);
        var loggedIn_user_role = "AG";
        var empID = "";
        var locale = "";
        var user_name = "";
        var phone_number = "";
        for (var key in decodedToken) {
          if (key === "nickname") {
            empID = decodedToken[key];
          } else if (key === "locale") {
            locale = decodedToken[key];
          } else if (key === "profile") {
            loggedIn_user_role = decodedToken[key];
          } else if (key === "name") {
            user_name = decodedToken[key];
          } else if (key === "phone_number") {
            phone_number = decodedToken[key];
          }
        }

        isLoggedIn(
          token,
          empID,
          loggedIn_user_role,
          locale,
          user_name,
          phone_number
        );

        console.log(loggedIn_user_role, "loggedIn_user_role");

        if (role === "agent") {
          window.location.href = "/agents";
        } else {
          switch (loggedIn_user_role) {
            case "NM":
              window.location.href = "/ContentTeam/AllImages";
              break;
            case "AM":
              return fetchEmployeeList(
                token,
                loggedIn_user_role,
                empID,
                "/ContentTeam/AllShopImages"
              );
            case "M":
              return fetchEmployeeList(
                token,
                loggedIn_user_role,
                empID,
                "/ContentTeam/AllImages"
              );
            case "ONM":
              window.location.href = "/OperationTeam/Newsignups";
              break;

            case "OM":
              window.location.href = "/OperationTeam/Newsignups";
              break;

            case "PHG":
              window.location.href = "/photographers";
              break;

            case "HR":
              window.location.href = "/HR/team";
              break;
          }
        }
      } else {
        setBtn(false);
        message.error("username or password incorrect");
      }
    } catch (error) {
      setUsername(username);
      if (error.message === "User is not confirmed.") {
        setConfirm(true);
        try {
          const send = await Auth.resendSignUp(username);
          if (send) {
            message.success("code resent successfully");
          }
        } catch (err) {
          //console.log("error resending code: ", err);
        }
      } else {
        message.error(error.message);
      }

      setBtn(false);
    }
  };

  const handelChangeRole = (e) => {
    console.log(e.target.value);
    setRole(e.target.value);

    if (e.target.value === "agent") {
      setCognito({
        region: process.env.REACT_APP_AGENT_COGNITO_USER_POOL_REGION,
        userPoolId: process.env.REACT_APP_AGENT_COGNITO_USER_POOL_ID,
        userPoolWebClientId:
          process.env.REACT_APP_AGENT_COGNITO_USER_POOL_WEB_CLIENT_ID,
      });
    } else {
      setCognito({
        region: process.env.REACT_APP_COGNITO_USER_POOL_REGION,
        userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
        userPoolWebClientId:
          process.env.REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID,
      });
    }
  };

  const confirmSignUp = async (values) => {
    setLoading(true);

    try {
      const code = values.code;
      const res = await Auth.confirmSignUp(username, code);
      if (res) {
        message.success("User Signup Success, Please Login");
        window.location.reload();
      }
    } catch (error) {
      message.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Row justify="center" id="login-bg">
      <Col lg={7} xl={6} className="form-section">
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={() => message.info("Please Input required  fields")}
        >
          <div>
            <img
              src={require("../../assets/img/logo.png")}
              alt="logo image"
              width="74px"
            />
          </div>
          <h3 className="login-title">Dashboard Login</h3>{" "}
          <Radio.Group
            onChange={handelChangeRole}
            className="mb-4"
            value={role}
            buttonStyle="solid"
          >
            <Radio.Button value="admin">Admin</Radio.Button>
            <Radio.Button value="agent">Agent</Radio.Button>
          </Radio.Group>
          <Form.Item
            label={role === "agent" ? "Mobile Number" : "Username"}
            name="username"
            rules={[{ required: true, message: "Required field!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={role === "agent" ? "Mobile Number" : "Username"}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <a
              style={{ float: "right" }}
              onClick={() => showForgotPassword(true)}
            >
              Forgot password
            </a>
          </Form.Item>
          <Form.Item>
            <Button
              className="login-btn"
              shape="round"
              size="large"
              loading={btn}
              type="danger"
              htmlType="submit"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Col>

      <ConfrimForm
        visible={confirm}
        onCancel={() => setConfirm(false)}
        onCreate={confirmSignUp}
        loading={loading}
        resendConfirmationCode={resendConfirmationCode}
      />

      {forgotPassword ? (
        <ForgotPassword
          visible={forgotPassword}
          onCancel={() => {
            setSetPassword(false);

            showForgotPassword(false);
          }}
          onCreate={handleForgotPasswordInit}
          loading={loading}
          setPassword={setPassword}
          resendConfirmationCode={resendConfirmationCode}
        />
      ) : null}
    </Row>
  );
};
export default Login;

export const RefreshToken = async () => {
  try {
    const data = await Auth.currentSession();

    if (data) {
      const newToken = data.idToken.jwtToken;

      localStorage.setItem("token", newToken);

      message.loading("Refreshing Token, Please Wait!", 0.5);

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      removeSession();
    }
  } catch (err) {
    removeSession();
  }
};
