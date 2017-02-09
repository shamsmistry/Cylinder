/**
 * Created by Wasiq Muhammad on 10/9/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.goal_mute = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'goal_mute',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            goal_id: {type: sequelize.INTEGER(11), allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'COMPLETED', 'DELETED','USERDEACTIVATED'), allowNull: false},
            created: {type: sequelize.INTEGER(11), allowNull: false},
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'goal_mute'
        }
    );
    return table;
};