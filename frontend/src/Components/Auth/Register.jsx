import React, { useEffect, useState } from "react";
import { useRegisterMutation } from "../../store/api/authAPI";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/MetaData";

const Register = () => {
    const [register, {data, isLoading, error, isError}] = useRegisterMutation();
    const {isAuthenticated} = useSelector(store => store.auth)  
    const navigate = useNavigate();
    useEffect(() => {
        /* 
            If authentication, passes
            Error will be set to false. Triggering useEffect
        */
        console.log({isAuthenticated})
        if(isAuthenticated) {
            navigate("/")
        }
        if(isError) {
            toast.error(error.data.message)
        }
       }, [isError, error, isAuthenticated, navigate])
   

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const submitHandler = (e) => {
        e.preventDefault();
        const signUpData = {
            name : userData.name,
            email : userData.email,
            password : userData.password
        }
        register(signUpData)
    }

  return (
    <>  
        <MetaData title={"Register"} />
        <div className="row wrapper">
        <div className="col-10 col-lg-5">
            <form
                className="shadow rounded bg-body"
                onSubmit={submitHandler}
            >
            <h2 className="mb-4">Register</h2>
            <div className="mb-3">
                <label htmlFor="name_field" className="form-label">Name</label>
                <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={userData.name}
                // When using dynamic values, use []
                onChange = {(e) => setUserData({...userData,[e.target.name] : e.target.value})}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="email_field" className="form-label">Email</label>
                <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={userData.email}
                // When using dynamic values, use []
                onChange = {(e) => setUserData({...userData,[e.target.name] : e.target.value})}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password_field" className="form-label">Password</label>
                <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={userData.password}
                // When using dynamic values, use []
                onChange = {(e) => setUserData({...userData,[e.target.name] : e.target.value})}
                />
            </div>
            <button id="register_button" type="submit" className="btn w-100 py-2" disabled={isLoading}>
                REGISTER
            </button>
            </form>
        </div>
        </div>
    </>
  )
};

export default Register;
