import { Box } from "@mui/material";
import React, { useState } from "react";

type Props = {
  // dateDetails: any;
  messageData: any;
  currentUser: string | undefined;
};

export default function Message({
  // dateDetails,
  currentUser,
  messageData,
}: Props) {
  const { sender, text, createdAt } = messageData;
  // console.log(dateDetails);
  let time: string;
  let hours = new Date(createdAt).getHours().toString();
  let minutes = new Date(createdAt).getMinutes().toString();

  if (parseInt(minutes) < 10) minutes = "0".concat(minutes);

  if (parseInt(hours) > 12) {
    hours = (parseInt(hours) - 12).toString();
    time = `${hours}:${minutes} pm`;
  } else {
    if (parseInt(hours) == 0) hours = (12).toString();
    time = `${hours}:${minutes} am`;
  }

  return (
    <>
      {currentUser !== sender ? (
        <Box
          sx={{
            backgroundColor: "#ffffff",
            color: "#000000",
            fontSize: 14,
            display: "flex",
            flexDirection: "column",
            width: "fit-content",
            minWidth: "10%",
            maxWidth: "85%",
            padding: 1,
            textAlign: "left",
            border: 0,
            borderRadius: 1,
            marginBottom: 2,
            boxShadow:
              "0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2.5px 5px 0 rgba(0, 0, 0, 0.19);",
          }}
        >
          <Box>{text}</Box>
          <Box sx={{ textAlign: "right", fontSize: 10, color: "grey" }}>
            {time}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            marginBottom: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#4361ee", // caffbf
              color: "#ffffff",
              width: "fit-content",
              minWidth: "10%",
              maxWidth: "85%",
              fontSize: 14,
              padding: 1,
              textAlign: "left",
              border: 0,
              borderRadius: 1,
              boxShadow:
                "0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2.5px 5px 0 rgba(0, 0, 0, 0.19);",
            }}
          >
            <Box>{text}</Box>
            <Box sx={{ textAlign: "right", fontSize: 10, color: "#eeeeee" }}>
              {time}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
