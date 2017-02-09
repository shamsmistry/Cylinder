var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.users_promoted = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'users_promoted',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: true},
            is_featured: {type: sequelize.TINYINT(1), allowNull: true},
            is_suggested: {type: sequelize.TINYINT(1), allowNull: true},
            status: {type: sequelize.ENUM('ACTIVE','INACTIVE','USERDEACTIVATED'), allowNull: false},
            created: {type: sequelize.INTEGER(11), allowNull: true},

        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'users_promoted'
        }
    );
    return table;
};