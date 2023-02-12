import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";

type Props = {
  recipientName: string;
  lastText: string;
};

export default function ConversationHeader({ recipientName, lastText }: Props) {
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar
          alt="Remy Sharp"
          src="https://xsgames.co/randomusers/avatar.php?g=male"
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontWeight: 700 }}>{recipientName}</Typography>
            <Typography variant="body2">9:29 pm</Typography>
          </Typography>
        }
        secondary={
          <Typography
            sx={{ display: "inline" }}
            component="span"
            variant="body2"
            color="text.secondary"
          >
            {lastText}
          </Typography>
        }
      />
    </ListItem>
  );
}
