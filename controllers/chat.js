/**
 * Created by Ahmer Saeed on 12/9/2015.
 */

var util = require('util');

//requiring mongodb models
var mongoose = require('mongoose')
    , chatConversationsThreads = mongoose.model('chat_conversations_threads')
    , chatConversationsDetails = mongoose.model('chat_conversations_details')
    , chatMessages = mongoose.model('chat_messages')
    , chatMessagesDetails = mongoose.model('chat_messages_details')
    , users = mongoose.model('users');

//requiring mysql models
var classAllTables = require('../models/alltables');

//establishing Socket.io
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


//requiring controllers and helpers
var chatController = require('../controllers/chat');
var helper = require('../helpers/helper');

//requiring npms
var Promise = require("bluebird");
var chalk = require('chalk');

//================== Database Operation on Mongodb =====================//

//insert document in Collection
exports.insertCollection = function (collectionName, dataObj) {
    return new Promise(function (resolveInsertion) {
        collectionName.save(function (err, dataObj) {
            var insertedId = null;
            if (!err) {
                insertedId = dataObj._id;
            } else {
            }
            resolveInsertion(insertedId);
        })
    })
        .then(function (inserted) {
            return inserted;
        });
};

//update document in Collection
exports.updateCollection = function (collectionName, updateObj, options, queryObj, callback) {
    collectionName.update(queryObj, {$set: updateObj}, options, function (err, updateResult) {
        console.log(chalk.green(' ==== Update Collection Result : No. of modified Document =====', updateResult.nModified));
        return callback(err, updateResult);
    });
};

//update document in Collection using $in clause (i-e where in)
exports.updateCollectionUsingInClause = function (collectionName, updateObj, options, queryObj, callback) {
    collectionName.update(queryObj, {$set: updateObj}, options, function (err, updateResult) {
        console.log(chalk.green(' ==== Update Collection Result : No. of modified Document =====', updateResult.nModified));
        return callback(err, updateResult);
    });
};

//delete document from Collection (updating status only not hard deleting)
exports.deleteCollection = function (collectionName, dataObj, queryObj) {
    collectionName.update(queryObj, {$set: dataObj}, {multi: true}, function (err, result) {
        if ((result.ok == 1) && (result.nModified == 1)) {
            return true;
        } else if ((result.ok == 1) && (result.nModified == 0)) {
            return false;
        }
        else if (result.ok == 0 || err != null) {
            return 'err';
        }
    });
}

//update document in Collection via push key
exports.updateCollectionViaPushKey = function (collectionName, pushKeyObject, options, queryObj, callback) {
    collectionName.findOneAndUpdate(
        queryObj,
        {
            $push: pushKeyObject
        },
        options,
        function (err, updateResult) {
            return callback(err, updateResult);
        }
    );
};

//update document in Collection via push and set key
exports.updateCollectionViaPushAndSetKey = function (collectionName, pushKeyObject, setKeyObject, options, queryObj, callback) {
    collectionName.findOneAndUpdate(
        queryObj,
        {
            $push: pushKeyObject,
            $set: setKeyObject
        },
        options,
        function (err, updateResult) {
            return callback(err, updateResult);
        }
    );
};

//update document in Collection via pull key
exports.updateCollectionViaPullKey = function (collectionName, pullKeyObject, options, queryObj, callback) {
    collectionName.findOneAndUpdate(
        queryObj,
        {
            $pull: pullKeyObject
        },
        options,
        function (err, updateResult) {
            return callback(err, updateResult);
        }
    );
};

//update document in Collection via pull and set key
exports.updateCollectionViaPullAndSetKey = function (collectionName, pullKeyObject, setKeyObject, options, queryObj, callback) {
    collectionName.findOneAndUpdate(
        queryObj,
        {
            $pull: pullKeyObject,
            $set: setKeyObject
        },
        options,
        function (err, updateResult) {
            return callback(err, updateResult);
        }
    );
};

//update array in Collection via pullAll key
exports.updateCollectionViaPullAllKey = function (collectionName, pullKeyObject, options, queryObj, callback) {
    collectionName.findOneAndUpdate(
        queryObj,
        {
            $pullAll: pullKeyObject
        },
        options,
        function (err, updateResult) {
            return callback(err, updateResult);
        }
    );
};

//get document from Collection with all fields
exports.getCollection = function (collectionName, queryObj, statsObj) {
    if (statsObj != '{}') {
        return new Promise(function (resolveFetch) {

            //approach - 1

            //collectionName.find(queryObj)
            //    .sort(statsObj.sortBy)
            //    .limit(statsObj.limit)
            //    .exec(function (err, fetchDataObj) {
            //        if (err) {
            //            console.log(chalk.green('  ======== In getCollection, Error is : ========', err));
            //            resolveFetch(err);
            //        } else {
            //            console.log(chalk.green('  ======== In getCollection, fetchDataObj: ========'));
            //            resolveFetch(fetchDataObj);
            //        }
            //    });

            //approach - 2

            collectionName.find(queryObj, {},
                {
                    limit: statsObj.limit,
                    sort: statsObj.sortBy
                },
                function (err, fetchDataObj) {
                    if (err) {
                        //console.log(chalk.green('  ======== In getCollection, Error is : ========', err));
                        resolveFetch(err);
                    } else {
                        //console.log(chalk.green('  ======== In getCollection, fetchDataObj: ========'));
                        resolveFetch(fetchDataObj);
                    }
                })
        })
            .then(function (fetchDataObj) {
                return fetchDataObj;
            })
    }
    else {
        return new Promise(function (resolveFetch) {

            //collectionName.find(queryObj)
            //    .exec(function (err, fetchDataObj) {
            //        if (err) {
            //            console.log(chalk.green('  ======== In getCollection, Error is : ========', err));
            //            resolveFetch(err);
            //        } else {
            //            console.log(chalk.green('  ======== In getCollection, fetchDataObj: ========'));
            //            resolveFetch(fetchDataObj);
            //        }
            //    });

            collectionName.find(queryObj, function (err, fetchDataObj) {
                if (err) {
                    //console.log(chalk.green('  ======== In getCollection, Error is : ========', err));
                    resolveFetch(err);
                } else {
                    //console.log(chalk.green('  ======== In getCollection, fetchDataObj: ========'));
                    resolveFetch(fetchDataObj);
                }
            })
        })
            .then(function (fetchDataObj) {
                return fetchDataObj;
            })
    }
}

