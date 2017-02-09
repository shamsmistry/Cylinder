var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.user_notification_settings = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'user_notification_settings',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false,autoIncrement: true,primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false },
            type_id: {type: sequelize.INTEGER(11), allowNull: false},

            toast: {type: sequelize.INTEGER(1), allowNull: true},    //its false in database with a default value
            mobile: {type: sequelize.INTEGER(1), allowNull: true},    //its false in database with a default value
            email: {type: sequelize.INTEGER(1), allowNull: true},    //its false in database with a default value

            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'user_notification_settings'
        }
    );
    return table;
};