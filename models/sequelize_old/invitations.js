
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.invitations = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'invitations',
        {
            id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            invitation_id: {type: sequelize.STRING(40), allowNull: false},
            platform: {type: sequelize.ENUM('MOBILE', 'WEB', 'OTHER'), allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'DELETED','USERDEACTIVATED'), allowNull: false},
            created: {type: sequelize.INTEGER(11), allowNull: false},
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'invitations'
        }
    );
    return table;
};


// CREATE TABLE invitations
// (
//     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
//     uid INT NOT NULL,
//     invitation_id VARCHAR(40) NOT NULL,
//     invitation_from ENUM('MOBILE', 'WEB', 'OTHER') DEFAULT 'OTHER' NOT NULL,
//     status ENUM('ACTIVE', 'DELETED', 'USERDEACTIVATED') DEFAULT 'ACTIVE' NOT NULL,
//     created INT NOT NULL
// );
// CREATE UNIQUE INDEX invitations_invitation_id_uindex ON invitations (invitation_id);
// 
// ALTER TABLE linkagoal_db_migrated.invitations CHANGE invitation_from platform ENUM('MOBILE', 'WEB', 'OTHER') NOT NULL DEFAULT 'OTHER';