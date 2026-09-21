import React, { Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LS_SERVICE from "../utils/localStorage";
import * as GlobalConfig from "../constants";
import { Form, Input, notification } from "antd";
import UserContext from "../context/UserContext";
import axios from "axios";
import Logo from "../assets/images/login.svg";

const Login = () => {
  const [form] = Form.useForm();
  const { setLoginUserData } = useContext(UserContext);
  let navigate = useNavigate();
  const authLogin = async (payload) => {
    try {
      notification.destroy();
      const apiRes = await axios.post(GlobalConfig.USER_LOGIN, payload);
      if (apiRes?.data?.statusCode == 200) {
        let userData = apiRes.data.data;        
        LS_SERVICE.set("AUTH_TOKEN", userData.authToken);
        LS_SERVICE.set("CURRENT_USER", userData.user);
        LS_SERVICE.set("fullname", `${userData.user?.first_name || ''} ${userData.user?.middle_name || ''} ${userData.user?.last_name || ''}`);
        LS_SERVICE.set("role", userData.user.designation.name || 'User');
        setLoginUserData(userData.user);
        navigate('/home');
      } else {
        notification.error({ message: "Login", description: "Invalid login credentials!" });
      }
    } catch (err) {
      notification.error({ message: "Login", description: "Invalid login credentials!" });
      console.log("auth-login-err:", err);
    }
  };

  const validate_email = (evt) => {
    let value = evt.target.value;
    if (evt.target.id == "email_id" && value != "") {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(value)) {
        notification.error({ message: "Login", description: "Please enter valid email address!" });
        return;
      }
    }
  };

  return (
    <Fragment>
      <div className="login-box">
        <h1 className="login-title text-center">Online Complete Portal | SMS</h1>
        <h5 className="text-center mb-5"> Please, Authenticate for access the portal </h5>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-4">
            <div className="login-logo">
              <img src={Logo} className="img-fluid login-logo" alt="MyLab Logo" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="login-box-body mt-4">
              <Form
                form={form}
                layout="vertical"
                className="mt-4"
                name="userForm"
                colon={false}
                onFinish={authLogin}
                initialValues={{ remember: true }}
              >
                <div className="antInputItem position-relative filldata">
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Please Enter Email" }]}
                  >
                    <Input type="email" id="email_id" placeholder="Email" onBlur={validate_email} maxLength="60" size="large"/>
                  </Form.Item>
                </div>
                <div className="antInputItem position-relative filldata mt-3">
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: "Please Enter Password" },
                    ]}
                  >
                    <Input type="password" placeholder="Password" size="large"/>
                  </Form.Item>
                </div>
                <div className="text-center mt-4">
                  <button className="btn btn-sm btn-danger ml-2">LOGIN</button>
                </div>
              </Form>
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;