/**
 * Created by Ahmer Saeed on 10/20/2015.
 */

var util = require('util');

//requiring mysql models
var classAllTables = require('../models/alltables');
var objAllTables = classAllTables.allTables;
var Media = require('../models/Media');
var User = require('../models/User');
var models = require('../models');

//requiring mongodb models
var mongoose = require('mongoose')
    , chatConversationsThreads = mongoose.model('chat_conversations_threads')
    , chatConversationsDetails = mongoose.model('chat_conversations_details')
    , chatMessages = mongoose.model('chat_messages')
    , chatMessagesDetails = mongoose.model('chat_messages_details')
    , users = mongoose.model('users')
    , usersFiles = mongoose.model('users_files');


//requiring npm
var Promise = require("bluebird");
var chalk = require('chalk');

//requiring files
var config = require('../config/config');
var developmentConfig = require('../config/development_config');
var env = process.env.NODE_ENV || 'development';
var chatConfig = require('../config/chat_config')[env];
var chatController = require('../controllers/chat');
var helper = require('../helpers/helper');
var db = require('../helpers/db');
var utility = require('../helpers/utility');

// #####################################################################
// ###############  All Helping / Reusable Functions  #################
//######################################################################


//generate UnixTimeStapm in milliseconds
exports.getUnixTimeStamp = function () {
    return Math.floor(Date.now() / 1000);
};


//function to get user session status from users collection
//behalf of provided user id
exports.getUserStatusFromChatRoom = function (userId) {
    var resultStatus = "USER_NOT_EXIST";
    var query = {
        uId: userId
    };
    return chatController.getCollection(users, query, '{}')
        .then(function (queryResult) {
            if (queryResult.length > 0) {
                console.log(chalk.green('  ======== Hence User is exist ========'));
                //now checking its status
                var query = {
                    uId: userId,
                    status: {$ne: 0} //i-e not an offline user
                };
                return chatController.getCollection(users, query, '{}')
                    .then(function (queryResult) {
                        if (queryResult.length > 0) {
                            console.log(chalk.green('  ======== Hence User is online ========'));
                            return resultStatus = "USER_IS_ONLINE";
                        } else {
                            console.log(chalk.green('  ======== Hence User is offline ========'));
                            return resultStatus = "USER_IS_OFFLINE";
                        }
                    });
            } else {
                console.log(chalk.green('  ======== Hence User is offline ========'));
                return resultStatus; // i-e USER_NOT_EXIST
            }

        });
};

//function to get object of on online users on
//behalf of provided user id
exports.getOnlineUsersObject = function (userId) {
    var query = {
        uId: userId,
        status: {$ne: 0} //i-e not an offline user
    };
    return chatController.getCollection(users, query, '{}')
        .then(function (queryResult) {
            if (queryResult.length > 0) {
                console.log(chalk.green('  ======== Hence User is not offline ========'));
                return queryResult[0];
            } else {
                console.log(chalk.green('  ======== Hence User is offline ========'));
                return null;
            }
        });
};

//function to get user object
//from mongo users collections
//on behalf of provided user id
exports.getUserObject = function (userId) {
    var query = {
        uId: userId
    };
    return chatController.getCollection(users, query, '{}')
        .then(function (queryResult) {
            if (queryResult.length > 0) {
                console.log(chalk.green('  ======== User is exist ========'));
                return queryResult[0];
            } else {
                console.log(chalk.green('  ======== User is not exist ========'));
                return null;
            }
        });
};

//checking if user is already exist on behalf of provided userId
//on success return user object with user credentials
//other wise return null object
exports.getUserFromChatRoomViaSocketId = function (socketId) {
    var query = {
        socketIds: socketId
    };
    return chatController.getCollection(users, query, '{}')
        .then(function (queryResult) {
            if (queryResult.length > 0) {
                console.log(chalk.green('  ======== User is exist ========'));
                return queryResult[0];
            } else {
                console.log(chalk.green('  ======== User is not exist ========'));
                return null;
            }

        });
};

//on success return true
//other wise return false
//userOneId = id of user
//userTwoObjectId = table id of target user
exports.checkUserInChatList = function (userOneId, userTwoObjectId) {
    console.log(chalk.green(' ======== Checking is User is in the Chat List  =========='));
//first fetching user object
    var isUserInChatList = false;
    var query = {
        uId: userOneId,
        chatList: userTwoObjectId
    };
    return chatController.getCollection(users, query, '{}')
        .then(function (queryResult) {
            if (queryResult.length > 0) {
                isUserInChatList = true;
            }
            return isUserInChatList;
        });
};

//adding receiverId's table id in chatList of Sender
//if they are not already in the chatList of Sender
exports.addUsersToChatList = function (senderId, receiverIdsTableId) {

    console.log(chalk.green(' ======== Adding User to Chat List only if not in the Chat List  =========='));
    return helper.checkUserInChatList(senderId, receiverIdsTableId)
        .then(function (isUserExistInChatList) {
            if (!isUserExistInChatList) {
                console.log(chalk.green(' ======== Hence this User is not in the Chat List  =========='));
                //hence user is not in chatList of message sender so adding in chatList
                var queryObj = {
                    uId: senderId
                };
                return chatController.updateCollectionViaPushKey(users, {chatList: receiverIdsTableId},
                    {
                        safe: true,
                        upsert: true
                    },
                    queryObj,
                    function (err, updateResult) {
                        console.log('err', err);
                        if (err == null) {
                            console.log(chalk.green(' ======== User is Added in the Chat List of Sender  =========='));

                        } else {
                            console.log(chalk.green('======== Error in updating Socket Id : ========'));
                        }
                        return;
                    });
            } else {
                console.log(chalk.green(' ======== Hence this User is already in the Chat List  =========='));
                //user is already added in chatList of message sender
                return;
            }
        });
}

