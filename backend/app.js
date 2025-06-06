const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const userRouter = require('./routes/UserRoute');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: process.env.FRONTEND,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRouter);
app.use(cookieParser());

const io = new Server(server, {
    cors: { origin: process.env.FRONTEND, credentials: true }
});

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log('User Connected:', socket.id);

    // Store username in cookie when the user joins
    socket.on("userJoined", (username) => {
        socket.username = username;

        if (!onlineUsers.includes(username)) {
            onlineUsers.push(username);
        }

        io.emit("onlineUsers", onlineUsers); //show all users Online
    });

    socket.on("sendMessage", (data) => {
        io.emit("receiveMessage", data);
    });

    socket.on("messageSeen", ({ messageId, from, to }) => {

        io.emit("messageSeenAck", { messageId, from, to }); //show specific user
    });
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.username || socket.id);

        if (socket.username) {
            onlineUsers = onlineUsers.filter(name => name !== socket.username);
            io.emit("onlineUsers", onlineUsers); // Update for all users
        }
    });
});



server.listen(process.env.PORT, () => {
    console.log("Server running on port 5000");
});
