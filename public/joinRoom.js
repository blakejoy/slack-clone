function joinRoom(roomName){
nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
    document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers}<span class="glyphicon glyphicon-user"></span>`
})
    nsSocket.on('historyCatchUp', (history) => {
        const messageUl = document.getElementById('messages');
        messageUl.innerHTML = '';
        history.forEach((msg) => {
          const newMsg = buildHTML(msg);
          const currentMessages = messageUl.innerHTML;
          messageUl.innerHTML = currentMessages + newMsg;
        })
        messageUl.scrollTo(0, messageUl.scrollHeight)
    })
    nsSocket.on('updateMembers', (numberOfMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numberOfMembers}<span class="glyphicon glyphicon-user"></span>`
        document.querySelector('.curr-room-text').innerText = `${roomName}`
    })
    let searchBox = document.getElementById('search-box');
    searchBox.addEventListener('input', (e) => {
    console.log(e.target.value)
        let messages = [...document.getElementsByClassName('message-text')];
    messages.forEach((msg) => {
        if(msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1){
            msg.style.display = 'none';
        }else{
            msg.style.display = 'block';
        }
    })
    })
}
