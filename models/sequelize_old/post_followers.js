var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.post_followers = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'post_followers',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false,autoIncrement: true,primaryKey: true},
			post_id: {type: sequelize.INTEGER(11), allowNull: false },
            uid: {type: sequelize.INTEGER(11), allowNull: false },

            status: {type: sequelize.ENUM('ACTIVE', 'DELETED', 'USERDEACTIVATED'), allowNull: true},   //its false in database with a default value

            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'post_followers'
        }
    );
    return table;
};