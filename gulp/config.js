var dest = './builds/development';
var destProd = './builds/production';
var src = './src';

module.exports = {
    browserSync: {
        server: {
            baseDir: dest
        }
    },
    jasmine: {
        src: 'jasmineTest/main.js'
    },
    sass: {
        src: src + '/sass/**/*.{sass,scss}',
        dest: dest + '/css',
        destProd: destProd + '/css',
        settings: {
            // Required if you want to use SASS syntax
            // See https://github.com/dlmanning/gulp-sass/issues/81
            sourceComments: 'map',
            imagePath: '/images' // Used by the image-url helper
        }
    },
    images: {
        src: src + '/images/**',
        dest: dest + '/images',
        destProd: destProd + '/images'
    },
    staticAssets: {
        src: src + '/static-assets/**',
        dest: dest + '/js'
    },
    markup: {
        src: src + '/html/*.html',
        dest: dest,
        destProd: destProd
    },
    browserify: {
        // A separate bundle will be generated for each
        // bundle config in the list below
        src: src,
        bundleConfigs: [{
            entries: src + '/javascript/main.js',
            dest: dest + '/js',
            outputName: 'main.js',
            // Additional file extentions to make optional
            extensions: ['.js', '.hbs']
            // list of modules to make require-able externally
            // require: ['jquery', 'backbone']
        }]
    },
    production: {
        cssSrc: dest + '/css/*.css',
        jsSrc: dest + '/js/*.js',
        dest: dest
    },
    settings: {
        src: './settings.json',
        dest: dest
    }
};
