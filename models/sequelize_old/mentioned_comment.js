var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.mentioned_comment = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'mentioned_comment',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false,autoIncrement: true,primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false },
            mentioned_uid: {type: sequelize.INTEGER(11), allowNull: false },
            post_id: {type: sequelize.INTEGER(11), allowNull: false },
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: true},   //its false in database with a default value
            mentioned_name : {type: sequelize.STRING(255), allowNull: false },
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true},
            comment_id: {type: sequelize.INTEGER(11), allowNull: false}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'mentioned_comment'
        }
    );
    return table;
};