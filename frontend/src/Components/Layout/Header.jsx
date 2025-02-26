import React from "react";
import Search from "./Search";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserDetailsQuery } from "../../store/api/userApi";
import { useLazyLogoutQuery } from "../../store/api/authAPI";

const Header = () => {
  const { isLoading } = useGetUserDetailsQuery();
  const {user} = useSelector(store => store.auth)  
  const navigate = useNavigate();
  /* Function Stub is provided, which we can conditionally call */
  const [triggerLogout] = useLazyLogoutQuery();
  const {cartItems} = useSelector(store => store.cart);
  const logoutHandler = async() => {
    try {
      await triggerLogout().unwrap();
      navigate("/");  // Navigate after successful logout
      console.log("Logout successful");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
  <>
    {/* Single Row Grid */}
    <nav className="navbar row">
      {/* Brand Logo Div*/}
      <div className="col-12 col-md-3 ps-5"> 
       {/* Margin down = 3, Padding Start =  5  */}
       <div className="navbar-brand d-flex justify-content-center justify-content-md-start">
          <Link to="/">
            <img 
              src={`${process.env.PUBLIC_URL}/images/logoSmall.png`}
              alt="Sydney Kart" 
              className="responsive-logo"
              style={{
                borderRadius: "10px",
                maxWidth: "100%",
                height: "auto"
              }}
            />
          </Link>
        </div>
      </div>
      {/* Search Input Div */}
      <div className="col-12 col-md-6 mt-2 mt-md-0"> 
      {/* 
        12 - columns normally, on medium screens 6,
        Margin Top = 2, Margin Top on Medium Screens = 0
      */}
        <Search />
      </div>
      {/* Cart*/}
      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center"> 
        <Link to="/cart" style={{textDecoration: "none"}}>
          <span id="cart" className="ms-3"> Cart </span>
          <span className="ms-1" id="cart_count">{cartItems.length}</span>
        </Link>
        {/* User Button + Drop Down Button */}
        {user ? 
        (<div className="ms-4 dropdown">
          {/* User Button */}
          <button
            className="btn dropdown-toggle text-white"
            type="button"
            id="dropDownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <figure className="avatar avatar-nav">
            {console.log(user)}
            {console.log(user?.avatar)}
            {console.log(user?.avatar?.url)}
              <img
                src={
                  user?.avatar?.url || 
                  `${process.env.REACT_APP_PUBLIC_URL_PROD}/images/default_avatar.jpg`
                }
                className="rounded-circle"
                alt={user?.name || "User Avatar"}
              />
            </figure>
            <span>{user?.name}</span>
          </button>
          {/*
            w-100 - Width 100%
          */}
          <div className="dropdown-menu w-100" aria-labelledby="dropDownMenuButton">
            {
              user.role === "admin" &&
              <Link className="dropdown-item" to="/admin/dashboard"> Dashboard </Link>
            }
            <Link className="dropdown-item" to="/me/orders"> Orders </Link>
            <Link className="dropdown-item" to="/me/profile"> Profile </Link>
            <Link className="dropdown-item text-danger" onClick = {logoutHandler} > Logout </Link>
          </div>
        </div>)
        :
        (!isLoading && 
          <Link to="/login" className="btn ms-4" id="login_btn"> Login </Link>
        )}
      </div>
    </nav>
  </>)
};

export default Header;
