/**
 * Created by Ahmar1 on 2/29/2016.
 */

var path = require('path');

//setting Base Url
exports.baseUrl = {
    fileServer: 'XXXXXXXXXXXXX',
    apiServer: 'XXXXXXXXXXXXX',
    socketServer: 'XXXXXXXXXXXXX',
    socketFileServer: 'XXXXXXXXXXXXX'
}

//setting list Port
exports.listenPorts = {
    port: 'XXXX'
}

//ffmpeg configurations
exports.ffmpegConfig = {
    path: 'C:/ffmpeg/bin/ffmpeg.exe',
    videoCodecLib: 'libx264',
    audioCodecLib: 'libmp3lame',
    videoFormat: 'mp4'
}

//default images name
exports.defaultImages = {
    profile: 'XXXXXXXXXXXXX',
    cover: 'XXXXXXXXXXXXX',
    goal: 'XXXXXXXXXXXXX'
}

//directory paths
exports.path = {
    //uploadPath:    path.join(__dirname, '../', 'resources/uploads/'),
    uploadPath: 'resources/uploads/',
    downloadPath: 'resources/downloads/images/',

    userFilePath: 'users/',

    profilePath: 'profile/',
    coverPath: 'cover/',
    contributionFilePath: 'contributions/',
    goalFilePath: 'goals/',
    postsFilePath: 'posts/',
    commentsFilePath: 'comments/',
    categoriesFilePath: 'categories/',
    subCategoriesFilePath: 'subcategories/',
    bannerFilePath: 'banner/',

    albumsPath: 'albums/',
    imagesAlbumPath: 'images/',
    videosAlbumPath: 'videos/',
    audiosAlbumPath: 'audios/',

    defaultFolderPath: 'default_files/',

    defaultSmallThumb: 'thumb/100x100/',
    defaultMediumThumb: 'thumb/200x200/',
    defaultLargeThumb: 'thumb/400x400/',

    defaultCoverSmallThumb: 'thumb/490x170/',
    defaultCoveMediumThumb: 'thumb/980x340/',
    defaultCoveLargeThumb: 'thumb/1960x680/',

    defaultGoalSmallThumb: 'thumb/300x225/',
    defaultGoalMediumThumb: 'thumb/528x297/',
    defaultGoalLargeThumb: 'thumb/980x340/',
    defaultGoalXlargeThumb: 'thumb/1960x680/',

    sdPath: 'sd/',
    hdPath: 'hd/',

    smallThumb: '100x100/',
    mediumThumb: '200x200/',
    largeThumb: '400x400/',

    coverSmallThumb: '490x170/',
    coverMediumThumb: '980x340/',
    coverLargeThumb: '1960x680/',

    goalSmallThumb: '300x225/',
    goalMediumThumb: '528x297/',
    goalLargeThumb: '980x340/',
    goalXlargeThumb: '1960x680/',

    postSquareThumb: 'square/',
    postSmallThumb: 'small/',
    postMediumThumb: 'medium/',
    postLargeThumb: 'large/',
    postXLargeThumb: 'xlarge/',


    //postSmallThumb: '640x360/',
    //postMediumThumb: '1280x720/',
    //postSquareThumb: '150x150/',

    categoriesSmallThumb: '128x128/',
    categoriesMediumThumb: '256x256/',

    subCategoriesSmallThumb: '128x128/',
    subCategoriesMediumThumb: '256x256/',

    bannerMediumThumb: '980x340/',
    bannerLargeThumb: '1960x680/',

    urlMediumThumb: '640x360/',

}

//thumb sizes
exports.thumbSize = {
    profile: [
        {
            "width": 100,
            "height": 100
        },
        {
            "width": 200,
            "height": 200
        },
        {
            "width": 400,
            "height": 400
        },
        {
            "width": 150,
            "height": 150
        }
    ],
    cover: [
        {
            "width": 490,
            "height": 170
        },
        {
            "width": 980,
            "height": 340
        },
        {
            "width": 1960,
            "height": 680
        },
        {
            "width": 150,
            "height": 150
        }
    ],
    goal: [
        {
            "width": 300,
            "height": 225
        },
        {
            "width": 528,
            "height": 297
        },
        {
            "width": 980,
            "height": 340
        },
        {
            "width": 1960,
            "height": 680
        },
        {
            "width": 150,
            "height": 150
        }
    ],
    contribute: [
        {
            "width": 0,
            "height": 0
        },
        {
            "width": 0,
            "height": 0
        },
        {
            "width": 0,
            "height": 0
        },
        {
            "width": 150,
            "height": 150
        }
    ],
    comment: [
        {
            "width": 0,
            "height": 0
        },
        {
            "width": 0,
            "height": 0
        },
        {
            "width": 0,
            "height": 0
        },
        {
            "width": 150,
            "height": 150
        }
    ],
    post: [
        {
            "width": 0,
            "height": 0
        },
        {
            "width": 0,
            "height": 0
        },
        {
            "width": 0,
            "height": 0
        },
        {
            "width": 150,
            "height": 150
        }
    ],
    albumProfile: [
        {
            "width": 100,
            "height": 100
        },
        {
            "width": 200,
            "height": 200
        },
        {
            "width": 400,
            "height": 400
        },
        {
            "width": 150,
            "height": 150
        }
    ],
    albumCover: [
        {
            "width": 490,
            "height": 170
        },
        {
            "width": 980,
            "height": 340
        },
        {
            "width": 1960,
            "height": 680
        },
        {
            "width": 150,
            "height": 150
        }
    ],
    categories: [
        {
            "width": 128,
            "height": 128
        },
        {
            "width": 256,
            "height": 256
        },
        {
            "width": 150,
            "height": 150
        }
    ],
    subCategories: [
        {
            "width": 128,
            "height": 128
        },
        {
            "width": 256,
            "height": 256
        },
        {
            "width": 150,
            "height": 150
        }
    ],
    urlImage: [
        {
            "width": 640,
            "height": 360
        }
    ],
    postGreater1024: [0.4, 0.55, 0.7],
    postLesser1024: [0.7, 0.85, 1.0],
    videoThumbs: [
        {
            "width": 320,
            "height": 240
        }
    ]
}

