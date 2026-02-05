import React from "react";

import { Outlet, Navigate } from "react-router-dom";

const RequireAuth = (props:any) => {
  let content;

  if (
    (props.role === "admin" && props.isLogged) ||
    (props.role === "user" && props.isLogged) ||
    (props.role === "moderator" && props.isLogged)
  ) {
    content = <Outlet />;
  } else {
    content = <Navigate to="/" />;
  }

  return content;
};

export default RequireAuth;