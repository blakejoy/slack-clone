const express =  require('express');
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');


const app = express();
app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000)


const io = socketio(expressServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: false
    }});



io.on('connection', (socket) => {
    // console.log(socket.handshake)
    let nsData = namespaces.map(ns => ({image: ns.img, endpoint: ns.endpoint}))
    socket.emit('nsList', nsData)
})

namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connection', (nsSocket) =>{
        const username = nsSocket.handshake.query.username
        nsSocket.emit('nsRoomLoad', namespace.rooms)
        nsSocket.on('joinRoom', async (roomToJoin, numberOfUsersCallback) => {
            const roomToLeaveTitle = [...nsSocket.rooms][1];
            nsSocket.leave(roomToLeaveTitle)
            await updateUsersInRoom(namespace, roomToLeaveTitle)
            nsSocket.join(roomToJoin);


            const nsRoomToJoin = namespace.rooms[roomToJoin];
            nsSocket.emit('historyCatchUp', nsRoomToJoin.history);

            updateUsersInRoom(namespace, roomToJoin)
        })

        nsSocket.on('newMessageToServer', (msg) => {
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username,
                avatar: 'https://via.placeholder.com/30'
            }

            const roomTitle = [...nsSocket.rooms][1];
            const nsRoom = namespace.rooms[roomTitle]
            nsRoom.addMessage(fullMsg);
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)
        })
    })
})


async function updateUsersInRoom(namespace, roomToJoin){
    const clients =  await io.of(namespace.endpoint).in(roomToJoin).allSockets();
    io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.size);

}
