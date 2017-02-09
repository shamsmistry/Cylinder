/**
 * Created by Ahmer Saeed on 2/23/2016.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema

collectionSchema = new Schema({

    //_id (default 12 bits ObjectId)
    "uid": {type: Array, required: true},
    "created_time": {type: Number, required: true}

}),
    chatConversationsThreads = mongoose.model('chat_conversations_threads', collectionSchema);

module.exports = chatConversationsThreads;