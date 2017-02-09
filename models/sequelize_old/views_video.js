
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.views_video = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'views_video',
        {
            id: {type: sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            video_file_id: {type: sequelize.INTEGER(11), allowNull: false},
            location_id: {type: sequelize.INTEGER(11), allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: false}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'views_video'
        }
    );
    return table;
};