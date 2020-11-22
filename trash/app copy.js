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

//---------------------------------------------------------------------------//
// Configuration
//---------------------------------------------------------------------------//

PRODUCTION = false;

//---------------------------------------------------------------------------//
// Database
//---------------------------------------------------------------------------//


var MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongod = new MongoMemoryServer();

let dbClient = null;

async function run(){
    const uri = await mongod.getUri();
    const port = await mongod.getPort();
    const dbPath = await mongod.getDbPath();
    const dbName = await mongod.getDbName();

    console.log('port', port)
    console.log('dbPath', dbPath)
    console.log('dbName', dbName)

    dbClient = mongod.getInstanceInfo();


}


run();









/*

var MongoClient = require('mongodb').MongoClient;

var f = require('util').format;
var fs = require('fs');
var ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];

let dbName = 'aws_local';
let uri = 'mongodb://localhost:27017';
let dbOption = {
    useUnifiedTopology:true
}




if(production){
    uri = 'mongodb://huthanh89:huynht123@docdb-2020-11-04-22-22-04.cluster-chvc4ktfzp6x.us-east-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false';

    dbOption = {
        sslValidate: true,
        sslCA: ca,
        useNewUrlParser: true,
        useUnifiedTopology:true
    }
}

var client = MongoClient.connect(url, dbOption,
    function(err, client) {
        if(err)
            throw err;
            
        //Specify the database to be used
        db = client.db('sample-database');
        
        //Specify the collection to be used
        col = db.collection('sample-collection');
    
        //Insert a single document
        col.insertOne({'hello':'Amazon DocumentDB'}, function(err, result){
        //Find the document that was previously written
        col.findOne({'hello':'Amazon DocumentDB'}, function(err, result){
            //Print the result to the screen
            console.log(result);
            
            //Close the connection
            client.close()
        });
    });
});
*/


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

    const database = dbClient;
    const collection = database.collection('animals');

    const users = await collection.find().toArray(async function(err, items){

        res.json(items);

    });


});

app.get('/post', async function (req, res) {

    console.log('POST');

    const database = dbClient;
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

app.listen(process.env.PORT || 3000);
console.log("-- Node Server Started -- ")

//---------------------------------------------------------------------------//
// Exports
//---------------------------------------------------------------------------//

module.exports = app;

//---------------------------------------------------------------------------//