import React, { useState, useEffect } from "react";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Axios from "axios";
import CircleIcon from "@mui/icons-material/Circle";

type Props = {
  user: any;
};

export default function OnlineFriendDetail({ user }: Props) {
  const [onlineFriend, setOnlineFriend] = useState<any>();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:4000/findUser/${user.userId}`
        );
        setOnlineFriend(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, []);

  return (
    <>
      <ListItem alignItems="center">
        <ListItemAvatar>
          <Avatar src={onlineFriend?.userProfilePicture} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              component="div"
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>
                {onlineFriend?.username}
              </Typography>
            </Typography>
          }
        />
        <CircleIcon fontSize="small" color="success" />
      </ListItem>
    </>
  );
}
