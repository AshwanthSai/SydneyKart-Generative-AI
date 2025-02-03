import React from "react";
import UserLayout from "../Layout/UserLayout";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MetaData from "../Layout/MetaData";

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth); 
  return (
    <>
    <MetaData title={"Profile"} />
    <UserLayout>
        <div className="container container-fluid">
        <h2 className="mt-5 ml-5">My Profile</h2>
        <div className="row justify-content-around mt-5 user-info">
            <div className="col-12 col-md-3">
                <figure className='avatar avatar-profile'>
                    <img className="rounded-circle img-fluid" alt=''
                        src={
                        user?.avatar ? user?.avatar?.url : "/images/default_avatar.jpg"}
                      />
                </figure>
            </div>
            <div className="col-12 col-md-5">
                 <h4>Full Name</h4>
                 <p>{user?.name}</p>
                 <h4>Email Address</h4>
                 <p>{user?.email}</p>
                 <h4>Joined On</h4>
                 <p>{user?.createdAt?.substring(0, 10)}</p>        
             </div>
            </div>
        </div>
    </UserLayout>
    </>
  )
};

export default Profile;
