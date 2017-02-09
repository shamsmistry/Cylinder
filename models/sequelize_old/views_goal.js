
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.views_goal = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'views_goal',
        {
            id: {type: sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            goal_id: {type: sequelize.INTEGER(11), allowNull: false},
            location_id: {type: sequelize.INTEGER(11), allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: false}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'views_goal'
        }
    );
    return table;
};