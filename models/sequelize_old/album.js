/**
 * Created by Wasiq Muhammad on 2/10/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

//mapping database table default_category
exports.album = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'album',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true},
            uid: {type: sequelize.INTEGER(11), allowNull: true},
            name: {type: sequelize.STRING, allowNull: true},
            type: {type: sequelize.ENUM('AUDIO', 'VIDEO', 'IMAGE'), allowNull: true},
            gen_by: {type: sequelize.ENUM('ADMIN', 'USER', 'SYSTEM'), allowNull: true},
            belongs_to: {type: sequelize.ENUM('DEFAULT', 'CUSTOM'), allowNull: true}

        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,

            // define the table's name
            tableName: 'album'
        }
    );
    return table;
};