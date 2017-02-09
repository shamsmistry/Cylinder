/**
 * Created by Wasiq Muhammad on 2/10/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

//mapping database table default_category

exports.all_roles = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'all_roles',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement : true},
            role_name: {type: sequelize.STRING(55) , allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: false , defaultValue : 'ACTIVE'}

        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,

            // define the table's name
            tableName: 'all_roles'
        }
    );
    return table;
};