import React, { useEffect, useState } from "react";
import { useUpdateAvatarMutation } from "../../store/api/userApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import UserLayout from "../Layout/UserLayout";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/MetaData";

const UploadAvatar = () => {
  const {user} = useSelector(state => state.auth)
  const[avatar, setAvatar] = useState("");
  const[avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? user?.avatar?.url : "/images/default_avatar.jpg"
  );
  const navigate = useNavigate();
  const [updateAvatar, {isLoading, error, isError, isSuccess}] = useUpdateAvatarMutation();

  const submitHandler = async(e) => {
    e.preventDefault()
    const updatedAvatar = {
      avatar
    }
    await updateAvatar(updatedAvatar)
    navigate("/me/profile")
  }

  useEffect(() => {
    if(isError) {
      toast.error(error.data.message)
    }
    if(isSuccess){
      toast.success("Avatar updated")
    }
  }, [isError, isSuccess, error])
  
  const onChangeHandler = (e) => {

    const reader = new FileReader();
    reader.onload = () => {
      if(reader.readyState === 2) {
        setAvatar(reader.result)
        setAvatarPreview(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }

  return (
    <>
    <MetaData title={"Upload Avatar"} />
    <UserLayout>
      <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form
            className="shadow rounded bg-body"
            onSubmit={submitHandler}
          >
            <h2 className="mb-4">Upload Avatar</h2>
            <div className="mb-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <figure className="avatar item-rtl">
                    <img src={avatarPreview} className="rounded-circle" alt="image" />
                  </figure>
                </div>
                <div className="input-foam">
                  <label className="form-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                  <input
                    type="file"
                    name="avatar"
                    className="form-control"
                    id="customFile"
                    accept="images/*"
                    onChange = {onChangeHandler}
                  />
                </div>
              </div>
            </div>
            <button
              id="register_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Uploading" : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
    </>
  )
};

export default UploadAvatar;
