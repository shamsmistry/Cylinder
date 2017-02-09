var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.OrganizationModel = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'organization',
        {
            id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            name: {type: sequelize.TEXT, allowNull: false},
            created: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'default_organization_name'
        }
    );
    return table;
};