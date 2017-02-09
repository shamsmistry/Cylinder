/**
 * Created by Ahmer Saeed on 2/23/2016.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema

collectionSchema = new Schema({

    //_id (default 12 bits ObjectId)
    "conversations_id": {type: Schema.ObjectId, ref: 'chat_conversations_threads'},
    "uid": {type: Number, required: true},
    "content": {type: String},
    "url_share_id": {type: Number, default: null},
    "created_time": {type: Number}

}),
    chatMessages = mongoose.model('chat_messages', collectionSchema);

module.exports = chatMessages;