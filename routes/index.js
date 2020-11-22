//---------------------------------------------------------------------------//
// Imports
//---------------------------------------------------------------------------//

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const { Schema } = mongoose;
const Blog = require('../models/blog');

//---------------------------------------------------------------------------//
// Router
//---------------------------------------------------------------------------//

router.get('/', function(req, res, next) {
    res.send({ 
        title: "Mongoose API Entry Point" 
    });
});

router.get('/get', async function (req, res) {
    
    console.log('GET');
    
    const doc = new Blog({
        name: 'aasdf',
        title: 'apple',
        //body: 'body text here'
    });

    doc.instanceFunc();
    Blog.staticFunc();


    let result = await Blog.find({});
    
    res.send({ 
        result: result
    });
    
});

router.get('/post', async function (req, res) {
    
    console.log('POST');

    const doc = new Blog({
        name: 'aasdf',
        title: 'apple',
    });
    await doc.save();

    res.send({ 
        result: doc
    });

});

//---------------------------------------------------------------------------//
// Export
//---------------------------------------------------------------------------//

module.exports = router;

//---------------------------------------------------------------------------//