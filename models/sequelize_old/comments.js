var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.comments = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'comments',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            parent_id: {type: sequelize.INTEGER(11), allowNull: false},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            comment_txt: {type: sequelize.TEXT, allowNull: false},
            parent_type: {type: sequelize.ENUM('POST'), allowNull: false},
            comment_type: {type: sequelize.ENUM('TEXT', 'AUDIO', 'VIDEO', 'IMAGE'), allowNull: true},
            fetched_url_id: {type: sequelize.INTEGER(11), allowNull: true},
            file_id: {type: sequelize.INTEGER(11), allowNull: true},
            image_id: {type: sequelize.INTEGER(11), allowNull: true},
            scope: {type: sequelize.ENUM('PUBLIC'), allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'DELETED', 'USERDEACTIVATED'), allowNull: false},
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true},
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'comments'
        }
    );
    return table;
};

