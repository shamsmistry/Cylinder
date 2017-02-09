/**
 * Created by Wasiq Muhammad on 2/10/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

//mapping database table default_category

exports.posts_tag = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'posts_tag',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement : true},
            post_id: {type: sequelize.INTEGER(11), allowNull: false},
            tag_id: {type: sequelize.INTEGER(11), allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE','USERDEACTIVATED'), allowNull: false , defaultValue : 'ACTIVE'},
            gen_by: {type: sequelize.ENUM('USER', 'SYSTEM'), allowNull: false , defaultValue : 'USER'},
            created: {type: sequelize.INTEGER(11), allowNull: true},
        
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,

            // define the table's name
            tableName: 'posts_tag'
        }
    );
    return table;
};