//---------------------------------------------------------------------------//
// Imports
//---------------------------------------------------------------------------//

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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
// App Configurations
//---------------------------------------------------------------------------//

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//---------------------------------------------------------------------------//
// Routes Handlers
//---------------------------------------------------------------------------//

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get('/', function (req, res) {
    res.send({ 
        title: "MongoDB API Entry Point" 
    });
})

app.get('/get', async function (req, res) {
    
    console.log('GET');

    const database = dbModule.getClient();
    const collection = database.collection('animals');

    const users = await collection.find().toArray(async function(err, items){

        res.json(items);

    });


});

app.get('/post', async function (req, res) {

    console.log('POST');

    const database = dbModule.getClient();
    const collection = database.collection('animals');

    let newUser = {
        name: 'bob',
        age: 22,
    }
    
    const result = await collection.insertOne(newUser);

    res.json({
        user: newUser
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

let port = process.env.PORT || 4000;

app.listen(port);
console.log(`-- Node Server started on port ${port} --`);

//---------------------------------------------------------------------------//
// Exports
//---------------------------------------------------------------------------//

module.exports = app;

//---------------------------------------------------------------------------//