//thumb directories name
exports.thumbDirName = {
    //cover: ["490x170", "980x340", "1960x680"],
    cover: ["small", "medium", "large", "square"],
    //profile: ["100x100", "200x200", "400x400"],
    profile: ["small", "medium", "large", "square"],
    //goal: ["300x225", "528x297", "980x340", "1960x680"],
    goal: ["small", "medium", "large", "xlarge", "square"],
    //contribute: ["100x100", "200x200", "400x400"],
    contribute: ["small", "medium", "large", "square"],
    //comment: ["100x100", "200x200", "400x400"],
    comment: ["small", "medium", "large", "square"],
    //post: ["150x150", "640x360", "1280x720"],
    post: ["small", "medium", "large", "square"],
    //albumProfile: ["100x100", "200x200", "400x400"],
    albumProfile: ["small", "medium", "large", "square"],
    //albumCover: ["490x170", "980x340", "1960x680"],
    albumCover: ["small", "medium", "large", "square"],
    //categories: ["128x128", "256x256"],
    categories: ["small", "medium", "square"],
    //subCategories: ["128x128", "256x256"],
    subCategories: ["small", "medium", "square"],
    //banner: ["980x340", "1960x680"],
    banner: ["medium", "large", "square"],
    //urlimage: ["980x340", "1960x680"],
    urlimage: ["null"]
}

//thumb type name
exports.thumbName = {
    small: 'thumb/small/',
    medium: 'thumb/medium/',
    large: 'thumb/large/',
    xlarge: 'thumb/xlarge/',
    square: 'thumb/square/',
    original: 'org/org/',

    videoThumbOneDir: 'thumb/_1/',
    videoThumbTwoDir: 'thumb/_2/',
    videoThumbThreeDir: 'thumb/_3/',
    videoThumbFourDir: 'thumb/_4/',

    videoSDDir: 'cmp/sd/',
    videoHDDir: 'cmp/hd/'
}

//video configurations
exports.videoConfig = {
    compressSize: [
        {
            "width": 640,
            "height": 320
        },
        {
            "width": 1280,
            "height": 720
        }
    ],
    compressDirName: ["640x320", "1280x720"],
    compressType: ["sd", "hd"],
    thumbExtension: '.png',
    dirName: 'videos',
    thumbPrefix: '_tn',
    thumbOneSuffix: '_1',
    thumbTwoSuffix: '_2',
    thumbThreeSuffix: '_3',
    thumbFourSuffix: '_4',
    thumbCount: 4,
    thumbSize: '320x240',
    thumbDirName: 'thumb'
}

//audio configurations
exports.audioConfig = {
    dirName: 'audios',
    format: 'mp3'
}

//image configuration
exports.imageConfig = {
    maxCompressWidth: 2048,
    maxCompressHeight: 2048
}

//image rotation configurations
exports.validRotationDegree = {
    range: ['-270', '-180', '-90', '0', '90', '180', '270']
}

//hash-id salt
exports.encryption = {
    salt: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    size: "XXX"
};

//get location from IP
exports.maxmind = {
    path: './libraries/thirdparty/GeoLiteCity.dat'
};

//pagination configurations
exports.pagination = {
    offset: 0,
    limit: 5
};

//network settings
exports.serverNetwork = {
    fileServer_private: {
        ip: 'XXXXXXXXXXXXX',
        port: 'XXXXXXXXXXXXX'
    },
    fileServer_public: {
        ip: 'XXXXXXXXXXXXX',
        port: 'XXXXXXXXXXXXX'
    },
    apiServer_private: {
        ip: 'XXXXXXXXXXXXX',
        port: 'XXXXXXXXXXXXX'
    },
    apiServer_public: {
        ip: 'XXXXXXXXXXXXX',
        port: 'XXXXXXXXXXXXX'
    },
    pushServer_private: {
        ip: 'XXXXXXXXXXXXX',
        port: 'XXXXXXXXXXXXX'
    },
    pushServer_public: {
        ip: 'XXXXXXXXXXXXX',
        port: 'XXXXXXXXXXXXX'
    }
};


//API Server configuration
exports.webURL = {
    domain: 'XXXXXXXXXX',
    cdn: ''
};