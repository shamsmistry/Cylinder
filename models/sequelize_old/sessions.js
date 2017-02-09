var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.sessions = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'sessions',
        {
            //mapping coulumns i-e datatypes, null checks etc
            SessionId: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            uid: { type: sequelize.INTEGER(11), allowNull: false },
            clientid: { type: sequelize.STRING, allowNull: false },
            clientsecret: { type: sequelize.STRING, allowNull: false },
            token: { type: sequelize.STRING, allowNull: true },
            status: { type: sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: true, defaultValue: 'ACTIVE' },
            uuid: { type: sequelize.STRING(255), allowNull: true },
            device_subscription_token: { type: sequelize.STRING(500), allowNull: true },
            platform: { type: sequelize.STRING(50), allowNull: true },
            platform_version: { type: sequelize.STRING(10), allowNull: true },
            model: { type: sequelize.STRING(15), allowNull: true },
            mobile: { type: sequelize.BOOLEAN, allowNull: true },
            isRetina: { type: sequelize.BOOLEAN, allowNull: true },
            screen_width: { type: sequelize.INTEGER(6), allowNull: true },
            screen_height: { type: sequelize.INTEGER(6), allowNull: true },
            useragent: {type: sequelize.STRING, allowNull: true},
            created: { type: sequelize.INTEGER(11), allowNull: false },
            expireTime: { type: sequelize.INTEGER(11), allowNull: false },            
            locationId: { type: sequelize.INTEGER(11), allowNull: true }            
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'sessions'
        }
    );
    return table;
};