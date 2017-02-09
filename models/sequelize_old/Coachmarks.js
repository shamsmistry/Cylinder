/**
 * Created by Momal Razzaq on 28/10/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.Coachmarks = function () {
    
    var table = sequelizeConnect.sequelizeConn().define(
        'coachmarks',
        {
            //mapping coulumns i-e datatypes, null checks etc
            _id: { autoIncrement: true, type: sequelize.INTEGER, allowNull: false, primaryKey: true },
            name: { type: sequelize.STRING(200), allowNull: false },
            description: { type: sequelize.STRING(255), allowNull: true },
            type: { type: sequelize.ENUM('landing_page', 'profile', 'settings'), allowNull: true },
            button: { type: sequelize.STRING(200), allowNull: true },
            created: { type: sequelize.INTEGER(11), allowNull: false }
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'coachmarks'
        }
    );
    return table;
};