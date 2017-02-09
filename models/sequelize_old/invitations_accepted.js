var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.invitations_accepted = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'invitations_accepted',
        {
            id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            invitee_uid: {type: sequelize.INTEGER(11), allowNull: false},
            created: {type: sequelize.INTEGER(11), allowNull: false},
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'invitations_accepted'
        }
    );
    return table;
};


// CREATE TABLE `invitations_accepted` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `uid` int(11) NOT NULL,
//   `invitee_uid` int(11) NOT NULL,
//   `created` int(11) NOT NULL,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8