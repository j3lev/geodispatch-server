function namespace(socket) {
    console.log(socket.id + ' connected');
    socket.on('ADD_MARKER', data => {
        console.log('add marker request at', data);
        // TODO publish to DB
        setTimeout(() => {
            socket.emit('ADD_MARKER_SUCCESS', data);
        }, 3000);
    });
}

module.exports = namespace;