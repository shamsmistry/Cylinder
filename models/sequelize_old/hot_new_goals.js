/**
 * Created by Wasiq Muhammad on 23/9/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.hot_new_goals = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'hot_new_goals',
        {
            //mapping coulumns i-e datatypes, null checks etc
            _id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            goal_id: {type: sequelize.INTEGER(11), allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE', 'USERDEACTIVATED'), allowNull: false},
            created_at: {type: sequelize.INTEGER(11), allowNull: true},

        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'hot_new_goals'
        }
    );
    return table;
};