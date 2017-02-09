/**
 * Created by Ahmer Saeed on 10/7/2015.
 */
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.user_email_verification = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'user_email_verification',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true},
            uid: {type: sequelize.INTEGER(11), allowNull: true},
            verification_key: {type: sequelize.STRING(255), allowNull: true},
            expirytime: {type: sequelize.STRING(55), allowNull: true},
            status: {type: sequelize.ENUM('INACTIVE','ACTIVE'), allowNull: false},
            created: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            // define the table's name
            tableName: 'user_email_verification'
        }
    );
    return table;
};