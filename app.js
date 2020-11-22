//---------------------------------------------------------------------------//
// Imports
//---------------------------------------------------------------------------//

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var expressWs = require('express-ws');

const dbModule = require('./db');

const dbModule = require('./db');

//---------------------------------------------------------------------------//
// Configuration
//---------------------------------------------------------------------------//

process.env.NODE_ENV = 'production';

//---------------------------------------------------------------------------//
// Database Connection
//---------------------------------------------------------------------------//

dbModule.connect();

//---------------------------------------------------------------------------//
// Initialize Application
//---------------------------------------------------------------------------//

var app = express();
const http = require('http').createServer(app);
var io = require('socket.io')(http);

//---------------------------------------------------------------------------//
// App Configurations
//---------------------------------------------------------------------------//

// Initialize websocket.
expressWs(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set static files location.
app.use(express.static(path.join(__dirname, 'public')));

//---------------------------------------------------------------------------//
// Variables 
//---------------------------------------------------------------------------//

let eventCount = 0;

let wsConnections = [];

let wsConnection = {
    ws: null,
    userId: ''
}

//---------------------------------------------------------------------------//
// Routes 
//---------------------------------------------------------------------------//

app.use('/', indexRouter);

//---------------------------------------------------------------------------//
// Websocket Routes 
//---------------------------------------------------------------------------//


app.ws('/instructor', function(ws, req) {

    instructorWs = ws;

    ws.on('message', function(msg) {
        console.log(JSON.parse(msg));
        ws.send(msg);
    });
});


//---------------------------------------------------------------------------//
// SocketIO event handlers
//---------------------------------------------------------------------------//

io.on('connection', function(socket) {

    console.log(socket.id)
    console.log(socket.handshake.query)

    // User connected
    console.log(`User connected - ${socket.id}`);
    io.emit('chat.message', `login - ${socket.id}`);
    
    // Join room
    socket.join('room1');
    socket.to('room1').emit('cool', 'cool');
    
    socket.on('event', function(data){ 
        console.log(data);
    });
    
    socket.on('disconnect', function(){ 
        console.log('io disconnected');
    });
    
    socket.on('chat.message', function(msg) {
        console.log(`${msg} - ${socket.id} - ${socket.rooms}` );
        io.emit('chat.message', msg);
        socket.to('room1').emit('privateRoom', 'cool');
    });

});


//---------------------------------------------------------------------------//
// Middleware
//---------------------------------------------------------------------------//

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//---------------------------------------------------------------------------//
// Start Server
//---------------------------------------------------------------------------//

let port = process.env.PORT || 3000;
//app.listen(port);

http.listen(port, () => {
    console.log(`-- Node Server started on port ${port} --`);
});

//---------------------------------------------------------------------------//
// Exports
//---------------------------------------------------------------------------//

module.exports = app;

//---------------------------------------------------------------------------//