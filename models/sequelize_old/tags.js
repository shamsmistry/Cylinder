var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.tags = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'tags',
        {
            tag_id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            tagname: {type: sequelize.STRING(60), allowNull: false},
            isFeatured: { type: sequelize.BOOLEAN, allowNull: true },
            isDisplayable: { type: sequelize.BOOLEAN, allowNull: true },
            icon_class: {type: sequelize.STRING(100), allowNull: false},
            default_color: { type: sequelize.STRING(7), allowNull: true },
            description: { type: sequelize.TEXT, allowNull: false },
            question: { type: sequelize.STRING(255), allowNull: true },
            image_id: { type: sequelize.INTEGER(11), allowNull: true },
            bannerImage_id: { type: sequelize.INTEGER(11), allowNull: true },
            action_text: { type: sequelize.STRING(255), allowNull: true },
            status: {type: sequelize.ENUM('ACTIVE', 'DEACTIVATE', 'DELETED'), allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'tags'
        }
    );
    return table;
};