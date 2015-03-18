/// <reference path="node_modules/typescript-formatter/typescript-formatter.d.ts"/>
/// <reference path="typings/tsd.d.ts" />
import del = require("del");
import dts = require("dts-bundle");
import glob = require("glob");
import ghPages = require("gulp-gh-pages");
import gulp = require("gulp");
import istanbul = require("gulp-istanbul");
import mocha = require("gulp-mocha");
import path = require("path");
import tsfmt = require("typescript-formatter");
import tslint = require("gulp-tslint");
import typedoc = require("gulp-typedoc");
import typescript = require("gulp-typescript");

/**
 * High Level Tasks
 */
gulp.task("doc", ["pages"]);
gulp.task("test", ["lint", "spec"]);

/**
 * Directories
 * @type {Object}
 */
var dirs = {
    build: "_build",
    dist: process.cwd(),
    doc: "doc",
    src: "src",
    test: "test",
    typings: "typings"
};

/**
 * Globs
 * @type {Object}
 */
var globs = {
    all: path.join("**", "*"),
    gulp: "gulpfile.ts",
    js: path.join("**", "*.js"),
    ts: path.join("**", "*.ts")
};

var name = "tsutil";
var scripts = path.join(combine(dirs.src, dirs.test), globs.ts);

/**
 * Combine the dirs for minimatch
 * @param dirs
 * @returns {string}
 */
function combine(...dirs: string[]): string {
    return "{" + dirs.join(",") + "}";
}

/**
 * Bundles the details view
 */
gulp.task("bundle", ["copy"], () => {
    dts.bundle({
        main: "index.d.ts",
        name: name,
        prefix: "",
        removeSource: true
    });
});

/**
 * Cleans the build artifacts
 */
gulp.task("clean", (callback) => {
    del([dirs.build, dirs.doc], callback);
});

/**
 * Copies the compiled files
 */
gulp.task("copy", ["scripts"], () => {
    return gulp.src(path.join(dirs.build, dirs.src, globs.all))
        .pipe(gulp.dest("."));
});

/**
 * Formats the TypeScript code
 */
gulp.task("format", (callback) => {
    glob(scripts, (err, files) => {
        if (err) {
            return callback(err);
        }
        files.push(globs.gulp);
        tsfmt.processFiles(files, {
            editorconfig: false,
            replace: true,
            tsfmt: true,
            tslint: true
        });
        return callback(null);
    });
});

/**
 * Lints the TypeScript
 */
gulp.task("lint", () => {
    return gulp.src([globs.gulp, scripts])
        .pipe(tslint())
        .pipe(tslint.report("verbose", {
            emitError: true
        }));
});

/**
 * Pushes the documentation to github pages
 */
gulp.task("pages", ["typedoc"], () => {
    return gulp.src(path.join(dirs.doc, globs.all))
        .pipe(ghPages({
            remoteUrl: process.env.PAGES_URL
        }));
});

/**
 * Compiles the TypeScript
 */
gulp.task("scripts", ["clean"], (callback) => {
    var err: Error = null;
    var completed = 0;
    function drain(stream: NodeJS.ReadWriteStream): void {
        stream
            .pipe(gulp.dest("_build"))
            .on("error", (e: Error) => {
                err = e;
            })
            .on("finish", () => {
                completed++;
                if (completed === 2) {
                    callback(err);
                }
            });
    }
    var compiler = gulp.src([scripts, path.join(dirs.typings, globs.ts)])
        .pipe(typescript({
            declarationFiles: true,
            module: "commonjs",
            noExternalResolve: true,
            noImplicitAny: true,
            noLib: false,
            removeComments: true,
            sortOutput: false,
            target: "ES5"
        }));
    drain(compiler.dts);
    drain(compiler.js);
});

/**
 * Runs the tests
 */
gulp.task("spec", ["scripts"], (callback) => {
    gulp.src(path.join(dirs.build, dirs.src, globs.js))
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire())
        .on("finish", () => {
            gulp.src(path.join(dirs.build, dirs.test, globs.js))
                .pipe(mocha({
                    reporter: process.env.TRAVIS ? "spec" : "nyan"
                }))
                .pipe(istanbul.writeReports())
                .on("finish", () => {
                    var err: Error = null;
                    var coverage = istanbul.summarizeCoverage();
                    var incomplete = Object.keys(coverage).filter((key) => {
                        return coverage[key].pct !== 100;
                    });
                    if (incomplete.length > 0) {
                        err = new Error("Incomplete coverage for " + incomplete.join(", "));
                    }
                    callback(err);
                });
        });
});

gulp.task("typedoc", ["clean"], () => {
    return gulp.src(path.join(dirs.src, globs.ts))
        .pipe(typedoc({
            module: "commonjs",
            name: name,
            out: dirs.doc,
            target: "ES5",
            theme: "minimal"
        }));
});
