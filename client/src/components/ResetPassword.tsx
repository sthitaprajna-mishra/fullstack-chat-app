// React
import React, { useState, useEffect } from "react";
import { Link as RLink, useSearchParams } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
// Axios
import Axios, { AxiosResponse } from "axios";
// Yup
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { CircularProgress, Modal } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
// Error
import { errorList } from "../config/errorList";

const SuccessIcon: string =
  require("../assets/success-svgrepo-com.svg").default;

const MailIcon: string =
  require("../assets/email-part-2-svgrepo-com.svg").default;

const ErrorIcon: string =
  require("../assets/erroricon-svgrepo-com.svg").default;

const ErrorBg: string = require("../assets/errorBg-svgrepo-com.svg").default;

const theme = createTheme();

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ResetPassword() {
  const [queryParameters] = useSearchParams();
  const _id = queryParameters.get("_id");
  const uniqueString = queryParameters.get("uniqueString");

  // modal
  const [resetStatus, setResetStatus] = useState<string>("");
  const [open, setOpen] = useState(false);
  const handleOpen = (status: string) => {
    setResetStatus(status);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Form Validation
  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .min(3, "Password must be at least 3 characters")
      .max(20, "Password must be at most 20 characters")
      .required("Password is a mandatory field"),
    confirmNewPassword: yup
      .string()
      .oneOf(
        [yup.ref("newPassword"), null],
        "Password and Confirm Password do not match"
      )
      .required("Confirm Password is a mandatory field"),
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // on submit
  const onSubmit = (data: FieldValues) => {
    Axios.post(`http://localhost:4000/resetpassword/${_id}${uniqueString}`, {
      newPassword: data.newPassword,
    })
      .then((res: AxiosResponse) => {
        console.log(res);
        handleOpen(res.data);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      })
      .catch((err) => handleOpen(err.response.data));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image={resetStatus === "success" ? MailIcon : ErrorBg}
              />
              <CardContent>
                {resetStatus === "success" ? (
                  <>
                    <Typography gutterBottom variant="h5" component="div">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          columnGap: 1,
                        }}
                      >
                        <img
                          style={{ width: 30, height: 30 }}
                          src={SuccessIcon}
                        />
                        <Typography>Password reset successful!</Typography>
                      </Box>
                    </Typography>
                    <Typography mt={2} variant="body2" color="text.secondary">
                      You can now sign in with your new password.
                    </Typography>
                    <CircularProgress />
                  </>
                ) : (
                  <>
                    <Typography gutterBottom variant="h5" component="div">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          columnGap: 1,
                        }}
                      >
                        <img
                          style={{ width: 30, height: 30 }}
                          src={ErrorIcon}
                        />
                        <Typography>An error occurred!</Typography>
                      </Box>
                    </Typography>
                    <Typography mt={2} variant="body2" color="text.secondary">
                      {
                        errorList.find((el) => el.title === resetStatus)
                          ?.description
                      }
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        </Modal>
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="New Password"
                  type="password"
                  id="newPassword"
                  autoComplete="new-password"
                  {...register("newPassword")}
                  error={errors.newPassword?.message?.toString() ? true : false}
                  helperText={errors.newPassword?.message?.toString()}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  id="confirmNewPassword"
                  autoComplete="new-password"
                  {...register("confirmNewPassword")}
                  error={
                    errors.confirmNewPassword?.message?.toString()
                      ? true
                      : false
                  }
                  helperText={errors.confirmNewPassword?.message?.toString()}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
