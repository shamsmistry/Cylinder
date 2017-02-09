var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.category_tags = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'category_tags',
        {
            id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            category_id: {type: sequelize.INTEGER(11), allowNull: false},
            tag_id: {type: sequelize.INTEGER(11), allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'category_tags'
        }
    );
    return table;
};