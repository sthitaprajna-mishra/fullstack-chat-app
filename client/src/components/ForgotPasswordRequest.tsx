// React
import React, { useState } from "react";
import { Link as RLink } from "react-router-dom";
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
import { Modal } from "@mui/material";
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
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function ForgotPasswordRequest() {
  // modal
  const [registerStatus, setRegisterStatus] = useState<string>("");
  const [open, setOpen] = useState(false);
  const handleOpen = (status: string) => {
    setRegisterStatus(status);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Form Validation
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Email must be a valid email")
      .required("Email is a mandatory field"),
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
    Axios.get(`http://localhost:4000/user/${data.email}`, {
      withCredentials: true,
    })
      .then((result) => {
        Axios.post("http://localhost:4000/requestnewpassword", {
          _id: result.data._id,
          email: data.email,
        })
          .then((res: AxiosResponse) => {
            handleOpen(res.data);
          })
          .catch((err) => handleOpen(err.response.data));
      })
      .catch((err) => handleOpen(err.response.data));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
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
                image={registerStatus === "pending" ? MailIcon : ErrorBg}
              />
              <CardContent>
                {registerStatus === "pending" ? (
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
                        <Typography>Email sent successfully!</Typography>
                      </Box>
                    </Typography>
                    <Typography mt={2} variant="body2" color="text.secondary">
                      We've sent an email to <b>{getValues("email")}</b> to
                      reset your password. The link in the email will expire in
                      6 hours.
                    </Typography>
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
                        errorList.find((el) => el.title === registerStatus)
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
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Grid>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <Typography my={2} variant="body2">
              Please enter your email and we will share a password reset link
              with you.
            </Typography>
          </Grid>
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
                  // fullWidth
                  sx={{ width: { xs: 250, sm: 400 } }}
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  {...register("email")}
                  error={errors.email?.message?.toString() ? true : false}
                  helperText={errors.email?.message?.toString()}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
