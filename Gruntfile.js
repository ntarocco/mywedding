module.exports = function(grunt) {

    var target = grunt.option('target') || 'dev';

    var deployDest = 'local-dev';
    if (target === 'dropbox') {
        deployDest = '/Users/ntarocco/Dropbox/Public/marie-nicola.wedding';
    } else if (target === 'github') {
        // https://gist.github.com/cobyism/4730490
        // git subtree push --prefix github-prod origin gh-pages
        deployDest = 'github-prod';
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            all: [deployDest]
        },
        assemble: {
            options: {
                partials: ['src/partials/**/*.html'],
                flatten: true
            },
            site: {
                src: 'src/*.html',
                dest: deployDest + '/'
            }
        },
        sass: {
            dist: {
                files: {
                    '.tmp/main.css': 'src/styles/base.scss'
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '.tmp/main.min.js': [
                        'src/js/translation.fr.js',
                        'src/js/translation.it.js',
                        'src/js/main.js'
                    ]
                }
            }
        },
        concat: {
            js: {
                src: [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/i18next/i18next.min.js',
                    'bower_components/jquery-i18next/jquery-i18next.min.js',
                    'flickity/flickity.pkgd.min.js',
                    'FlipClock-master/compiled/flipclock.min.js',
                    'bootstrap/js/bootstrap.js',
                    '.tmp/main.min.js'
                ],
                dest: deployDest + '/js/main.min.js'
            },
            css: {
                src: [
                    'bootstrap/css/bootstrap.css',
                    'flickity/flickity.min.css',
                    'src/styles/flipclock.css',
                    '.tmp/main.css'
                ],
                dest: deployDest + '/css/main.css'
            }
        },
        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: 'src/images/',
                    src: ['**/*'],
                    dest: deployDest + '/images/'
                }]
            },
            video: {
                files: [{
                    expand: true,
                    cwd: 'src/video/',
                    src: ['**/*'],
                    dest: deployDest + '/video/'
                }]
            }
        },
        connect: {
            server: {
                options: {
                    livereload: true,
                    port: 9001,
                    base: deployDest + '/'
                }
            }
        },
        watch: {
            files: ['src/**/*'],
            tasks: ['default']
        }
    });

    grunt.loadNpmTasks('grunt-assemble');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'assemble', 'sass', 'uglify', 'concat', 'copy' ]);
    grunt.registerTask('serve', ['connect', 'watch' ]);
    grunt.registerTask('clean-generated', ['clean' ]);
};
