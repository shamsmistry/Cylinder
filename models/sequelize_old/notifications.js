var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.notifications = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'notifications',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false,autoIncrement: true,primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false },
            activity_id: {type: sequelize.INTEGER(11), allowNull: true},
            type: {type: sequelize.ENUM('USERMENTIONED','USER_FOLLOW_REQUEST_CREATED','USER_FOLLOW_REQUEST_ACCEPTED'), allowNull: true},
            details : { type : sequelize.STRING(255), allowNull : true },
            seen: {type: sequelize.INTEGER(1), allowNull: true},    //its false in database with a default value
            read: {type: sequelize.INTEGER(1), allowNull: true},    //its false in database with a default value

            status: {type: sequelize.ENUM('ACTIVE', 'DELETED'), allowNull: true},   //its false in database with a default value

            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'notifications'
        }
    );
    return table;
};