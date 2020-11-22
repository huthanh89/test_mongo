//---------------------------------------------------------------------------//
// Imports
//---------------------------------------------------------------------------//

const AWS = require('aws-sdk');
const S3 = require('aws-sdk/clients/s3');

//---------------------------------------------------------------------------//
// AWS S3 Service
//---------------------------------------------------------------------------//

// Create S3 service object
s3 = new AWS.S3({
    apiVersion: '2006-03-01'
});
exports.getS3File = function(bucket, key){
    
    let params = {
        Bucket: 'thanh-s3awsbucket', 
        Key: 'rds-combined-ca-bundle.pem'
    }
    
    console.log('s3...');
    
    return new Promise(function(resolve, reject){

        s3.getObject({
            Bucket: bucket, 
            Key: key
        }, function(err, data) {
        
            if (err){
                reject(err);
            }
        
            console.log('s3 read finished')
            //console.log(data);
        
            resolve(data.Body.toString('utf-8'));
        });
    });

};

//---------------------------------------------------------------------------//
// Export
//---------------------------------------------------------------------------//
/*
module.exports = {
    getS3Object
};
*/
//---------------------------------------------------------------------------//