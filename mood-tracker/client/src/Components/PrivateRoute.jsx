// import React from "react";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children }) => {
//     const user = JSON.parse(localStorage.getItem("user"))
//     return user?children:<Navigate to="/login"/>
// }

// export default PrivateRoute;


import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    
    // Check if both user and token exist
    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }
    
    return <Outlet />;
};

export default PrivateRoute;