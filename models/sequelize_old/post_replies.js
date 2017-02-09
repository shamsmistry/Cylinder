var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.post_replies = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'post_replies',
        {
            //mapping coulumns i-e datatypes, null checks etc
            _id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            parent_id: {type: sequelize.INTEGER(11), allowNull: false}, // comment id
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            reply: {type: sequelize.TEXT, allowNull: false},
            status: {
                type: sequelize.ENUM('ACTIVE', 'DELETED', 'USERDEACTIVATED'),
                allowNull: false,
                defaultValue: 'ACTIVE'
            },
            created: {type: sequelize.INTEGER(11), allowNull: true},
            updated: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,

            paranoid: true,
            freezeTableName: true,
            tableName: 'post_replies'
        }
    );
    return table;
};