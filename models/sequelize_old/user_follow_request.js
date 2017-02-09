
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

//mapping database table default_category

exports.user_follow_request = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'user_follow_request',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement : true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            uid_requester: {type: sequelize.INTEGER(11), allowNull: false},
            seen: {type: sequelize.INTEGER(1), allowNull: true},    //its false in database with a default value
            status: {type: sequelize.ENUM('ACCEPTED','ACTIVE', 'REJECTED','CANCELLED'), allowNull: true , defaultValue : 'ACTIVE'},
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true},


        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,

            // define the table's name
            tableName: 'user_follow_request'
        }
    );
    return table;
};