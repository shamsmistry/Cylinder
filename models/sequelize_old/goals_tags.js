/**
 * Created by Mudassir on 10/9/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.goals_tags = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'goals_tags',
        {
            //mapping coulumns i-e datatypes, null checks etc
            _id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            goal_id: {type: sequelize.INTEGER(11), allowNull: false},
            tag_id: {type: sequelize.INTEGER(11), allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE', 'USERDEACTIVATED'), allowNull: false},
            gen_by: {type: sequelize.ENUM('USER', 'SYSTEM'), allowNull: false},
            created: {type: sequelize.INTEGER(11), allowNull: false}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'goals_tags'
        }
    );
    return table;
};