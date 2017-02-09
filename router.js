//requiring controllers and helpers
var events_ = require('./controllers/events_');
var helper = require('./helpers/helper');
var developmentConfig = require('./config/development_config');
var chalk = require('chalk');

module.exports = function (app, io) {

// #####################################################################
// ############### Establishing Socket Connections #####################
//######################################################################


    //all sockets, event listner and emitter
    // Initialize a new socket.io application
    io.on('connection', function (socket) {

        console.log(chalk.green(' ================ Socket Connection Established =================='));

        //login

        //fires when client emit login event
        //on this event,we will get user-id and token
        socket.on('login', function (data) {

            console.log(chalk.yellow('======== Login Event Fired ============'));

            //now checking if session is exist of provided uid and token
            var userId = data.uId || null;
            var userToken = data.token || null;
            var userObj = {
                socket: socket,
                userId: userId,
                userToken: userToken
            };

            return events_.login(userObj)
                .then(function () {
                    return;
                });
        });

        //message

        socket.on('msg', function (data) {

            console.log(chalk.yellow('======== Message Event Fired =============='));

            var dataObj = {
                socket: socket,                                    // socket instance
                msgFrom: parseInt(data.msgFrom) || null,           // msgFrom belongs to, sender
                msgTo: parseInt(data.msgTo) || null,               // msgTo belongs to, receiver
                msgContent: data.msgContent || null,               // messageContent belongs to, content
                mediaId: data.mediaId || [],                     // mediaId contains array of uploaded file id(s)
                urlSharedId: data.urlSharedId || null              // urlShareId contains the shared url id
            };


            return events_.message(dataObj)
                .then(function () {
                    return;
                });
        });

        //messageseen

        socket.on('messageseen', function (data) {

            console.log(chalk.yellow(' =============== Message Seen Event Fired =============='));

            //updating seen status on provided msg ids
            //and emitting seen event to user (sender)

            var dataObj = {
                socket: socket,
                userId: data.uId || null,
                messageIds: data.messageIds || null
            };


            return events_.seen(dataObj)
                .then(function () {
                    return;
                });

        });

        //messagedelete

        socket.on('messagedelete', function (data) {

            console.log(chalk.yellow('========== Delete Message Event Fired ========='));

            //updating status to 2 on provided msg id

            var dataObj = {
                socket: socket,
                userId: data.uId || null,
                messageId: data.messageId || null
            };
            return events_.deleteMessage(dataObj)
                .then(function () {
                    return;
                });

        });

        //hide conversation

        socket.on('delete_conversation', function (data) {

            console.log(chalk.yellow('========== Hide Conversation Event Fired ========='), data);

            //updating status to 2 on provided conversation id

            var dataObj = {
                socket: socket,
                userId: data.uId || null,
                conversationId: data.conversationId || null
            };
            return events_.deleteConversation(dataObj)
                .then(function () {
                    return;
                });

        });

        //customize disconnect (on logout from session web/app both)

        socket.on('customize_disconnect', function (data) {

            console.log(chalk.yellow(' =============== Customize Disconnect(Logout) Event Fired =============='));

            var dataObj = {
                socket: socket,
                uId: data.uId,
                socketIdsArray: data.socketIds || []
            };
            return events_.customizeDisconnect(dataObj)
                .then(function () {
                    return;
                });
        });

        //follow up function for customize disconnect

        socket.on('disconnect', function () {

            console.log(chalk.yellow(' =============== Disconnect(leave) Event Fired =============='));

            //now socket clears the chatRoomId
            //then removing chatRoomId from global chatRoomArray
            //than removing chatRoomId from user table
            var dataObj = {
                socket: socket,
                lastSeenTime: helper.getUnixTimeStamp()
            };
            return events_.disconnect(dataObj)
                .then(function () {
                    return;
                });
        });


        //search conversation

        socket.on('search_conversation', function (data) {

            console.log(chalk.yellow('======== Scroll Search Conversation Event Fired =============='));

            var dataObj = {
                socket: socket,                                          // socket instance
                userId: data.uId || null,                                // user id of requester
                searchUserId: data.searchUserId || null                  // id of searched person
            };
            return events_.searchConversation(dataObj)
                .then(function () {
                    return;
                });
        });

        // ====== Pagination ============ //

        //scroll conversation (pagination)

        socket.on('scroll_conversations', function (data) {

            console.log(chalk.yellow('======== Scroll Conversation Event Fired =============='));

            var dataObj = {
                socket: socket,                                   // socket instance
                userId: data.uId || null,                         // user id of requester
                createdTime: data.conversationCreated || null     // from this fetch old conversations
            };

            return events_.scrollConversations(dataObj)
                .then(function () {
                    return;
                });
        });

        //scroll chat messages (pagination)

        socket.on('scroll_chat_messages', function (data) {

            console.log(chalk.yellow('======== Scroll Chat Messages Event Fired =============='));

            var dataObj = {
                socket: socket,                                   // socket instance
                userId: data.uId || null,                         // user id of requester
                conversationId: data.conversationId || null,      // from this fetch all the conversation and apply limit
                createdTime: data.messageCreated || null          // from this fetch old messages
            };

            return events_.scrollChatMessages(dataObj)
                .then(function () {
                    return;
                });
        });

        //other Features

        socket.on('user_typing', function (data) {
            console.log(' ====== User Typing Event Fired ========');

            var dataObj = {
                socket: socket,                                   // socket instance
                userId: data.uId || null,                         // user id of requester
                conversationId: data.conversationId || null,      // from this fetch all the conversation and apply limit
                typingMessage: data.message || null               // the message to show on typing event
            };

            return events_.userTyping(dataObj)
                .then(function () {
                    return;
                });
        });


        //TESTING EVENTS
        socket.on('generate_jwt', function (data) {

            console.log(chalk.yellow('======== Generate JWT Event Fired =============='));

            var jwt = require('jwt-simple');
            var payload = {foo: 'bar'};
            var secret = 'xxx';

            // encode
            var token = jwt.encode(payload, secret);
            console.log('encoded token', token);

            // decode
            var decoded = jwt.decode(token, secret);
            console.log('decoded token', decoded); //=> { foo: 'bar' }
        });

    });

// #####################################################################
// ################### Establishing Routes #############################
//######################################################################

    app.route('/emit/notification')
        //emit notification object event
        .post(function (req, res) {

            console.log(chalk.yellow('======== Emit Notification API =============='));
            var remoteAddress = req.connection.remoteAddress || null;
            if (remoteAddress != null) {
                var notificationArray = req.body.notification || [];
                if (notificationArray.length > 0) {
                    var dataObj = {
                        socket: io,
                        notification: notificationArray
                    };
                    return events_.emitNotification(dataObj)
                        .then(function (response) {
                            if (response) {
                                res.status(200).send({
                                    meta: {
                                        status: 200,
                                        message: 'successfully emitted the notification'
                                    }
                                });
                            } else {
                                res.status(401).send({
                                    meta: {
                                        status: 401,
                                        message: 'failed to emit the notification'
                                    }
                                });
                            }
                        });
                } else {
                    res.status(401).send({
                        meta: {
                            status: 401,
                            message: 'failed to emit the notification'
                        }
                    });
                }
            } else {
                res.status(401).send({
                    meta: {
                        status: 401,
                        message: 'failed to emit the notification'
                    }
                });
            }
        });

    //admin api for checking the values in
    //chat room array
    app.route('/chatroom/status')
        .get(function (req, res) {
            if (req.headers.token == developmentConfig.development.apiToken) {
                return helper.getChatRoomStatus()
                    .then(function (chatRoomStatus) {
                        res.status(200).send({
                            meta: {
                                status: 200,
                                message: 'chat room status'
                            },
                            data: chatRoomStatus
                        });
                    });
            } else {
                res.status(402).send({
                    meta: {
                        status: 402,
                        message: 'not allowed'
                    }
                });
            }
        });   //admin api for checking the values in

    //test api for push notification in chat message
    app.route('/test/push')
        .get(function (req, res) {
            events_.testPushNotificationApi();
            res.send();
        });

    //test api for insert media file in chat message
    app.route('/test/media')
        .post(function (req, res) {
            events_.testMediaApi();
            res.send();
        });

    //test api for insert media file in chat message
    app.route('/test/promise')
        .post(function (req, res) {
            return events_.testPromiseApi()
                .then(function () {
                    res.send('hello');
                });
        });

    //test api for stackoverflow
    app.route('/test/loop')
        .post(function (req, res) {
            return events_.testLoop();
        });
};

//for formatting in database queries
String.prototype.format = function (i, safe, arg) {

    function format() {
        var str = this, len = arguments.length + 1;

        // For each {0} {1} {n...} replace with the argument in that position.  If
        // the argument is an object or an array it will be stringified to JSON.
        for (i = 0; i < len; arg = arguments[i++]) {
            safe = typeof arg === 'object' ? JSON.stringify(arg) : arg;
            str = str.replace(RegExp('\\{' + (i - 1) + '\\}', 'g'), safe);
        }
        return str;
    }

    // Save a reference of what may already exist under the property native.
    // Allows for doing something like: if("".format.native) { /* use native */ }
    format.native = String.prototype.format;

    // Replace the prototype property
    return format;

}();


Array.prototype.toURL = function () {
    return this.join('/');
};