var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

exports.user_activity = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'user_activity',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            activity_type: {
                type: sequelize.ENUM('ALBUM', 'GOAL_CREATED', 'PROGRESS_UPDATED', 'CONTRIBUTION', 'GOAL_ACHIEVED', 'GOAL_FOLLOWED', 'USER_FOLLOWED', 'MILESTONE_CREATED', 'MILESTONE_COMPLETED', 'COMMENT', 'REPLY_ON_POSTCOMMENT', 'STATUS_UPDATE', 'MOTIVATE_ON_GOAL', 'MOTIVATE_ON_POST', 'SHARE_GOAL', 'SHARE_POST', 'GOAL_TIMELINE_UPDATED', 'GOAL_IMAGE_UPDATED', 'GOAL_DESCRIPTION_UPDATED', 'GOAL_NAME_UPDATED', 'GOAL_INTEREST_UPDATED', 'PROFILE_PICTURE_UPDATED', 'PROFILE_COVER_UPDATED', 'LINK_GOAL'),
                allowNull: false
            },
            source_id: {type: sequelize.INTEGER(11), allowNull: false},
            parent_id: {type: sequelize.INTEGER(11), allowNull: true},
            parent_type: {type: sequelize.ENUM('GOAL', 'POST', 'ALBUM'), allowNull: true},
            post_id: {type: sequelize.INTEGER(11), allowNull: true},
            status: {type: sequelize.ENUM('ACTIVE', 'DELETED'), allowNull: true},    //allow null is "true" here because db has a defulat value 'ACTIVE'
            created: { type: sequelize.INTEGER(11), allowNull: true }
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'user_activity'
        }
    );
    return table;
};