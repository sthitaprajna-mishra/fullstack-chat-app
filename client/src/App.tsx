import React, { useContext } from "react";
import "./App.css";
import ClippedDrawer from "./components/ClippedDrawer";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import VerifyEmail from "./components/VerifyEmail";
import ResetPassword from "./components/ResetPassword";
import ForgotPasswordRequest from "./components/ForgotPasswordRequest";
import { Routes, Route, Link as RLink, useNavigate } from "react-router-dom";
import { myContext } from "./context/Context";

function App() {
  const context = useContext(myContext);
  console.log(context);
  return (
    <div className="App">
      <Routes>
        {context ? (
          <>
            <Route path="/" element={<ClippedDrawer />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/requestnewpassword"
              element={<ForgotPasswordRequest />}
            />
            {/* <Route path="/chats" element={<ClippedDrawer />} /> */}
          </>
        ) : (
          <>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </>
        )}

        <Route path="user/verify" element={<VerifyEmail />} />
        <Route path="user/reset" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
