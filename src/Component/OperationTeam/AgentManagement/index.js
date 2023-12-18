import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { message, Modal } from "antd";
import { withRouter } from "react-router-dom";
import ConfrimForm from "./Confirm";
import moment from "moment";
import "antd/dist/antd.css";

import Amplify from "aws-amplify";
import ModalFormComponent from "./form";
import Axios from "axios";
import ShortUniqueId from "short-unique-id";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("loggedIn_user_role");
const empid = localStorage.getItem("emp_id");

const AgentSignup = (props) => {
  const [confirm, setConfirm] = useState(false);
  const [username, setUsername] = useState("");

  const [user, setUser] = useState({});

  const [loading, setLoading] = useState(false);

  const [area_code, setArea] = useState({
    code: "",
    name: "",
  });

  Amplify.configure({
    Auth: {
      region: process.env.REACT_APP_AGENT_COGNITO_USER_POOL_REGION,
      userPoolId: process.env.REACT_APP_AGENT_COGNITO_USER_POOL_ID,
      userPoolWebClientId:
        process.env.REACT_APP_AGENT_COGNITO_USER_POOL_WEB_CLIENT_ID,
    },
  });

  const handleSignUp = async (values) => {
    setLoading(true);

    const { name, phone_number, password, agent_id, area } = values;

    const userName = `+91${phone_number}`;

    setUsername(userName);
    setUser({ ...values });

    try {
      const user = await Auth.signUp({
        username: userName,
        password: password,
        attributes: {
          name,
          gender: "NA",
          locale: area,
          nickname: agent_id,
        },
      });
      if (user) {
        setConfirm(true);
      }
    } catch (error) {
      message.error(
        <span style={{ color: "red", fontWeight: "bold" }}>
          {" "}
          {error.message}{" "}
        </span>
      );
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
      message.error(err.message);
    }
  }

  const confirmSignUp = async (values) => {
    setLoading(true);
    try {
      const code = values.code;
      const res = await Auth.confirmSignUp(username, code);
      // saveData();
      // console.log("saving data to db....");
      setConfirm(false);
      Modal.success({
        title: "Signup Successfull",
        onOk() {
          window.location.reload();
        },
      });
    } catch (error) {
      message.error(error.message);
    }
    setLoading(false);
  };

  const getAreaCode = (name, code) => {
    setArea({ name, code });
  };

  const saveData = async () => {
    // setLoading(true);

    const json = {
      agent_id: user.agent_id,
      contact: user.phone_number,
      name: user.name,
    };

    try {
      const endPoint = `${process.env.REACT_APP_BASE_URL}/${empid}/${userRole}/onm?status=agent`;
      const res = await Axios.put(endPoint, json, {
        headers: { authorization: token },
      });
      if (res) {
        setConfirm(false);
        Modal.success({
          title: "Agnet Signup Suceess",
          onOk() {
            window.location.reload();
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      <ModalFormComponent
        area_code={getAreaCode}
        onSignUp={handleSignUp}
        loading={loading}
      />

      <ConfrimForm
        visible={confirm}
        onCancel={() => setConfirm(false)}
        onCreate={confirmSignUp}
        loading={loading}
        resendConfirmationCode={resendConfirmationCode}
      />
    </>
  );
};

export default withRouter(AgentSignup);
