/**
 * Created by Ahmer Saeed on 9/14/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.user_education_history = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'user_education_history',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            organization_id: {type: sequelize.INTEGER(11), allowNull: false},
            program: {type: sequelize.STRING(200), allowNull: true},
            major: {type: sequelize.STRING(255), allowNull: true},
            from_year: {type: sequelize.DATE, allowNull: true},
            to_year: {type: sequelize.DATE, allowNull: true},
            type: {type: sequelize.ENUM('SCHOOL', 'UNIVERSITY', 'MIDDLE SCHOOL', 'HIGH SCHOOL'), allowNull: false},
            graduated: {type: sequelize.INTEGER(1), allowNull: true},//its not null in database level
            created: {type: sequelize.INTEGER(11), allowNull: true},
            updated: {type: sequelize.INTEGER(11), allowNull: true},
            status: {type: sequelize.ENUM('ACTIVE', 'DELETED','USERDEACTIVATED'), allowNull: true},
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'user_education_history'
        }
    );
    return table;
};