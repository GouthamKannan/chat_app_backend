const express = require("express");
const cors = require('cors');
require("dotenv").config({ path: ".env" });
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fetch = require("node-fetch")

const ChatController = require('./controller/chat');


const JWT_SIGNING_KEY = process.env.JWT_SIGNING_KEY;

// Initialize the express server
const app = express();
app.use(cookieParser());
app.use(cors({credentials: true, origin: process.env.UI_HOST}));
app.use(express.json());

var http = require('http').createServer(app)
var io = require("socket.io")(http, {
  cors : {
    origin: process.env.UI_HOST,
    methods : ["GET", "POST"]
  }
})



io.on('connection', (socket) => {
  console.log("new client connected")

  socket.on("add_message", async(chat_details) => {
    console.log("Got data")
    console.log("add_message")
    console.log(chat_details)
    const { user_name, group_name, timestamp, message } = chat_details;
    await ChatController.add_chat( user_name, group_name, timestamp, message)
    console.log("added message")

    // Get the chat from the database and update the state variable
    console.log(group_name)
    data = await ChatController.get_chats(group_name);
    console.log(data)
    io.emit("new_message", data)
  })
})

// io.on("add_message", async (chat_details) => {
//   console.log("add_message")
//   const { user_name, group_name, timestamp, message } = chat_details;
//   var response = await fetch("http://localhost:3000" + "/chat/add_chat", {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//         user_name,
//         group_name,
//         timestamp,
//         message
//     })
//   })
//   var data = await response.json()
//   console.log("added message")

//   // Get the chat from the database and update the state variable
//   response = await fetch("http://localhost:3000" + "/chat/get_chats", {
//     method : "GET",
//     credentials: "include",
//   })
//   data = await response.json()
//   io.emit("new_message", data)
// })

http.listen(process.env.SOCKET_PORT, () => {
  console.log(`socket listing to ${process.env.SOCKET_PORT}`)
})

// Middleware to verify JWT
app.use((req, res, next) => {
  if (req.cookies.session_id) {
      try {
          userDetails = jwt.verify(req.cookies.session_id, JWT_SIGNING_KEY)
      } catch (error) {
          console.error('Error in verifying JWT :: ', error)
          return res.status(401).json({ success: false, data: "Invalid session" })
      }
  }
  next()
})

// API endpoint for testing
app.get("/", (req, res) => {
  return res.json("success");
});

// Initialize routes
const chatRouter = require('./routes/chat');
const groupRouter = require('./routes/group');
const userRouter = require('./routes/user');

app.use('/chat', chatRouter);
app.use('/group', groupRouter);
app.use('/user', userRouter);

// Set the port to listen
app.listen(process.env.PORT, () => {
  console.log(`server running at port ${process.env.PORT}`);
});
