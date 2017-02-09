var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.privacy_scope = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'privacy_scope',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            scope: {type: sequelize.TEXT, allowNull: false},
            description: {type: sequelize.TEXT, allowNull: true},
            default : {type : sequelize.INTEGER(1), allowNull : false },
            icon: { type: sequelize.STRING(30), allowNull: true },
            status: { type: sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: true },
            gen_by: {type: sequelize.ENUM('USER', 'SYSTEM'), allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'privacy_scope'
        }
    );
    return table;
};

