var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');
var OrganizationModel = require('../../models/sequelize_old/OrganizationModel');

var user_work_history = exports.user_work_history = function () {

    var user_work_history_tbl = sequelizeConnect.sequelizeConn().define(
        'user_work_history',
        {
            _id: {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true , autoIncrement : true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            organization_id: {type: sequelize.INTEGER(11), allowNull: false},
            position: {type: sequelize.STRING(35), allowNull: true},
            from_year : {type: sequelize.DATE, allowNull: true},
            to_year : {type: sequelize.DATE, allowNull: true},
            is_working: {type: sequelize.INTEGER(1), allowNull: false , defaultValue : 0},
            status: {type: sequelize.ENUM('ACTIVE', 'DELETED','USERDEACTIVATED'), allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: true},
            updated: {type: sequelize.INTEGER(11), allowNull: true}

        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'user_work_history'
        }
    );
    user_work_history_tbl.belongsTo(OrganizationModel.OrganizationModel(), {
        foreignKey: 'organization_id',
        constraints: false,
    });
    return user_work_history_tbl;
};