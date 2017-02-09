/**
 * Created by Ahmer Saeed on 2/25/2016.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

collectionSchema = new Schema({

    //_id (default 12 bits ObjectId)
    "uId": {type: Number, required: true},
    "token": {type: String, required: true},
    "socketIds": {type: Array, required: true},
    "chatList": {type: Array, ref: 'users'},
    "roomId": {type: Array},
    "status": {type: Number, required: true, default: '1'}, // session status login,offline,away and busy etc
    "last_seen_time": {type: Number},
    "updated_time": {type: Number},
    "created_time": {type: Number}

}),
    users = mongoose.model('users', collectionSchema);

module.exports = users;