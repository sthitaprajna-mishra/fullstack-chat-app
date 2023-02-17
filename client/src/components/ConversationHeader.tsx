import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { IConversation } from "../interfaces/IConversation";
import Axios from "axios";
import { IUserInterface } from "../interfaces/IUserInterface";
import Divider from "@mui/material/Divider";

type Props = {
  conversation: IConversation;
  currentUserId: string;
};

export default function ConversationHeader({
  conversation,
  currentUserId,
}: Props) {
  const [recipient, setRecipient] = useState<IUserInterface>();

  useEffect(() => {
    const recipientId = conversation.members.find((m) => m !== currentUserId);
    const getUser = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:4000/findUser/${recipientId}`
        );
        console.log(response);
        setRecipient(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [conversation, currentUserId]);

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar src={recipient?.userProfilePicture} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              component="div"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography sx={{ fontWeight: 700 }}>
                {recipient?.username}
              </Typography>
              <Typography variant="body2">{"9:29 pm"}</Typography>
            </Typography>
          }
          secondary={
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.secondary"
            >
              lastText
            </Typography>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}
