/**
 * Created by Wasiq Muhammad on 10/9/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.ResourceCenterTags = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'ResourceCenterTags',
        {
            _id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            resource_id: {type: sequelize.INTEGER(11), allowNull: false},
            tag_id: {type: sequelize.INTEGER(11), allowNull: false},
            created_at: {type: sequelize.DATE(), allowNull: false},
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'resource_center_tags'
        }
    );
    return table;
};