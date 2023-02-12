// React
import React, { useEffect, useState } from "react";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, AlertTitle, Badge, IconButton, Modal } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
// Error
import { errorList } from "../config/errorList";
// uuidv4
import { v4 as uuidv4 } from "uuid";

const SuccessIcon: string =
  require("../assets/success-svgrepo-com.svg").default;

const MailIcon: string =
  require("../assets/email-part-2-svgrepo-com.svg").default;

const ErrorIcon: string =
  require("../assets/erroricon-svgrepo-com.svg").default;

const ErrorBg: string = require("../assets/errorBg-svgrepo-com.svg").default;

const UserDefaultProfileIcon: string =
  require("../assets/defaultprofile.svg").default;

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

const IMAGEKITIO_PUBLIC_KEY = "public_4acFW+bY8EFRt2LbrdVfdem+MHo=";

export default function SignUp() {
  // imagekitio cloud
  const publicKey = process.env.REACT_APP_IMAGEKITIO_PUBLIC_KEY;
  const urlEndpoint = `${process.env.REACT_APP_IMAGEKITIO_URL_ENDPOINT$}`;
  const authenticationEndpoint = process.env.REACT_APP_IMAGEKITIO_AUTH_ENDPOINT;
  const [base64, setBase64] = useState<string>("");

  const uploadImageHandler = () => {
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    let base64file: string | undefined = "";

    // file to base64 string
    var reader = new FileReader();
    reader.readAsDataURL(imageFile!);

    reader.onload = () => {
      base64file = reader.result?.toString();
      console.log(base64file); //base64encoded string
    };

    Axios.get("http://localhost:4000/calculatesignature")
      .then((res) => {
        console.log(res.data);
        Axios.post(
          "https://upload.imagekit.io/api/v1/files/upload",
          {
            file: base64file,
            publicKey: IMAGEKITIO_PUBLIC_KEY,
            signature: res.data.signature,
            expire: res.data.expire,
            token: res.data.token,
            fileName: uuidv4(),
            useUniqueFileName: true,
          },
          config
        )
          .then((res) => console.log(res))
          .catch((err) => console.log(err.response));
      })
      .catch((err) => console.log(err));
  };

  const [imageFile, setImageFile] = useState<File>();
  const [userProfilePictureSettings, setUserProfilePictureSettings] =
    useState<string>("Default");
  const [userProfilePicture, setUserProfilePicture] = useState<any>(
    UserDefaultProfileIcon
  );
  const [userProfilePictureFileType, setUserProfilePictureFileType] =
    useState<boolean>(false);
  const [userProfilePictureFileSize, setUserProfilePictureFileSize] =
    useState<boolean>(false);

  function getBase64(file: File) {
    return new Promise(function (resolve, reject) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = reject;
      reader.onload = function () {
        resolve(reader.result);
      };
    });
  }

  const handleUserProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedPicture = e.target.files![0];
    console.log("just uploaded");
    console.log(selectedPicture);

    // file type validation
    if (
      !["image/jpeg", "image/jpg", "image/png"].includes(selectedPicture.type)
    ) {
      setUserProfilePictureFileType(true);
      return;
    }
    // file size validation
    if (selectedPicture.size >= 2000000) {
      setUserProfilePictureFileSize(true);
      return;
    }
    setUserProfilePictureFileSize(false);
    setUserProfilePictureFileType(false);
    setUserProfilePicture(URL.createObjectURL(selectedPicture));
    console.log(URL.createObjectURL(selectedPicture));
    setImageFile(selectedPicture);

    getBase64(selectedPicture).then((res) => {
      setBase64(res + "");
      console.log(base64);
    });

    setUserProfilePictureSettings("Custom");
  };

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
    username: yup.string().required("Username is a mandatory field"),
    email: yup
      .string()
      .email("Email must be a valid email")
      .required("Email is a mandatory field"),
    password: yup
      .string()
      .min(3, "Password must be at least 3 characters")
      .max(20, "Password must be at most 20 characters")
      .required("Password is a mandatory field"),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
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
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    Axios.get("http://localhost:4000/calculatesignature")
      .then((res) => {
        console.log(res.data);
        Axios.post(
          "https://upload.imagekit.io/api/v1/files/upload",
          {
            file: base64,
            publicKey: IMAGEKITIO_PUBLIC_KEY,
            signature: res.data.signature,
            expire: res.data.expire,
            token: res.data.token,
            fileName: uuidv4(),
            useUniqueFileName: true,
          },
          config
        )
          .then((res) => console.log(res))
          .catch((err) => console.log(err.response));
      })
      .catch((err) => console.log(err));
    // console.log(data);
    // Axios.post("http://localhost:4000/register", {
    //   username: data.username,
    //   password: data.password,
    //   email: data.email,
    // })
    //   .then((res: AxiosResponse) => {
    //     console.log(res);
    //     handleOpen(res.data);
    //   })
    //   .catch((err) => handleOpen(err.response.data));
  };

  // terms and conditions
  const [checkTC, setCheckTC] = useState<boolean>(false);

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
                      verify your email address and activate your account. The
                      link in the email will expire in 6 hours.
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
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                    height: 30,
                    width: 30,
                  }}
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => handleUserProfilePictureUpload(e)}
                  />
                  <PhotoCamera sx={{ height: 20, width: 20 }} />
                </Avatar>
              </IconButton>
            }
          >
            {userProfilePictureSettings === "Default" ? (
              <Avatar
                sx={{
                  mt: 2,
                  height: 60,
                  width: 60,
                  padding: 1,
                  border: `2px solid #bdbdbd`,
                }}
                src={userProfilePicture}
              />
            ) : (
              <Avatar
                sx={{
                  mt: 2,
                  height: 60,
                  width: 60,
                  padding: 0,
                }}
                src={userProfilePicture}
              />
            )}
          </Badge>
          {userProfilePictureFileSize ? (
            <Alert sx={{ mt: 1, textAlign: "left" }} severity="warning">
              <AlertTitle>Warning</AlertTitle>
              Image size must be less than — <strong>2MB</strong>
            </Alert>
          ) : null}
          {userProfilePictureFileType ? (
            <Alert sx={{ mt: 1, textAlign: "left" }} severity="warning">
              <AlertTitle>Warning</AlertTitle>
              We accept images of only — <strong>JPEG / JPG / PNG</strong> type
            </Alert>
          ) : null}
          <button onClick={uploadImageHandler}>Upload Image</button>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  {...register("username")}
                  error={errors.username?.message?.toString() ? true : false}
                  helperText={errors.username?.message?.toString()}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  {...register("email")}
                  error={errors.email?.message?.toString() ? true : false}
                  helperText={errors.email?.message?.toString()}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register("password")}
                  error={errors.password?.message?.toString() ? true : false}
                  helperText={errors.password?.message?.toString()}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  error={
                    errors.confirmPassword?.message?.toString() ? true : false
                  }
                  helperText={errors.confirmPassword?.message?.toString()}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkTC}
                      onChange={(e) => setCheckTC(e.target.checked)}
                      value="readTermsAndConditions"
                      color="primary"
                    />
                  }
                  label={
                    <div style={{ textAlign: "left" }}>
                      <span>I have read and agree to the </span>
                      <Link href="#" underline="hover">
                        Terms and Conditions
                      </Link>
                      .
                    </div>
                  }
                />
              </Grid>
            </Grid>
            <Button
              disabled={!checkTC}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RLink} to="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
