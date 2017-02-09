/**
 * Created by Ahmer Saeed on 10/20/2015.
 */

var mysql = require('mysql');
var Sequelize = require('sequelize');

//Create connection
var sequelizeConnection = new Sequelize('XXXXXXXXXXXXX', 'XXXXXXXXX', 'XXXXXXX', {
    host: 'XXXXXXXXXXXX',
    dialect: 'mysql',
    define: {
        timestamps: false
    },

    pool: {
        max: 15,
        min: 0,
        idle: 10000
    }
});

exports.sequelizeConn = function connectSequelize() {
    return sequelizeConnection;
};

var sequelizeConnect = this.sequelizeConn();

sequelizeConnect.sync(
    {
        force: false
    }
);





