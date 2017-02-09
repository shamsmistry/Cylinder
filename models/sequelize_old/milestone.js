
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.milestone = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'milestone',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false,autoIncrement: true,primaryKey: true},
            text: {type: sequelize.TEXT, allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'DELETED','COMPLETED','USERDEACTIVATED'), allowNull: false},
            goal_id: {type: sequelize.INTEGER(11), allowNull: false},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            seq_number: {type: sequelize.INTEGER(11), allowNull: false},

            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true},
            finished_at: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'milestone'
        }
    );
    return table;
};