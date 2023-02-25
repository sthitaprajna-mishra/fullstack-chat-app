import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Axios from "axios";
import { myContext } from "../context/Context";
import DoneIcon from "@mui/icons-material/Done";
import {
  List,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

type Props = {};

export default function SearchUsers({}: Props) {
  const [pendingFriendRequests, setPendingFriendRequests] = useState<any>();
  const [friendReqOpen, setFriendReqOpen] = React.useState(false);
  const context = useContext(myContext);
  const [userInput, setUserInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any>([]);

  const friendReqHandleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setFriendReqOpen(false);
  };

  useEffect(() => {
    const getPendingFriendRequests = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:4000/pendingfriendrequests/${context._id}`
        );
        console.log(response.data);
        console.log(
          response.data
            .map((el: any) => el.requestedTo)
            .includes("63fa01fed084594676ff2ab9")
        );
        setPendingFriendRequests(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getPendingFriendRequests();
  }, [friendReqOpen]);

  const searchUsers = async () => {
    try {
      console.log(userInput);
      if (userInput.length > 0) {
        const response = await Axios.get(
          `http://localhost:4000/searchUsers/${userInput}`
        );
        setSearchResults(
          response.data.filter((user: any) => user._id != context._id)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendRequest = async (userId: string) => {
    const payload = {
      requestedBy: context._id,
      requestedTo: userId,
    };
    try {
      await Axios.post("http://localhost:4000/sendfriendrequest", payload);
      setFriendReqOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Snackbar
        open={friendReqOpen}
        autoHideDuration={6000}
        onClose={friendReqHandleClose}
      >
        <Alert
          onClose={friendReqHandleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Friend request sent!
        </Alert>
      </Snackbar>

      <Box sx={{ display: "flex", alignItems: "flex-end", px: 1 }}>
        <TextField
          value={userInput}
          onChange={(e: any) => setUserInput(e.target.value)}
          fullWidth
          sx={{ pr: 2 }}
          id="input-with-sx"
          label="Search users"
          variant="standard"
          size="small"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchUsers();
            }
          }}
        />
        <Button
          type="submit"
          variant="contained"
          onClick={searchUsers}
          sx={{ mr: 1 }}
          size="small"
        >
          <Typography sx={{ fontSize: 14, textTransform: "capitalize" }}>
            Search
          </Typography>
        </Button>
      </Box>
      {searchResults ? (
        <>
          <Box sx={{ overflow: "auto" }}>
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                "& .MuiListItem-root:hover": {
                  bgcolor: "#ebf1ef",
                  cursor: "pointer",
                },
              }}
            >
              {searchResults.map((user: any) => (
                <Box key={user._id}>
                  <ListItem
                    alignItems="center"
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box sx={{ display: "flex" }}>
                      <ListItemAvatar>
                        <Avatar src={user?.userProfilePicture} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: 700 }}>
                            {user?.username}
                          </Typography>
                        }
                      />
                    </Box>
                    {context.friends!.includes(user._id) ? (
                      <Button
                        disabled
                        sx={{ ml: 10 }}
                        size="small"
                        variant="contained"
                        endIcon={<DoneIcon />}
                      >
                        <Typography
                          sx={{ fontSize: 14, textTransform: "capitalize" }}
                        >
                          Friends
                        </Typography>
                      </Button>
                    ) : (
                      <Button
                        sx={{ ml: 10 }}
                        size="small"
                        variant="contained"
                        endIcon={<PersonAddIcon />}
                        onClick={() => sendRequest(user._id)}
                        disabled={pendingFriendRequests
                          .map((el: any) => el.requestedTo)
                          .includes(user._id)}
                      >
                        <Typography
                          sx={{ fontSize: 14, textTransform: "capitalize" }}
                        >
                          {pendingFriendRequests
                            .map((el: any) => el.requestedTo)
                            .includes(user._id)
                            ? "Sent Friend Request"
                            : "Send Friend Request"}
                        </Typography>
                      </Button>
                    )}
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Box>
              ))}
            </List>
          </Box>
        </>
      ) : null}
    </>
  );
}
