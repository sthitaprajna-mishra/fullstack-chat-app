import Button from "@mui/material/Button";
import React from "react";
import Axios, { AxiosResponse } from "axios";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Logout() {
  const handleLogout = () => {
    Axios.get("http://localhost:4000/logout", {
      withCredentials: true,
    }).then((res: AxiosResponse) => {
      if (res.data === "success") {
        window.location.href = "/";
      }
    });
  };

  return (
    <>
      <LogoutIcon sx={{ cursor: "pointer" }} onClick={handleLogout} />
    </>
  );
}
