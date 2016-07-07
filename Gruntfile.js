
module.exports = function(grunt) 
{
	
	require('time-grunt')(grunt); //  for time estimation

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		composer : {
				options : {
					usePhp: true,
					phpArgs: {
						allow_url_fopen: 'on'
					},
					flags: ['no-dev'],
					composerLocation: '/usr/local/bin/composer'
				},
				build:{

				}
			},

		uglify: {
			options: {
				},
				build: {
					files: [{
						expand: true,
						flatten: false,
						cwd: 'wp/wp-content/themes/krds/',
						ext: '.js',
						src: ['**/*.js', '!*.min.js'],
						filter: 'isFile',
						dest: 'wp/wp-content/themes/krds/'
					}]
				}
		},
			
		cssmin: {
			 build: {
				  files: [{
					expand: true,
					flatten: false,
					cwd: 'wp/wp-content/themes/krds/',
					ext: '.css',
					src: ['*.css', '!*.min.css'],
					filter: 'isFile',
					dest: 'wp/wp-content/themes/krds/'
					
				  }]
				}
		},

		prompt: {
	        target: {
	            options: {
	                questions: [
	                    {
	                        config: 'projecturl',
	                        type: 'input',
	                        message: 'Enter Project Dev Url (ex: http://localhost/wordpress/wp/)',
	                        validate: function(value){
	                            if(! /^(http|https):\/\/[^ "]+$/.test(value)) {
	                                return 'Enter valid url';
	                            }
	                            return true;
	                        }
	                    },
	                    {
	                        config: 'dbname',
	                        type: 'input',
	                        message: 'Enter DB Name',
	                        validate: function(value){
	                            if(value == '') {
	                                return 'Enter Db name';
	                            }
	                            return true;
	                        }
	                    },
	                    {
	                        config: 'dbuser',
	                        type: 'input',
	                        message: 'Enter DB User',
	                        validate: function(value){
	                            if(value == '') {
	                                return 'Enter Db User';
	                            }
	                            return true;
	                        }
	                    },
	                    {
	                        config: 'dbpassword',
	                        type: 'password',
	                        message: 'Enter DB Password',
	                        validate: function(value){
	                            if(value == '') {
	                                return 'Enter Db Password';
	                            }
	                            return true;
	                        }
	                    },
	                    {
	                        config: 'dbhost',
	                        type: 'input',
	                        message: 'Enter DB Host',
	                        validate: function(value){
	                            if(value == '') {
	                                return 'Enter Db Host';
	                            }
	                            return true;
	                        }
	                    }                                     
	                ]
	            }
	        }
    	},

    	shell: {
            install_db: {
                options: {
                    stdout: true
                },
                command: 'mysql -u <%= dbuser %> -p<%= dbpassword %> -e "CREATE DATABASE IF NOT EXISTS <%= dbname %>"'
            }
        },

		'string-replace': {
				prod: {
				  files: [{
					expand: true,
					flatten: false,
					cwd: 'wp/wp-content/themes/krds/',
					ext: '.css',
					src: ['**/*.css'],
					filter: 'isFile',
					dest: 'wp/wp-content/themes/krds/'
				  }],
				  options: {
					replacements: [{
						pattern: /\.(jpg|jpeg|png|gif|svg)/g,
						replacement: '.$1?v=1'

					}]
				  }
				},

				dev: {
					files: [{
						src: 'wp/wp-config.php',
						dest: 'wp/wp-config.php'
					  }],
					  options: {
						replacements: [{
							pattern: /project url/ig,
							replacement: '<%= projecturl %>'

						},
						{
							pattern: /dbname/i,
							replacement: '<%= dbname %>'

						},
						{
							pattern: /dbuser/i,
							replacement: '<%= dbuser %>'

						},
						{
							pattern: /dbpass/i,
							replacement: '<%= dbpassword %>'

						},

						{
							pattern: /dbhost/i,
							replacement: '<%= dbhost %>'

						},
					]
					  }
					}
			},

		copy: {
	        main: {
	            files: [
	                {
	                    expand: true,
	                    cwd:'vendor/custom-wptheme',
	                    src: '**',
	                    dest: 'wp/wp-content/themes/krds/'
	                },
	                {
	                    expand: true,
	                    cwd:'vendor/wp-autoconfig',
	                    src: '**',
	                    dest: 'wp/'
	                }
	           ]
	        }
	      },

	      clean: {
	      	before: ["wp/wp-content/themes/*/","wp/wp-content/plugins/hello.php","wp/wp-config-sample.php"],
	      	after: ["vendor/custom-wptheme", "vendor/wp-autoconfig"]
	    },

	    open : {
	    dev : {
	      path: '<%= projecturl %>'
	    }
	}

});
	 
	grunt.loadNpmTasks('grunt-composer');
	grunt.loadNpmTasks('grunt-wordpress-deploy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-prompt');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-shell');


	//Dev Tasks

	grunt.registerTask('dev', 
		[
		'composer:build:install', 
		'clean:before', 
		'copy', 
		'clean:after', 
		'prompt:target', 
		//'shell:install_db',
		//'string-replace:dev',
		'open:dev'
	]); 

	//Production Tasks

	grunt.registerTask('production', 
		[
		'uglify:build', 
		'cssmin:build', 
		'string-replace:prod'
	]);

};

