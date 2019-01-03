/*
静态资源打包压缩流程
*/

'use strict';
// var fs = require('fs');

// 加载插件
var gulp = require("gulp"),
    del = require("del"),
    //vinylPaths = require("vinyl-paths"),
    jshintStyle = require("jshint-stylish"),
    gulpLoadPlugins = require("gulp-load-plugins"),
    fs = require('fs'),
    $ = gulpLoadPlugins({
        rename: {
            'gulp-htmlmin': 'htmlmin',
            'gulp-minify-css': 'minifycss',
            'gulp-uglify': 'uglify',
            'gulp-sass': 'sass',
            'gulp-concat': 'concat',
            'gulp-watch': 'watch',
            'gulp-zip': 'zip',
            'gulp-size': 'size',
            'gulp-strip-debug': 'stripdebug',
            'gulp-jshint': 'jshint',
            'gulp-cache': 'cache',
            'gulp-plumber': 'plumber',
            'gulp-babel': 'babel',
            'babel-preset-es2015': 'es2015',
            'gulp-header': 'header'
        }
    });

// 路径配置
var path = {
    // js-glob，js压缩文件路径
    html: [
        "login/templates/**/*.html",
        "paas/templates/**/*.html",
        "!login/templates/**/*.part",
        "!paas/templates/**/*.part"
    ],
    // js-glob，js压缩文件路径
    js: [
        "paas/static/js/**/*.js",
        "paas/static/home/js/**/*.js",
	"paas/static/home/user_center/js/**/*.js",
        "paas/static/esb/js/*.js",
        "paas/static/esb/status/js/**/*.js",
        "paas/static/esb/utils/*.js",
	"login/static/js/**/*.js",

        "!paas/static/js/**/*.min.js",
        "!paas/static/home/js/**/*.min.js",
	"!paas/static/home/user_center/js/**/*.min.js",
        "!paas/static/esb/js/*.min.js",
        "!paas/static/esb/js/*.min.js",
        "!paas/static/esb/status/js/**/*.min.js",
        "!paas/static/esb/utils/*.min.js",
        "!login/static/js/**/*.min.js",
    ],
    // .es6.js-glob，js转码文件路径
    es6js: [
        "paas/static/js/**/*.es6.js",
        "login/static/js/**/*.es6.js",
        "!paas/static/js/**/*.min.js",
        "!login/static/js/**/*.min.js"
    ],
    // jshint-glob，js检查文件路径
    jshint: [
        "static/js/**/app.js",
        "static/js/**/app-config.js",
        "static/js/**/proxy-agent.js",
        "static/js/**/operation-record.js"
    ],
    // css-glob，css压缩文件路径
    css: [
        "paas/static/css/*.css",
        "paas/static/home/css/*.css",
	"paas/static/home/user_center/css/*.css",
        "paas/static/esb/css/*.css",
        "login/static/css/*.css",

        "!login/static/css/*.min.css",
        "!paas/static/css/*.min.css",
	"!paas/static/home/user_center/css/*.min.css",
        "!paas/static/home/css/*.min.css",
        "!paas/static/esb/css/*.min.css"
    ],
    // zip-glob，打包路径
    zip: [
        "dist/**/*.*",
        "!dist/**/*.zip"
    ],
    // clean-glob，清理文件路径
    clean: [
        "dist/**/*.zip",
        "dist"
    ],
    // scss-glob，scss文件路径
    scss: [
        "static/sass/**/*.scss"
    ],
    base: "static",
    static: "static",
    templates: "templates",
    dist: "dist"
};


