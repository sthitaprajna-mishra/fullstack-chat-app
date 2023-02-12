import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Axios, { AxiosResponse } from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Card, CardContent, CardMedia, Modal, Typography } from "@mui/material";
import { errorList } from "../config/errorList";

const errStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ErrorIcon: string =
  require("../assets/erroricon-svgrepo-com.svg").default;

const ErrorBg: string = require("../assets/errorBg-svgrepo-com.svg").default;

export default function VerifyEmail() {
  const [queryParameters] = useSearchParams();
  const _id = queryParameters.get("_id");
  const uniqueString = queryParameters.get("uniqueString");

  console.log(`_id: ${_id}`);

  // modal
  const [err, SetErr] = useState<string | undefined>();
  useEffect(() => {
    Axios.get(`http://localhost:4000/verifyemail/${_id}${uniqueString}`, {
      withCredentials: true,
    })
      .then((res: AxiosResponse) => {
        console.log(res);
        if (res.data === "success") {
          window.location.href = "/";
        } else {
          SetErr(res.data);
        }
      })
      .catch((err) => SetErr(err.response.data));
  }, []);

  return (
    <>
      {err ? (
        <Box sx={errStyle}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia component="img" height="140" image={ErrorBg} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    columnGap: 1,
                  }}
                >
                  <img style={{ width: 30, height: 30 }} src={ErrorIcon} />
                  <Typography>An error occurred!</Typography>
                </Box>
              </Typography>
              <Typography mt={2} variant="body2" color="text.secondary">
                {errorList.find((el) => el.title === err)?.description}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "90vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
}
