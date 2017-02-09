
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.listen_audio = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'listen_audio',
        {
            id: {type: sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            audio_file_id: {type: sequelize.INTEGER(11), allowNull: false},
            location_id: {type: sequelize.INTEGER(11), allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: false}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'listen_audio'
        }
    );
    return table;
};