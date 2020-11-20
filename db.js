//---------------------------------------------------------------------------//
// Imports
//---------------------------------------------------------------------------//

var MongoClient = require('mongodb').MongoClient;
var MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
var fs = require('fs');

//---------------------------------------------------------------------------//
// Variables
//---------------------------------------------------------------------------//

let dbClient = null;
let dbName = 'test';

//---------------------------------------------------------------------------//
// Database
//---------------------------------------------------------------------------//

async function useDevServer(){
    
    const mongod = new MongoMemoryServer({
        instance: {
            port: 62369,
            dbName: dbName
        }
    });

    let uri = await mongod.getUri();
    
    await MongoClient.connect(uri, {
        useUnifiedTopology:true
    }, function(err, client) {
        if(err){
            throw err;
        }else{
            console.log(`Connected to development database - ${uri}`);
            dbClient = client.db(dbName);
        }
    });
    
}

async function useProductionServer(){

    console.log('connecting to production database...')

    let ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];
    let uri = 'mongodb://huthanh89:huynht123@docdb-2020-11-04-22-22-04.cluster-chvc4ktfzp6x.us-east-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false';

    let dbOption = {
        sslValidate: true,
        sslCA: ca,
        useNewUrlParser: true,
        useUnifiedTopology:true
    }

    await MongoClient.connect(uri, dbOption, function(err, client) {
        if(err){
            throw err;
        }else{
            console.log(`Connected to database`);
            dbClient = client.db(dbName);
        }
    });

}
















function connect(){
    if(process.env.NODE_ENV === "production") {  
        useProductionServer();
    }else{
        useDevServer();
    }
}

async function close(){
    dbClient = null;
    await dbClient.close();
};

function getClient(){
    return dbClient;
};

//---------------------------------------------------------------------------//
// Export
//---------------------------------------------------------------------------//

module.exports = {
    connect,
    close,
    getClient,
};

//---------------------------------------------------------------------------//