// 任务配置
var tasks = {
    // 代码检查
    jshint: function() {
        return gulp.src(path.jshint)
            .pipe($.jshint(".jshintrc"))
            // .pipe($.cache($.jshint('.jshintrc')))
            // .pipe($.jshint.reporter("default"))
            .pipe($.jshint.reporter(jshintStyle))
    },
    // sass编译
    sass: function() {
        return gulp.src(path.scss, {
                base: path.base
            })
            .pipe(watch(path.scss))
            .pipe($.sass().on('error', sass.logError))
            .pipe(gulp.dest(path.dist));
    },
    // html压缩
    minifyhtml: function() {
        return gulp.src(path.html)
            .pipe($.htmlmin({
                ignoreCustomFragments: [
                    /<%inherit[\s\S]*\/>/,
                    /<%include[\s\S]*\/>/,
                    /<%block[\s\S]*?>/,
                    /<%[\s\S]*?%>/,
                    /^(\s)*(#){2,}[\s\S]*>/,
                    /%\s*(if|for|while)\s{1,}\S*:$/,
                    /%[\s]*endif\s$/,
                    /<\/%block[\s\S]*?>/
                ],
                removeComments: true,
                collapseWhitespace: false,
                collapseBooleanAttributes: true,
                removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                minifyJS: true,
                minifyCSS: true
            }))
            .pipe(gulp.dest(path.dist));
    },
    // js压缩
    minifyjs: function() {
        return gulp.src(path.js, {
                base: path.base
            })
            // .pipe($.concat("app.js"))
            // .pipe($.babel())
            // .pipe(gulp.dest(path.dist))
            .pipe($.size({
                showFiles: true,
                pretty: true
            }))
            .pipe($.rename({
                suffix: ".min"
            }))
            .pipe($.stripdebug())
            .pipe($.uglify())
            .pipe($.size({
                showFiles: true,
                pretty: true
            }))
            .pipe($.header(fs.readFileSync('examples/build/LICENSE_JSCSS_HEADER', 'utf8'), {} ))
            .pipe(gulp.dest(path.dist))
            .pipe(gulp.dest(path.static))
    },
    // css压缩
    minifycss: function() {
        return gulp.src(path.css, {
                base: path.base
            })
            .pipe($.size({
                showFiles: true,
                pretty: true
            }))
            .pipe($.rename({
                suffix: ".min"
            }))
            .pipe($.minifycss())
            .pipe($.size({
                showFiles: true,
                pretty: true
            }))
            .pipe($.header(fs.readFileSync('examples/build/LICENSE_JSCSS_HEADER', 'utf8'), {} ))
            .pipe(gulp.dest(path.dist))
            .pipe(gulp.dest(path.static))
    },
    // es6转换
    minifyjs6: function() {
        return gulp.src(path.es6js, {
                base: path.base
            })
            .pipe($.babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(path.dist))
            .pipe($.rename({
                suffix: ".min"
            }))
            .pipe($.stripdebug())
            .pipe($.uglify())
            .pipe(gulp.dest(path.dist))
    },
    // 打包发布
    zip: function() {
        var zipFile = 'dist-' + new Date().getTime() + '.zip';
        console.log('create release package: ' + zipFile);
        return gulp.src(path.zip)
            .pipe($.plumber())
            .pipe($.zip(zipFile))
            .on("error", function() {
                console.error("zip error!")
            })
            .pipe(gulp.dest(path.dist))
            .pipe(gulp.dest(path.static))
    },
    // 清理dist
    clean: function() {
        del(path.clean);
        return $.cache.clearAll();
        // .pipe(vinylPaths(del));
    }

};

// 代码检查
gulp.task("jshint", tasks.jshint);

// sass编译
gulp.task('sass', tasks.sass);

// css压缩
gulp.task("minifycss", tasks.minifycss);

// html压缩(慎重，若Html中掺杂其他模板语法，可能出现问题，建议只压缩内嵌css/js)
gulp.task("minifyhtml", tasks.minifyhtml);

// es6转换
gulp.task("minifyjs6", tasks.minifyjs6);

// js压缩
gulp.task("minifyjs", ["jshint"], tasks.minifyjs);

// 清理dist
gulp.task("clean", tasks.clean);

// 打包发布
gulp.task("zip", tasks.zip);

// 监听变化
// gulp.task('sass:watch', function() {
//     gulp.watch(path.scss, ['sass']);
// });

// 静态资源压缩
gulp.task("build", ["minifyjs", "minifycss"])

// 清理dist目录+静态资源压缩
gulp.task("rebuild", function() {
    return del(path.clean).then(function(paths) {
        console.log('delete files:\n', paths.join('\n'));
        gulp.start('build');
    });
});

// 压缩后打包
gulp.task("default", ["build"], function() {
    gulp.start("zip");
    console.log('build finished.' + new Date());
});


// 帮助说明
gulp.task("help", function() {
    var helpInfo = "step1. npm install\n" +
        "step2. npm install -g gulp\n" +
        "step3. gulp <help|build|rebuild|zip|minifyjs|minifycss|minifyhtml|jshint|minifyjs6|sass>";
    console.log(helpInfo)
});
