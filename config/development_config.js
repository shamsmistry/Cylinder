module.exports = {
    development: {
        root: require('path').normalize(__dirname + '/..')
        , app: {
            name: 'LinkagoalMessage'
        }
        , db: 'mongodb://127.0.0.1:27017/chat'
        , apiToken: 'linkagoal' //for use in chat room array api
    }
    , staging: {
        root: require('path').normalize(__dirname + '/..')
        , app: {
            name: 'LinkagoalMessage'
        }
        , db: 'mongodb://127.0.0.1:27017/chat'
        , apiToken: 'linkagoal' //for use in chat room array api
    }
    , production: {
        root: require('path').normalize(__dirname + '/..')
        , app: {
            name: 'LinkagoalMessage'
        }
        , db: 'mongodb://127.0.0.1:27017/chat'
        , apiToken: 'linkagoal' //for use in chat room array api
    }
}