//removing socketIds against provided userObj
exports.removeSocketIdFromChatRoom = function (userObj, dataObj) {
    var socketIdToRemove = dataObj.socket.id;
    var socketIdRemovedStatus = "FALSE";
    return new Promise(function (firstPromiseResolve) {
        //first remove the respective socketId of given session user from
        //the socket array after removing it make check whether the socket array
        //length is zero or greater than zero now, if it is zero then make
        //chatList array to [],status to 0 and set removed socketIdRemovedStatus
        //to user_is_offline other wise set status user_is_still_online
        var query = {
            uId: userObj.uId
        };
        var pullKeyObject = {
            socketIds: socketIdToRemove
        };
        return chatController.updateCollectionViaPullKey(users, pullKeyObject, {
            safe: true,
            upsert: true
        }, query, function (err) {
            if (err == null) {
                console.log(chalk.green(' ===== This socketId is Successfully Removed  ==== ', socketIdToRemove));
                return helper.getUserObject(userObj.uId)
                    .then(function (result) {
                        if (result != null) {
                            if (result.socketIds.length > 0) {
                                //hence user is still online
                                socketIdRemovedStatus = "USER_IS_ONLINE";
                                firstPromiseResolve(socketIdRemovedStatus);
                            } else {
                                //hence user is offline now
                                //now removing all the friends in chatList
                                //of this user
                                var updateQueryObj = {
                                    "_id": result._id
                                };
                                var updateObj = {
                                    chatList: [],
                                    status: 0,
                                    last_seen_time: dataObj.lastSeenTime
                                };
                                var options = {multi: false};
                                return chatController.updateCollection(users, updateObj, options, updateQueryObj, function (err, updateResult) {
                                    if ((updateResult.ok == 1) && (updateResult.nModified == 1 || updateResult.nModified > 1)) {
                                        console.log(chalk.green('======== Updating ChatList Result is True ========'));
                                        return helper.getUserObject(userObj.uId)
                                            .then(function (result) {
                                                if (result != null) {
                                                    if (result.chatList.length > 0) {
                                                        console.log(chalk.green('======== Hence Chat List is not null ========'));
                                                        socketIdRemovedStatus = "USER_IS_ONLINE";
                                                        firstPromiseResolve(socketIdRemovedStatus);
                                                    } else {
                                                        console.log(chalk.green('======== Hence Chat List is null now ========'));
                                                        socketIdRemovedStatus = "USER_IS_OFFLINE";
                                                        firstPromiseResolve(socketIdRemovedStatus);
                                                    }
                                                } else {
                                                    firstPromiseResolve(socketIdRemovedStatus);
                                                }
                                            });
                                    } else if ((updateResult.ok == 1) && (updateResult.nModified == 0)) {
                                        console.log(chalk.green('======== Updating ChatList Result is False : ========'));
                                        firstPromiseResolve(socketIdRemovedStatus);
                                    }
                                    else if (updateResult.ok == 0 || err != null) {
                                        console.log(chalk.green('======== Updating ChatList Result is Error : ========'));
                                        firstPromiseResolve(socketIdRemovedStatus);
                                    }
                                });
                            }
                        } else {
                            firstPromiseResolve(socketIdRemovedStatus);
                        }
                    });
            }
            else {
                firstPromiseResolve(socketIdRemovedStatus);
            }
        });
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//return all socket ids for connected users
exports.returnChatRoomIdsForConnectedUsers = function (connectedUserIds) {
    var allChatRoomIds = [];
    return Promise.map(connectedUserIds, function (resultUserIds) {
        return helper.getOnlineUsersObject(resultUserIds)
            .then(function (fetchedUserObj) {
                if (fetchedUserObj != null) {
                    //now iterating over each user object
                    // in order to find and save there socket Ids
                    // in allChatRoomIds array
                    if (fetchedUserObj.socketIds.length > 0) {
                        return Promise.map(fetchedUserObj.socketIds, function (resultSocketIds) {
                            if (resultSocketIds != null) {
                                allChatRoomIds.push(resultSocketIds);
                            }
                        });
                    }
                }
            })
    })
        .then(function () {
            return allChatRoomIds;
        });
};

//checking if user is logged in or not
//on success return true
//other wise return false
//it takes object, which contains user credentials
exports.isUserLoggedIn = function (userObj) {
    return new Promise(function (resolveLoggedIn) {
        //var tableSession = objAllTables.sessions.sessions();
        models.sessions.findOne({
            where: {
                $and: [
                    {
                        uid: userObj.userId
                    },
                    {
                        token: userObj.userToken
                    }
                ]
            }
        })
            .then(function (isUserLoggedIn) {
                if (isUserLoggedIn != null) {
                    resolveLoggedIn(true);
                } else {
                    resolveLoggedIn(false);
                }
            })
            .error(function () {
                resolveLoggedIn(false);
            })
    })
        .then(function (isUserLoggedIn) {
            return isUserLoggedIn;
        });
};


//getAllCompleteConversations returns
//all the complete conversations of provided user
exports.getAllCompleteConversations = function (userObj) {
    return new Promise(function (firstPromiseResolve) {
        var responseBack = {
            conversation: [],
            otherObj: {
                sessionUserProfile: [],
                connectedUserRoomIds: []
            }
        };
        var queryObjGetConversationsIds = {
            uid: parseInt(userObj.userId),
            status: 1
        };
        var groupBy = {
            key: {
                _id: "$conversations_id",
                created_time: {$addToSet: "$created_time"}
            }
        };
        var projectBy = {
            alias: {
                '_id': 0,
                'conversations_id': "$_id",
                'created_time': 1
            }
        };
        var sortBy = {
            key: {
                created_time: chatConfig.pagination.message.sort
            },
            limit: chatConfig.pagination.conversation.limit

        };
        return new Promise(function (checkPromiseResolve) {
            return chatController.getAggregateCollectionComplete(chatMessagesDetails, queryObjGetConversationsIds, groupBy, projectBy, sortBy)
                .then(function (collectionResult) {
                    checkPromiseResolve(collectionResult);
                })
        })
            //make proper array
            //.then(function (collectionResult) {
            //    var collectionLength = collectionResult.length;
            //    if (collectionLength > 0) {
            //        var promiseFor = Promise.method(function (condition, action, value) {
            //            if (!condition(value)) return value;
            //            return action(value).then(promiseFor.bind(null, condition, action));
            //        });
            //        return promiseFor(function (count) {
            //            return count < collectionLength;
            //        }, function (count) {
            //            return new Promise(function (secondPromiseResolve) {
            //                delete collectionResult[count]['messagesId'];
            //                secondPromiseResolve();
            //            })
            //                .then(function (secondPromiseResult) {
            //                    return ++count;
            //                })
            //        }, 0)
            //            .then(function () {
            //                return collectionResult;
            //            });
            //    } else {
            //        return collectionResult;
            //    }
            //})
            ////remove duplicates
            //.then(function (collectionResult) {
            //    return utility.removeDuplicateConversationIds(collectionResult);
            //})
            ////reverse
            //.then(function (collectionResult) {
            //    //return collectionResult.reverse();
            //    return collectionResult;
            //})

            //creating chat object
            .then(function (collectionResult) {
                if (collectionResult.length > 0) {
                    return helper.getChatObjectForAllConversations(collectionResult, userObj)
                        .then(function (allMessagesDetails) {
                            //now get UserIds from collectionResult.uid save in array as users
                            //also get message content by joining allMessagesDetails.messages_id result with message table
                            responseBack.conversation = allMessagesDetails;
                            return collectionResult;
                        });
                } else {
                    console.log(chalk.green(' ======== collectionResult is of zero length ==========='));
                    return collectionResult;
                }
            })
            //fetching connected users and their socketIds
            .then(function (collectionResult) {
                var allConnectedUsers = [];
                var promiseFor = Promise.method(function (condition, action, value) {
                    if (!condition(value)) return value;
                    return action(value).then(promiseFor.bind(null, condition, action));
                });
                promiseFor(function (count) {
                    return count < collectionResult.length;
                }, function (count) {
                    return new Promise(function (secondPromiseResolve) {
                        //first finding the conversation id (group by) id w.r.t user id
                        var queryObj = {
                            conversations_id: collectionResult[count][0],
                            uid: {$ne: parseInt(userObj.userId)},
                            status: 1
                        };
                        var groupByObj = {
                            key: "$uid",
                            alias: {
                                "_id": 0,
                                uid: "$_id",
                                conversationsId: "$conversations_id"
                            }
                        };
                        //returns user ids
                        return chatController.getAggregateCollectionGroupBy(chatConversationsDetails, queryObj, groupByObj)
                            .then(function (result) {
                                if (result.length > 0) {
                                    allConnectedUsers.push(result[0].uid);
                                }
                                secondPromiseResolve();
                            });
                    })
                        .then(function () {
                            return ++count;
                        })
                }, 0)
                    .then(function () {
                        console.log("==== Find Connected User Ids ===");
                        //get connected user's socket ids
                        return helper.returnChatRoomIdsForConnectedUsers(allConnectedUsers)
                            .then(function (allChatRoomIds) {
                                //now getting session user object
                                //to emit to allConnectedUsers

                                //now appending the user object of who's
                                //going to be disconnected from chat
                                var sessionUserObj = {
                                    userId: userObj.userId
                                };
                                return helper.getUserMiniProfileObject(sessionUserObj)
                                    .then(function (userProfile) {
                                        var sessionUserProfile = {
                                            uid: userProfile.uid || null,
                                            name: userProfile.name || null,
                                            username: userProfile.username || null,
                                            image: userProfile.profile.small || null,
                                            lastSeenTime: userProfile.lastSeenTime || null,
                                            status: userProfile.sessionStatus || null
                                        };
                                        responseBack.otherObj.connectedUserRoomIds = allChatRoomIds;
                                        responseBack.otherObj.sessionUserProfile = sessionUserProfile;
                                        firstPromiseResolve(responseBack);
                                    });
                            });
                    });
            });
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });

}

//return true if allValues are same in array
exports.isAllValuesSame = function (checkArray) {
    Array.prototype.allValuesSame = function (checkArray) {
        for (var i = 1; i < checkArray.length; i++) {
            if (checkArray[i] !== checkArray[0])
                return false;
        }
        return true;
    }
};

//return conversations id w.r.t user id
// and status w.r.t both users
exports.getUserIdsWRTConversations = function (userObj) {
    return new Promise(function (firstPromiseResolve) {
        //first finding the conversation id (group by) id w.r.t user id
        var allConnectedUsers = [];
        var queryObj = {
            uid: parseInt(userObj.uId),
            status: 1
        };
        var groupByObj = {
            key: "$conversations_id",
            alias: {
                "_id": 0,
                conversationsId: "$_id"
            }
        };
        //returns conversation ids
        return chatController.getAggregateCollectionGroupBy(chatConversationsDetails, queryObj, groupByObj)
            .then(function (conversationsIds) {

                //you can use below logic for login scenario as well

                //now iterate over this conversation ids for finding status w.r.t
                //to other user as its status is 1 or 0 if 1 take this user id for emitting event
                //other wise exclude it

                var conversationsIdsLength = conversationsIds.length;
                var promiseFor = Promise.method(function (condition, action, value) {
                    if (!condition(value)) return value;
                    return action(value).then(promiseFor.bind(null, condition, action));
                });
                promiseFor(function (count) {
                    return count < conversationsIdsLength;
                }, function (count) {
                    return new Promise(function (secondPromiseResolve) {
                        //first finding the conversation id (group by) id w.r.t user id
                        var queryObj = {
                            conversations_id: conversationsIds[count].conversationsId,
                            uid: {$ne: parseInt(userObj.uId)},
                            status: 1
                        };
                        var groupByObj = {
                            key: "$uid",
                            alias: {
                                "_id": 0,
                                uid: "$_id",
                                conversationsId: "$conversations_id"
                            }
                        };
                        //returns user ids
                        return chatController.getAggregateCollectionGroupBy(chatConversationsDetails, queryObj, groupByObj)
                            .then(function (result) {
                                if (result.length > 0) {
                                    allConnectedUsers.push(result[0].uid);
                                }
                                secondPromiseResolve();
                            });
                    })
                        .then(function () {
                            return ++count;
                        })
                }, 0)
                    .then(function () {
                        firstPromiseResolve(allConnectedUsers)
                    });
            });
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//hit push-notification api function
exports.hitPushNotificationAPI = function (host, port, api, chatObj) {

    var method = 'POST';
    var contentType = 'application/json';
    var apiVersion = '1.0.0';
    var url = 'http://' + host + ':' + port + '/' + api;
    console.log('Now Hitting Url: ', url);
    utility.requestServer(url, method, contentType, chatObj, apiVersion)
        .then(function (result) {
            console.log('####################### CALLING PUSH NOTIFICATION API - End #######################');
            return result;
        });
};


// #####################################################################
// ################  All Data Preparing Functions  #####################
//######################################################################


//prepare data for conversation threads
exports.saveConversationThreads = function (conversation) {
    return new Promise(function (resolvePromise) {
        var newConversationThread = chatConversationsThreads({
            uid: conversation,
            created_time: helper.getUnixTimeStamp()
        });
        return chatController.insertCollection(newConversationThread, null)
            .then(function (insertedId) {
                resolvePromise(insertedId);
            });
    })
        .then(function (firstPromiseResult) {
            //now inserting conversation details
            //firstPromiseResult contains conversation id
            if (firstPromiseResult != null) {
                var dataObj = {
                    conversationsId: firstPromiseResult,
                    conversation: conversation,
                    mute: false,
                    hide: false,
                    status: 1,
                    created_time: helper.getUnixTimeStamp()
                };
                return helper.saveConversationDetails(dataObj)
                    .then(function (insertedResult) {
                        if (insertedResult != null) {
                            return firstPromiseResult;
                        } else {
                            return insertedResult;
                        }

                    });
            } else {
                return null
            }
        });
}

//prepare data for conversation details
exports.saveConversationDetails = function (dataObj) {
    return new Promise(function (resolvePromise) {
        var arrayLength = dataObj.conversation.length;
        var result = null; // insertedResult of saving conversations_details collection
        var promiseFor = Promise.method(function (condition, action, value) {
            if (!condition(value)) return value;
            return action(value).then(promiseFor.bind(null, condition, action));
        });
        promiseFor(function (count) {
            return count < arrayLength;
        }, function (count) {
            return new Promise(function (lastPromiseResolve) {
                var newConversationThreadDetails = chatConversationsDetails({
                    conversations_id: dataObj.conversationsId,
                    uid: dataObj.conversation[count],
                    mute: dataObj.mute,
                    hide: dataObj.hide,
                    status: dataObj.status,
                    created_time: dataObj.created_time
                });
                return chatController.insertCollection(newConversationThreadDetails, null)
                    .then(function (insertedResult) {
                        result = insertedResult;
                        lastPromiseResolve(insertedResult);
                    });
            })
                .then(function () {
                    return ++count;
                })
        }, 0)
            .then(function () {
                resolvePromise(result)
            });
    })
        .then(function (promiseResult) {
            return promiseResult;
        });

};

//prepare data for messages
exports.saveMessages = function (dataObj) {

    console.log(chalk.green('=== First Save Message to Database : ====='));

    var messageObject = {};
    return new Promise(function (resolvePromise) {
        var newMessage = chatMessages({
            conversations_id: dataObj.conversationsId,
            uid: dataObj.msgFrom,
            content: dataObj.messageContent,
            url_share_id: dataObj.urlSharedId,
            created_time: helper.getUnixTimeStamp()
        });
        return chatController.insertCollection(newMessage, null)
            .then(function (insertedId) {
                resolvePromise(insertedId);
            });
    })
        .then(function (promiseResult) {
            if (promiseResult != null) {
                //now inserting messages details
                console.log(chalk.green('=== Message ID which is Saved is : =====', promiseResult));
                var obj = {
                    "conversationsId": dataObj.conversationsId,
                    "messagesId": promiseResult,
                    "senderId": dataObj.msgFrom,
                    "uIds": dataObj.conversation,
                    "seen": false,
                    "delivered": true,
                    "status": 1,
                    "created_time": helper.getUnixTimeStamp()
                };
                return helper.saveMessagesDetails(obj)
                    .then(function (insertedResult) {
                        if (insertedResult != null) {
                            return new Promise(function (resolvePromise) {
                                if (dataObj.mediaId.length > 0) {
                                    console.log(chalk.green('======== Media Id is not null ========'));
                                    var loopResult = 'FALSE';
                                    var updateQueryObj =
                                    {
                                        _id: {
                                            $in: dataObj.mediaId
                                        },
                                        status: 1
                                    };
                                    var updateObj = {message_id: promiseResult};
                                    var options = {multi: true};
                                    return chatController.updateCollectionUsingInClause(usersFiles, updateObj, options, updateQueryObj, function (err, updateResult) {
                                        if ((updateResult.ok == 1) && (updateResult.nModified == 1 || updateResult.nModified > 1)) {
                                            console.log(chalk.green('======== Updating Media Id Result is True ========'));
                                            loopResult = 'TRUE';
                                            resolvePromise('TRUE');

                                        }
                                        else if ((updateResult.ok == 1) && (updateResult.nModified == 0)) {
                                            console.log(chalk.green('======== Updating Media Id Result is False : ========'));
                                            loopResult = 'FALSE';
                                            resolvePromise('FALSE');
                                        }
                                        else if (updateResult.ok == 0 || err != null) {
                                            console.log(chalk.green('======== Updating Media Id Result is Error : ========'));
                                            loopResult = 'FALSE';
                                            resolvePromise('FALSE');
                                        }
                                    });
                                } else {
                                    resolvePromise('FALSE');
                                }
                            })
                                .then(function (resultPromise) {
                                    console.log(chalk.green('======== After Loop is Complete ========', resultPromise));
                                    //now creating messageObject here
                                    //in order to append in chat object
                                    //now fetching message details
                                    var queryGetMessageDetails = {
                                        messages_id: promiseResult,
                                        uid: {$ne: dataObj.msgFrom},
                                        status: 1 // i-e status is active\
                                    };
                                    var statsObj = {
                                        referenceId: 'messages_id',
                                        limit: chatConfig.pagination.message.limit,
                                        sortBy: {
                                            'messages_id': chatConfig.pagination.message.sort
                                        }
                                    };
                                    return chatController.getPopulatedCollections(chatMessagesDetails, queryGetMessageDetails, statsObj)
                                        .then(function (messageDetailsResult) {
                                            if (messageDetailsResult != null) {
                                                if (resultPromise !== 'FALSE') {
                                                    //first embedding media (if used in message) in message object
                                                    return helper.getChatMediaArray(messageDetailsResult[0].messages_id._id, '*', '*', '*', '*')
                                                        .then(function (mediaArray) {
                                                            console.log('the media array', mediaArray);
                                                            //now embedding shared url information (if shared in message) in message object
                                                            return helper.getFetchedUrlData(messageDetailsResult[0].messages_id.url_share_id)
                                                                .then(function (urlData) {
                                                                    if (urlData != null) {
                                                                        //messageObject.fetched_url = urlData;
                                                                        return messageObject = {
                                                                            conversationId: messageDetailsResult[0].messages_id.conversations_id,
                                                                            messageId: messageDetailsResult[0].messages_id._id,
                                                                            senderId: messageDetailsResult[0].sender_id,
                                                                            receiverId: messageDetailsResult[0].uid,
                                                                            content: messageDetailsResult[0].messages_id.content,
                                                                            seen: messageDetailsResult[0].seen,
                                                                            delivered: messageDetailsResult[0].delivered,
                                                                            status: messageDetailsResult[0].status,
                                                                            createdTime: messageDetailsResult[0].created_time,
                                                                            media: mediaArray,
                                                                            fetched_url: urlData
                                                                        };
                                                                    } else {
                                                                        //messageObject.fetched_url = {};
                                                                        return messageObject = {
                                                                            conversationId: messageDetailsResult[0].messages_id.conversations_id,
                                                                            messageId: messageDetailsResult[0].messages_id._id,
                                                                            senderId: messageDetailsResult[0].sender_id,
                                                                            receiverId: messageDetailsResult[0].uid,
                                                                            content: messageDetailsResult[0].messages_id.content,
                                                                            seen: messageDetailsResult[0].seen,
                                                                            delivered: messageDetailsResult[0].delivered,
                                                                            status: messageDetailsResult[0].status,
                                                                            createdTime: messageDetailsResult[0].created_time,
                                                                            media: mediaArray,
                                                                            fetched_url: urlData
                                                                        };
                                                                    }
                                                                });
                                                        });
                                                } else {
                                                    //now embedding shared url information (if shared in message) in message object
                                                    return helper.getFetchedUrlData(messageDetailsResult[0].messages_id.url_share_id)
                                                        .then(function (urlData) {
                                                            if (urlData != null) {
                                                                messageObject.fetched_url = urlData;
                                                            } else {
                                                                messageObject.fetched_url = {};
                                                            }
                                                            return messageObject = {
                                                                conversationId: messageDetailsResult[0].messages_id.conversations_id,
                                                                messageId: messageDetailsResult[0].messages_id._id,
                                                                senderId: messageDetailsResult[0].sender_id,
                                                                receiverId: messageDetailsResult[0].uid,
                                                                content: messageDetailsResult[0].messages_id.content,
                                                                seen: messageDetailsResult[0].seen,
                                                                delivered: messageDetailsResult[0].delivered,
                                                                status: messageDetailsResult[0].status,
                                                                createdTime: messageDetailsResult[0].created_time,
                                                                media: [],
                                                                fetched_url: urlData
                                                            };
                                                        });
                                                }

                                            } else {
                                                return messageObject;
                                            }
                                        });
                                });
                        } else {
                            return insertedResult;
                        }
                    });
            } else {
                return messageObject;
            }
        });
};

//prepare data for messages details
exports.saveMessagesDetails = function (dataObj) {
    return new Promise(function (resolvePromise) {
        var arrayLength = dataObj.uIds.length;
        var result = null; // insertedResult of saving messages_details collection
        var promiseFor = Promise.method(function (condition, action, value) {
            if (!condition(value)) return value;
            return action(value).then(promiseFor.bind(null, condition, action));
        });
        promiseFor(function (count) {
            return count < arrayLength;
        }, function (count) {
            return new Promise(function (lastPromiseResolve) {
                if (dataObj.uIds[count] == dataObj.senderId) {
                    dataObj.seen = true; // i-e where receiver id equals to sender id
                } else {
                    dataObj.seen = false; // i-e where receiver id not equals to sender id
                }
                var newMessagesDetails = chatMessagesDetails({
                    conversations_id: dataObj.conversationsId,
                    messages_id: dataObj.messagesId,
                    sender_id: dataObj.senderId,
                    uid: dataObj.uIds[count],
                    seen: dataObj.seen,
                    delivered: dataObj.delivered,
                    status: dataObj.status,
                    created_time: helper.getUnixTimeStamp()
                });
                return chatController.insertCollection(newMessagesDetails, null)
                    .then(function (insertedResult) {
                        result = insertedResult;
                        console.log(chalk.green('=== Message Details ID which is Saved is : =====', insertedResult));
                        lastPromiseResolve(insertedResult);
                    });
            })
                .then(function () {
                    return ++count;
                })
        }, 0)
            .then(function () {
                resolvePromise(result)
            });
    })
        .then(function (promiseResult) {
            return promiseResult;
        });
};

// #####################################################################
// ################  All Emit Preparing Functions  #####################
//######################################################################

//login event
exports.prepareLoginDataBeforeEmit = function (userObj) {
    return new Promise(function (resolveFirstPromise) {
        //for response back to calling method (i-e login)
        var responseLoginEventMethod = {
            message: "",
            data: ""
        };
        return helper.getUserStatusFromChatRoom(userObj.userId)
            .then(function (userStatus) {
                if (userStatus == "USER_NOT_EXIST") {
                    console.log(' === This is User"s very first Session ===', userObj.socket.id);
                    //now creating room on behalf of this user
                    //by saving its default socket Id in users collection
                    var newUser = users({
                        uId: userObj.userId,
                        token: userObj.userToken,
                        socketIds: userObj.socket.id,
                        chatList: [],
                        roomId: [],
                        status: 1,
                        last_seen_time: null,
                        updated_time: helper.getUnixTimeStamp(),
                        created_time: helper.getUnixTimeStamp()
                    });
                    return chatController.insertCollection(newUser, null)
                        .then(function (insertedId) {
                            console.log(' == This user has single default room now == ');
                            return helper.getAllCompleteConversations(userObj)
                                .then(function (completeConversations) {
                                    console.log(chalk.green('==== Conversations List for this User is Fetched now Ready to Emit the Event ==='));
                                    responseLoginEventMethod.message = "user_is_logged_in_successfully";
                                    responseLoginEventMethod.data = completeConversations;
                                    resolveFirstPromise(responseLoginEventMethod);
                                });
                        });
                }
                else if (userStatus == "USER_IS_OFFLINE") {
                    console.log(' === This is User"s single Session ===', userObj.socket.id);
                    //now updating user's status to 1 i-e online
                    var updatingQueryObj = {
                        uId: userObj.userId
                    };
                    return chatController.updateCollectionViaPushAndSetKey(users, {socketIds: userObj.socket.id}, {
                        status: 1,
                        last_seen_time: null
                    }, {}, updatingQueryObj, function (err, updateResult) {
                        if (err == null) {
                            console.log(' == This user has single default room now == ');
                            return helper.getAllCompleteConversations(userObj)
                                .then(function (completeConversations) {
                                    console.log(chalk.green('==== Conversations List for this User is Fetched now Ready to Emit the Event ==='));
                                    responseLoginEventMethod.message = "user_is_logged_in_successfully";
                                    responseLoginEventMethod.data = completeConversations;
                                    resolveFirstPromise(responseLoginEventMethod);
                                });

                        } else {
                            console.log(chalk.green('======== Updating User Result is False : ========'));
                            responseLoginEventMethod.message = "user_is_failed_to_logged_in";
                            responseLoginEventMethod.data = [];
                            resolveFirstPromise(responseLoginEventMethod);
                        }
                    });
                }
                else if (userStatus == "USER_IS_ONLINE") {
                    console.log(' === This is User"s multiple Session ===');
                    //Hence this user is login multiple times
                    //now first checking whether its default socket id
                    //is already exist in user collection in case of exist
                    //no need to save it other wise save it
                    var query = {
                        uId: userObj.userId,
                        socketIds: userObj.socket.id
                    };
                    return chatController.getCollection(users, query, '{}')
                        .then(function (queryResult) {
                            if (queryResult.length > 0) {
                                console.log(chalk.green('  ======== Hence this Socket Id is already exist ========'));
                                return helper.getAllCompleteConversations(userObj)
                                    .then(function (completeConversations) {
                                        console.log(chalk.green('==== Conversations List for this User is Fetched now Ready to Emit the Event ==='));
                                        responseLoginEventMethod.message = "user_is_logged_in_successfully";
                                        responseLoginEventMethod.data = completeConversations;
                                        resolveFirstPromise(responseLoginEventMethod);
                                    });
                            } else {
                                console.log(chalk.green('  ======== Hence this Socket Id is not exist ========'));
                                //hence this socket id is not exist so
                                //update this in users collection
                                var queryObj = {
                                    uId: userObj.userId
                                };
                                return chatController.updateCollectionViaPushKey(users, {socketIds: userObj.socket.id},
                                    {
                                        safe: true,
                                        upsert: true
                                    },
                                    queryObj,
                                    function (err, updateResult) {
                                        console.log('err', err);
                                        if (err == null) {
                                            console.log(chalk.green('======== Socket Id is updated Successfully : ========'));
                                            return helper.getAllCompleteConversations(userObj)
                                                .then(function (completeConversations) {
                                                    console.log(chalk.green('==== Conversations List for this User is Fetched now Ready to Emit the Event ==='));
                                                    responseLoginEventMethod.message = "user_is_logged_in_successfully";
                                                    responseLoginEventMethod.data = completeConversations;
                                                    resolveFirstPromise(responseLoginEventMethod);
                                                });
                                        } else {
                                            console.log(chalk.green('======== Error in updating Socket Id : ========'));
                                            responseLoginEventMethod.message = "chat_room_id_failed_to_update";
                                            responseLoginEventMethod.data = [];
                                            resolveFirstPromise(responseLoginEventMethod);
                                        }
                                    });
                            }
                        });
                }
            });
    })
        .then(function (firstPromiseResult) {
            return (firstPromiseResult);
        });
};

exports.saveFile = function () {
    var newFile = usersFiles({
        uId: 1,
        message_id: null,
        name: 'image1',
        extension: '.jpg',
        width: 100,
        height: 100,
        type: 'IMAGE',
        path: 'path',
        duration: 0,
        thumbs: [
            {
                path: 'path/square',
                width: 100,
                height: 100,
                sizetype: 'square',
                thumbtype: 'image',
                status: 1
            },
            {
                path: 'path/small',
                width: 100,
                height: 100,
                sizetype: 'small',
                thumbtype: 'image',
                status: 1
            },
            {
                path: 'path/medium',
                width: 100,
                height: 100,
                sizetype: 'medium',
                thumbtype: 'image',
                status: 1
            },
            {
                path: 'path/large',
                width: 100,
                height: 100,
                sizetype: 'large',
                thumbtype: 'image',
                status: 1
            }
        ],
        compress_types: [
            //{
            //    path: 'path',
            //    width: 100,
            //    height: 100,
            //    sizetype: 'square',
            //    status: 1
            //},
            //{
            //    path: 'path',
            //    width: 100,
            //    height: 100,
            //    sizetype: 'square',
            //    status: 1
            //}
        ],
        status: 1,
        created_time: helper.getUnixTimeStamp()
    });
    return chatController.insertCollection(newFile, null)
        .then(function (insertedId) {
            return insertedId;
        });
};

//message event
exports.prepareMessageDataBeforeEmit = function (dataObj) {
    return new Promise(function (resolveFirstPromise) {
        //now checking if receiver is logged in or not,
        //if logged in emit the message to
        //both sender and receiver other wise
        //emit message to sender
        console.log(chalk.green(' ========== Now First Prepare Message Data before Emit it =============='));
        var senderSocketIds = "";
        var senderTableId = "";
        var responseLoginEventMethod = {
            message: "",
            data: {
                sender: "",
                receiver: ""
            }
        };
        console.log(chalk.green('====== First Fetching Socket Ids for Sender ======'));
        //fetching socketIds for sender
        return helper.getOnlineUsersObject(dataObj.msgFrom)
            .then(function (senderUserObject) {
                if (senderUserObject != null) {
                    senderTableId = senderUserObject._id;
                    senderSocketIds = senderUserObject.socketIds;
                    responseLoginEventMethod.data.sender = senderSocketIds;
                    console.log(chalk.green('====== SenderId"s Socket Ids : ======', senderSocketIds));
                    console.log(chalk.green('====== SenderId"s Table Id : ======', senderTableId));
                    console.log(chalk.green(' ======== Now Checking is Receiver is Logged In =============='));
                    return helper.getOnlineUsersObject(dataObj.msgTo)
                        .then(function (receiverUserObject) {
                            var allSocketIds = null;
                            if (receiverUserObject != null) {
                                //hence user is logged in
                                console.log(chalk.green('====== Hence Receiver is Logged In ======'));
                                console.log(chalk.green('====== ReceiverId"s Table Id : ======', receiverUserObject._id));
                                allSocketIds = receiverUserObject.socketIds || [];
                                if (allSocketIds.length > 0) {
                                    responseLoginEventMethod.message = "chat_room_id_exist";
                                    responseLoginEventMethod.data.receiver = allSocketIds;
                                    resolveFirstPromise(responseLoginEventMethod);
                                }
                                else {
                                    console.log(chalk.green(' =========== Hence Receiver Room IDs are not exist =============='));
                                    //no chatRoomId is exist
                                    responseLoginEventMethod.message = "chat_room_id_not_exist";
                                    responseLoginEventMethod.data.receiver = [];
                                    resolveFirstPromise(responseLoginEventMethod);
                                }
                            }
                            else {
                                //hence receiver is not logged in
                                //so no need to add in chat list
                                console.log(chalk.green(' ============= Hence Receiver is not Logged In ============='));
                                //now adding receiver to sender chat list
                                responseLoginEventMethod.message = "receiver_not_logged_in";
                                responseLoginEventMethod.data.receiver = [];
                                resolveFirstPromise(responseLoginEventMethod);
                            }
                        });
                } else {
                    responseLoginEventMethod.data.sender = [];
                    responseLoginEventMethod.data.receiver = [];
                    responseLoginEventMethod.message = "sender_not_logged_in";
                    resolveFirstPromise(responseLoginEventMethod);
                }
            })
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//disconnect event
//removing socketId from users table
exports.prepareDisconnectDataBeforeEmit = function (dataObj) {
    console.log(chalk.green(' =============== In removeChatRoomIdFromArrayAndTable Function =============='));
    return new Promise(function (resolveFirstPromise) {

        //first getting socket.id from global socket object
        //then from this socket.id updating user table
        //and chatRoomArray as well
        var socketId = dataObj.socket.id;
        var responseLoginEventMethod = {
            message: "",
            data: ""
        };
        if (dataObj.socket.id != null) {
            console.log(chalk.green(' ===  Socket ID is not Null ====', dataObj.socket.id));
            return helper.getUserFromChatRoomViaSocketId(dataObj.socket.id)
                .then(function (userObj) {
                    if (userObj != null) {
                        var userId = userObj.uId;
                        console.log(chalk.green(' === Now Getting Friend List Room Ids ==='));
                        //get userIds of users which are in conversation
                        //with respective userId
                        return helper.getUserIdsWRTConversations(userObj)
                            .then(function (resultantUserIds) {
                                return helper.returnChatRoomIdsForConnectedUsers(resultantUserIds)
                                    .then(function (allSocketIds) {
                                        var allSocketIdsArray = allSocketIds; //this refers to socketIds of all connected users
                                        console.log(chalk.green(' === Fetched allSocketIdsArray : ===='), allSocketIdsArray);
                                        //returns the result if user is offline, online or false
                                        return helper.removeSocketIdFromChatRoom(userObj, dataObj)
                                            .then(function (isRemovedStatus) {
                                                console.log('isRemovedStatus', isRemovedStatus);
                                                if (isRemovedStatus == "USER_IS_OFFLINE") {
                                                    //now appending the user object of who's
                                                    //going to be disconnected from chat
                                                    var disconnectedUserObject = {
                                                        userId: userId
                                                    };
                                                    return helper.getUserMiniProfileObject(disconnectedUserObject)
                                                        .then(function (userProfile) {
                                                            var disconnectedUserProfile = {
                                                                uid: userProfile.uid || null,
                                                                name: userProfile.name || null,
                                                                username: userProfile.username || null,
                                                                image: userProfile.profile.small || null,
                                                                lastSeenTime: userProfile.lastSeenTime || null,
                                                                status: userProfile.sessionStatus || null
                                                            };
                                                            responseLoginEventMethod.message = "receive_offline_status";
                                                            responseLoginEventMethod.data = {
                                                                disconnectedUser: disconnectedUserProfile,
                                                                friendsListArray: allSocketIdsArray
                                                            };
                                                            resolveFirstPromise(responseLoginEventMethod);
                                                        });
                                                } else if (isRemovedStatus == "USER_IS_ONLINE" && isRemovedStatus == "FALSE") {
                                                    resolveFirstPromise(responseLoginEventMethod);
                                                }
                                                else {
                                                    resolveFirstPromise(responseLoginEventMethod);
                                                }
                                            });
                                    });
                            });
                    }
                    else {
                        console.log(chalk.green(' ===  Hence User is not Logged In yet from this Socket Id ===='));
                        responseLoginEventMethod.message = "";
                        responseLoginEventMethod.data = [];
                        resolveFirstPromise(responseLoginEventMethod);
                    }
                }
            );
        }
        else {
            console.log(chalk.green(' ===  Hence Socket ID is Null ====', dataObj.socket.id));
            responseLoginEventMethod.message = "";
            responseLoginEventMethod.data = [];
            resolveFirstPromise(responseLoginEventMethod);
        }
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//customize disconnect event
//removing all the socketIds from users table
exports.prepareCustomizeDisconnectDataBeforeEmit = function (dataObj) {
    return new Promise(function (firstPromiseResolve) {
        if (dataObj.socketIdsArray.length > 0) {
            var socketId = dataObj.socket.id;
            var connectedSocketIdsObj = dataObj.socket.server.sockets.connected;
            //first exclude the socket Id which belongs to current tab from
            //dataObj.socketIds array then disconnect all the remaining socketIds
            //from socket and then after remove these socketIds from user's collection
            //at the end calling the default socket.disconnect function on excluded socketId

            //here excluding the current tab's socket Id
            var indexOfSocketId = dataObj.socketIdsArray.indexOf(socketId);
            if (indexOfSocketId != -1) {
                dataObj.socketIdsArray.splice(indexOfSocketId, 1);
            }

            //now removing all the remaining socketIds from socket
            return Promise.map(dataObj.socketIdsArray, function (socketId) {
                for (var key in connectedSocketIdsObj) {
                    if (connectedSocketIdsObj.hasOwnProperty(key) && key == socketId) {
                        console.log("Socket Id Found");
                        connectedSocketIdsObj[socketId].disconnect();
                    } else {
                        console.log("Socket Id Not found");
                    }
                }
            })
                .then(function () {
                    //now removing all the remaining socket Ids
                    //in array from user's table
                    var query = {
                        uId: dataObj.uId
                    };
                    var pullKeyObject = {
                        socketIds: dataObj.socketIdsArray
                    };
                    return chatController.updateCollectionViaPullAllKey(users, pullKeyObject, {safe: true}, query, function (err) {
                        if (err == null) {
                            //calling default socket.disconnect function here
                            dataObj.socket.disconnect();
                            firstPromiseResolve('TRUE');
                        } else {
                            console.log('Error:', err);
                            firstPromiseResolve('FALSE');
                        }
                    });
                });
        } else {
            firstPromiseResolve('FALSE');
        }
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//preparing query object and data object for updating seen status
//and then preparing data for emitt event to sender
exports.prepareDataForUpdateAndEmitSeenStatus = function (dataObj) {
    return new Promise(function (firstPromiseResolve) {
        console.log(chalk.green('======== In prepareDataForUpdateAndEmitSeenStatus Function ========'));
        //first updating the seen status
        //than fetch sender id from messageIds
        //in order to emit seen status event to sender

        var userId = dataObj.userId;
        var seenStatusResponse = {
            user: userId,
            userChatRoomIds: [],
            chatRoomId: [],
            status: false
        };

        //now fetching session user profile (i-e who have seen the message)
        return helper.getUserObject(userId)
            .then(function (userObj) {
                if (userObj != null) {
                    var messageSeenBy = {
                        userId: userId,
                        userToken: userObj.token
                    };
                    return helper.getUserMiniProfileObject(messageSeenBy)
                        .then(function (userProfile) {
                            var userProfile = {
                                uid: userProfile.uid || null,
                                name: userProfile.name || null,
                                username: userProfile.username || null,
                                image: userProfile.profile.small || null,
                                lastSeenTime: userProfile.lastSeenTime || null,
                                status: userProfile.sessionStatus || null
                            };

                            seenStatusResponse.user = userProfile;
                            seenStatusResponse.userChatRoomIds = userObj.socketIds;
                            console.log(chalk.green('======== Message Seen By User : ========', seenStatusResponse.user));
                            console.log(chalk.green('======== User Socket Ids  ========', seenStatusResponse.userChatRoomIds));
                            console.log(chalk.green('======== Message Ids ========', dataObj.messageIds));
                            //now update the message seen status
                            if ((dataObj.messageIds).length > 0) {
                                var updateQueryObj = {
                                    messages_id: {"$in": dataObj.messageIds},
                                    sender_id: {"$ne": userId},
                                    seen: {"$ne": true},
                                    status: 1
                                };
                                var updateObj = {seen: true};
                                var options = {multi: true};
                                return chatController.updateCollection(chatMessagesDetails, updateObj, options, updateQueryObj, function (err, updateResult) {
                                    if ((updateResult.ok == 1) && (updateResult.nModified == 1 || updateResult.nModified > 1)) {
                                        console.log(chalk.green('======== Updating Seen Result is True ========'));
                                        console.log(chalk.green('======== Now Fetching the Sender Id ========'));

                                        seenStatusResponse.status = true;

                                        var queryObj = {
                                            messages_id: {"$in": dataObj.messageIds},
                                            seen: true,
                                            status: 1
                                        };
                                        var statsObj = {
                                            limit: chatConfig.pagination.messageSeen.limit
                                        };
                                        return chatController.getCollectionSpecifiedField(chatMessagesDetails, queryObj, statsObj, 'sender_id')
                                            .then(function (fetchedResult) {
                                                if (fetchedResult.length > 0) {
                                                    return helper.getOnlineUsersObject(fetchedResult[0].sender_id)
                                                        .then(function (returnedUserObject) {
                                                            if (returnedUserObject != null) {
                                                                seenStatusResponse.chatRoomId = returnedUserObject.socketIds;
                                                                firstPromiseResolve(seenStatusResponse);
                                                            }
                                                            firstPromiseResolve(seenStatusResponse);
                                                        });
                                                } else {
                                                    //update the seen successfully but chat room id is []
                                                    seenStatusResponse.status = true;
                                                    firstPromiseResolve(seenStatusResponse);
                                                }
                                            });

                                    } else if ((updateResult.ok == 1) && (updateResult.nModified == 0)) {
                                        console.log(chalk.green('======== Updating Seen Result is False : ========'));
                                        firstPromiseResolve(seenStatusResponse);
                                    }
                                    else if (updateResult.ok == 0 || err != null) {
                                        console.log(chalk.green('======== Updating Seen Result is False : ========'));
                                        firstPromiseResolve(seenStatusResponse);
                                    }
                                });
                            } else {
                                firstPromiseResolve(seenStatusResponse);
                            }
                        });
                } else {
                    firstPromiseResolve(seenStatusResponse);
                }
            });
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//prepare data for message delete event
exports.prepareDataForDeleteMessageEvent = function (dataObj) {
    return new Promise(function (firstPromiseResolve) {
        if (dataObj.messageId != null) {
            var updatingQueryObj = {
                messages_id: dataObj.messageId,
                uid: dataObj.userId
            };
            var updateStatus = {status: 2};
            var options = {multi: false};
            var responseObject = {
                deleteStatus: false,
                userChatRoomIds: ""
            };
            return chatController.updateCollection(chatMessagesDetails, updateStatus, options, updatingQueryObj, function (err, updateResult) {
                if ((updateResult.ok == 1) && (updateResult.nModified == 1)) {
                    console.log(chalk.green('======== Updating Delete Result is True : ========'));
                    responseObject.deleteStatus = true;
                    return helper.getUserObject(dataObj.userId)
                        .then(function (userObject) {
                            if (userObject != null) {
                                responseObject.userChatRoomIds = userObject.socketIds;
                                firstPromiseResolve(responseObject);
                            } else {
                                firstPromiseResolve(responseObject);
                            }
                        });
                } else if ((updateResult.ok == 1) && (updateResult.nModified == 0)) {
                    console.log(chalk.green('======== Updating Delete Result is False : ========'));
                    firstPromiseResolve(responseObject);
                }
                else if (updateResult.ok == 0 || err != null) {
                    console.log(chalk.green('======== Updating Delete Result is Error : ========'));
                    firstPromiseResolve(responseObject);
                }
            });
        } else {
            return firstPromiseResolve(false);
        }
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//prepare data for hide conversation event
exports.prepareDataForDeleteConversationEvent = function (dataObj) {
    return new Promise(function (firstPromiseResolve) {

        //first deleting the status in chatConversationsDetails
        //then in finally in chatMessagesDetails
        var responseObject = {
            deleteStatus: false,
            userChatRoomIds: ""
        };
        if (dataObj.conversationId != null) {
            var updatingQueryObj = {
                uid: dataObj.userId,
                conversations_id: dataObj.conversationId
            };
            var updateStatus = {status: 2};
            var options = {multi: false};
            return chatController.updateCollection(chatConversationsDetails, updateStatus, options, updatingQueryObj, function (err, updateResult) {
                if ((updateResult.ok == 1) && (updateResult.nModified == 1)) {
                    console.log(chalk.green('======== chatConversationsDetails: Delete Result is True : ========'));
                    return chatController.updateCollection(chatMessagesDetails, updateStatus, {multi: true}, updatingQueryObj, function (err, updateResult) {
                        console.log('updateResult.ok', updateResult.ok);
                        console.log('updateResult.nModified', updateResult.nModified);
                        if ((updateResult.ok == 1) && (updateResult.nModified >= 1)) {
                            console.log(chalk.green('======== chatMessagesDetails: Delete Result is True : ========'));
                            responseObject.deleteStatus = true;
                            return helper.getUserObject(dataObj.userId)
                                .then(function (userObject) {
                                    if (userObject != null) {
                                        responseObject.userChatRoomIds = userObject.socketIds
                                        firstPromiseResolve(responseObject);
                                    } else {
                                        firstPromiseResolve(responseObject);
                                    }
                                });
                        } else if ((updateResult.ok == 1) && (updateResult.nModified == 0)) {
                            console.log(chalk.green('======== Updating Delete Result is False : ========'));
                            firstPromiseResolve(responseObject);
                        }
                        else if (updateResult.ok == 0 || err != null) {
                            console.log(chalk.green('======== Updating Delete Result is Error : ========'));
                            firstPromiseResolve(responseObject);
                        }
                    });
                } else if ((updateResult.ok == 1) && (updateResult.nModified == 0)) {
                    console.log(chalk.green('======== Updating Delete Result is False : ========'));
                    firstPromiseResolve(responseObject);
                }
                else if (updateResult.ok == 0 || err != null) {
                    console.log(chalk.green('======== Updating Delete Result is Error : ========'));
                    firstPromiseResolve(responseObject);
                }
            });
        } else {
            return firstPromiseResolve(responseObject);
        }
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//prepare data for scroll chat messages
exports.prepareDataForScrollChatMessages = function (dataObj) {
    return new Promise(function (firstPromiseResolve) {

        //for response back to calling method (i-e scrollChatMessage)
        var responseScrollEventMethod = {
            message: "",
            data: ""
        };

        var receiverId = null;
        //first fetching receiver id
        return new Promise(function (secondPromiseResolve) {
            var queryGetReceiverId = {
                conversations_id: dataObj.conversationId,
                uid: {$ne: dataObj.userId}
            };
            return chatController.getCollection(chatConversationsDetails, queryGetReceiverId, '{}')
                .then(function (getReceiverIdResult) {
                    if (getReceiverIdResult.length > 0) {
                        console.log(chalk.green('  ======== getReceiverIdResult length is greater than zero ========'));
                        receiverId = getReceiverIdResult[0].uid;
                    } else {
                        console.log(chalk.green('  ======== getReceiverIdResult length is less than zero ========'));
                    }
                    secondPromiseResolve();
                });
        })
            .then(function () {
                var queryObjGetAllMessageDetails = {
                    conversations_id: dataObj.conversationId,
                    uid: dataObj.userId,
                    status: 1,
                    messages_id: {$lt: dataObj.createdTime}
                };
                var statsObj = {
                    referenceId: 'messages_id',
                    limit: chatConfig.pagination.message.limit,
                    sortBy: {'messages_id': chatConfig.pagination.message.sort}
                };
                var chatObject = [];
                return chatController.getPopulatedCollections(chatMessagesDetails, queryObjGetAllMessageDetails, statsObj)
                    .then(function (allMessagesDetailsResult) {
                        if (allMessagesDetailsResult.length > 0) {
                            console.log(chalk.green('  ======== allMessagesDetailsResult length is greater than zero ========'));
                            return new Promise(function (thirdPromiseResolve) {
                                    var allMessagesDetails = []; //array of all messages detail of provided conversationsIds
                                    var counterLength = allMessagesDetailsResult.length;
                                    var promiseForMessagesResult = Promise.method(function (condition, action, value) {
                                        if (!condition(value)) return value;
                                        return action(value).then(promiseForMessagesResult.bind(null, condition, action));
                                    });
                                    promiseForMessagesResult(function (innerCounter) {
                                            return innerCounter < counterLength;
                                        },
                                        function (innerCounter) {
                                            return new Promise(function (fourthPromiseResolve) {
                                                console.log(chalk.green(' == Inner Counter is : ===', innerCounter));
                                                //first embedding media (if used in message) in message object
                                                helper.getChatMediaArray(allMessagesDetailsResult[innerCounter].messages_id._id, '*', '*', '*', '*')
                                                    .then(function (mediaArray) {
                                                        var messageObject = {
                                                            conversationId: allMessagesDetailsResult[innerCounter].messages_id.conversations_id,
                                                            messageId: allMessagesDetailsResult[innerCounter].messages_id._id,
                                                            senderId: allMessagesDetailsResult[innerCounter].sender_id,
                                                            receiverId: allMessagesDetailsResult[innerCounter].uid,
                                                            content: allMessagesDetailsResult[innerCounter].messages_id.content,
                                                            seen: allMessagesDetailsResult[innerCounter].seen,
                                                            delivered: allMessagesDetailsResult[innerCounter].delivered,
                                                            status: allMessagesDetailsResult[innerCounter].status,
                                                            createdTime: allMessagesDetailsResult[innerCounter].created_time,
                                                            media: mediaArray
                                                        };

                                                        //now embedding shared url information (if shared in message) in message object
                                                        return helper.getFetchedUrlData(allMessagesDetailsResult[innerCounter].messages_id.url_share_id)
                                                            .then(function (urlData) {
                                                                if (urlData != null) {
                                                                    messageObject.fetched_url = urlData;
                                                                } else {
                                                                    messageObject.fetched_url = {};
                                                                }
                                                                allMessagesDetails.push(messageObject);
                                                            });
                                                        allMessagesDetails.push(messageObject);
                                                    });

                                                fourthPromiseResolve();
                                            })
                                                .then(function () {
                                                    return ++innerCounter;
                                                })
                                        }, 0)
                                        .then(function () {
                                            //now append allMessagesDetails array in parent chat object
                                            //also append user profile in chat object

                                            //now reversing the index of allMessagesDetails array
                                            allMessagesDetails.reverse();

                                            return new Promise(function (fifthPromiseResolve) {
                                                //for user profile and its session status getting its userId and token
                                                var receiverObject = {
                                                    userId: receiverId
                                                };
                                                return helper.getUserMiniProfileObject(receiverObject)
                                                    .then(function (userMiniProfileObject) {
                                                        if (userMiniProfileObject != null) {
                                                            fifthPromiseResolve(userMiniProfileObject);
                                                        } else {
                                                            fifthPromiseResolve(null);
                                                        }
                                                    });
                                            })
                                                .then(function (fifthPromiseResult) {
                                                    //fifthPromiseResult contains the userProfile
                                                    if (fifthPromiseResult != null) {
                                                        var userProfile = fifthPromiseResult;
                                                        chatObject.push({
                                                            user: {
                                                                uid: userProfile.uid || null,
                                                                name: userProfile.name || null,
                                                                username: userProfile.username || null,
                                                                image: userProfile.profile.small || null,
                                                                lastSeenTime: userProfile.lastSeenTime || null,
                                                                status: userProfile.sessionStatus || null
                                                            },
                                                            chat: allMessagesDetails
                                                        });
                                                    }
                                                    thirdPromiseResolve();
                                                });
                                        });
                                }
                            )
                                .
                                then(function () {
                                    responseScrollEventMethod.message = "scroll_chat_messages_successfully";
                                    responseScrollEventMethod.data = chatObject;
                                    firstPromiseResolve(responseScrollEventMethod);
                                });
                        }
                        else {
                            responseScrollEventMethod.message = "scroll_chat_messages_failed";
                            responseScrollEventMethod.data = chatObject;
                            firstPromiseResolve(responseScrollEventMethod);
                        }
                    });
            });
    }).
        then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//prepare data for scroll chat conversation
exports.prepareDataForScrollConversations = function (dataObj) {
    return new Promise(function (firstPromiseResolve) {
        var responseScrollEventMethod = {
            message: "",
            data: ""
        };
        var queryObjGetConversationsIds = {
            uid: dataObj.userId,
            conversations_id: {$lt: dataObj.createdTime},
            status: 1 // i-e status is active
        };
        var statsObj = {
            limit: chatConfig.pagination.conversation.limit,
            sortBy: {
                'conversations_id': chatConfig.pagination.conversation.sort
            }
        };
        return chatController.getCollection(chatConversationsDetails, queryObjGetConversationsIds, statsObj)
            .then(function (getConversationsIdsResult) {
                if (getConversationsIdsResult.length > 0) {
                    return helper.getChatObjectForAllConversations(getConversationsIdsResult, dataObj)
                        .then(function (allMessagesDetails) {
                            //now get UserIds from getConversationsIdsResult.uid save in array as users
                            //also get message content by joining allMessagesDetails.messages_id result with message table
                            responseScrollEventMethod.message = "scroll_conversations_successfully";
                            responseScrollEventMethod.data = allMessagesDetails;
                            firstPromiseResolve(responseScrollEventMethod);
                        });
                } else {
                    responseScrollEventMethod.message = "scroll_conversations_failed";
                    responseScrollEventMethod.data = [];
                    firstPromiseResolve(responseScrollEventMethod);
                }
            })
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//prepare data for search conversation
exports.prepareDataForSearchConversation = function (dataObj) {
    var responseSearchEventMethod = {
        message: "",
        data: ""
    };
    return new Promise(function (firstPromiseResolve) {
        var conversationUsers = [];
        conversationUsers.push(dataObj.userId);
        conversationUsers.push(dataObj.searchUserId);
        console.log(chalk.green(' ======== Conversation array before Sort ==============='));
        console.log(chalk.green(conversationUsers));

        //sort the conversation array in ascending order
        return utility.sortStringsArray(conversationUsers)
            .then(function (conversationUser) {

                //now first check whether the conversation id is exist for sender and receiver
                //if exist checks its status in conversation detail collection if it is not deleted
                //than use the respective conversation_id for search conversation

                console.log(chalk.green(' =========== Conversation array after Sort ==========='));
                console.log(chalk.green(conversationUser));
                var queryConversationThread = {
                    uid: conversationUser
                };
                var statsObj = {
                    limit: chatConfig.pagination.conversationSearch.limit,
                    sortBy: chatConfig.pagination.conversationSearch.sort
                };
                console.log(chalk.green(' ======= Checking Conversation ID ========='));
                return chatController.getCollection(chatConversationsThreads, queryConversationThread, statsObj)
                    .then(function (queryResult) {
                        var conversationIdArray = [{
                            "conversations_id": null
                        }];

                        if (queryResult.length > 0) {
                            console.log(chalk.green(' ======= Conversation ID is Exist ========='));
                            //hence conversation id is exist
                            //now checking the status in
                            //conversation details collection

                            var queryConversationDetails = {
                                "conversations_id": queryResult[0]._id, // fetched conversation id
                                "status": 1
                            };
                            console.log(chalk.green('========== Checking Conversation ID Status =========='));

                            return chatController.getCollection(chatConversationsDetails, queryConversationDetails, '{}')
                                .then(function (statusQueryResult) {
                                    if (statusQueryResult.length > 0) {
                                        console.log(chalk.green('======== Conversation ID is Exist and its Status is Active =============='));
                                        conversationIdArray[0].conversations_id = queryResult[0]._id;
                                        firstPromiseResolve(conversationIdArray);
                                    }
                                    else {
                                        firstPromiseResolve(conversationIdArray);
                                    }
                                });
                        }
                        else {
                            firstPromiseResolve(conversationIdArray);
                        }
                    });
            })
    })
        .then(function (firstPromiseResult) {
            //firstPromiseResult is conversation id array
            if (firstPromiseResult.length > 0) {
                return helper.getChatObjectForAllConversations(firstPromiseResult, dataObj)
                    .then(function (allMessagesDetails) {
                        responseSearchEventMethod.message = "conversation_fetched_successfully";
                        responseSearchEventMethod.data = allMessagesDetails;
                        return responseSearchEventMethod;
                    });
            } else {
                responseSearchEventMethod.message = "conversation_fetched_failed";
                responseSearchEventMethod.data = [];
                return responseSearchEventMethod;
            }
        });
};

//prepare data for emit user typing object
exports.prepareDataForUserTyping = function (dataObj) {
    var responseUserTypingEvent = {
        message: "failure",
        data: {
            chatRoomId: [],
            userTyping: {
                message: null,
                user: null,
                conversationId: null
            }
        }
    };
    return new Promise(function (firstPromiseResolve) {
        var queryObj = {
            conversations_id: dataObj.conversationId,
            uid: {$ne: dataObj.userId},
            status: 1
        };
        var statsObj = {
            limit: null  // no need to limit here
        };
        //firs fetching all the users in the respective conversation
        return chatController.getCollectionSpecifiedField(chatConversationsDetails, queryObj, statsObj, 'uid')
            .then(function (fetchedResult) {
                if (fetchedResult.length > 0) {
                    //now find the room id for each user
                    return helper.getOnlineUsersObject(fetchedResult[0].uid)
                        .then(function (returnedUserObject) {
                            //connected users room id
                            if (returnedUserObject != null) {
                                responseUserTypingEvent.data.chatRoomId.push(returnedUserObject.socketIds);
                                var userObj = {
                                    userId: dataObj.userId
                                };
                                return helper.getUserMiniProfileObject(userObj)
                                    .then(function (userProfile) {
                                        var userProfile = {
                                            uid: userProfile.uid || null,
                                            name: userProfile.name || null,
                                            username: userProfile.username || null,
                                            image: userProfile.profile.small || null,
                                            lastSeenTime: userProfile.lastSeenTime || null,
                                            status: userProfile.sessionStatus || null
                                        };
                                        responseUserTypingEvent.message = "success";
                                        responseUserTypingEvent.data.userTyping.message = dataObj.typingMessage;
                                        responseUserTypingEvent.data.userTyping.user = userProfile;
                                        responseUserTypingEvent.data.userTyping.conversationId = dataObj.conversationId;
                                        firstPromiseResolve(responseUserTypingEvent);
                                    });
                            } else {
                                firstPromiseResolve(responseUserTypingEvent)
                            }
                        })
                } else {
                    firstPromiseResolve(responseUserTypingEvent);
                }
            })
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//prepare data for emit notification object
exports.prepareDataForEmitNotification = function (dataObj) {
    return new Promise(function (firstPromiseResolve) {
        var notificationArray = dataObj.notification; //requested data array
        var emitNotification = [];  // response data array
        if (notificationArray.length > 0) {
            return Promise.map(notificationArray, function (result) {
                return helper.getOnlineUsersObject(result.uid)
                    .then(function (userObject) {
                        if (userObject != null) {
                            var emitNotificationObj = {
                                uId: userObject.uId,
                                roomId: [userObject.socketIds],
                                notification: {
                                    activityId: result.activity_id,
                                    activityType: result.type,
                                    created: result.created
                                }
                            };
                            emitNotification.push(emitNotificationObj);
                        }
                    });
            })
                .then(function () {
                    firstPromiseResolve(emitNotification);
                });
        } else {
            firstPromiseResolve([]);
        }
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

// #####################################################################
// ###############  All Object Generators Functions  ###################
//######################################################################

//get chat object for all conversations
//on behalf of provided conversations ids
//method use in getting chat object on login event
exports.getChatObjectForAllConversations = function (getConversationsIdsResult, userObj) {
    var arrayLength = getConversationsIdsResult.length;
    var chatObject = [];
    return new Promise(function (firstPromiseResolve) {
        if (getConversationsIdsResult.length > 0) {
            //iterating to fetch messages details on behalf of conversations id
            var promiseFor = Promise.method(function (condition, action, value) {
                if (!condition(value)) return value;
                return action(value).then(promiseFor.bind(null, condition, action));
            });
            promiseFor(function (count) {
                    return count < arrayLength;
                },
                function (count) {
                    return new Promise(function (secondPromiseResolve) {
                        var conversationsId = getConversationsIdsResult[count].conversations_id || getConversationsIdsResult[count] || null;
                        var receiverId = null;
                        var conversationCreatedTime = null;
                        //first fetching receiver id
                        return new Promise(function (thirdPromiseResolve) {
                            var queryGetReceiverId = {
                                conversations_id: conversationsId,
                                uid: {$ne: userObj.userId}
                            };
                            return chatController.getCollection(chatConversationsDetails, queryGetReceiverId, '{}')
                                .then(function (getReceiverIdResult) {
                                    if (getReceiverIdResult.length > 0) {
                                        receiverId = getReceiverIdResult[0].uid;
                                        conversationCreatedTime = getReceiverIdResult[0].created_time;
                                    }
                                    thirdPromiseResolve();
                                });
                        })
                            .then(function () {
                                var queryObjGetAllMessageDetails = {
                                    conversations_id: conversationsId,
                                    uid: userObj.userId,
                                    status: 1 // i-e status is active
                                };
                                var statsObj = {
                                    referenceId: 'messages_id',
                                    limit: chatConfig.pagination.message.limit,
                                    sortBy: {'created_time': chatConfig.pagination.message.sort} // means sort in descending order
                                };
                                return chatController.getPopulatedCollections(chatMessagesDetails, queryObjGetAllMessageDetails, statsObj)
                                    .then(function (allMessagesDetailsResult) {
                                        if (allMessagesDetailsResult.length > 0) {
                                            return new Promise(function (thirdPromiseResolve) {
                                                var allMessagesDetails = []; //array of all messages detail of provided conversationsIds
                                                var counterLength = allMessagesDetailsResult.length;
                                                var promiseForMessagesResult = Promise.method(function (condition, action, value) {
                                                    if (!condition(value)) return value;
                                                    return action(value).then(promiseForMessagesResult.bind(null, condition, action));
                                                });
                                                promiseForMessagesResult(function (innerCounter) {
                                                    return innerCounter < counterLength;
                                                }, function (innerCounter) {
                                                    return new Promise(function (fourthPromiseResolve) {
                                                        //first embedding media (if used in message) in message object
                                                        return helper.getChatMediaArray(allMessagesDetailsResult[innerCounter].messages_id._id, '*', '*', '*', '*')
                                                            .then(function (mediaArray) {
                                                                var messageObject = {
                                                                    conversationId: allMessagesDetailsResult[innerCounter].messages_id.conversations_id,
                                                                    messageId: allMessagesDetailsResult[innerCounter].messages_id._id,
                                                                    senderId: allMessagesDetailsResult[innerCounter].sender_id,
                                                                    receiverId: allMessagesDetailsResult[innerCounter].uid,
                                                                    content: allMessagesDetailsResult[innerCounter].messages_id.content,
                                                                    seen: allMessagesDetailsResult[innerCounter].seen,
                                                                    delivered: allMessagesDetailsResult[innerCounter].delivered,
                                                                    status: allMessagesDetailsResult[innerCounter].status,
                                                                    createdTime: allMessagesDetailsResult[innerCounter].created_time,
                                                                    conversationCreatedTime: conversationCreatedTime,
                                                                    media: mediaArray
                                                                };
                                                                //now embedding shared ugetFetchedUrlDatarl information (if shared in message) in message object
                                                                return helper.(allMessagesDetailsResult[innerCounter].messages_id.url_share_id)
                                                                    .then(function (urlData) {
                                                                        messageObject.fetched_url = urlData;
                                                                        allMessagesDetails.push(messageObject);
                                                                        fourthPromiseResolve();
                                                                    });
                                                            });

                                                    })
                                                        .then(function () {
                                                            return ++innerCounter;
                                                        })
                                                }, 0)
                                                    .then(function () {

                                                        //now reversing the index of allMessagesDetails array
                                                        allMessagesDetails.reverse();

                                                        //now append allMessagesDetails array in parent chat object
                                                        //also append user profile in chat object
                                                        return new Promise(function (fifthPromiseResolve) {
                                                            //for user profile and its session status getting its userId and token
                                                            if (receiverId != null) {
                                                                var receiverObject = {
                                                                    userId: receiverId
                                                                };
                                                                return helper.getUserMiniProfileObject(receiverObject)
                                                                    .then(function (userMiniProfileObject) {
                                                                        if (userMiniProfileObject != null) {
                                                                            fifthPromiseResolve(userMiniProfileObject);
                                                                        }
                                                                        else {
                                                                            fifthPromiseResolve(null);
                                                                        }
                                                                    });
                                                            } else {
                                                                //hence empty user profile object
                                                                fifthPromiseResolve(null);
                                                            }
                                                        })
                                                            .then(function (fifthPromiseResult) {
                                                                //fifthPromiseResult contains the userProfile
                                                                if (fifthPromiseResult != null) {
                                                                    var userProfile = fifthPromiseResult;
                                                                    chatObject.push({
                                                                        user: {
                                                                            uid: userProfile.uid || null,
                                                                            name: userProfile.name || null,
                                                                            username: userProfile.username || null,
                                                                            image: userProfile.profile.small || null,
                                                                            status: userProfile.sessionStatus || null,
                                                                            lastSeenTime: userProfile.lastSeenTime || null
                                                                        },
                                                                        chat: allMessagesDetails
                                                                    });
                                                                }
                                                                thirdPromiseResolve();
                                                            });
                                                    });
                                            })
                                                .then(function () {
                                                    secondPromiseResolve(chatObject);
                                                });
                                        }
                                        else {
                                            secondPromiseResolve(chatObject);
                                        }
                                    });
                            });
                    })
                        .then(function () {
                            return ++count;
                        })
                }, 0)
                .then(function () {
                    firstPromiseResolve(chatObject);
                });
        }
        else {
            firstPromiseResolve(chatObject);
        }
    }).then(function (chatObject) {
            return chatObject
        });
};

//get chat object for single conversations
//on behalf of provided
//conversations id, sender id and receiver id
//method use in getting chat object on message event
exports.getChatObjectForSingleConversation = function (messageObject) {
    return new Promise(function (resolvePromise) {
        //for user profile and its session status getting its userId and token
        var senderObject = {
            userId: messageObject.senderId
        };
        return helper.getUserMiniProfileObject(senderObject)
            .then(function (userMiniProfileObject) {
                if (userMiniProfileObject != null) {
                    resolvePromise(userMiniProfileObject);
                } else {
                    resolvePromise(null);
                }
            });
    })
        .then(function (promiseResult) {
            //now fetching receiver profile
            var chatObject = [];
            if (promiseResult != null) {
                var userProfile = promiseResult;
                var receiversArray = [];
                var receiverObject = {
                    userId: messageObject.receiverId
                };
                return helper.getUserMiniProfileObject(receiverObject)
                    .then(function (receiverProfile) {
                        if (receiverProfile != null) {
                            var receiver = {
                                uid: receiverProfile.uid || null,
                                name: receiverProfile.name || null,
                                image: receiverProfile.profile.small || null,
                                lastSeenTime: receiverProfile.lastSeenTime || null,
                                status: receiverProfile.sessionStatus
                            };
                            receiversArray.push(receiver);
                            chatObject.push({
                                user: {
                                    uid: userProfile.uid || null,
                                    name: userProfile.name || null,
                                    username: userProfile.username || null,
                                    image: userProfile.profile.small || null,
                                    lastSeenTime: userProfile.lastSeenTime || null,
                                    status: userProfile.sessionStatus || null
                                },
                                receiver: receiversArray,
                                chat: messageObject
                            });
                            return chatObject;

                        } else {
                            return chatObject;
                        }
                    });
            } else {
                return chatObject;
            }
        });
};

//media object
exports.getMediaObject = function (fileId) {

    if (fileId == null) {
        return new Promise(function (resolve) {
            resolve({});
        })
    }

    var tableUserFileUploads = objAllTables.user_file_uploads.user_file_uploads();
    var tableImagesThumbs = objAllTables.images_thumbs.images_thumbs();
    var tableFileCompressions = objAllTables.file_compressions.file_compressions();
    var mediaObject = {
        files: "",
        info: ""
    };
    var dataArray = [];
    var fileObject = {};
    var baseUrl = config.baseUrl.fileServer;
    var uploadPath = config.path.uploadPath;
    return new Promise(function (resolveMediaObject) {
        return tableUserFileUploads.findAll({
            where: {
                $and: [
                    {
                        id: fileId
                    },
                    {
                        status: 'ACTIVE'
                    }
                ]
            }
        })
            .then(function (fileData) {
                if (fileData.length > 0) {
                    //all fields value
                    //which are fetched from
                    //user_file_uploads table
                    var parentId = fileData[0]['dataValues']['parent_id'];
                    var albumId = fileData[0]['dataValues']['album_id'];
                    var parentType = fileData[0]['dataValues']['parent_type'];
                    var fileType = fileData[0]['dataValues']['filetype'];
                    var uId = fileData[0]['dataValues']['uid'];
                    var mediaUrl = fileData[0]['dataValues']['media_url'];
                    var extension = fileData[0]['dataValues']['extension'];
                    var width = fileData[0]['dataValues']['width'];
                    var height = fileData[0]['dataValues']['height'];
                    var duration = fileData[0]['dataValues']['duration'];
                    var filePath = fileData[0]['dataValues']['path'];
                    var filePostId = fileData[0]['dataValues']['post_id'];
                    var totalFiles = fileData.length;


                    return new Promise(function (resolveFileObject) {
                        //now checking the filetype
                        if (fileType == 'IMAGE') {

                            //if filetype is IMAGE
                            //fetch images thumb data
                            var smallThumbParameter = config.thumbName.small;
                            var mediumThumbParameter = config.thumbName.medium;
                            var largeThumbParameter = config.thumbName.large;
                            var xLargeThumbParameter = config.thumbName.xlarge;
                            var squareThumbParameter = config.thumbName.square;
                            var originalImageFileParameter = config.thumbName.original;

                            //declaring and initializing variables
                            //for Image File
                            var original = baseUrl + config.path.uploadPath + fileId + '/' + originalImageFileParameter + mediaUrl + extension;
                            var small, medium, large, square, xLarge = "";
                            return tableImagesThumbs.findAll({
                                where: {
                                    $and: [
                                        {
                                            image_id: fileId
                                        },
                                        {
                                            status: 'ACTIVE'
                                        }
                                    ]
                                }
                            })
                                .then(function (thumbData) {
                                    if (thumbData != null) {
                                        //if thumbData is not null
                                        //then iterate on each thumb
                                        //to fetch its properties
                                        var objLength = thumbData.length;
                                        var promiseFor = Promise.method(function (condition, action, value) {
                                            if (!condition(value)) return value;
                                            return action(value).then(promiseFor.bind(null, condition, action));
                                        });
                                        promiseFor(function (counter) {
                                            return counter < objLength;
                                        }, function (counter) {
                                            return new Promise(function (resolveImageThumbLoop) {
                                                if (thumbData[counter].dataValues.sizetype == 'SMALL') {
                                                    small = baseUrl + uploadPath + fileId + '/' + smallThumbParameter + mediaUrl + extension;
                                                }
                                                else if (thumbData[counter].dataValues.sizetype == 'MEDIUM') {
                                                    medium = baseUrl + uploadPath + fileId + '/' + mediumThumbParameter + mediaUrl + extension;
                                                }
                                                else if (thumbData[counter].dataValues.sizetype == 'LARGE') {
                                                    large = baseUrl + uploadPath + fileId + '/' + largeThumbParameter + mediaUrl + extension;
                                                }
                                                else if (thumbData[counter].dataValues.sizetype == 'XLARGE') {
                                                    xLarge = baseUrl + uploadPath + fileId + '/' + xLargeThumbParameter + mediaUrl + extension;
                                                }
                                                else if (thumbData[counter].dataValues.sizetype == 'SQUARE') {
                                                    square = baseUrl + uploadPath + fileId + '/' + squareThumbParameter + mediaUrl + extension;
                                                }
                                                resolveImageThumbLoop(null);
                                            })
                                                .then(function () {
                                                    return ++counter;
                                                });
                                        }, 0)
                                            .then(function () {
                                                //now creating image file object
                                                fileObject = {
                                                    "type": fileType,
                                                    "fileId": fileId,
                                                    "postId": filePostId,
                                                    "views": 0,
                                                    "source": {}
                                                };

                                                if (original) {
                                                    fileObject.source.original = {
                                                        "src": original
                                                    };
                                                }
                                                if (square) {
                                                    fileObject.source.square = {
                                                        "src": square
                                                    };
                                                }
                                                if (small) {
                                                    fileObject.source.small = {
                                                        "src": small
                                                    };
                                                }
                                                if (medium) {
                                                    fileObject.source.medium = {
                                                        "src": medium
                                                    };
                                                }
                                                if (large) {
                                                    fileObject.source.large = {
                                                        "src": large
                                                    };
                                                }
                                                if (xLarge) {
                                                    fileObject.source.xlarge = {
                                                        "src": xLarge
                                                    };
                                                }

                                                resolveFileObject(fileObject);
                                            });
                                    }
                                    else {
                                        resolveFileObject(fileObject);
                                    }
                                })
                        }
                        else if (fileType == 'VIDEO') {

                            //declaring and initializing variables
                            //for video File
                            var sdVideoFilePath = "";
                            var hdVideoFilePath = "";
                            var thumbOne = "";
                            var thumbTwo = "";
                            var videoSDFileParameter = config.thumbName.videoSDDir;
                            var videoHDFileParameter = config.thumbName.videoHDDir;

                            var thumbOneDir = config.thumbName.videoThumbOneDir;
                            var thumbTwoDir = config.thumbName.videoThumbTwoDir;
                            var thumbOneSuffix = config.videoConfig.thumbOneSuffix;
                            var thumbTwoSuffix = config.videoConfig.thumbTwoSuffix;
                            var videoThumbExtension = config.videoConfig.thumbExtension;

                            var viewsCount = 0;

                            return new Promise(function (resolveVideoFile) {
                                return tableImagesThumbs.findAll({
                                    where: {
                                        $and: [
                                            {
                                                image_id: fileId
                                            },
                                            {
                                                status: 'ACTIVE'
                                            }
                                        ]
                                    }
                                })
                                    .then(function (thumbData) {
                                        if (thumbData != null) {
                                            var objLength = thumbData.length;
                                            var promiseFor = Promise.method(function (condition, action, value) {
                                                if (!condition(value)) return value;
                                                return action(value).then(promiseFor.bind(null, condition, action));
                                            });
                                            promiseFor(function (counter) {
                                                return counter < objLength;
                                            }, function (counter) {
                                                return new Promise(function (resolveVideoThumb) {
                                                    if (thumbData[counter].dataValues.sizetype == '_1' || thumbData[counter].dataValues.sizetype == '_2' || thumbData[counter].dataValues.sizetype == '_3' || thumbData[counter].dataValues.sizetype == '_4') {
                                                        thumbOne = baseUrl + uploadPath + fileId + '/' + thumbOneDir + mediaUrl + thumbOneSuffix + videoThumbExtension;
                                                        thumbTwo = baseUrl + uploadPath + fileId + '/' + thumbTwoDir + mediaUrl + thumbTwoSuffix + videoThumbExtension;
                                                    }
                                                    resolveVideoThumb(null);
                                                })
                                                    .then(function () {
                                                        return ++counter;
                                                    });
                                            }, 0)
                                                .then(function () {
                                                    return tableFileCompressions.findAll({
                                                        where: {
                                                            $and: [
                                                                {
                                                                    file_id: fileId
                                                                },
                                                                {
                                                                    status: 'ACTIVE'
                                                                }
                                                            ]
                                                        }
                                                    })
                                                        .then(function (compressFileData) {
                                                            if (compressFileData != null) {
                                                                var objLength = compressFileData.length;
                                                                var promiseFor = Promise.method(function (condition, action, value) {
                                                                    if (!condition(value)) return value;
                                                                    return action(value).then(promiseFor.bind(null, condition, action));
                                                                });
                                                                promiseFor(function (counter) {
                                                                    return counter < objLength;
                                                                }, function (counter) {
                                                                    return new Promise(function (resolveVideoFileLoop) {
                                                                        if (compressFileData[counter].dataValues.sizetype == 'SD') {
                                                                            sdVideoFilePath = baseUrl + uploadPath + fileId + '/' + videoSDFileParameter + mediaUrl + extension;
                                                                        } else if (compressFileData[counter].dataValues.sizetype == 'HD') {
                                                                            hdVideoFilePath = baseUrl + uploadPath + fileId + '/' + videoHDFileParameter + mediaUrl + extension;
                                                                        }
                                                                        resolveVideoFileLoop(null);
                                                                    })
                                                                        .then(function () {
                                                                            return ++counter;
                                                                        });
                                                                }, 0)
                                                                    .then(function () {
                                                                        //fetching count of this file
                                                                        return new Promise(function (resolveViewCount) {
                                                                            return helpers.getVideoViewCount(null, fileId)
                                                                                .then(function (counts) {
                                                                                    if (counts != null) {
                                                                                        viewsCount = counts;
                                                                                        resolveViewCount(viewsCount);
                                                                                    }
                                                                                });
                                                                        })
                                                                            .then(function (viewsCount) {
                                                                                //now creating video file object
                                                                                fileObject = {
                                                                                    "type": fileType,
                                                                                    "fileId": fileId,
                                                                                    "postId": filePostId,
                                                                                    "views": viewsCount,
                                                                                    "source": {},
                                                                                    "thumbs": {
                                                                                        "one": thumbOne,
                                                                                        "two": thumbTwo
                                                                                    }
                                                                                };

                                                                                if (sdVideoFilePath) {
                                                                                    fileObject.source.sd = {
                                                                                        format: 'video/' + config.ffmpegConfig.videoFormat,
                                                                                        src: sdVideoFilePath
                                                                                    };
                                                                                }
                                                                                if (hdVideoFilePath) {
                                                                                    fileObject.source.hd = {
                                                                                        format: 'video/' + config.ffmpegConfig.videoFormat,
                                                                                        src: hdVideoFilePath
                                                                                    };
                                                                                }
                                                                                resolveVideoFile(fileObject);
                                                                            });
                                                                    })
                                                            } else {
                                                                resolveVideoFile(fileObject);
                                                            }

                                                        });
                                                })
                                        } else {
                                            resolveVideoFile(fileObject);
                                        }
                                    });
                            })
                                .then(function (fileObject) {
                                    resolveFileObject(fileObject);
                                })

                        }
                        else if (fileType == 'AUDIO') {
                            var originalAudioFileParameter = config.thumbName.original;
                            var audioFilePath = baseUrl + config.path.uploadPath + fileId + '/' + originalAudioFileParameter + mediaUrl + extension;
                            var listenCount = 0;
                            //fetching count of this file
                            return new Promise(function (resolveListenCount) {
                                return helpers.getAudioListenCount(null, fileId)
                                    .then(function (counts) {
                                        if (counts != null) {
                                            listenCount = counts;
                                            resolveListenCount(listenCount);
                                        }
                                    });
                            })
                                .then(function (listenCount) {
                                    //now creating audio file object
                                    fileObject = {
                                        "type": fileType,
                                        "fileId": fileId,
                                        "postId": filePostId,
                                        "views": listenCount,
                                        "source": {
                                            "format": 'audio/' + config.audioConfig.format,
                                            "source": audioFilePath
                                        }
                                    };
                                    resolveFileObject(fileObject);
                                });
                        }
                    })
                        .then(function (fileObj) {
                            dataArray.push(fileObj);
                            mediaObject.files = dataArray;
                            mediaObject.info = {
                                totalFiles: totalFiles,
                                postLink: null,
                                albumLink: null
                            };
                            resolveMediaObject(mediaObject);
                        });
                } else {
                    resolveMediaObject(mediaObject);
                }
            });
    })
        .then(function (result) {
            return result;
        });
}

//fix media object for 'PROFILE', 'PROFILE_COVER', 'GOAL_COVER'
var getMediaObject_Fix = exports.getMediaObject_Fix = function (image, imageType, sizes) {

    /*console.log(chalk.yellow('in fix media'));
     console.log('image', image);
     console.log('imageType', imageType);
     console.log('sizes', sizes);*/

    var media = {};

    //if nothing is provided
    if ((image == null ||
        (Object.keys(image).length === 0 && JSON.stringify(image) === JSON.stringify({}))) //check for empty object
        && imageType == null) {
        return {};
    }

    //if image is available
    if (image != null) {
        if (sizes.indexOf('small') > -1 && (typeof image.files[0].source.small != "undefined")) {
            media.small = image.files[0].source.small.src;
        }
        if (sizes.indexOf('medium') > -1 && (typeof image.files[0].source.medium != "undefined")) {
            media.medium = image.files[0].source.medium.src;
        }
        if (sizes.indexOf('large') > -1 && (typeof image.files[0].source.large != "undefined")) {
            media.large = image.files[0].source.large.src;
        }
        if (sizes.indexOf('original') > -1 && (typeof image.files[0].source.original != "undefined")) {
            media.original = image.files[0].source.original.src;
        }
        if (sizes.indexOf('xlarge') > -1 && (typeof image.files[0].source.xlarge != "undefined")) {
            media.xlarge = image.files[0].source.xlarge.src;
        }
    }
    //image is not available, it means DEFAULT image is required
    else {
        //profile picture
        if (imageType == 'PROFILE') {
            if (sizes.indexOf('small') > -1) {
                media.small = config.baseUrl.fileServer + config.path.uploadPath + config.path.defaultFolderPath + config.path.profilePath + config.thumbName.small + config.defaultImages.profile;
            }
            if (sizes.indexOf('medium') > -1) {
                media.medium = config.baseUrl.fileServer + config.path.uploadPath + config.path.defaultFolderPath + config.path.profilePath + config.thumbName.medium + config.defaultImages.profile;
            }
            if (sizes.indexOf('large') > -1) {
                media.large = config.baseUrl.fileServer + config.path.uploadPath + config.path.defaultFolderPath + config.path.profilePath + config.thumbName.large + config.defaultImages.profile;
            }
            if (sizes.indexOf('original') > -1) {
                media.original = config.baseUrl.fileServer + config.path.uploadPath + config.path.defaultFolderPath + config.path.profilePath + config.thumbName.original + config.defaultImages.profile;
            }
        }
        //profile cover
        else if (imageType == 'PROFILE_COVER') {
            if (sizes.indexOf('small') > -1) {
                media.small = config.baseUrl.fileServer + config.path.uploadPath + config.path.defaultFolderPath + config.path.coverPath + config.thumbName.small + config.defaultImages.cover;
            }
            if (sizes.indexOf('medium') > -1) {
                media.medium = config.baseUrl.fileServer + config.path.uploadPath + config.path.defaultFolderPath + config.path.coverPath + config.thumbName.medium + config.defaultImages.cover;
            }
            if (sizes.indexOf('large') > -1) {
                media.large = config.baseUrl.fileServer + config.path.uploadPath + config.path.defaultFolderPath + config.path.coverPath + config.thumbName.large + config.defaultImages.cover;
            }
            if (sizes.indexOf('original') > -1) {
                media.original = config.baseUrl.fileServer + config.path.uploadPath + config.path.defaultFolderPath + config.path.coverPath + config.thumbName.original + config.defaultImages.cover;
            }
        }
        //goal cover image
        else if (imageType == 'GOAL_COVER') {
            if (sizes.indexOf('small') > -1) {
                media.small = config.baseUrl.fileServer + config.path.uploadPath + config.path.defaultFolderPath + config.path.goalFilePath + config.thumbName.small + config.defaultImages.goal;
            }
            if (sizes.indexOf('medium') > -1) {
                media.medium = config.baseUrl.fileServer + config.path.uploadPath + config.path.defaultFolderPath + config.path.goalFilePath + config.thumbName.medium + config.defaultImages.goal;
            }
            if (sizes.indexOf('large') > -1) {
                media.large = config.baseUrl.fileServer + config.path.uploadPath + config.path.defaultFolderPath + config.path.goalFilePath + config.thumbName.large + config.defaultImages.goal;
            }
            if (sizes.indexOf('original') > -1) {
                media.original = config.baseUrl.fileServer + config.path.uploadPath + config.path.defaultFolderPath + config.path.goalFilePath + config.thumbName.original + config.defaultImages.goal;
            }
            if (sizes.indexOf('xlarge') > -1) {
                media.xlarge = config.baseUrl.fileServer + config.path.uploadPath + config.path.defaultFolderPath + config.path.goalFilePath + config.thumbName.xlarge + config.defaultImages.goal;
            }
        }
        else {
            return media;
        }
    }

    return media;
};

//get user mini profile object
exports.getUserMiniProfileObject = function (userObj) {
    var userInstance = new User(userObj.userId);
    var userBasicProfile = "";
    var input = {
        basic: ['name', 'username', 'email', 'link', 'created'],
        profile: ['small', 'medium']
    };
    return userInstance.get(input)
        .then(function (result) {
            userBasicProfile = result[0];
            return userBasicProfile;
        })
        .then(function (userBasicProfile) {
            return helper.getUserObject(userObj.userId)
                .then(function (userObject) {
                    if (userObject != null) {
                        if (userObject.status == 0) {
                            userBasicProfile['sessionStatus'] = 'offline';
                            userBasicProfile['lastSeenTime'] = userObject.last_seen_time || null;
                        } else {
                            userBasicProfile['sessionStatus'] = 'online';
                            userBasicProfile['lastSeenTime'] = null;
                        }
                    } else {
                        userBasicProfile['sessionStatus'] = 'offline';
                        userBasicProfile['lastSeenTime'] = null;
                    }
                    return userBasicProfile;
                });
        });
};

//analytics function
//get chat room arraly status
exports.getChatRoomStatus = function () {
    return new Promise(function (firstPromiseResolve) {
        var chatRoomStatus = {
            _comment: "The key Users represent the total number of users in chat room at moment",
            users: 0,
            chatRoom: 0
        }
        firstPromiseResolve(chatRoomStatus);
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//returns the array of media used in single message
//fileId = media used in message
//fileType = [IMAGE,VIDEO,AUDIO]
//thumbTypes = ['*'] for all Images Thumbs types
//thumbTypes = ['SMALL|MEDIUM|LARGE|SQUARE|ORG'] for selected Images Thumbs types
//videoCompressType = ['*'] for all Video Compress types
//videoCompressType = ['SD|HD'] for selected Video Compress types
//noOfFilesRequired = ['*'] for all existing files ,
//noOfFilesRequired = otherwise set the number of files required
exports.getChatMediaArray = function (messageId, thumbTypes, videoThumbTypes, videoCompressType, noOfFilesRequired) {
    //return new Promise(function (resolve) {
    var media = [];
    var baseUrl = config.baseUrl.socketFileServer;
    var uploadPath = config.path.uploadPath;
    var smallThumbParameter = config.thumbName.small;
    var mediumThumbParameter = config.thumbName.medium;
    var largeThumbParameter = config.thumbName.large;
    var xLargeThumbParameter = config.thumbName.xlarge;
    var squareThumbParameter = config.thumbName.square;
    var originalImageFileParameter = config.thumbName.original;
    var queryGetMessageDetails = {
        message_id: messageId,
        status: 1 // i-e status is active\
    };
    var statsObj = {
        referenceId: 'message_id'
    };
    return chatController.getPopulatedCollections(usersFiles, queryGetMessageDetails, statsObj)
        .then(function (result) {
            var noOfFilesExist = result.length;
            var loopLimit = 0;
            if (noOfFilesExist > 0) {
                if (noOfFilesRequired == '*') {
                    loopLimit = noOfFilesExist;
                } else {
                    if (noOfFilesRequired < noOfFilesExist) {
                        loopLimit = noOfFilesRequired;
                    } else {
                        loopLimit = noOfFilesExist;
                    }
                }
                for (var k = 0; k < loopLimit; k++) {
                    var fileType = result[k].type;
                    var allFiles = {};
                    if (fileType == 'IMAGE') {
                        if (thumbTypes == '*') {
                            // i-e for required all types of thumbs
                            for (var i = 0; i < result[k].thumbs.length; i++) {
                                if (result[k].thumbs[i].sizetype == 'SQUARE') {
                                    allFiles.square = baseUrl + uploadPath + result[k]._id + '/' + squareThumbParameter + result[k].name + result[k].extension;
                                }
                                if (result[k].thumbs[i].sizetype == 'SMALL') {
                                    allFiles.small = baseUrl + uploadPath + result[k]._id + '/' + smallThumbParameter + result[k].name + result[k].extension;
                                }
                                if (result[k].thumbs[i].sizetype == 'MEDIUM') {
                                    allFiles.medium = baseUrl + uploadPath + result[k]._id + '/' + mediumThumbParameter + result[k].name + result[k].extension;
                                }
                                if (result[k].thumbs[i].sizetype == 'LARGE') {
                                    allFiles.large = baseUrl + uploadPath + result[k]._id + '/' + largeThumbParameter + result[k].name + result[k].extension;
                                }
                            }
                            media.push(allFiles);
                        }
                        else {
                            // i -e for selected thumbs
                            if (thumbTypes != null) {
                                var thumbTypesArray = thumbTypes.split("|");
                                if (thumbTypesArray.length > 0) {
                                    for (var key in thumbTypesArray) {
                                        if (thumbTypesArray[key] == 'SQUARE') {
                                            allFiles.square = baseUrl + uploadPath + result[k]._id + '/' + squareThumbParameter + result[k].name + result[k].extension;
                                        }
                                        if (thumbTypesArray[key] == 'SMALL') {
                                            allFiles.small = baseUrl + uploadPath + result[k]._id + '/' + smallThumbParameter + result[k].name + result[k].extension;
                                        }
                                        if (thumbTypesArray[key] == 'MEDIUM') {
                                            allFiles.medium = baseUrl + uploadPath + result[k]._id + '/' + mediumThumbParameter + result[k].name + result[k].extension;
                                        }
                                        if (thumbTypesArray[key] == 'LARGE') {
                                            allFiles.large = baseUrl + uploadPath + result[k]._id + '/' + largeThumbParameter + result[k].name + result[k].extension;
                                        }
                                    }
                                    media.push(allFiles);
                                }
                            }
                        }
                    }
                    else if (fileType == 'VIDEO') {
                        var videoSDFileParameter = config.thumbName.videoSDDir;
                        var videoHDFileParameter = config.thumbName.videoHDDir;
                        var thumbOneDir = config.thumbName.videoThumbOneDir;
                        var thumbTwoDir = config.thumbName.videoThumbTwoDir;
                        var thumbOneSuffix = config.videoConfig.thumbOneSuffix;
                        var thumbTwoSuffix = config.videoConfig.thumbTwoSuffix;
                        var videoThumbExtension = config.videoConfig.thumbExtension;

                        //for video thumbs
                        if (videoThumbTypes == '*') {
                            for (var j = 0; j <= result[k].thumbs.length; j++) {
                                if (result[j].thumbs[j].sizetype == '_1') {
                                    allFiles._1 = baseUrl + uploadPath + result[k]._id + '/' + thumbOneDir + result[k].name + thumbOneSuffix + videoThumbExtension;
                                }
                                if (result[j].thumbs[j].sizetype == '_2') {
                                    allFiles._2 = baseUrl + uploadPath + result[k]._id + '/' + thumbTwoDir + result[k].name + thumbTwoSuffix + videoThumbExtension;
                                }
                                media.push(allFiles);
                            }
                        }
                        else {
                            // i -e for selected thumbs
                            if (videoThumbTypes != null) {
                                var videoThumbTypesArray = videoThumbTypes.split("|");
                                if (videoThumbTypesArray.length > 0) {
                                    for (var key in videoThumbTypesArray) {
                                        if (videoThumbTypesArray[key] == '_1') {
                                            allFiles._1 = baseUrl + uploadPath + result[k]._id + '/' + thumbOneDir + result[k].name + thumbOneSuffix + videoThumbExtension;
                                        }
                                        if (videoThumbTypesArray[key] == '_2') {
                                            allFiles._2 = baseUrl + uploadPath + result[k]._id + '/' + thumbTwoDir + result[k].name + thumbTwoSuffix + videoThumbExtension;
                                        }
                                    }
                                    media.push(allFiles);
                                }
                            }
                        }

                        //for SD and HD videos
                        if (videoCompressType == '*') {
                            for (var i = 0; i < result[k].compress_types.length; i++) {
                                if (result[k].compress_types[i].sizetype == 'SD') {
                                    allFiles.sd = baseUrl + uploadPath + result[k]._id + '/' + videoSDFileParameter + result[k].name + result[k].extension;
                                }
                                if (result[k].compress_types[i].sizetype == 'HD') {
                                    allFiles.hd = baseUrl + uploadPath + result[k]._id + '/' + videoHDFileParameter + result[k].name + result[k].extension;
                                }
                            }
                            media.push(allFiles);
                        }
                        else {
                            // i -e for selected thumbs
                            if (videoCompressType != null) {
                                var videoCompressTypeArray = videoCompressType.split("|");
                                if (videoCompressTypeArray.length > 0) {
                                    for (var key in videoCompressTypeArray) {
                                        if (videoCompressTypeArray[key] == 'SD') {
                                            allFiles.sd = baseUrl + uploadPath + result[k]._id + '/' + videoSDFileParameter + result[k].name + result[k].extension;
                                        }
                                        if (videoCompressTypeArray[key] == 'HD') {
                                            allFiles.hd = baseUrl + uploadPath + result[k]._id + '/' + videoHDFileParameter + result[k].name + result[k].extension;
                                        }
                                    }
                                    media.push(allFiles);
                                }
                            }
                        }
                        return media;
                        //resolve(media);
                    }
                    else if (fileType == 'AUDIO') {

                    }
                }
                //resolve(media);
                return media;
            } else {
                //resolve(media);
                return media;
            }
        });
};

//returns the URL shared object
exports.getFetchedUrlData = function (id) {
    return new Promise(function (resolve) {
        if (id != null) {
            models.fetched_url.findOne({
                where: {
                    $and: [
                        {
                            id: id
                        },
                        {
                            status: 'ACTIVE'
                        }
                    ]
                }
            }).then(function (data) {
                if (data != null) {
                    resolve(data);
                } else {
                    resolve({});
                }
            }).error(function (err) {
                resolve({});
            });
        } else {
            resolve({});
        }
    })
        .then(function (result) {
            return result;
        });

};


