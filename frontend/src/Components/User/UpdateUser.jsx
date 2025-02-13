import React, { useEffect, useState } from "react";
import { useUpdateDetailsMutation } from "../../store/api/userApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserLayout from "../Layout/UserLayout";
import MetaData from "../Layout/MetaData";


const UpdateProfile = () => {
    /* For Handling Form */
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    
    /* Aux to redirect on Success */
    const navigate = useNavigate();
    /* To Pre Populate Form*/
    const {user} = useSelector(store => store.auth)
    /* To send Post Update */
    const [updateDetails, {isLoading, isSuccess, error, isError}] = useUpdateDetailsMutation()

    const submitHandler = (e) => { 
        e.preventDefault();
        const updatedUserData = {
            name: name,
            email:email
        }
        /* Sending Post Request */
        updateDetails(updatedUserData)
    }

    /* To notify status of Post Data */
    useEffect(() => {
        /* To prepopulate the form */
        if(user) {
            setName(user.name)
            setEmail(user.email)
        }
        if(isError){
            toast.error(error?.data?.message)
        }
        if(isSuccess) {
            toast.success("Profile Updated Successfully")
            navigate("/me/profile")
        }
    }, [isSuccess, error, user])

  return (
    <>
    <MetaData title={"Update Profile"} />
    <UserLayout>
        <div className="row wrapper mt-3">
            <div className="col-10 col-lg-8">
            <form
                className="shadow rounded bg-body"
                action="#"
                onSubmit={submitHandler}
            >
                <h2 className="mb-4">Update Profile</h2>
                <div className="mb-3">
                <label htmlFor="name_field" className="form-label"> Name </label>
                <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    name="name"
                    value={name}
                    onChange = {e => {setName(e.target.value)}}
                />
                </div>
                <div className="mb-3">
                <label htmlFor="email_field" className="form-label"> Email </label>
                <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange = {e => {setEmail(e.target.value)}}
                />
                </div>
                <button type="submit" className="btn update-btn w-100" disabled={isLoading}>{isLoading ? "Updating .." : "Update"}</button>
            </form>
            </div>
        </div>
    </UserLayout>
    </>
  )
};

export default UpdateProfile;
