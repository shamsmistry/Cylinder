/**
 * Created by Momal Razzaq on 28/10/2015.
 */


var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.UsersCoachmarks = function () {
    return sequelizeConnect.sequelizeConn().define('UsersCoachmarks',
        {
            _id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            coachmark_id: {type: sequelize.INTEGER(11), allowNull: false},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            created_at: {type: sequelize.DATE(), allowNull: true},
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'users_coachmarks'
        }
    );
};
