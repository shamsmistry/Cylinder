/**
 * Created by Ahmer Saeed on 2/29/2016.
 */

// Manage all events emit or listened from router.js

var util = require('util');

//requiring mongodb models
var mongoose = require('mongoose')
    , chatConversationsThreads = mongoose.model('chat_conversations_threads')
    , chatConversationsDetails = mongoose.model('chat_conversations_details')
    , chatMessages = mongoose.model('chat_messages')
    , chatMessagesDetails = mongoose.model('chat_messages_details')
    , users = mongoose.model('users');

//requiring mysql models
var db = require('../helpers/db');
var sequelize = db.sequelizeConn();


//requiring controllers and helpers
var chatController = require('../controllers/chat');
var helper = require('../helpers/helper');
var event_ = require('../controllers/events_');
var utility = require('../helpers/utility');
var config = require('../config/config');

//requiring npms
var Promise = require("bluebird");
var chalk = require('chalk');

// #####################################################################
// ################  Managing All Listened Events  #####################
//######################################################################

//login event
exports.login = function (userObj) {
    return new Promise(function (resolveFirstPromise) {
        return helper.isUserLoggedIn(userObj)
            .then(function (sessionExist) {
                //if session exist than proceed further
                // other wise return the response
                console.log(chalk.green('==== Checking Session Result ==='));
                if (sessionExist) {
                    console.log(chalk.green('==== Session is not Null ==='));
                    //Hence session is exist
                    //now save userId,userToken and chatRoomId in chatRoomArray for further
                    // usage, only if they are not already exist in chatRoomArray
                    return helper.prepareLoginDataBeforeEmit(userObj)
                        .then(function (prepareResult) {
                            if (prepareResult.message === "user_is_logged_in_successfully") {
                                var emitObj = {
                                    event: "receiveOfflineMessages",
                                    socket: userObj.socket,
                                    msgFrom: userObj.userId,
                                    data: prepareResult.data,
                                    chatRoomId: prepareResult.data,
                                    message: "success"
                                };
                                //now finally emitting the respective event
                                return event_.emitEvents(emitObj)
                                    .then(function (emitResult) {
                                        resolveFirstPromise(emitResult);
                                    });
                            }
                            else if (prepareResult.message == 'user_is_failed_to_logged_in') {
                                var emitObj = {
                                    event: "receiveOfflineMessages",
                                    socket: userObj.socket,
                                    msgFrom: userObj.userId,
                                    data: prepareResult.data,
                                    chatRoomId: prepareResult.data,
                                    message: "failed"
                                };
                                //now finally emitting the respective event
                                return event_.emitEvents(emitObj)
                                    .then(function (emitResult) {
                                        resolveFirstPromise(emitResult);
                                    });
                            }
                            resolveFirstPromise(prepareResult);
                        });
                }
                else {
                    console.log(chalk.green('==== Session is Null ===', sessionExist));
                    var emitObj = {
                        event: "receiveOfflineMessages",
                        socket: userObj.socket,
                        msgFrom: userObj.userId,
                        data: [],
                        message: "failed"
                    };
                    //now finally emitting the respective event
                    return event_.emitEvents(emitObj)
                        .then(function (emitResult) {
                            resolveFirstPromise(emitResult);
                        });
                }
            })
            .error(function () {
                console.log(chalk.green('==== Error in Checking Session ==='));
                var emitObj = {
                    event: "receiveOfflineMessages",
                    socket: userObj.socket,
                    msgFrom: userObj.userId,
                    data: [],
                    message: "failed"
                };
                //now finally emitting the respective event
                return event_.emitEvents(emitObj)
                    .then(function (emitResult) {
                        resolveFirstPromise(emitResult);
                    });
            });
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//message event
exports.message = function (messageObj) {
    return new Promise(function (resolve) {
        console.log(chalk.green('==== In Message Event Function ====='));
        if ((messageObj.msgTo != null) && (messageObj.msgFrom != null)) {
            if (messageObj.msgTo != messageObj.msgFrom) {

                var dataObj = {
                    socket: messageObj.socket,              // socket instance
                    msgFrom: messageObj.msgFrom,            // msgFrom belongs to, sender
                    msgTo: messageObj.msgTo,                // msgTo belongs to, receiver
                    messageContent: messageObj.msgContent,  // messageContent belongs to, content
                    mediaId: messageObj.mediaId,             // mediaId contains array of uploaded file id(s)
                    urlSharedId: messageObj.urlSharedId        // urlShareId contains the shared url id
                };

                //message event contain two parts
                //one of saving message in database
                //and second is of emitting message to
                //receiver

                //conversation array
                //contains list of users
                //who are chatting

                var conversation = [];

                conversation.push(dataObj.msgFrom);
                conversation.push(dataObj.msgTo);
                dataObj.conversation = conversation;


                console.log(chalk.green(' ======== Conversation array before Sort ==============='));
                console.log(chalk.green(conversation));

                //sort the conversation array in ascending order
                return utility.sortStringsArray(conversation)
                    .then(function (conversation) {
                        return new Promise(function (resolveFirstPromise) {

                            //now first check whether the conversation id is exist for sender and receiver
                            //if not exist generate a new conversation_id and if already exist checks its status
                            //in conversation detail collection if it is not deleted than use the respective
                            //conversation_id and other wise generate a new conversation_id

                            console.log(chalk.green(' =========== Conversation array after Sort ==========='));
                            console.log(chalk.green(conversation));
                            var queryConversationThread = {
                                uid: conversation
                            };

                            console.log(chalk.green(' ======= Checking Conversation ID ========='));
                            return chatController.getCollection(chatConversationsThreads, queryConversationThread, {})
                                .then(function (queryResult) {
                                    if (queryResult.length > 0) {

                                        console.log(chalk.green(' ======= Conversation ID is Exist ========='));
                                        //hence conversation id is exist
                                        //now checking the status in
                                        //conversation details collection
                                        var conversationsId = queryResult[0]._id;
                                        var queryConversationDetails = {
                                            "conversations_id": conversationsId,
                                            "uid": dataObj.msgFrom,
                                            "status": '1'
                                        };

                                        console.log(chalk.green('========== Checking Conversation ID Status =========='));

                                        return chatController.getCollection(chatConversationsDetails, queryConversationDetails, {})
                                            .then(function (statusQueryResult) {
                                                if (statusQueryResult.length > 0) {
                                                    console.log(chalk.green('======== Conversation ID is Exist and its Status is Active =============='));
                                                    //hence conversation id is exist
                                                    //and its status is ACTIVE for both sender and receiver
                                                    //so now return back this conversation id for use
                                                    //and save the message content
                                                    dataObj.conversationsId = conversationsId;
                                                    return helper.saveMessages(dataObj)
                                                        .then(function (savedMessageObject) {
                                                            //call functions of
                                                            //creating chat rooms arrays etc
                                                            if (savedMessageObject != null) {
                                                                console.log(chalk.green('=============== The Message Object Saved in Database is : ============'));
                                                                console.log(util.inspect(savedMessageObject, {
                                                                    showHidden: false,
                                                                    depth: null
                                                                }));
                                                                //hence now database work is completed
                                                                //now make preparation for emitting msg event
                                                                return helper.prepareMessageDataBeforeEmit(dataObj)
                                                                    .then(function (prepareResult) {

                                                                        console.log('prepareResult', prepareResult);
                                                                        console.log(util.inspect(prepareResult, {
                                                                            showHidden: true,
                                                                            depth: null
                                                                        }));

                                                                        //now emit recieve message event
                                                                        var eventMessage = null;
                                                                        if (prepareResult.message == "sender_not_logged_in") {
                                                                            console.log(" === Hence Sender is not Logged In ===");
                                                                            eventMessage = "sender_not_logged_in";
                                                                            var emitObj = {
                                                                                event: "receiveChatMessage",
                                                                                socket: dataObj.socket,
                                                                                chatRoomId: prepareResult.data,
                                                                                message: eventMessage,
                                                                                data: []
                                                                            };
                                                                            //now finally emitting the respective event
                                                                            return event_.emitEvents(emitObj)
                                                                                .then(function (emitResult) {
                                                                                    resolveFirstPromise(emitResult);
                                                                                });
                                                                        }
                                                                        else if (prepareResult.message == "chat_room_id_exist" || prepareResult.message == "chat_room_id_not_exist" || prepareResult.message == "receiver_not_logged_in") {
                                                                            eventMessage = "receiver_not_logged_in";
                                                                            //finally now appending chat object
                                                                            return helper.getChatObjectForSingleConversation(savedMessageObject)
                                                                                .then(function (chatObject) {
                                                                                    console.log('The Chat Object', chatObject[0].receiver[0].status);
                                                                                    var emitObj = {
                                                                                        event: "receiveChatMessage",
                                                                                        socket: dataObj.socket,
                                                                                        chatRoomId: prepareResult.data,
                                                                                        message: eventMessage,
                                                                                        data: chatObject
                                                                                    };

                                                                                    //now finally emitting the respective event
                                                                                    return event_.emitEvents(emitObj)
                                                                                        .then(function (emitResult) {

                                                                                            //Call PushNotification API Function here

                                                                                            //console.log('####################### CALLING PUSH NOTIFICATION API - Start #######################');
                                                                                            //var pushChatObj = {
                                                                                            //    senderId: chatObject[0].chat.senderId,
                                                                                            //    receiverId: chatObject[0].chat.receiverId,
                                                                                            //    content: chatObject[0].chat.content,
                                                                                            //    conversationId: chatObject[0].chat.conversationId,
                                                                                            //    receiverStatus:chatObject[0].receiver[0].status
                                                                                            //};
                                                                                            //return helper.hitPushNotificationAPI(config.serverNetwork.pushServer_public.ip, config.serverNetwork.pushServer_public.port, 'chat/notifications', pushChatObj);

                                                                                            resolveFirstPromise(emitResult);
                                                                                        });
                                                                                });
                                                                        }
                                                                    });
                                                            } else {
                                                                //now finally emitting the respective event
                                                                //emit message send fail event here
                                                                console.log(chalk.red('======= Message Failed to Save in Database ======='));
                                                                resolveFirstPromise(null);
                                                            }
                                                        });
                                                }
                                                else {
                                                    //hence conversation id status is not active
                                                    //so updating its status to active from sender perspective
                                                    var updatingQueryObj = {
                                                        conversations_id: conversationsId,
                                                        uid: dataObj.msgFrom
                                                    };
                                                    var updateStatus = {status: 1};
                                                    var options = {multi: false};
                                                    return chatController.updateCollection(chatConversationsDetails, updateStatus, options, updatingQueryObj, function (err, updateResult) {
                                                        if ((updateResult.ok == 1) && (updateResult.nModified == 1)) {
                                                            //now save the message content
                                                            console.log(chalk.green('====== Conversation ID is Updated Now ========='));
                                                            dataObj.conversationsId = conversationsId;
                                                            return helper.saveMessages(dataObj)
                                                                .then(function (savedMessageObject) {
                                                                    //call functions of
                                                                    //creating chat rooms arrays etc
                                                                    if (savedMessageObject != null) {
                                                                        console.log(chalk.green('=============== The Message Object Saved in Database is : ============'));
                                                                        console.log(util.inspect(savedMessageObject, {
                                                                            showHidden: false,
                                                                            depth: null
                                                                        }));
                                                                        //hence now database work is completed
                                                                        //now make preparation for emitting msg event
                                                                        //hence now database work is completed
                                                                        //now make preparation for emitting msg event
                                                                        return helper.prepareMessageDataBeforeEmit(dataObj)
                                                                            .then(function (prepareResult) {

                                                                                console.log('prepareResult', prepareResult);
                                                                                console.log(util.inspect(prepareResult, {
                                                                                    showHidden: true,
                                                                                    depth: null
                                                                                }));

                                                                                //now emit recieve message event
                                                                                var eventMessage = null;
                                                                                if (prepareResult.message == "sender_not_logged_in") {
                                                                                    console.log(" === Hence Sender is not Logged In ===");
                                                                                    eventMessage = "sender_not_logged_in";
                                                                                    var emitObj = {
                                                                                        event: "receiveChatMessage",
                                                                                        socket: dataObj.socket,
                                                                                        chatRoomId: prepareResult.data,
                                                                                        message: eventMessage,
                                                                                        data: []
                                                                                    };
                                                                                    //now finally emitting the respective event
                                                                                    return event_.emitEvents(emitObj)
                                                                                        .then(function (emitResult) {
                                                                                            resolveFirstPromise(emitResult);
                                                                                        });
                                                                                }
                                                                                else if (prepareResult.message == "chat_room_id_exist" || prepareResult.message == "chat_room_id_not_exist" || prepareResult.message == "receiver_not_logged_in") {
                                                                                    eventMessage = "receiver_not_logged_in";
                                                                                    //finally now appending chat object
                                                                                    return helper.getChatObjectForSingleConversation(savedMessageObject)
                                                                                        .then(function (chatObject) {
                                                                                            console.log('The Chat Object', chatObject[0].receiver[0].status);
                                                                                            var emitObj = {
                                                                                                event: "receiveChatMessage",
                                                                                                socket: dataObj.socket,
                                                                                                chatRoomId: prepareResult.data,
                                                                                                message: eventMessage,
                                                                                                data: chatObject
                                                                                            };

                                                                                            //now finally emitting the respective event
                                                                                            return event_.emitEvents(emitObj)
                                                                                                .then(function (emitResult) {

                                                                                                    //Call PushNotification API Function here

                                                                                                    //console.log('####################### CALLING PUSH NOTIFICATION API - Start #######################');

                                                                                                    //var pushChatObj = {
                                                                                                    //    senderId: chatObject[0].chat.senderId,
                                                                                                    //    receiverId: chatObject[0].chat.receiverId,
                                                                                                    //    content: chatObject[0].chat.content,
                                                                                                    //    conversationId: chatObject[0].chat.conversationId
                                                                                                    //    receiverStatus:chatObject[0].receiver[0].status
                                                                                                    //};
                                                                                                    //return helper.hitPushNotificationAPI(config.serverNetwork.pushServer_public.ip, config.serverNetwork.pushServer_public.port, 'chat/notifications', pushChatObj);

                                                                                                    resolveFirstPromise(emitResult);
                                                                                                });
                                                                                        });
                                                                                }
                                                                            });
                                                                    } else {
                                                                        console.log(chalk.red('=============== Message Failed to Save in Database  ============'));
                                                                        //emit message send fail event here
                                                                        resolveFirstPromise(statusQueryResult);
                                                                    }
                                                                });
                                                        } else if ((updateResult.ok == 1) && (updateResult.nModified == 0)) {
                                                            console.log(chalk.green('======== Updating Delete Result is False : ========'));
                                                            resolveFirstPromise(false);
                                                        }
                                                        else if (updateResult.ok == 0 || err != null) {
                                                            console.log(chalk.green('======== Updating Delete Result is Error : ========'));
                                                            resolveFirstPromise(false);
                                                        }
                                                    });
                                                }
                                            });
                                    }
                                    else {
                                        //hence no conversation id exist
                                        //now generating new conversation id
                                        console.log(chalk.green('========= Conversation ID Not Exist ==========='));
                                        return helper.saveConversationThreads(conversation)
                                            .then(function (saveConversationResult) {
                                                if (saveConversationResult != null) {
                                                    console.log(chalk.green('=========  New Conversation ID is Generated ========= ', saveConversationResult));
                                                    //now save the message content
                                                    dataObj.conversationsId = saveConversationResult;
                                                    return helper.saveMessages(dataObj)
                                                        .then(function (savedMessageObject) {
                                                            //call functions of
                                                            //creating chat rooms arrays etc
                                                            if (savedMessageObject != null) {
                                                                console.log(chalk.green('=============== The Message Object Saved in Database is : ============'));
                                                                console.log(util.inspect(savedMessageObject, {
                                                                    showHidden: false,
                                                                    depth: null
                                                                }));
                                                                //hence now database work is completed
                                                                //now make preparation for emitting msg event
                                                                //hence now database work is completed
                                                                //now make preparation for emitting msg event
                                                                return helper.prepareMessageDataBeforeEmit(dataObj)
                                                                    .then(function (prepareResult) {

                                                                        console.log('prepareResult', prepareResult);
                                                                        console.log(util.inspect(prepareResult, {
                                                                            showHidden: true,
                                                                            depth: null
                                                                        }));

                                                                        //now emit recieve message event
                                                                        var eventMessage = null;
                                                                        if (prepareResult.message == "sender_not_logged_in") {
                                                                            console.log(" === Hence Sender is not Logged In ===");
                                                                            eventMessage = "sender_not_logged_in";
                                                                            var emitObj = {
                                                                                event: "receiveChatMessage",
                                                                                socket: dataObj.socket,
                                                                                chatRoomId: prepareResult.data,
                                                                                message: eventMessage,
                                                                                data: []
                                                                            };
                                                                            //now finally emitting the respective event
                                                                            return event_.emitEvents(emitObj)
                                                                                .then(function (emitResult) {
                                                                                    resolveFirstPromise(emitResult);
                                                                                });
                                                                        }
                                                                        else if (prepareResult.message == "chat_room_id_exist" || prepareResult.message == "chat_room_id_not_exist" || prepareResult.message == "receiver_not_logged_in") {
                                                                            eventMessage = "receiver_not_logged_in";
                                                                            //finally now appending chat object
                                                                            return helper.getChatObjectForSingleConversation(savedMessageObject)
                                                                                .then(function (chatObject) {
                                                                                    console.log('The Chat Object', chatObject[0].receiver[0].status);
                                                                                    var emitObj = {
                                                                                        event: "receiveChatMessage",
                                                                                        socket: dataObj.socket,
                                                                                        chatRoomId: prepareResult.data,
                                                                                        message: eventMessage,
                                                                                        data: chatObject
                                                                                    };

                                                                                    //now finally emitting the respective event
                                                                                    return event_.emitEvents(emitObj)
                                                                                        .then(function (emitResult) {

                                                                                            //Call PushNotification API Function here

                                                                                            //console.log('####################### CALLING PUSH NOTIFICATION API - Start #######################');

                                                                                            //var pushChatObj = {
                                                                                            //    senderId: chatObject[0].chat.senderId,
                                                                                            //    receiverId: chatObject[0].chat.receiverId,
                                                                                            //    content: chatObject[0].chat.content,
                                                                                            //    conversationId: chatObject[0].chat.conversationId
                                                                                            //    receiverStatus:chatObject[0].receiver[0].status
                                                                                            //};
                                                                                            //return helper.hitPushNotificationAPI(config.serverNetwork.pushServer_public.ip, config.serverNetwork.pushServer_public.port, 'chat/notifications', pushChatObj);

                                                                                            resolveFirstPromise(emitResult);
                                                                                        });
                                                                                });
                                                                        }
                                                                    });
                                                            } else {
                                                                console.log(chalk.red('=============== Message Failed to Save in Database  ============'));
                                                                //emit message send fail event here
                                                                resolveFirstPromise(queryResult);
                                                            }
                                                        });
                                                } else {
                                                    console.log(chalk.red('=============== Message Failed to Save in Database  ============'));

                                                    //emit message send fail event here
                                                    resolveFirstPromise(queryResult);
                                                }
                                            });
                                    }
                                });
                        })
                            .then(function (firstPromiseResult) {
                                resolve(firstPromiseResult);
                            });
                    });
            }
            else {
                resolve(false);
            }
        }
        else {
            resolve(false);
        }
    })
        .then(function (result) {
            return result;
        });
};

//disconnect event (emit on page reload)
exports.disconnect = function (dataObj) {

    console.log(chalk.green(' =============== In Disconnect Event Function =============='));
    return helper.prepareDisconnectDataBeforeEmit(dataObj)
        .then(function (responseObj) {
            if (responseObj.message == 'receive_offline_status') {
                //var chatRoomId = [];
                //chatRoomId.push(responseObj.data.friendsListArray);
                console.log(chalk.green(' =============== Now iterating over Friend List Array =============='));
                var emitObj = {
                    event: "receiveOfflineStatus",
                    socket: dataObj.socket,
                    chatRoomId: responseObj.data.friendsListArray,
                    data: responseObj.data.disconnectedUser
                };
                //now finally emitting the respective event
                return event_.emitEvents(emitObj)
                    .then(function (emitResult) {
                        return emitResult;
                    });
            } else {
                var emitObj = {
                    event: "receiveOfflineStatus",
                    socket: dataObj.socket,
                    chatRoomId: [],
                    data: []
                };
                //now finally emitting the respective event
                return event_.emitEvents(emitObj)
                    .then(function (emitResult) {
                        return emitResult;
                    });
            }
        });
};

//customize disconnect use in logout from session
//both in mobile and app
exports.customizeDisconnect = function (dataObj) {
    return helper.prepareCustomizeDisconnectDataBeforeEmit(dataObj)
        .then(function (result) {
            return result;
        });
};

//message seen event
exports.seen = function (dataObj) {
    //first preparing data for emit seen status
    return helper.prepareDataForUpdateAndEmitSeenStatus(dataObj)
        .then(function (seenStatus) {
            if (seenStatus.status == true && seenStatus.chatRoomId.length > 0) {
                console.log(chalk.green('==== Hence Seen Status is True and chatRoomId is not Null ==='));
                var emitObj = {
                    event: "receiveMessageSeenStatus",
                    socket: dataObj.socket,
                    userChatRoomIds: seenStatus.userChatRoomIds,
                    chatRoomId: seenStatus.chatRoomId,
                    data: seenStatus,
                    message: "update seen status successfully"
                };
            } else if (seenStatus.status == true && seenStatus.chatRoomId == []) {
                console.log(chalk.green('==== Hence Seen Status is True and chatRoomId is Null ==='));
                var emitObj = {
                    event: "receiveMessageSeenStatus",
                    socket: dataObj.socket,
                    userChatRoomIds: seenStatus.userChatRoomIds,
                    chatRoomId: [],
                    data: seenStatus,
                    message: "update seen status successfully"
                };
            } else {
                console.log(chalk.green('==== Hence Seen Status is False and chatRoomId is Null ==='));
                var emitObj = {
                    event: "receiveMessageSeenStatus",
                    socket: dataObj.socket,
                    userChatRoomIds: seenStatus.userChatRoomIds,
                    chatRoomId: [],
                    data: seenStatus,
                    message: "failed to update seen status"
                };
            }
            //now finally emitting the respective event
            return event_.emitEvents(emitObj)
                .then(function (emitResult) {
                    return emitResult;
                });
        });
};

//message delete event
exports.deleteMessage = function (dataObj) {
    //first deleting the message then emit back
    return helper.prepareDataForDeleteMessageEvent(dataObj)
        .then(function (response) {
            console.log(chalk.green('==== Checking Delete Status ==='));
            if (response.deleteStatus) {
                console.log(chalk.green('==== Hence Delete Status is True ==='));
                var emitObj = {
                    event: "receiveMessageDeleteStatus",
                    socket: dataObj.socket,
                    chatRoomId: response.userChatRoomIds,
                    data: response.deleteStatus,
                    message: "update delete status successfully"
                };
            } else {
                console.log(chalk.green('==== Hence Delete Status is False ==='));
                console.log(chalk.green('==== Now Emit Delete Status ==='));
                var emitObj = {
                    event: "receiveMessageDeleteStatus",
                    socket: dataObj.socket,
                    chatRoomId: [],
                    data: response.deleteStatus,
                    message: "failed to update delete status"
                };
            }
            //now finally emitting the respective event
            return event_.emitEvents(emitObj)
                .then(function (emitResult) {
                    return emitResult;
                });
        });
};

//conversation delete event
exports.deleteConversation = function (dataObj) {
    //first deleting the message then emit back
    return helper.prepareDataForDeleteConversationEvent(dataObj)
        .then(function (response) {
            console.log(chalk.green('==== Checking Delete Status ==='));
            if (response) {
                console.log(chalk.green('==== Hence Delete Status is True ==='));
                var emitObj = {
                    event: "receiveConversationDeleteStatus",
                    socket: dataObj.socket,
                    chatRoomId: response.userChatRoomIds,
                    data: response.deleteStatus,
                    message: "update delete status successfully"
                };
            } else {
                console.log(chalk.green('==== Hence Delete Status is False ==='));
                var emitObj = {
                    event: "receiveConversationDeleteStatus",
                    socket: dataObj.socket,
                    chatRoomId: [],
                    data: response,
                    message: "failed to update delete status"
                };
            }
            //now finally emitting the respective event
            return event_.emitEvents(emitObj)
                .then(function (emitResult) {
                    return emitResult;
                });
        });
};

//scroll conversation event
exports.scrollConversations = function (dataObj) {
    return new Promise(function (firstPromiseResolve) {
        if (dataObj.userId != null && dataObj.createdTime != null) {
            return helper.prepareDataForScrollConversations(dataObj)
                .then(function (prepareResult) {
                    if (prepareResult.message === "scroll_conversations_successfully") {
                        var emitObj = {
                            event: "receiveScrollConversations",
                            socket: dataObj.socket,
                            data: prepareResult.data,
                            message: prepareResult.message
                        };
                        //now finally emitting the respective event
                        return event_.emitEvents(emitObj)
                            .then(function (emitResult) {
                                firstPromiseResolve(emitResult);
                            });
                    } else if (prepareResult.message === "scroll_conversations_failed") {
                        var emitObj = {
                            event: "receiveScrollConversations",
                            socket: dataObj.socket,
                            data: prepareResult.data,
                            message: prepareResult.message
                        };
                        //now finally emitting the respective event
                        return event_.emitEvents(emitObj)
                            .then(function (emitResult) {
                                firstPromiseResolve(emitResult);
                            });
                    }
                });

        }
        else {
            //here emit empty data object to requester
            var emitObj = {
                event: "receiveScrollConversations",
                socket: dataObj.socket,
                data: [],
                message: "scroll_conversations_failed"
            };
            //now finally emitting the respective event
            return event_.emitEvents(emitObj)
                .then(function (emitResult) {
                    firstPromiseResolve(emitResult);
                });
        }
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//scroll chat message event
exports.scrollChatMessages = function (dataObj) {
    return new Promise(function (firstPromiseResolve) {
        if (dataObj.conversationId != null || dataObj.createdTime != null) {
            return helper.prepareDataForScrollChatMessages(dataObj)
                .then(function (prepareResult) {
                    if (prepareResult.message === "scroll_chat_messages_successfully") {
                        var emitObj = {
                            event: "receiveScrollChatMessages",
                            socket: dataObj.socket,
                            data: prepareResult.data,
                            message: prepareResult.message
                        };
                        //now finally emitting the respective event
                        return event_.emitEvents(emitObj)
                            .then(function (emitResult) {
                                firstPromiseResolve(emitResult);
                            });
                    } else if (prepareResult.message === "scroll_chat_messages_failed") {
                        var emitObj = {
                            event: "receiveScrollChatMessages",
                            socket: dataObj.socket,
                            data: prepareResult.data,
                            message: prepareResult.message
                        };
                        //now finally emitting the respective event
                        return event_.emitEvents(emitObj)
                            .then(function (emitResult) {
                                firstPromiseResolve(emitResult);
                            });
                    }
                });

        }
        else {
            //here emit empty data object to requester
            var emitObj = {
                event: "receiveScrollChatMessages",
                socket: dataObj.socket,
                data: [],
                message: "scroll_chat_messages_failed"
            };
            //now finally emitting the respective event
            return event_.emitEvents(emitObj)
                .then(function (emitResult) {
                    firstPromiseResolve(emitResult);
                });
        }
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//search conversation event
exports.searchConversation = function (dataObj) {
    return new Promise(function (firstPromiseResolve) {
        if (dataObj.userId != null) {
            return helper.prepareDataForSearchConversation(dataObj)
                .then(function (prepareResult) {
                    if (prepareResult.message === "conversation_fetched_successfully") {
                        console.log(chalk.green(' ======== conversation_fetched_successfully ==========='));
                        var emitObj = {
                            event: "receiveSearchConversation",
                            socket: dataObj.socket,
                            data: prepareResult.data,
                            message: prepareResult.message
                        };

                        //now finally emitting the respective event
                        return event_.emitEvents(emitObj)
                            .then(function (emitResult) {
                                firstPromiseResolve(emitResult);
                            });
                    } else if (prepareResult.message === "conversation_fetched_failed") {
                        console.log(chalk.green(' ======== conversation_fetched_failed ==========='));
                        var emitObj = {
                            event: "receiveSearchConversation",
                            socket: dataObj.socket,
                            data: prepareResult.data,
                            message: prepareResult.message
                        };
                        //now finally emitting the respective event
                        return event_.emitEvents(emitObj)
                            .then(function (emitResult) {
                                firstPromiseResolve(emitResult);
                            });
                    }
                });

        }
        else {
            //here emit empty data object to requester
            var emitObj = {
                event: "receiveSearchConversation",
                socket: dataObj.socket,
                data: [],
                message: "conversation_fetched_failed"
            };
            //now finally emitting the respective event
            return event_.emitEvents(emitObj)
                .then(function (emitResult) {
                    firstPromiseResolve(emitResult);
                });
        }
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//user typing event
exports.userTyping = function (dataObj) {
    return new Promise(function (firstPromiseResolve) {
        if (dataObj.userId != null && dataObj.conversationId != null) {
            return helper.prepareDataForUserTyping(dataObj)
                .then(function (prepareResult) {
                    if (prepareResult) {
                        console.log(util.inspect(prepareResult, {showHidden: true, depth: null}));
                        if (prepareResult.message == "success") {
                            console.log(chalk.green('==================== Successfully Prepared to Emit ================='));
                            var emitObj = {
                                event: "receive_UserTyping",
                                socket: dataObj.socket,
                                data: prepareResult.data,
                                message: prepareResult.message
                            };

                            //now finally emitting the respective event
                            return event_.emitEvents(emitObj)
                                .then(function (emitResult) {
                                    firstPromiseResolve(emitResult);
                                });
                        } else {
                            console.log(chalk.green('==================== Preparation Failed to Emit ================='));
                            firstPromiseResolve(false);
                        }
                    }
                })
        } else {
            firstPromiseResolve(false);
        }
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });

};

//emit notification api
exports.emitNotification = function (dataObj) {
    return new Promise(function (firstPromiseResolve) {
        return helper.prepareDataForEmitNotification(dataObj)
            .then(function (emitNotificationArray) {
                if (emitNotificationArray.length > 0) {
                    var emitObj = {
                        event: "receive_notification",
                        socket: dataObj.socket,
                        data: emitNotificationArray,
                        message: "success"
                    };
                    return event_.emitEvents(emitObj)
                        .then(function (emitResult) {
                            if (emitResult) {
                                firstPromiseResolve(true);
                            } else {
                                firstPromiseResolve(false);
                            }
                        });

                } else {
                    firstPromiseResolve(false);
                }
            });
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

// #####################################################################
// ################   Managing All Emit Events     #####################
//######################################################################

exports.emitEvents = function (emitObject) {
    return new Promise(function (resolvePromise) {
        console.log(chalk.green('==================== Now Finally Emitting the Respective Event ================='));
        if (emitObject.event == "receiveOfflineMessages") {
            //emit event to self
            emitObject.socket.emit('receiveOfflineMessages', {
                data: emitObject.data.conversation // chatobject
            });

            if (emitObject.message == "success") {
                //emit event to respective receiver
                //hence receiver can have multiple sessions
                //so emit to all sessions
                return event_.emitToMultipleSocketIds(emitObject.socket, emitObject.data.otherObj.connectedUserRoomIds, 'receiveConnectedUserLoginStatus', emitObject.data.otherObj.sessionUserProfile)
                    .then(function (result) {
                        resolvePromise(result);
                    });
            }
            else {
                resolvePromise(true);
            }
        }
        else if (emitObject.event === "receiveOfflineStatus") {

            //emit event to respective receiver
            //hence receiver can have multiple sessions
            //so emit to all sessions
            return event_.emitToMultipleSocketIds(emitObject.socket, emitObject.chatRoomId, 'receiveOfflineStatus', emitObject.data)
                .then(function (result) {
                    resolvePromise(result);
                });
        }
        else if (emitObject.event === "receiveChatMessage") {
            if (emitObject.message != "sender_not_logged_in") {
                //emit event to self
                emitObject.socket.emit('receiveChatMessage', {
                    data: emitObject.data[0] // emitting chat object here
                });

                if (emitObject.chatRoomId.receiver.length > 0) {
                    //emit event to respective receiver
                    //hence receiver can have multiple sessions
                    //so emit to all sessions
                    return event_.emitToMultipleSocketIds(emitObject.socket, emitObject.chatRoomId.receiver, 'receiveChatMessage', emitObject.data[0])
                        .then(function (result) {
                            //emit event to respective sender
                            //hence sender can have multiple sessions
                            //so emit to all sessions
                            return event_.emitToMultipleSocketIds(emitObject.socket, emitObject.chatRoomId.sender, 'receiveChatMessage', emitObject.data[0])
                                .then(function (result) {
                                    resolvePromise(result);
                                })
                        });
                }
                else {
                    //emit event to respective sender
                    //hence sender can have multiple sessions
                    //so emit to all sessions
                    return event_.emitToMultipleSocketIds(emitObject.socket, emitObject.chatRoomId.sender, 'receiveChatMessage', emitObject.data[0])
                        .then(function (result) {
                            resolvePromise(result);
                        });
                }
            } else {
                resolvePromise(false);
            }
        }
        else if (emitObject.event === "receiveMessageSeenStatus") {
            var chatRoomIds = [];
            chatRoomIds.push(emitObject.data.chatRoomId);
            delete emitObject.data.chatRoomId;

            //emit event to self
            emitObject.socket.emit('receiveMessageSeenStatus', {
                data: emitObject.data // emitting chat object here
            });

            //emit event to respective sender
            //hence sender can have multiple sessions
            //so emit to all sessions
            return event_.emitToMultipleSocketIds(emitObject.socket, emitObject.userChatRoomIds, 'receiveMessageSeenStatus', emitObject.data)
                .then(function (result) {
                    if (emitObject.message == "update seen status successfully") {
                        //emit event to respective receiver
                        //hence receiver can have multiple sessions
                        //so emit to all sessions
                        return event_.emitToMultipleSocketIds(emitObject.socket, chatRoomIds[0], 'receiveMessageSeenStatus', emitObject.data)
                            .then(function (result) {
                                resolvePromise(result);
                            });
                    } else if (emitObject.message == "failed to update seen status") {
                        resolvePromise(true);
                    }
                });
        }
        else if (emitObject.event === "receiveMessageDeleteStatus") {
            //emit event to self
            emitObject.socket.emit('receiveMessageDeleteStatus', {
                data: emitObject.data // emitting chat object here
            });

            //emit event to respective user
            //hence user can have multiple sessions
            //so emit to all sessions
            return event_.emitToMultipleSocketIds(emitObject.socket, emitObject.chatRoomId, 'receiveMessageDeleteStatus', emitObject.data)
                .then(function (result) {
                    resolvePromise(result);
                });
        }
        else if (emitObject.event === "receiveConversationDeleteStatus") {

            //emit event to self
            emitObject.socket.emit('receiveConversationDeleteStatus', {
                data: emitObject.data // emitting chat object here
            });

            //emit event to respective user
            //hence user can have multiple sessions
            //so emit to all sessions
            return event_.emitToMultipleSocketIds(emitObject.socket, emitObject.chatRoomId, 'receiveConversationDeleteStatus', emitObject.data)
                .then(function (result) {
                    resolvePromise(result);
                });
        }
        else if (emitObject.event === "receiveScrollConversations") {
            //emit event to self
            emitObject.socket.emit('receiveScrollConversations', {
                data: emitObject.data // emitting chat object here
            });
        }
        else if (emitObject.event === "receiveScrollChatMessages") {
            //emit event to self
            emitObject.socket.emit('receiveScrollChatMessages', {
                data: emitObject.data // emitting chat object here
            });
        }
        else if (emitObject.event === "receiveSearchConversation") {
            //emit event to self
            emitObject.socket.emit('receiveSearchConversation', {
                data: emitObject.data // emitting chat object here
            });
        }
        else if (emitObject.event === "receive_UserTyping") {
            if (emitObject.message == "success") {
                //emit event to respective receiver
                //hence receiver can have multiple sessions
                //so emit to all sessions
                return event_.emitToMultipleSocketIds(emitObject.socket, emitObject.data.chatRoomId[0], 'receive_UserTyping', emitObject.data.userTyping)
                    .then(function (result) {
                        resolvePromise(result);
                    });
            } else {
                resolvePromise(false);
            }
        }
        else if (emitObject.event === "receive_notification") {
            if (emitObject.message == "success") {
                return Promise.map(emitObject.data, function (resultObject) {
                    //emit event to respective receiver
                    //hence receiver can have multiple sessions
                    //so emit to all sessions
                    return event_.emitToMultipleSocketIds(emitObject.socket, resultObject.roomId[0], 'receive_notification', resultObject.notification)
                        .then(function (result) {
                            resolvePromise(result);
                        });
                })
                    .then(function () {
                        resolvePromise(true);
                    });
            } else {
                resolvePromise(false);
            }
        }
        else {
            resolvePromise(false);
        }
    }).
        then(function (promiseResult) {
            return promiseResult;
        });
};

exports.emitToMultipleSocketIds = function (socketInstance, socketIds, eventToEmit, dataToEmit) {
    return new Promise(function (resolve) {
        if (socketIds.length > 0) {
            return Promise.map(socketIds, function (id) {
                socketInstance.to(id).emit(eventToEmit, {data: dataToEmit});
            })
                .then(function (result) {
                    resolve(true);
                });
        } else {
            resolve(true);
        }
    })
        .then(function (result) {
            return result;
        });
};

