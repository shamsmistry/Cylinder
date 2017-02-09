/**
 * Created by Wasiq Muhammad on 10/9/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.goal_motivate = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'goal_motivate',
        {
            //mapping coulumns i-e datatypes, null checks etc
            _id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            goal_id: {type: sequelize.INTEGER(11), allowNull: false},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE','USERDEACTIVATED'), allowNull: false},
            created: {type: sequelize.INTEGER(11), allowNull: false},
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'goal_motivate'
        }
    );
    return table;
};