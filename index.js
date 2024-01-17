const express = require("express")
const App = express()
const Port = 7777
const UserRouter = require("./Routes/UserRoutes")
// const AdminRouter = require("./Routes/AdminRoutes")
require('dotenv').config()
const mongoose = require("mongoose")
const cors = require("cors")
const socketIO = require("socket.io")


const http = require("http").createServer(App)
const io = socketIO(http)



mongoose.connect("mongodb://127.0.0.1/GlobalTweet")
    .then(() => {
      console.log('MongoDB Connected');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });

    
App.use(cors())
App.use(express.json())
App.use("/api/user",UserRouter)
// App.use("/api/admin",AdminRouter)



io.on("connection",(socket) => {
  console.log("A user connected");

  socket.on("message",(data) => {
    io.emit("message", data)
  })

  socket.on("notification", (notificationData) => {
    io.emit("notification", notificationData)
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
  })
})



App.listen(Port,()=>{
    console.log("Server is Running")
})