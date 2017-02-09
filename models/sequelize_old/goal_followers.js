/**
 * Created by Mudassir Ali on 9/15/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

//mapping database table default_category

exports.goal_followers = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'goal_followers',
        {
            //mapping coulumns i-e datatypes, null checks etc
            _id: {type: sequelize.BIGINT(20), allowNull: false, primaryKey: true, autoIncrement : true},
            goal_id: {type: sequelize.INTEGER(11), allowNull: false},
            follower_uid: {type: sequelize.INTEGER(11), allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE','USERDEACTIVATED'), allowNull: false , defaultValue : 'ACTIVE'},
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true}

        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,

            // define the table's name
            tableName: 'goal_followers'
        }
    );
    return table;
};