import React, { useEffect, useState } from "react";
import UserLayout from "../Layout/UserLayout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUpdatePasswordMutation } from "../../store/api/authAPI";
import { toast } from "react-toastify";
import MetaData from "../Layout/MetaData";

const UpdatePassword = () => {
    /* For Handling Form */
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    
    /* Aux to redirect on Success */
    const navigate = useNavigate();
    /* To Pre Populate Form*/
    const {user} = useSelector(store => store.auth)
    /* To send Post Update */
    const [updatePassword, {isLoading, isSuccess, error, isError}] = useUpdatePasswordMutation()

    const submitHandler = (e) => { 
        console.log("Submit Called")
        e.preventDefault();
        const updatedUserData = {
            oldPassword : oldPassword,
            newPassword : newPassword
        }
        /* Sending Post Request */
        updatePassword(updatedUserData)
    }

    /* To notify status of Post Data */
    useEffect(() => {
        /* To prepopulated the form */
        if(isError){
            toast.error(error?.data?.message)
        }
        if(isSuccess) {
            toast.success("Password Updated Successfully")
            navigate("/me/profile")
        }
    }, [isSuccess, error, user])

  return (
    <>
    <MetaData title={"Update Password"} />
    <UserLayout>
    <div className="row wrapper mt-3">
        <div className="col-10 col-lg-8">
            <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Update Password</h2>
            <div className="mb-3">
                <label htmlFor="old_password_field" className="form-label">
                Old Password
                </label>
                <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="new_password_field" className="form-label">
                New Password
                </label>
                <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
            <button type="submit" className="btn update-btn w-100" disabled={isLoading}>
               {isLoading ? "Update Password..." : "Update Password"}
            </button>
            </form>
        </div>
        </div>
    </UserLayout>
    </>
  )
}
export default UpdatePassword;
