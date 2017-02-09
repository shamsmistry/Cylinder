module.exports = {
    development: {
        root: require('path').normalize(__dirname + '/..')
        , pagination: {
            conversation: {
                limit: 10,
                sort: -1 // i-e in descending order

            },
            message: {
                limit: 10,
                sort: -1 // i-e in descending order
            },
            messageSeen: {
                limit: 1,
                sort: null // i-e in descending order
            },
            conversationSearch: {
                limit: 1,
                sort: null // i-e in descending order
            }
        }
    }
    , staging: {
        root: require('path').normalize(__dirname + '/..')
        , pagination: {
            conversation: {
                limit: 10,
                sort: -1 // i-e in descending order

            },
            message: {
                limit: 10,
                sort: -1 // i-e in descending order
            },
            messageSeen: {
                limit: 1,
                sort: null // i-e in descending order
            },
            conversationSearch: {
                limit: 1,
                sort: null // i-e in descending order
            }
        }
    }
    , production: {
        root: require('path').normalize(__dirname + '/..')
        , pagination: {
            conversation: {
                limit: 10,
                sort: -1 // i-e in descending order

            },
            message: {
                limit: 10,
                sort: -1 // i-e in descending order
            },
            messageSeen: {
                limit: 1,
                sort: null // i-e in descending order
            },
            conversationSearch: {
                limit: 1,
                sort: null // i-e in descending order
            }
        }
    }
}