//get document from Collection with specific fields
exports.getCollectionSpecifiedField = function (collectionName, queryObj, statsObj, requiredField) {
    return new Promise(function (resolveFetch) {

        //approach - 1

        collectionName.find(queryObj, function (err, fetchDataObj) {
            if (err) {
                resolveFetch(err);
            } else {
                resolveFetch(fetchDataObj);
            }
        })
            .limit(statsObj.limit)
            .select(requiredField);

        //approach - 2

        //collectionName.find(queryObj)
        //    .select(requiredField)
        //    .exec(function (err, fetchDataObj) {
        //        if (err) {
        //            resolveFetch(err);
        //        } else {
        //            resolveFetch(fetchDataObj);
        //        }
        //    });

    })
        .then(function (fetchDataObj) {
            return fetchDataObj;
        });


}

//get single document from Collection
exports.getCollectionSingleDocument = function (collectionName, queryObj) {
    return new Promise(function (resolveFetch) {

        //approach - 1

        collectionName.findOne({
            where: queryObj
        })
            .then(function (fetchResult) {
                resolveFetch(fetchResult);
            })
            .error(function (fetchError) {
                resolveFetch(fetchError);
            });

        //approach - 2

        //collectionName.findOne(queryObj)
        //    .exec(function (err, fetchResult) {
        //        if (err) {
        //            resolveFetch(err);
        //        } else {
        //            resolveFetch(fetchResult);
        //        }
        //    });

    })
        .then(function (fetchDataObj) {
            return fetchDataObj;
        });
}

//get data from multiple collections
exports.getPopulatedCollections = function (collectionName, queryObj, statsObj) {
    return new Promise(function (firstPromiseResolve) {
        collectionName.find(queryObj)
            .populate({
                path: statsObj.referenceId
            })
            .limit(statsObj.limit)
            .sort(statsObj.sortBy)
            .exec(function (err, populatedResult) {
                if (err) {
                    console.log(chalk.red(' ======= Error in Populating Collections =======', err));
                    firstPromiseResolve(err);
                } else {
                    //console.log(chalk.green(' ======= Hence Collections are Successfully Populated  ======='));
                    firstPromiseResolve(populatedResult);
                }
            });
    })
        .then(function (resultFirstPromise) {
            return resultFirstPromise;
        });
};

//get data with aggregate complete (i-e w.r.t group,match,sort)
exports.getAggregateCollectionComplete = function (collectionName, queryObj, groupBy, projectBy, sortBy) {
    return new Promise(function (firstPromiseResolve) {
        collectionName.aggregate([
            {
                $match: queryObj
            },
            {
                $group: groupBy.key
            },
            {
                $project: projectBy.alias
            },
            {
                $sort: sortBy.key
            },
            {
                $limit: sortBy.limit
            }
        ], function (err, result) {
            if (err) {
                firstPromiseResolve(err);
            } else {
                firstPromiseResolve(result);
            }
        });
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//get data with aggregate on match, project and group by stages
exports.getAggregateCollectionGroupBy = function (collectionName, queryObj, $groupBy) {
    return new Promise(function (firstPromiseResolve) {
        collectionName.aggregate([
            {
                $match: queryObj
            },
            {
                "$group": {"_id": $groupBy.key}
            },
            {
                "$project": $groupBy.alias
            }
        ], function (err, result) {
            if (err) {
                firstPromiseResolve(err);
            } else {
                firstPromiseResolve(result);
            }
        });
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//get data with aggregate on match, project and sort stages
exports.getAggregateCollectionSortBy = function (collectionName, queryObj, projectBy, sortBy) {
    return new Promise(function (firstPromiseResolve) {
        collectionName.aggregate([
            {
                $match: queryObj
            },
            {
                $project: projectBy.alias
            },
            {
                $sort: sortBy.key
            }
        ], function (err, result) {
            if (err) {
                firstPromiseResolve(err);
            } else {
                firstPromiseResolve(result);
            }
        });
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};



//get data with aggregate complete (i-e w.r.t group,match,sort)
exports.getAggregateSalaryCollection = function (collectionName, queryObj, groupBy, projectBy, sortBy) {
    return new Promise(function (firstPromiseResolve) {
        collectionName.aggregate([
            {
                $match: queryObj
            },
            {
                $group: groupBy.key
            },
            {
                $project: projectBy.alias
            },
            {
                $sort: sortBy.key
            },
            {
                $limit: sortBy.limit
            }
        ], function (err, result) {
            if (err) {
                firstPromiseResolve(err);
            } else {
                firstPromiseResolve(result);
            }
        });
    })
        .then(function (firstPromiseResult) {
            return firstPromiseResult;
        });
};

//================== Database Operation on Mysql =====================//

//updating user table
exports.updateTable = function (tableName, dataObj, queryObj) {
    return new Promise(function (resolveUpdation) {
        tableName.update(dataObj, {
            where: queryObj
        })
            .then(function (updateResult) {
                resolveUpdation(updateResult);
            });
    })
        .then(function (updated) {
            if (updated == 1) {
                return true;
            } else {
                return false;
            }
        });
};
