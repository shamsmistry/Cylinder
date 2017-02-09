/**
 * Created by Wasiq Muhammad on 10/9/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.goal_linked = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'goal_linked',
        {
            _id: {autoIncrement: true, type: sequelize.BIGINT(20), allowNull: false, primaryKey: true},
            from_goal_id: {type: sequelize.INTEGER(11), allowNull: false},
            to_goal_id: {type: sequelize.INTEGER(11), allowNull: false},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE','USERDEACTIVATED'), allowNull: false},
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true},
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'goal_linked'
        }
    );
    return table;
};