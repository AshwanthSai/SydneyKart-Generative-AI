import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../store/api/authAPI";
import { toast } from "react-toastify";
import MetaData from "../Layout/MetaData";

const ResetPassword = () => {
    const[passwordOne, setPasswordOne] = useState("");
    const[passwordTwo, setPasswordTwo] = useState("");
    const navigate = useNavigate();
    const {token} = useParams();
    const[resetPassword, {isSuccess, isLoading, isError, error}] = useResetPasswordMutation();

    const submitHandler = async(e) => {
        e.preventDefault();
        if(passwordOne !== passwordTwo) {
            toast.error("Passwords do not match")
        } 
        try {
            const formData = {
              password : passwordOne,
              confirmPassword : passwordTwo
            }
            await resetPassword({ token, body : formData }).unwrap();
            navigate('/login');
          } catch (error) {
            console.error('Reset password failed:', error);
        }
    }

    useEffect(() => {
        if(isError) {
            toast.error(error.data.message)
        }
        if(isSuccess) {
            toast.success("Email sent successfully")
        }
    }, [isError, isSuccess])

  return (
    <>
    <MetaData title={"Reset Password"} />
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit = {submitHandler}
        >
          <h2 className="mb-4">New Password</h2>
          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={passwordOne}
              onChange = {(e) => setPasswordOne(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label for="confirm_password_field" className="form-label">
            Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              name="confirm_password"
              value={passwordTwo}
              onChange = {(e) => setPasswordTwo(e.target.value)}
            />
          </div>
          <button id="new_password_button" type="submit" className="btn w-100 py-2" disabled = {isLoading}>
            {isLoading ? "Loading..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
    </>
  )
};

export default ResetPassword;
