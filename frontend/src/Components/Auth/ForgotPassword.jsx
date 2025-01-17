import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../store/api/authAPI";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  
  const[email, setEmail] = useState("");    
  const navigate = useNavigate();
  const [forgotPassword, {isSuccess, isError, error}] = useForgotPasswordMutation();
  
  const submitHandler = async(e) => {
    e.preventDefault(); 
    await forgotPassword({email})
    // send email to user
    navigate("/me/profile");

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
          >
            Send Email
          </button>
        </form>
      </div>
    </div>
  )
};

export default ForgotPassword;
