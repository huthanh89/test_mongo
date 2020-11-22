
//---------------------------------------------------------------------------//
// Imports
//---------------------------------------------------------------------------//

import Store from './store.js';

//---------------------------------------------------------------------------//
// SocketIO
//---------------------------------------------------------------------------//

$(function () {

    var socket = io(window.location.origin, {
        query:'loggeduser=user1'
    });

    socket.on('connect', function(){
        console.log('connected');
    });


    $('form').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('chat.message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat.message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });

    
    socket.on("privateRoom", function (args) {
        console.log('privateRoom', args);
        /* Doing something with the args... */
    });
});


//---------------------------------------------------------------------------//
// WebSockets
//---------------------------------------------------------------------------//

/*
const ws = new WebSocket('ws://localhost:4000/instructor');

ws.onopen = () => { 
    console.log('Now connected'); 

    let msg = {
        'name': 'foo'
    }

    ws.send(JSON.stringify(msg))

};

ws.onmessage = (msg) => {
    let data = JSON.parse(msg.data);
    console.log(msg.data);
};

ws.onerror = (error)  => {
    console.log(`WebSocket error: ${error}`)
}
*/