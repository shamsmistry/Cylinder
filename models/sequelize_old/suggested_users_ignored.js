var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.suggested_users_ignored = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'suggested_users_ignored',
        {
            id: {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            ignored_uid: {type: sequelize.INTEGER(11), allowNull: false},
            created : {type: sequelize.INTEGER(11), allowNull: false}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'suggested_users_ignored'
        }
    );
    return table;
};

// CREATE TABLE suggested_users_ignored
// (
//     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
//     uid INT NOT NULL,
//     ignored_uid INT NOT NULL,
//     created INT NOT NULL
// );
// CREATE INDEX suggested_users_ignored_uid_index ON suggested_users_ignored (uid);