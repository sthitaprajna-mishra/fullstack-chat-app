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
  setSelectedConversationData: any;
};

const months: string[] = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Oct",
  "Nov",
  "Dec",
];

export default function ConversationHeader({
  conversation,
  currentUserId,
  setSelectedConversationData,
}: Props) {
  const [recipient, setRecipient] = useState<IUserInterface>();
  const [lastText, setLastText] = useState<string>("");
  const [lastTextTime, setLastTextTime] = useState<string>("");

  useEffect(() => {
    const recipientId = conversation.members.find((m) => m !== currentUserId);
    const getUser = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:4000/findUser/${recipientId}`
        );
        setRecipient(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getLastText = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:4000/messages/getlasttext/${conversation._id}`
        );
        handleTime(new Date(response.data.createdAt));
        if (response.data.text.length > 60)
          setLastText(`${response.data.text.substring(0, 61)}...`);
        else setLastText(response.data.text);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
    getLastText();
  }, [conversation, currentUserId]);

  const handleTime = (createdAt: Date) => {
    const previousDay = new Date(new Date().setDate(new Date().getDate() - 1));
    if (createdAt < previousDay) {
      const month = months[createdAt.getMonth()];
      const date = createdAt.getDate();
      const year = createdAt.getFullYear();
      setLastTextTime(`${date} ${month} ${year}`);
    } else {
      let hours = new Date(createdAt).getHours().toString();
      let minutes = new Date(createdAt).getMinutes().toString();

      if (parseInt(hours) > 12) hours = (parseInt(hours) - 12).toString();
      if (parseInt(hours) == 0) hours = (12).toString();

      if (parseInt(minutes) < 10) minutes = "0".concat(minutes);

      if (parseInt(hours) > 12) {
        setLastTextTime(`${hours}:${minutes} pm`);
      } else {
        setLastTextTime(`${hours}:${minutes} am`);
      }
    }
  };

  return (
    <>
      <ListItem
        alignItems="flex-start"
        onClick={() =>
          setSelectedConversationData({
            userProfilePicture: recipient?.userProfilePicture,
            username: recipient?.username,
            conversationId: conversation._id,
          })
        }
      >
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
              <Typography variant="body2">{lastTextTime}</Typography>
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
      <Divider variant="inset" component="li" />
    </>
  );
}
