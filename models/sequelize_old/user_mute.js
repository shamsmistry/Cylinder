/**
 * Created by Mudassir on 12/17/2015.
 */
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.user_mute = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'user_mute',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false,autoIncrement: true,primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false },
            mute_uid: {type: sequelize.INTEGER(11), allowNull: false },
            status: {type: sequelize.ENUM('ACTIVE','INACTIVE','USERDEACTIVATED'), allowNull: false, defaultValue : 'ACTIVE'},
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: false}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'user_mute'
        }
    );
    return table;
};