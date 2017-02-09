
//properties
exports.properties = {
    email: {
        accessibility: 'PUBLIC'
    },
    name: {
        accessibility: 'PUBLIC',
        toString: function () {
            return (first_name + ' ' + middle_name + ' ' + last_name).replaceAll('  ', ' ');
        }
    },
    find: function (property) {
        if(this.hasOwnProperty(property))
            return this[property];
    }
}

//generate expression tree
exports.parseExpression = function (query) {
    
    var finalQuery = [];
    
    for(var i = 0; i < query.length; i++) {
        if(this.properties.find(query[i]).accessibility == 'PUBLIC'){
            finalQuery.push(query[i]);
        }
    }
    
}

//for Sequelize
exports.users = function () {

    var table = sequelizeConnect.sequelizeConn().define(
        'users',
        {
            //mapping coulumns i-e datatypes, null checks etc
            uid: {autoIncrement: true, type: sequelize.INTEGER(11), allowNull: false, primaryKey: true},
            username: {type: sequelize.STRING, allowNull: true},
            user_email: {type: sequelize.STRING, allowNull: false},
            email_valid: {type: sequelize.BOOLEAN, allowNull: false, defaultValue: true},
            first_name: {type: sequelize.STRING, allowNull: false},
            middle_name: {type: sequelize.STRING, allowNull: true},
            last_name: {type: sequelize.STRING, allowNull: true},
            bio: {type: sequelize.TEXT, allowNull: true},
            gender: {type: sequelize.ENUM('MALE', 'FEMALE', 'UNKNOWN'), allowNull: true},
            dob: {type: sequelize.DATE, allowNull: true},
            dob_show: {type: sequelize.ENUM('PUBLIC', 'PRIVATE'), allowNull: true},
            password: {type: sequelize.STRING, allowNull: false},
            profile_image_id: {type: sequelize.INTEGER(11), allowNull: true},
            cover_image_id: {type: sequelize.INTEGER(11), allowNull: true},
            default_image_id: {type: sequelize.INTEGER(11), allowNull: true},
            default_cover_image_id: {type: sequelize.INTEGER(11), allowNull: true},
            privacy_type: { type: sequelize.ENUM('PUBLIC', 'PRIVATE'), allowNull: true },
            lang: { type: sequelize.STRING, allowNull: true },
            created: {type: sequelize.INTEGER(11), allowNull: false},
            updated: {type: sequelize.INTEGER(11), allowNull: true},
            status: {type: sequelize.ENUM('ACTIVE', 'DEACTIVATED', 'DELETED', 'FLAGGED'), allowNull: false},
            featured_profile: {type: sequelize.ENUM('YES', 'NO'), allowNull: true},
            account_verified: {type: sequelize.BOOLEAN, allowNull: false, defaultValue: true},
            role_id: {type: sequelize.INTEGER(11), allowNull: false},
            country_id: {type: sequelize.INTEGER(4), allowNull: false},
            country_id_guess: {type: sequelize.ENUM('GUESS', 'USER'), allowNull: false},
            fb_uid: {type: sequelize.STRING, allowNull: true},
            tw_uid: {type: sequelize.STRING, allowNull: true},
            gp_uid: {type: sequelize.STRING, allowNull: true},
            twitter_oauth_token: {type: sequelize.STRING, allowNull: true},
            twitter_oauth_token_secret: {type: sequelize.STRING, allowNull: true},
            username_by: {type: sequelize.ENUM('SYSTEM', 'USER'), allowNull: false},
            timezone: {type: sequelize.INTEGER(4), allowNull: true},
            last_login: { type: sequelize.INTEGER(11), allowNull: true },
            last_login_ip: {type: sequelize.STRING, allowNull: true},
            lastactivity: {type: sequelize.DATE, allowNull: true},
            created_at: {type: sequelize.DATE, allowNull: true},
            updated_at: {type: sequelize.DATE, allowNull: true},
            location_id: {type: sequelize.INTEGER(11), allowNull: true},
            user_location: {type: sequelize.INTEGER(11), allowNull: true},
            chatRoomId: {type: sequelize.STRING, allowNull: true}
        },
        {
            timestamps: false,
            paranoid: true,
            freezeTableName: true,
            tableName: 'users'
        }
    );
    return table;
};