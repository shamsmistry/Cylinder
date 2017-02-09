/**
 * Created by Wasiq Muhammad on 2/10/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

//mapping database table default_category

exports.all_roles = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'user_permission',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement : true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            permission_id: {type: sequelize.INTEGER(11), allowNull: false},
            read: {type: sequelize.BOOLEAN, allowNull: false},
            create: {type: sequelize.BOOLEAN, allowNull: false},
            edit: {type: sequelize.BOOLEAN, allowNull: false},
            delete: {type: sequelize.BOOLEAN, allowNull: false}

        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,

            // define the table's name
            tableName: 'user_permission'
        }
    );
    return table;
};