/**
 * Created by Ahmer Saeed on 9/9/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.default_category = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'default_category',
        {
            //mapping coulumns i-e datatypes, null checks etc
            category_id: {autoIncrement: true, type: sequelize.INTEGER, allowNull: false, primaryKey: true},
            category_name: {type: sequelize.STRING(100), allowNull: false},
            category_route: {type: sequelize.STRING(100), allowNull: true},
            default_thumb: {type: sequelize.STRING(200), allowNull: false},
            default_image_id: {type: sequelize.INTEGER(11), allowNull: true},
            banner_id: {type: sequelize.INTEGER(11), allowNull: true},
            default_color: {type: sequelize.STRING(7), allowNull: false},
            default_icon: {type: sequelize.STRING(100), allowNull: false},
            custom_message: {type: sequelize.TEXT, allowNull: true},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE', 'DELETED'), allowNull: false},
            category_type: {type: sequelize.BOOLEAN, allowNull: false},
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true},
            default_color_class: {type: sequelize.STRING(50), allowNull: false}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'default_category'
        }
    );
    return table;
};