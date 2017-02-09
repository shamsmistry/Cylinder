
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.user_block = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'user_block',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            blocked_uid: {type: sequelize.INTEGER(11), allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE', 'USERDEACTIVATED'), allowNull: true, defaultValue : 'ACTIVE'},
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true},

        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'user_block'
        }
    );
    return table;
};
