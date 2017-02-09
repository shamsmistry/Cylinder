/**
 * Created by Ahmer Saeed on 2/25/2016.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema

collectionSchema = new Schema({

    //_id (default 12 bits ObjectId)
    "conversations_id": {type: Schema.ObjectId, ref: 'chat_conversations_threads'},
    "messages_id": {type: Schema.ObjectId, ref: 'chat_messages'},
    "sender_id": {type: Number, required: true}, //this refers to receiver id
    "uid": {type: Number, required: true}, //this refers to receiver id
    "seen": {type: Boolean, default: false},
    "delivered": {type: Boolean, default: false},
    "status": {type: Number, required: true, default: '1'}, // i-e by default ACTIVE
    "created_time": {type: Number}

}),
    chatMessagesDetails = mongoose.model('chat_messages_details', collectionSchema);

module.exports = chatMessagesDetails;