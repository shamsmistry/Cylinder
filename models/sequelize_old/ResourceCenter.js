var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.ResourceCenter = function () {

    var ResourceCenter = sequelizeConnect.sequelizeConn().define('ResourceCenter',
        {
            //mapping coulumns i-e datatypes, null checks etc
            resource_id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            title: {type: sequelize.STRING(255), allowNull: false},
            content_block1: {type: sequelize.TEXT, allowNull: false},
            content_block2: {type: sequelize.TEXT, allowNull: true},
            route: {type: sequelize.STRING(100), allowNull: true},
            created_at: {type: sequelize.DATE(), allowNull: true},
            plain_description: {type: sequelize.STRING(255), allowNull: true},
            image_href: {type: sequelize.STRING(255), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'resource_center'
        }
    );
    return ResourceCenter;
};