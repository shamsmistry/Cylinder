/**
 * Created by Mudassir Ali on 10/12/2015.
 */


var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.contacts = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'contacts',
        {
            id: {type: sequelize.INTEGER(11), allowNull: false,autoIncrement: true,primaryKey: true},
            name: {type: sequelize.STRING(25), allowNull: false},
            email: {type: sequelize.STRING(25), allowNull: false},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            invited: {type: sequelize.INTEGER(1), allowNull: false, defaultValue: 0},
            invite_counter: {type: sequelize.INTEGER(4), allowNull: false},
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: false}
           },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'contacts'
        }
    );
    return table;
};