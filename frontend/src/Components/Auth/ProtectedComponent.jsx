import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Loader } from "../Layout/Loader";

const ProtectedComponent = ({children}) => {
   const {isAuthenticated, isLoading} = useSelector(store => store.auth)

    if(isLoading){
        return <Loader/>
    }

    //* Because data is not recieved instantaneously 
    //* Else the component will redirect on mount.
    if(!isAuthenticated) {
        //* Replace the entire url   
       return <Navigate to="/login" replace/>
    }
    
    return children;
};

export default ProtectedComponent;
