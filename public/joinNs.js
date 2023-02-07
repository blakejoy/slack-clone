function joinNs(endpoint) {
    if (nsSocket) {
        nsSocket.close();
        document.querySelector('#user-input').removeEventListener('submit',formSubmission);
    }
    nsSocket = io(`http://localhost:9000${endpoint}`)
    nsSocket.on('nsRoomLoad', (nsRooms) => {
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = '';

        for(let room in nsRooms){
            let glpyh;
            const nsRoom = nsRooms[room];
            if (nsRoom.privateRoom) {
                glpyh = 'lock'
            } else {
                glpyh = 'globe'
            }
            roomList.innerHTML += `<li class="room"><span class="bi bi-${glpyh}"></span>${nsRoom.roomTitle}</li>`
        }


        let roomNodes = [...document.getElementsByClassName('room')];
        roomNodes.forEach(roomNode => {
            roomNode.addEventListener('click', (el) => {
                joinRoom(el.target.innerText)
            })
        })
        const topRoom = document.querySelector('.room');
        const topRoomName = topRoom.innerText;
        joinRoom(topRoomName)
    })

    nsSocket.on('messageToClients', (msg) => {
        const newMsg = buildHTML(msg);
        document.getElementById('messages').innerHTML += newMsg
    })

    document.querySelector('#user-input').addEventListener('submit', formSubmission)

}

function formSubmission(event){
        event.preventDefault();
        const newMessage = document.getElementById('user-message').value
        nsSocket.emit('newMessageToServer', {text: newMessage})
        document.getElementById('user-message').value = '';
}

function buildHTML(msg){
    const convertedDate = new Date(msg.time).toLocaleTimeString();

    return newHTML =  `
     <li>
                    <div class="user-image">
                        <img src="${msg.avatar}" />
                    </div>
                    <div class="user-message">
                        <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
                        <div class="message-text">${msg.text}</div>
                    </div>
                </li>
    
    `
}
