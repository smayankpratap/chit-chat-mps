// Node server which will handle socket io connection

// this piece of code imports 'socket.io' and also helps us to deal with the error related to CORS
// and also run the command 'python3 -m http.server --cgi 5000' in terminal it requires to have python3 in your system
/*
const io = require('socket.io')(8000, {
    cors: {
        origin: '*'
    }
});*/


const PORT = process.env.PORT || 8000;
const express = require('express');
const app = express();

const http = require('http');
const server = http.Server(app);

app.use(express.static('client'));

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

const io = require('socket.io')(server);


// this object saves info about all socket in form of their socket.id and name as (key: value) pair
const users = {}; 

io.on('connection', socket => {
    // If any new user joins, let other connected users know
    socket.on('new-user-joined', name => {
        // console.log(`${name} joined.`);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name); 
    });

    // If someone sends a message, broadcast it to all other connected users
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    // In socket.io when an user gets disconnected then by default 'disconnect' event ocurrs, 'disconnect' is built-in event
    socket.on('disconnect', () => {
        socket.broadcast.emit('left-chat', users[socket.id]);
        delete users[socket.id];
    })
});
