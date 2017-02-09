/**
 * Created by Wasiq Muhammad on 23/9/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.featured_users = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'featured_users',
        {
            //mapping coulumns i-e datatypes, null checks etc
            _id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: true},
            featured_by: {type: sequelize.INTEGER(11), allowNull: true},
            description: {type: sequelize.STRING(600), allowNull: true},
            status: {type: sequelize.ENUM('ACTIVE','INACTIVE','USERDEACTIVATED'), allowNull: false},
            created_at: {type: sequelize.INTEGER(11), allowNull: true},
            
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'featured_users'
        }
    );
    return table;
};