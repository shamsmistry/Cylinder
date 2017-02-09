/**
 * Created by Ahmer Saeed on 2/25/2016.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema

collectionSchema = new Schema({

    //_id (default 12 bits ObjectId)
    "conversations_id": {type: Schema.ObjectId, ref: 'chat_conversations_threads'},
    "uid": {type: Number, required: true},
    "mute": {type: Boolean, default: false},
    "hide": {type: Boolean, default: false},
    "status": {type: Number, required: true, default: '1'}, // i-e by default ACTIVE
    "created_time": {type: Number, required: true}

}),
    chatConversationsDetails = mongoose.model('chat_conversations_details', collectionSchema);

module.exports = chatConversationsDetails;