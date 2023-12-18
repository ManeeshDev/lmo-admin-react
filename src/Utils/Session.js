import { Auth, Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_COGNITO_USER_POOL_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID,
  },
});

export const isLoggedIn = (
  token,
  emp_id,
  loggedIn_user_role,
  locale,
  user_name,
  phone_number
) => {
  localStorage.setItem("token", token);
  localStorage.setItem("emp_id", emp_id);
  localStorage.setItem("loggedIn_user_role", loggedIn_user_role);
  localStorage.setItem("locale", locale);
  localStorage.setItem("user_name", user_name);
  localStorage.setItem("phone_number", phone_number);
};

export const employeeList = (employeeList) => {
  localStorage.setItem("employeeList", JSON.stringify(employeeList));
};

export const removeSession = async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    //console.log("error signing out: ", error);
  }

  localStorage.clear();

  window.location.href = "/";
};
