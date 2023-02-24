import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import OnlineFriendDetail from "./OnlineFriendDetail";

export default function OnlineFriends({ onlineFriendsList }: any) {
  console.log(onlineFriendsList);

  return (
    <Box sx={{ overflow: "auto" }}>
      <List
        sx={{
          width: "100%", //maxWidth: 360,
          bgcolor: "background.paper",
          "& .MuiListItem-root:hover": {
            bgcolor: "#ebf1ef",
            cursor: "pointer",
          },
        }}
      >
        {onlineFriendsList.map((user: any) => (
          <div key={user.userId}>
            <OnlineFriendDetail user={user} />
            <Divider variant="inset" component="li" />
          </div>
        ))}
      </List>
    </Box>
  );
}
