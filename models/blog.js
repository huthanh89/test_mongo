//---------------------------------------------------------------------------//
// Imports
//---------------------------------------------------------------------------//

const mongoose = require('mongoose');
const { Schema } = mongoose;
const validate = require('mongoose-validator');

//---------------------------------------------------------------------------//
// Schema
//---------------------------------------------------------------------------//

const schema = new Schema({
    name: {
        type: String,
    },
    title: {
        type: String,
        default: function(title){
            return `${this.title} --- ${this.author}`;
        }
    }, 
    author: {
        type: String,
        default: 'foo'
    }, 
    body: {
        type: String,
    },
    fullname: {
        type: String,
        default: function(){
            return `${this.title} --- ${this.author}`;
        }
    }
});

// instance methods
schema.methods.instanceFunc = function() {
    console.log('instanceFunc')
    return;
};

// static methods
schema.static('staticFunc', function() {
    console.log('staticFunc')
    return;
});

const Model = mongoose.model('Blog', schema);

//---------------------------------------------------------------------------//
// Export
//---------------------------------------------------------------------------//

module.exports = Model

//---------------------------------------------------------------------------//