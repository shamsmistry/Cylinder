/**
 * Created by Ahmer Saeed on 9/23/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

//mapping database table default_category

exports.images_thumbs = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'images_thumbs',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true},
            image_id: {type: sequelize.INTEGER(11), allowNull: false},
            path: {type: sequelize.STRING, allowNull: true},
            width: {type: sequelize.INTEGER(11), allowNull: true},
            height: {type: sequelize.INTEGER(11), allowNull: true},
            sizetype: {type: sequelize.ENUM('SMALL', 'MEDIUM', 'LARGE', 'XLARGE','SQUARE','_1','_2','_3','_4'), allowNull: true},
            thumbtype: {type: sequelize.ENUM('IMAGETHUMB', 'VIDEOTHUMB'), allowNull: true},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: true, defaultValue: 'ACTIVE'},
            created: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'images_thumbs'
        }
    );
    return table;
};