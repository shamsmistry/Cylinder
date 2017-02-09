/**
 * Created by Ahmer Saeed on 9/15/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.user_skills = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'user_skills',
        {
            //mapping coulumns i-e datatypes, null checks etc
            userskills_id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            skills: {type: sequelize.STRING, allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: true},
            updated: {type: sequelize.INTEGER(11), allowNull: true},
            status: {type: sequelize.ENUM('ACTIVE', 'DELETED','USERDEACTIVATED'), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'user_skills'
        }
    );
    return table;
};