var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

//mapping database table default_category

exports.posts = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'posts',
        {
            //mapping coulumns i-e datatypes, null checks etc
            id: {type: sequelize.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement : true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            textSearchable:{type:sequelize.TEXT,allowNull:true},
            text:{type:sequelize.TEXT,allowNull:false},
            media_id: {type: sequelize.INTEGER(11), allowNull: true},
            fetched_url_id: {type: sequelize.INTEGER(11), allowNull: true},
            scope_id: {type: sequelize.INTEGER(11), allowNull: true},
            post_type: {type: sequelize.ENUM('ALBUM','GOAL_CREATED','PROGRESS_UPDATED','CONTRIBUTION','GOAL_ACHIEVED','GOAL_FOLLOWED','USER_FOLLOWED','MILESTONE_CREATED','MILESTONE_COMPLETED','STATUS_UPDATE','SHARE_GOAL','SHARE_POST','GOAL_TIMELINE_UPDATED','GOAL_IMAGE_UPDATED','GOAL_DESCRIPTION_UPDATED','GOAL_NAME_UPDATED','GOAL_INTEREST_UPDATED','PROFILE_PICTURE_UPDATED','PROFILE_COVER_UPDATED','LINK_GOAL'), allowNull: false , defaultValue : 'NORMAL_POST'},
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true},
            status: {type: sequelize.ENUM('ACTIVE', 'DELETED','FLAG','USERDEACTIVATED'), allowNull: false},
            parent_id: {type: sequelize.INTEGER(11), allowNull: true},
            location_id: {type: sequelize.INTEGER(11), allowNull: true},
            user_defined_location_id: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,

            // define the table's name
            tableName: 'posts'
        }
    );
    return table;
}