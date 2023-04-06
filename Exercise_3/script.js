const historyNode = document.querySelector('.history');
const inputNode = document.querySelector('.input');
const btn_send = document.querySelector('.btn_send');
const btn_geo = document.querySelector('.btn_geo');

let websocket = new WebSocket('wss://echo-ws-service.herokuapp.com')
let connection = false;

websocket.onopen = function(evt){
    const connect = document.createElement('div');
    connect.innerHTML = 'Соединение с сервером установлено';
    connect.classList.add('connect');
    historyNode.appendChild(connect);
    connection = true;
}

websocket.onclose = function(evt){
    const disconnect = document.createElement('div');
    disconnect.innerHTML = 'Соединение с сервером закрыто';
    disconnect.classList.add('disconnect');
    historyNode.appendChild(disconnect);
    connection = false;
}

websocket.onerror = function(evt){
    const connectError = document.createElement('div');
    connectError.innerHTML = 'Ошибка соединения с сервером';
    connectError.classList.add('connect_error');
    historyNode.appendChild(connectError);
    connection = false;
}

websocket.onmessage = function(evt){
    if (!evt.data.startsWith('https://www.openstreetmap.org')) {
        addHistory(evt.data, 'server');
    }
};

function addHistory(msg, from){
    const divMsg = document.createElement('div');
    const message = `<p class="msg">${msg}</p>`;
    divMsg.classList.className = '';
    divMsg.classList.add(from);
    divMsg.innerHTML = message;
    historyNode.appendChild(divMsg);
    historyNode.scrollTop = historyNode.scrollHeight;
}

inputNode.addEventListener('keydown', (e) => {
    if (e.keyCode === 13){
        const textInput = inputNode.value;
        if (textInput){
            addHistory(textInput, 'client');
            document.querySelector('.input').value = '';
            websocket.send(textInput);
        }
    }
});

btn_send.addEventListener('click', () => {
    const textInput = inputNode.value;
    if (textInput){
        addHistory(textInput, 'client');
        document.querySelector('.input').value = '';
        websocket.send(textInput);
    }
});

btn_geo.addEventListener('click', () => {
    if (connection) {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { coords } = position;
                const geoLink = `https://www.openstreetmap.org/#map=3/${coords.latitude}/${coords.longitude}`;
                const geoLinkMessage = `<a href="${geoLink}">Гео-позиция</a>`;
                addHistory(geoLinkMessage, 'client');
                websocket.send(geoLink)
            })
        }
    }
});
