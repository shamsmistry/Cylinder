
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.location = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'location',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false,autoIncrement: true,primaryKey: true},
            ip :{type: sequelize.STRING(39), allowNull: false},
            countryCode :{type: sequelize.STRING(5), allowNull: true},
            countryName :{type: sequelize.STRING(25), allowNull: true},
            region :{type: sequelize.STRING(5), allowNull: true},
            city :{type: sequelize.STRING(25), allowNull: true},
            postalCode :{type: sequelize.STRING(25), allowNull: true},
            latitude :{type: sequelize.DECIMAL(10,8), allowNull: true},
            longitude :{type: sequelize.DECIMAL(11,8), allowNull: true},
            dmaCode: {type: sequelize.INTEGER(11), allowNull: true},
            areaCode: {type: sequelize.INTEGER(11), allowNull: true},
            metroCode: {type: sequelize.INTEGER(11), allowNull: true},
            continentCode :{type: sequelize.STRING(5), allowNull: true},
            regionName :{type: sequelize.STRING(25), allowNull: true}

        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'location'
        }
    );
    return table;
};