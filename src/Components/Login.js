import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authContext from "../AuthContext/AuthContext";

function Login() {
  const navigate = useNavigate();
  const {setAuthStatus}  = useContext(authContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState({
    errorData: "",
    emailError: "",
    passwordError: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setMsg({
        errorData: "",
        emailError: "",
        passwordError: "",
      });
    }, 10000);
  }, [msg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let valid = true;
    const errors = {
      emailError: "",
      passwordError: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.emailError = "Please enter a valid email address.";
      valid = false;
    }

    if (!formData.password) {
      errors.passwordError = "Password is required.";
      valid = false;
    }

    setMsg((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:8080/userlogin/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg);
      }
      console.log(data);

      setMsg((prevState) => ({
        ...prevState,
        successData: "User LoggedIn successfully",
      }));
      console.log("Going to navigate!....")
      setAuthStatus(true)
      navigate("/users/home");
    } catch (error) {
      setMsg((prevState) => ({
        ...prevState,
        errorData: error.message,
      }));
      setFormData({
        email: "",
        password: "",
      });
      setMsg({
        errorData: "",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
    });
    setMsg({
      errorData: "",
      emailError: "",
      passwordError: "",
    });
  };

  return (
    <div className="signup-form">
      <h3>LOGIN</h3>
      <p className={msg.successData ? "success-msg" : "error-msg"}>
        {msg.errorData || msg.successData}
      </p>
      <form className="form-for-signup" onSubmit={handleSubmit}>
        <div className="signup-input-container">
          <label className="signupLable" htmlFor="emailinput">
            Enter Email:
          </label>
          <input
            className="signupInput"
            type="email"
            id="emailinput"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
            value={formData.email}
          />
        </div>
        <p className="error-msg">{msg.emailError}</p>

        <div className="signup-input-container">
          <label className="signupLable" htmlFor="passwordinput">
            Enter Password:
          </label>
          <input
            className="signupInput"
            type="password"
            id="passwordinput"
            placeholder="Enter Password"
            name="password"
            onChange={handleChange}
            value={formData.password}
          />
        </div>
        <p className="error-msg">{msg.passwordError}</p>

        <div className="signup-button-holder">
          <button
            className="btn"
            type="button"
            id="reset-btn"
            onClick={handleReset}
          >
            Reset
          </button>
          <button className="btn" id="submit-btn" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
