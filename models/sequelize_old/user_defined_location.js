var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

//mapping database table user_defined_location

exports.user_defined_location = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'user_defined_location',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement : true},
            street_number: {type: sequelize.STRING, allowNull: true},
            route:{type:sequelize.TEXT,allowNull:true},
            locality: {type:sequelize.TEXT,allowNull:true},
            administrative_area_level_1:{type: sequelize.STRING, allowNull: true},
            country: {type: sequelize.STRING, allowNull: true},
            postal_code:{type: sequelize.STRING, allowNull: true},
            formatted_address:{type:sequelize.TEXT,allowNull:true},
            status: {type: sequelize.ENUM('ACTIVE', 'DELETED'), allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: true},
            latitude: {type: sequelize.DECIMAL(10,8), allowNull: true},
            longitude: {type: sequelize.DECIMAL(11,8), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,

            // define the table's name
            tableName: 'user_defined_location'
        }
    );
    return table;
}