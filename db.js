//---------------------------------------------------------------------------//
// Imports
//---------------------------------------------------------------------------//

const mongoose = require('mongoose');
const aws = require('./aws');

//---------------------------------------------------------------------------//
// Variables
//---------------------------------------------------------------------------//

let dbClient = null;
let dbName = 'test_mongoose';

//---------------------------------------------------------------------------//
// Database
//---------------------------------------------------------------------------//

async function useDevServer(){
    
    console.log('connecting to dev database...');

    await mongoose.connect('mongodb://localhost:27017/mongoose', {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then(function(){
        console.log('connected to DEV database');
    })
    .catch(function(error){
        console.error(err);
    });

}

async function useProductionServer(){

    console.log('connecting to production database...');
    
    const uri = 'mongodb://huthanh89:huynht123@docdb-2020-11-04-22-22-04.cluster-chvc4ktfzp6x.us-east-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false';
    
    const ca = await aws.getS3File('thanh-s3awsbucket', 'rds-combined-ca-bundle.pem');
    
    await mongoose.connect(uri, {
        sslValidate: true,
        sslCA: [ca],
        useNewUrlParser: true,
        useUnifiedTopology:true
    })    
    .then(function(){
        console.log('connected to Production database');
    })
    .catch(function(error){
        console.error('ERROR - ', error);
    });;
    
}

async function connect(){
    //await useDevServer();
    await useProductionServer();

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