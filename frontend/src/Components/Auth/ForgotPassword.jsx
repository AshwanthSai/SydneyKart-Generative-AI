import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../store/api/authAPI";
import { toast } from "react-toastify";
import MetaData from "../Layout/MetaData";

const ForgotPassword = () => {
  const[email, setEmail] = useState("");    
  const [forgotPassword, {isLoading, isSuccess, isError, error}] = useForgotPasswordMutation();
  
  const submitHandler = async(e) => {
    e.preventDefault(); 
    await forgotPassword({email})
  }

  useEffect(() => {
        if(isError) {
            toast.error(error.data.message)
        }
        if(isSuccess) {
            toast.success("Email sent successfully")
        }
    }, [isError, isSuccess, error])

  return ( 
    <>
    <MetaData title={"Forgot Password"} />
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Forgot Password</h2>
          <div className="mt-3">
            <label htmlFor="email_field" className="form-label">Enter Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            id="forgot_password_button"
            type="submit"
            className="btn w-100 py-2"
            disabled={isLoading}
          >
           {isLoading ? "Sending..."  : "Send Email"}
          </button>
        </form>
      </div>
    </div>
    </>
  )
};

export default ForgotPassword;
