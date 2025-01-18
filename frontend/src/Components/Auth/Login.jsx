import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../store/api/authAPI";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import MetaData from "../Layout/MetaData";

const Login = () => {
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const { user, isAuthenticated } = useSelector((state) => state.auth); 
  const navigate = useNavigate();

  /* Mutations are used when sending data to Backend */
  const[login, {authData:data,isLoading, error, isError}] = useLoginMutation();


  const submitHandler = async(e) => {
    e.preventDefault();
    const loginData = {
        email,
        password,
    }
    try {
      await login(loginData).unwrap();
      console.log("Calling Completed")
    } catch (err){
      console.error(err)
    }
  }

    useEffect(() => {
      /* 
          If authentication, passes
          Error will be set to false. Triggering useEffect
      */
      if(isAuthenticated) {
        navigate("/")
      }
      if(isError) {
        toast.error(error.data.message)
      }
    }, [error, isAuthenticated])

  return (
    <>
        <MetaData title={"Login"} />
        <div className="row wrapper">
        <div className="col-10 col-lg-5">
            <form
            className="shadow rounded bg-body"t
            onSubmit={submitHandler}
            >
            <h2 className="mb-4">Login</h2>
            <div className="mb-3">
                <label htmlFor="email_field" className="form-label">Email</label>
                <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password_field" className="form-label">Password</label>
                <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <Link to="/password/htmlForgot" className="float-end mb-4">Forgot Password?</Link>
            <button id="login_button" type="submit" className="btn w-100 py-2" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Login"}
            </button>
            <div className="my-3">
                <Link to="/register" className="float-end">New User?</Link>
            </div>
            </form>
        </div>
    </div>
    </>
  )
};

export default Login;
