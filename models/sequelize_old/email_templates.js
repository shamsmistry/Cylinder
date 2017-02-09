/**
 * Created by Wasiq Muhammad on 2/10/2015.
 */

var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

//mapping database table default_category
exports.email_templates = function () {
    
    var table = sequelizeConnect.sequelizeConn().define(
        'email_templates',
     {
            //mapping coulumns i-e datatypes, null checks etc
            id: { type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true },
            template_id: { type: sequelize.STRING(255), allowNull: false },
            body: { type: sequelize.TEXT, allowNull: true },
            version: { type: sequelize.FLOAT, alloweNull: false },
            template_name : { type: sequelize.STRING(255), allowNull: false }
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            
            // define the table's name
            tableName: 'email_templates'
        }
    );
    return table;
};