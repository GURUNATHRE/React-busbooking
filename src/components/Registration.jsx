import React from "react";
import "../css/Registration.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const baseurl = import.meta.env.VITE_API_BASE_URL;

function Registration() {

    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (formData) => {
        try {
            const response = await fetch(`${baseurl}register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            window.alert("Registration completed");
            navigate(`/`);

        } catch (error) {
            console.error("Error registering user:", error);
            alert("Something went wrong. Try again later.");
        }
    };

    const passwordshow = (event) => {
        const icon = event.target;
        const input = icon.parentElement.previousElementSibling;

        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
    };

    return (
        <div className="registration-container">
            <div className="container-fluid">
                <div className="row" style={{ height: "100vh" }}>

                    {/* LEFT SIDE */}
                    <div className="col-lg-7 d-none d-lg-flex login-side-img align-items-center justify-content-center text-white text-center">
                        <div className="px-5">
                            <h1 className="display-3 fw-bold mb-4">Start Your Journey</h1>
                            <h4 className="lead">
                                <b>Create an account to book tickets in seconds and manage your trips effortlessly.</b>
                            </h4>
                        </div>
                    </div>

                    {/* RIGHT SIDE FORM */}
                    <div className="col-lg-5 d-flex align-items-center bg-white">
                        <div className="container p-5">

                            <div className="text-center mb-4">
                                <span className="navbar-brand fs-2 mb-3 d-block">
                                    <i className="fa-solid fa-bus-simple me-2"></i>BusTicket
                                </span>
                                <h3 className="fw-bold">Create Account</h3>
                                <p className="text-muted">Fill in the details below</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>

                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className="form-control shadow-sm border-0 bg-light"
                                        placeholder="Username"
                                        {...register("username")}
                                    />
                                    <label>User Name</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                        type="email"
                                        className="form-control shadow-sm border-0 bg-light"
                                        placeholder="Email"
                                        {...register("email", { required: true })}
                                    />
                                    <label>Email Address</label>
                                </div>

                                <div className="form-floating mb-3 position-relative">
                                    <input
                                        type="password"
                                        className="form-control shadow-sm border-0 bg-light"
                                        placeholder="Password"
                                        {...register("password", { required: true })}
                                    />

                                    <div className="position-absolute top-0 end-0 py-3 px-3 eye-css">
                                        <i className="fa-solid fa-eye" onClick={passwordshow}></i>
                                    </div>

                                    <label>Password</label>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-brand w-100 py-3 fw-bold shadow"
                                >
                                    SIGN UP
                                </button>

                                <div className="text-center mt-4">
                                    <p className="text-muted small">
                                        Already have an account?
                                        <a
                                            href="/"
                                            className="text-brand fw-bold text-decoration-none ms-1"
                                        >
                                            Login here
                                        </a>
                                    </p>
                                </div>

                            </form>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Registration;