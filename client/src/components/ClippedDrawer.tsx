import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import ConversationHeader from "./ConversationHeader";
import { myContext } from "../context/Context";
import Logout from "./Logout";
import Axios from "axios";
import { IConversation } from "../interfaces/IConversation";
import ConversationDisplay from "./ConversationDisplay";
import SendIcon from "@mui/icons-material/Send";
import {
  Button,
  Input,
  ListItem,
  ListItemAvatar,
  Modal,
  Popover,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const EmojiIcon: string =
  require("../assets/emoji-very-happy-svgrepo-com.svg").default;

const drawerWidth = 500;
const EMOJI_API_KEY = "586ab9b44aed239e91e4ee2e8f953e1321d21563";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

export default function ClippedDrawer() {
  const [text, setText] = useState<string>("");
  const [emojiSearch, setEmojiSearch] = useState<string>("");
  const [emojisList, setEmojisList] = useState<any[]>();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const context = useContext(myContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationData, setSelectedConversationData] = useState({
    userProfilePicture: "",
    username: "",
    conversationId: "",
  });

  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const response = await Axios.get(
          `https://emoji-api.com/emojis?access_key=${EMOJI_API_KEY}`
        );
        setEmojisList(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEmojis();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:4000/conversations/${context._id}`
        );
        setConversations(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchConversations();
  }, [conversations]);

  const handleEmojiSearch = (e: any) => {
    const value = e.target.value;
    setEmojiSearch(value);
  };

  const addEmoji = (emojiCharacter: string) => {
    const newText = text.concat(emojiCharacter);
    setText(newText);
  };

  const sendText = async () => {
    try {
      const res = await Axios.post("http://localhost:4000/messages/", {
        conversationId: selectedConversationData.conversationId,
        sender: context._id,
        text: text,
      });
      setText("");
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <AppBar
          sx={{
            // backgroundColor: "red",
            position: "absolute",
            width: "100%",
            // zIndex: "1400",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                columnGap: 2,
              }}
            >
              <Avatar src={context.userProfilePicture} />
              <Typography variant="h6" noWrap component="div">
                {context.username}
              </Typography>
            </Box>
            <Logout />
          </Toolbar>
        </AppBar>
        <Toolbar />
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
            {conversations.map((c: IConversation) => (
              <div key={c.members.find((m) => m !== context._id)!}>
                <ConversationHeader
                  setSelectedConversationData={setSelectedConversationData}
                  conversation={c}
                  currentUserId={context._id!}
                />
                <Divider variant="inset" component="li" />
              </div>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mb: 10,
          bgcolor: "#fefae0", // fefae0
          minHeight: "100vh",
        }}
      >
        {selectedConversationData ? (
          <ConversationDisplay conversationData={selectedConversationData} />
        ) : (
          <>
            <Typography paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Rhoncus dolor purus non enim praesent elementum facilisis leo vel.
              Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
              gravida rutrum quisque non tellus. Convallis convallis tellus id
              interdum velit laoreet id donec ultrices. Odio morbi quis commodo
              odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum
              est ultricies integer quis. Cursus euismod quis viverra nibh cras.
              Metus vulputate eu scelerisque felis imperdiet proin fermentum
              leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt
              lobortis feugiat vivamus at augue. At augue eget arcu dictum
              varius duis at consectetur lorem. Velit sed ullamcorper morbi
              tincidunt. Lorem donec massa sapien faucibus et molestie ac.
            </Typography>
            <Typography paragraph>
              Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
              ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
              elementum integer enim neque volutpat ac tincidunt. Ornare
              suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
              volutpat consequat mauris. Elementum eu facilisis sed odio morbi.
              Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
              ornare massa eget egestas purus viverra accumsan in. In hendrerit
              gravida rutrum quisque non tellus orci ac. Pellentesque nec nam
              aliquam sem et tortor. Habitant morbi tristique senectus et.
              Adipiscing elit duis tristique sollicitudin nibh sit. Ornare
              aenean euismod elementum nisi quis eleifend. Commodo viverra
              maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin
              aliquam ultrices sagittis orci a.
            </Typography>
          </>
        )}

        {selectedConversationData.username.length > 0 ? (
          <Box
            sx={{
              bgcolor: "#ffffff", // e9ecef
              py: 2,
              position: "fixed",
              bottom: 0,
              left: drawerWidth,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              columnGap: 1,
            }}
          >
            <Box sx={{ mx: 2, my: 1, cursor: "pointer" }} onClick={handleOpen}>
              <img style={{ width: 30, height: 30 }} src={EmojiIcon} />
            </Box>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {emojisList ? (
                  <>
                    <TextField
                      onKeyUp={(e) => handleEmojiSearch(e)}
                      label="Search emojis"
                      sx={{ mb: 2 }}
                      fullWidth
                      autoFocus
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        overflow: "scroll",
                        gap: 1,
                        height: 400,
                      }}
                    >
                      {emojisList.map((emoji) => {
                        if (emojiSearch?.length > 0) {
                          if (emoji.unicodeName.includes(emojiSearch))
                            return (
                              <Typography
                                onClick={() => addEmoji(emoji.character)}
                                sx={{ fontSize: 24, cursor: "pointer" }}
                              >
                                {emoji.character}
                              </Typography>
                            );
                        } else {
                          return (
                            <Typography
                              onClick={() => addEmoji(emoji.character)}
                              sx={{ fontSize: 24, cursor: "pointer" }}
                            >
                              {emoji.character}
                            </Typography>
                          );
                        }
                      })}
                    </Box>
                  </>
                ) : (
                  <div>Nope</div>
                )}
              </Box>
            </Modal>
            <TextField
              value={text}
              onChange={(e: any) => setText(e.target.value)}
              sx={{
                flex: 5,
              }}
              InputProps={{ disableUnderline: true }}
              minRows={1}
              variant="filled"
              multiline
            />
            <Button
              onClick={sendText}
              sx={{ mr: 1 }}
              variant="contained"
              size="small"
            >
              <SendIcon />
            </Button>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
