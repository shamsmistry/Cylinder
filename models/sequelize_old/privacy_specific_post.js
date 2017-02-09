/**
 * Created by Mudassir Ali on 1/28/2016.
 */
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.privacy_specific_post = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'privacy_specific_post',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            post_id: {type: sequelize.INTEGER(11), allowNull: true},
            allowed_uid: {type: sequelize.INTEGER(11), allowNull: true},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: true},

        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'privacy_specific_post'
        }
    );
    return table;
};
/**
 * Created by Mudassir Ali on 1/28/2016.
 */
