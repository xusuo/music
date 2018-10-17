var gulp = require("gulp");
var htmlclean = require("gulp-htmlclean");
var imagemin = require("gulp-imagemin");
var uglify = require("gulp-uglify")
var debug = require("gulp-strip-debug")
var less = require("gulp-less")
var postcss = require("gulp-postcss")
var autoprefixer = require("autoprefixer")
var cssnano = require("cssnano")
var connect = require("gulp-connect")

console.log(process.env.NODE_ENV == "development")
var devMode = process.env.NODE_ENV == "development"
//export NODE_ENV=development
var folder = {
    src: "src/",
    dist: "dist/"
}



gulp.task("html", function () {
    var page = gulp.src(folder.src + "html/*")
    if (!devMode) {
        page.pipe(htmlclean())
    }

    page.pipe(gulp.dest(folder.dist + "html/"))
})
gulp.task("image", function () {
    gulp.src(folder.src + "images/*")
        .pipe(imagemin())
        .pipe(gulp.dest(folder.dist + "images/"))
})
gulp.task("js", function () {
    var js = gulp.src(folder.src + "js/*")
    if(!devMode){
        js.pipe(debug())
        .pipe(uglify())
    }
        js.pipe(gulp.dest(folder.dist + "js/"));
})
gulp.task("css", function () {
    var options = [autoprefixer(), cssnano()];
    var css = gulp.src(folder.src + "css/*")
        .pipe(less())
        if(!devMode){
            css.pipe(postcss(options))
        }
        css.pipe(gulp.dest(folder.dist + "css/"))
})
gulp.task("watch", function () {
    gulp.watch(folder.src + "html/*", ["html"]);
    gulp.watch(folder.src + "css/*", ["css"]);
    gulp.watch(folder.src + "js/*", ["js"]);
    gulp.watch(folder.src + "images/*", ["images"]);
})
gulp.task("server", function () {
    connect.server({
        port: "8090"
    })

})

gulp.task("default", ["html", "image", "js", "css", 'watch', "server"]);
