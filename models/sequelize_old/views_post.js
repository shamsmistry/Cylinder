
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.views_post = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'views_post',
        {
            id: {type: sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            post_id: {type: sequelize.INTEGER(11), allowNull: false},
            location_id: {type: sequelize.INTEGER(11), allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: false}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'views_post'
        }
    );
    return table;
};