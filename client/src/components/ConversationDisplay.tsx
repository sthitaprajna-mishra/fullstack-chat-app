import {
  AppBar,
  Avatar,
  Box,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import React, { useEffect, useState, useContext, useRef } from "react";
import Axios from "axios";
import Message from "./Message";
import { myContext } from "../context/Context";

type Props = {
  conversationData: any;
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

const theme = createTheme();

function ConversationDisplay({ conversationData }: Props) {
  const context = useContext(myContext);
  const [totalMessages, setTotalMessages] = useState<number>();
  const scrollRef: any = useRef(null);
  const [messages, setMessages] = useState<any[]>();

  useEffect(() => {
    const getAllMessages = async () => {
      if (conversationData.conversationId.length > 0) {
        try {
          const response = await Axios.get(
            `http://localhost:4000/messages/${conversationData.conversationId}`
          );
          // handleDate(response.data[0].createdAt);
          setMessages(response.data);
          scrollRef.current?.scrollIntoView({
            behaviour: "smooth",
          });
          scrollRef.current = null;
          setTotalMessages(response.data.length);
        } catch (err) {
          console.log(err);
        }
      }
    };

    getAllMessages();
  }, [messages, conversationData]);

  return (
    <>
      <AppBar
        sx={{
          width:
            conversationData.conversationId.length > 0
              ? `calc(100% - ${theme.spacing(62)})`
              : 0,
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              columnGap: 2,
              paddingLeft: 2,
            }}
          >
            <Avatar src={conversationData.userProfilePicture} />
            <Typography variant="h6" noWrap component="div">
              {conversationData.username}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      {conversationData.conversationId.length > 0 ? <Toolbar /> : null}

      <Container>
        {messages ? (
          messages.map((message, index, arr) => {
            if (index == 0) {
              return (
                <Box key={message._id}>
                  <Box
                    sx={{
                      bgcolor: "#eaf4f4",
                      color: "grey",
                      width: "fit-content",
                      padding: 0.75,
                      fontSize: 12,
                      border: 0,
                      borderRadius: 1,
                      fontWeight: 700,
                      mx: "auto",
                      marginBottom: 2,
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {`${new Date(message.createdAt).getDate()} ${
                      months[new Date(message.createdAt).getMonth()]
                    } ${new Date(message.createdAt).getFullYear()}`}
                  </Box>
                  <Message
                    key={message._id}
                    currentUser={context._id}
                    messageData={message}
                  />
                </Box>
              );
            }
            if (index - 1 >= 0) {
              if (
                new Date(message.createdAt).toLocaleDateString() >
                new Date(arr[index - 1].createdAt).toLocaleDateString()
              ) {
                return (
                  <Box key={message._id}>
                    <Box
                      sx={{
                        bgcolor: "#eaf4f4",
                        color: "grey",
                        width: "fit-content",
                        padding: 0.75,
                        fontSize: 12,
                        border: 0,
                        borderRadius: 1,
                        fontWeight: 700,
                        mx: "auto",
                        marginBottom: 2,
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      {`${new Date(message.createdAt).getDate()} ${
                        months[new Date(message.createdAt).getMonth()]
                      } ${new Date(message.createdAt).getFullYear()}`}
                    </Box>
                    <Box ref={scrollRef}>
                      <Message
                        key={message._id}
                        currentUser={context._id}
                        messageData={message}
                      />
                    </Box>
                  </Box>
                );
              } else {
                return (
                  <Box ref={scrollRef}>
                    <Message
                      key={message._id}
                      currentUser={context._id}
                      messageData={message}
                    />
                  </Box>
                );
              }
            }
          })
        ) : (
          //   <>
          //     <Message currentUser={context._id} messageData={messages[0]} />
          //     <Message currentUser={context._id} messageData={messages[1]} />
          //   </>
          <Box sx={{ my: 2 }}>
            {[...new Array(12)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
              )
              .join("\n")}
          </Box>
        )}
      </Container>
    </>
  );
}

export default ConversationDisplay;
