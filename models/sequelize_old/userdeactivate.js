var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.userdeactivate = function () {
    
    var table = sequelizeConnect.sequelizeConn().define(
        'userdeactivate',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: { autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true },
            uid: { type: sequelize.INTEGER(11), allowNull: false },
            option_id: { type: sequelize.INTEGER(11), allowNull: false },
            details: { type: sequelize.TEXT, allowNull: true },
            created: { type: sequelize.INTEGER(11), allowNull: false }
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'userdeactivate'
        }
    );
    return table;
};

