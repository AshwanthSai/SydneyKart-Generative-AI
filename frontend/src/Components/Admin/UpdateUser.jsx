import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { useGetAdminUserDetailsQuery, useUpdateUserDetailsMutation } from "../../store/api/userApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateUser = () => {
  const {id} = useParams()
  const {data} = useGetAdminUserDetailsQuery(id)
  const user = data?.user || ""
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [updateUserDetails, {isError, error, isSuccess, isLoading}] = useUpdateUserDetailsMutation()

  useEffect(() => {
    if(user){
        setName(user?.name);
        setEmail(user?.email);
        setRole(user?.role);
    }
  }, [user])

  useEffect(() => {
    if(isError){
        toast.error(error?.data?.message)
    }
    if(isSuccess){
        toast.success("User updated successfully")
    }
  }, [isError, error, isSuccess])

  const submitHandler = (e) => {
    e.preventDefault();
    const updatedUserData = {id, body : {name, email, role}}
    updateUserDetails(updatedUserData)
  }

  return (
    <AdminLayout>
    <div className="row wrapper mt-5 mt-lg-0">
      <div className="col-10 col-lg-8">
        <form className="shadow-lg" onSubmit={submitHandler}>
          <h2 className="mb-4">Update User</h2>
          <div className="mb-3">
            <label htmlFor="name_field" className="form-label">Name</label>
            <input
              type="name"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            <label htmlFor="role_field" className="form-label">Role</label>
            <select id="role_field" className="form-select" name="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <button type="submit" className="btn update-btn w-100 py-2" 
            disabled={isLoading}>
            Update
          </button>
        </form>
      </div>
    </div>
    </AdminLayout>
  )
};

export default UpdateUser;
