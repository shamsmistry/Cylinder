/**
 * Created by Ahmer Saeed on 9/23/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

//mapping database table default_category

exports.user_file_uploads = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'user_file_uploads',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            parent_id: {type: sequelize.INTEGER(11), allowNull: true},
            album_id: {type: sequelize.INTEGER(11), allowNull: true},
            parent_type: {
                type: sequelize.ENUM('USERPROFILE', 'USERCOVER', 'GOAL', 'PROGRESS', 'CONTRIBUTE', 'COMMENT', 'POST', 'DEFAULTUSERPROFILE', 'DEFAULTUSERCOVER', 'DEFAULTGOAL', 'LIBRARY', 'CATEGORY', 'SUBCATEGORY', 'BANNER'), // PROGRESS belongs to Milestone Completed
                allowNull: true
            },
            media_url: {type: sequelize.STRING, allowNull: true},
            filetype: {type: sequelize.ENUM('AUDIO', 'VIDEO', 'IMAGE'), allowNull: true},
            extension: {type: sequelize.STRING(55), allowNull: true},
            width: {type: sequelize.INTEGER(11), allowNull: true},
            height: {type: sequelize.INTEGER(11), allowNull: true},
            videothumbextension: {type: sequelize.STRING(55), allowNull: true},
            path: {type: sequelize.STRING, allowNull: true},
            duration: {type: sequelize.INTEGER(11), allowNull: true},
            status: {
                type: sequelize.ENUM('ACTIVE', 'INACTIVE', 'USERDEACTIVATED'),
                allowNull: true,
                defaultValue: 'ACTIVE'
            },
            created: { type: sequelize.INTEGER(11), allowNull: true },
            post_id: { type: sequelize.INTEGER(11), allowNull: true }
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            // define the table's name
            tableName: 'user_file_uploads'
        }
    );
    return table;
};