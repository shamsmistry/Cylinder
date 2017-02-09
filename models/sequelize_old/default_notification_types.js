var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.default_notification_types = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'default_notification_types',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false,autoIncrement: true,primaryKey: true},
            /*type: {type: sequelize.ENUM('LOGIN', 'GOAL_FOLLOWED', 'USER_FOLLOWED', 'PROGRESS_UPDATED',
                'CONTRIBUTION', 'MILESTONE_CREATED', 'MILESTONE_COMPLETED', 'COMMENT', 'REPLY_ON_POSTCOMMENT',
                'MOTIVATE_ON_POST', 'MOTIVATE_ON_GOAL', 'SHARE_GOAL', 'SHARE_POST', 'LINK_GOAL', 'USERMENTIONED'), allowNull: false},*/
            type: {type: sequelize.STRING, allowNull: false},
            status: {type: sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: true},   //its false in database with a default value

            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'default_notification_types'
        }
    );
    return table;
};