import React, { useState } from "react";
import "../css/Registration.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await axios.post("Loginview/", {
        email: email,
        password: password
      });

      if (res.status === 200) {

        // store token
        localStorage.setItem("access", res.data.token);

        // redirect
        navigate("/businput");

      }

    } catch (error) {

      if (error.response) {
        alert(error.response.data.error || "Login failed");
      } else {
        alert("Server error");
      }

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

  const googleLogin = () => {
    console.log("Google login");
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row" style={{ height: "100vh" }}>

          {/* LEFT SIDE */}
          <div className="col-lg-7 d-none d-lg-flex login-side-img align-items-center justify-content-center text-white text-center">
            <div className="px-5">
              <h1 className="display-3 fw-bold mb-4">
                Welcome, Start Your Journey
              </h1>

              <p className="lead">
                Join over 10 million happy travelers across India.
              </p>

              <div className="mt-5 d-flex justify-content-center gap-4">
                <div>
                  <i className="fa-solid fa-shield-halved fa-2x mb-2"></i>
                  <p>Verified Buses</p>
                </div>

                <div>
                  <i className="fa-solid fa-headset fa-2x mb-2"></i>
                  <p>24/7 Support</p>
                </div>

                <div>
                  <i className="fa-solid fa-bolt fa-2x mb-2"></i>
                  <p>Instant Refund</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-5 d-flex align-items-center bg-white">

            <div className="container p-5">

              <div className="text-center mb-5">
                <span className="navbar-brand fs-2 mb-3 d-block">
                  <i className="fa-solid fa-bus-simple me-2"></i>
                  BusTicket
                </span>

                <h3 className="fw-bold">Welcome Back!</h3>

                <p className="text-muted">
                  Log in to your account to continue
                </p>
              </div>

              <form onSubmit={handleSubmit}>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control shadow-sm border-0 bg-light"
                    placeholder="name@example.com"
                    required
                    onChange={(e) => setemail(e.target.value)}
                  />
                  <label>Email</label>
                </div>

                <div className="form-floating mb-3 position-relative">
                  <input
                    type="password"
                    className="form-control shadow-sm border-0 bg-light"
                    placeholder="Password"
                    onChange={(e) => setpassword(e.target.value)}
                  />

                  <div className="position-absolute top-0 end-0 py-3 px-3 eye-css">
                    <i
                      className="fa-solid fa-eye"
                      onClick={passwordshow}
                    ></i>
                  </div>

                  <label>Password</label>
                </div>

                <div className="d-flex justify-content-between mb-4 small">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                    />
                    <label className="form-check-label text-muted">
                      Remember me
                    </label>
                  </div>

                  <a href="#" className="text-decoration-none text-brand fw-bold">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn btn-brand w-100 py-3 fw-bold shadow"
                >
                  LOGIN
                  <i className="fa-solid fa-arrow-right-to-bracket ms-2"></i>
                </button>

                <div className="text-center my-4">
                  <span className="text-muted small">OR</span>
                  <hr />
                </div>

                <button
                  type="button"
                  onClick={googleLogin}
                  className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center py-2"
                >
                  <i className="fa-brands fa-google m-2"></i>
                  Continue with Google
                </button>

                <div className="text-center mt-5">
                  <p className="text-muted small">
                    New to BusTicket?
                    <Link
                      to="/Registration"
                      className="text-brand fw-bold text-decoration-none ms-1"
                    >
                      Create an account
                    </Link>
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

export default Login;