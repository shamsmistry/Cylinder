
var sequelizeConnect = require('../../helpers/db');
var sequelize = require('sequelize');

//mapping database table default_category

exports.goals = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'goals',
        {
            //mapping coulumns i-e datatypes, null checks etc
            goal_id: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            uid: {type: sequelize.INTEGER(11), allowNull: false},
            goal_name: {type: sequelize.STRING(200), allowNull: false},
            goal_description: {type: sequelize.TEXT, allowNull: true},
            g_start_date: {type: sequelize.DATE, allowNull: true},
            g_end_date: {type: sequelize.DATE, allowNull: true},
            goal_type: {type: sequelize.ENUM('BASIC'), allowNull: true},
            default_goal_image_id: {type: sequelize.INTEGER(11), allowNull: true},
            goal_image_id: {type: sequelize.INTEGER(11), allowNull: true},
            category_id: {type: sequelize.INTEGER(11), allowNull: true},
            goal_image: {type: sequelize.STRING(255), allowNull: false, defaultValue: '0'},
            is_public: {type: sequelize.BOOLEAN, allowNull: false, defaultValue: 1},
            featured: {type: sequelize.BOOLEAN, allowNull: true},
            status: {type: sequelize.ENUM('ACTIVE', 'DEACTIVATE', 'DELETED', 'FLAGGED', 'COMPLETED','USERDEACTIVATED'), allowNull: false},
            flag: {type: sequelize.BOOLEAN, allowNull: false, defaultValue: 0},
            priority: {type: sequelize.ENUM('LOW', 'MEDIUM', 'HIGH'), allowNull: true},
            linked_goal_id: {type: sequelize.INTEGER(11), allowNull: true},
            linked_type: {
                type: sequelize.ENUM('DEFAULT', 'MERGE', 'SEPERATED'),
                allowNull: false,
                defaultValue: 'DEFAULT'
            },
            via_uid: {type: sequelize.INTEGER(11), allowNull: true},
            via_uid_show: {type: sequelize.ENUM('YES', 'NO'), allowNull: true},
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true},
            scope_id: {type: sequelize.INTEGER(11), allowNull: true},
            followers_count: {type: sequelize.INTEGER(11), allowNull: false, defaultValue: 0},
            links_count: {type: sequelize.INTEGER(11), allowNull: false, defaultValue: 0},
            location_id: {type: sequelize.INTEGER(11), allowNull: true},
            user_location: {type: sequelize.INTEGER(11), allowNull: true},
            completed: {type: sequelize.INTEGER(11), allowNull: true}
        },
        {
            timestamps: false,

            paranoid: true,
            freezeTableName: true,

            // define the table's name
            tableName: 'goals'
        }
    );
    return table;
};