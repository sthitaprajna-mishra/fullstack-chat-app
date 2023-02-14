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
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { Card, CardContent, CardMedia, Modal } from "@mui/material";
// Error
import { errorList } from "../config/errorList";

// SVGs
const FacebookOfficial: string =
  require("../assets/facebook-official.svg").default;
const GoogleIcon: string = require("../assets/google-tile.svg").default;
const TwitterOfficial: string =
  require("../assets/twitter-official.svg").default;
const ChatBg: string =
  require("../assets/undraw_online_connection_6778.svg").default;
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
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SignIn() {
  // Form Validation
  const schema = yup.object().shape({
    username: yup.string().required("Username is a mandatory field"),
    password: yup
      .string()
      .min(3, "Password must be at least 3 characters")
      .max(20, "Password must be at most 20 characters")
      .required("Password is a mandatory field"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [signInStatus, setSignInStatus] = useState<string>("");
  const [open, setOpen] = useState(false);
  const handleOpen = (status: string) => {
    setSignInStatus(status);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const onSubmit = (data: FieldValues) => {
    Axios.post(
      "http://localhost:4000/login",
      {
        username: data.username,
        password: data.password,
      },
      {
        withCredentials: true,
      }
    )
      .then((res: AxiosResponse) => {
        console.log(res.data);
        if (res.data === "success") {
          window.location.href = "/";
        } else {
          handleOpen(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        handleOpen(err.response.data);
      });
  };
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
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
                  {
                    errorList.find((el) => el.title === signInStatus)
                      ?.description
                  }
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Modal>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            // backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundImage: `url(${ChatBg})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 4,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
                {...register("username")}
                error={errors.username?.message?.toString() ? true : false}
                helperText={errors.username?.message?.toString()}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register("password")}
                error={errors.password?.message?.toString() ? true : false}
                helperText={errors.password?.message?.toString()}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Link
                  component={RLink}
                  to="/requestnewpassword"
                  variant="body2"
                >
                  {"Forgot password?"}
                </Link>
                <Link component={RLink} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Box>

              <Box sx={{ marginTop: 5 }}>
                <Divider>OR</Divider>
                <Typography sx={{ marginTop: 2, color: "text.secondary" }}>
                  Continue with
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Box style={{ margin: 10, padding: 10 }}>
                  <a href="#">
                    <img
                      style={{ width: 60, height: 60 }}
                      src={FacebookOfficial}
                    />
                  </a>
                </Box>
                <Box style={{ margin: 10, padding: 10 }}>
                  <a href="#">
                    <img style={{ width: 70, height: 70 }} src={GoogleIcon} />
                  </a>
                </Box>
                <Box style={{ margin: 10, padding: 10 }}>
                  <a href="#">
                    <img
                      style={{ width: 70, height: 60 }}
                      src={TwitterOfficial}
                    />
                  </a>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
