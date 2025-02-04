import React, { useEffect, useState } from "react";

function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [msg, setMsg] = useState({
        errorData: "",
        nameError: "",
        emailError: "",
        passwordError: "",
    });

    useEffect(() => {
        setTimeout(() => {
            setMsg({
                errorData: "",
                nameError: "",
                emailError: "",
                passwordError: "",
            })
        }, 10000);

    }, [msg])

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
            nameError: "",
            emailError: "",
            passwordError: "",
        };

        if (!formData.name) {
            errors.nameError = "Name is required.";
            valid = false;
        }

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
            const response = await fetch("http://localhost:8080/userlogin/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                throw new Error(data.message || "Failed to sign up!");
            }

            setMsg((prevState) => ({
                ...prevState,
                successData: "User signed up successfully.",
                errorData: "",
            }));
            setFormData({
                name: "",
                email: "",
                password: "",
            });
        } catch (error) {
            setMsg((prevState) => ({
                ...prevState,
                errorData: error.message || "An unexpected error occurred.",
                successData: "",
            }));
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
            nameError: "",
            emailError: "",
            passwordError: "",
        });
    };

    return (
        <div className="signup-form">
            <h3>SIGN UP</h3>
            <p className= {msg.successData?"success-msg":"error-msg"}>
                {msg.errorData || msg.successData}
            </p>
            <form className="form-for-signup" onSubmit={handleSubmit}>
                <div className="signup-input-container">
                    <label className="signupLable" htmlFor="nameinput">
                        Enter Name:
                    </label>
                    <input
                        className="signupInput"
                        type="text"
                        id="nameinput"
                        placeholder="Enter Name"
                        name="name"
                        onChange={handleChange}
                        value={formData.name}
                    />
                </div>
                <p className="error-msg">{msg.nameError}</p>

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
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Signup;
