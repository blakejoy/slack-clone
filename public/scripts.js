const username = prompt('What is your username?');
const socket = io('http://localhost:9000', {
    query: {
        username
    }
})
let nsSocket = '';

socket.on('nsList', (nsData) => {
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = '';
    let namespaces = ''
    nsData.forEach((ns) => {
        namespaces += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.image}" /></div>`
    })
    namespacesDiv.innerHTML = namespaces;

    [...document.getElementsByClassName('namespace')].forEach(el => el.addEventListener('click', (event) => {
        const nsEndpoint = el.getAttribute('ns');
        joinNs(nsEndpoint)

    }))

})

