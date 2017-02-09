var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');


exports.user_stats = function () {

    var user_stats = sequelizeConnect.sequelizeConn().define(
        'user_stats',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: { autoIncrement: true, type: sequelize.INTEGER, allowNull: false, primaryKey: true },
            uid: { type: sequelize.INTEGER(11), allowNull: false },
            followers: { type: sequelize.INTEGER(11), allowNull: false },
            followings: { type: sequelize.INTEGER(11), allowNull: false },
            goals: { type: sequelize.INTEGER(11), allowNull: false },
            views: { type: sequelize.INTEGER(11), allowNull: false },
            goal_followings: { type: sequelize.INTEGER(11), allowNull: false }
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'user_stats'
        }
    );
    return user_stats;
};