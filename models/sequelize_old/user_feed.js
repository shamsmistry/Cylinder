var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.user_feed = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'user_activity',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            activity_id: {type: sequelize.INTEGER(11), allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE','DELETED','HIDDEN','USERDEACTIVATED'), allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: true},
            updated: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'user_feed'
        }
    );
    return table;
};