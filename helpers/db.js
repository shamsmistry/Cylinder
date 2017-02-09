/**
 * Created by Ahmer Saeed on 10/20/2015.
 */

var mysql = require('mysql');
var Sequelize = require('sequelize');

//Create connection
var sequelizeConnection = new Sequelize('linkagoal_db_8aug2016', 'root', '', {
    host: 'localhost',
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





