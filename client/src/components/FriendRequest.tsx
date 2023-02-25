import React, { useState, useEffect, useContext } from "react";
import GroupIcon from "@mui/icons-material/Group";
import { Badge } from "@mui/material";
import { myContext } from "../context/Context";
import Axios from "axios";

type Props = {};

export default function FriendRequest({}: Props) {
  const context = useContext(myContext);
  const [recievedFriendRequests, setRecievedFriendRequests] = useState<any>([]);
  useEffect(() => {
    const getRequests = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:4000/receivedfriendrequests/${context._id}`
        );
        setRecievedFriendRequests(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getRequests();
  }, []);
  return (
    <>
      <Badge badgeContent={recievedFriendRequests.length} color="error">
        <GroupIcon />
      </Badge>
    </>
  );
}
