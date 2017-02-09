
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');


exports.feedbacks = function () {
    var table = sequelizeConnect.sequelizeConn().define(
        'feedbacks',
        {
            id:   {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true},
            text: {type: sequelize.STRING, allowNull: false},
            name :{type: sequelize.STRING, allowNull: true},
            uid : {type: sequelize.INTEGER(11), allowNull: true},
            email: {type: sequelize.STRING, allowNull: true},
            created : {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,

            // define the table's name
            tableName: 'feedbacks'
        }
    );
         return table;
};