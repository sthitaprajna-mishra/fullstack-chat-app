import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import { myContext } from "../context/Context";
import Axios, { AxiosResponse } from "axios";

export default function Dashboard() {
  const context = useContext(myContext);

  const handleLogout = () => {
    Axios.get("http://localhost:4000/logout", { withCredentials: true }).then(
      (res: AxiosResponse) => {
        if (res.data === "success") {
          window.location.href = "/";
        }
      }
    );
  };
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      <h1>Dashboard</h1>
      <h3>Hello, {context.username}</h3>
    </>
  );
}
