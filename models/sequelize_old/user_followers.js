/**
 * Created by Wasiq Muhammad on 10/9/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.user_followers = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'user_followers',
        {
            //mapping coulumns i-e datatypes, null checks etc
            _id: {autoIncrement: true, type: sequelize.BIGINT(20), allowNull: false, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            follows_uid: {type: sequelize.INTEGER(11), allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE', 'USERDEACTIVATED'), allowNull: false},
            created: {type: sequelize.INTEGER(11), allowNull: false},

        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'user_followers'
        }
    );
    return table;
};