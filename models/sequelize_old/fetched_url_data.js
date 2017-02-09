var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

//mapping database table fetched_url_data
exports.fetched_url_data = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'fetched_url_data',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true},
            url: {type: sequelize.STRING, allowNull: true},
            scheme: {type: sequelize.STRING, allowNull: true},
            host: {type: sequelize.STRING, allowNull: true},
            rootUrl: {type: sequelize.STRING, allowNull: true},
            title: {type: sequelize.STRING, allowNull: true},
            links: {type: sequelize.STRING, allowNull: true},
            author: {type: sequelize.STRING, allowNull: true},
            keywords: {type: sequelize.STRING, allowNull: true},
            charset: {type: sequelize.STRING, allowNull: true},
            description: {type: sequelize.STRING, allowNull: true},
            feeds: {type: sequelize.STRING, allowNull: true},
            ogTitle: {type: sequelize.STRING, allowNull: true},
            ogDescription: {type: sequelize.STRING, allowNull: true},
            imageUrl: {type: sequelize.STRING, allowNull: true},
            imagePath: {type: sequelize.STRING, allowNull: true},
            imageName: {type: sequelize.STRING, allowNull: true},
            imageExtension: {type: sequelize.STRING, allowNull: true},
            imageThumbSize: {type: sequelize.ENUM('SQUARE', 'XLARGE', 'LARGE', 'MEDIUM', 'SMALL'), allowNull: true},
            imageThumbWidth: {type: sequelize.STRING, allowNull: true},
            imageThumbHeight: {type: sequelize.STRING, allowNull: true},
            thumbPath: {type: sequelize.STRING, allowNull: true},
            provider: { type: sequelize.STRING, allowNull: true },
            status: { type: sequelize.ENUM('ACTIVE', 'DELETED', 'DEACTIVATED'), allowNull: true },
            updated: {type: sequelize.INTEGER(11), allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,

            // define the table's name
            tableName: 'fetched_url_data'
        }
    );
    return table;
};