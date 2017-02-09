/**
 * Created by Ahmer Saeed on 2/25/2016.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

collectionSchema = new Schema({

    //_id (default 12 bits ObjectId)
    "uId": {type: Number, required: true},
    "message_id": {type: Schema.ObjectId, ref: 'chat_messages'},
    "name": {type: String, required: true},
    "extension": {type: String, required: true},
    "width": {type: Number, required: false},
    "height": {type: Number, required: false},
    "type": {type: String, enum: ['IMAGE', 'VIDEO', 'AUDIO'], required: false},
    "path": {type: String, required: true},
    "duration": {type: Number, required: true, default: 0},
    "thumbs": {type: Array, default: []},
    "compress_types": {type: Array, default: []},
    "status": {type: Number, required: true, default: '1'}, // session status login,offline,away and busy etc
    "updated_time": {type: Number},
    "created_time": {type: Number}
}),
    usersFiles = mongoose.model('users_files', collectionSchema);

module.exports = usersFiles;