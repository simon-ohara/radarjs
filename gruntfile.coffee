module.exports = (grunt) ->

  source =
    wrapper: 'src/radar.js'
    content: 'src/_content'
    final: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
    files: [
      # Models
      'src/lib/models/group.js'
      'src/lib/models/member.js'

      # Store
      'src/lib/store.js'

      # Display
      'src/lib/display/screen.js'
      'src/lib/display/renderer.js'

      'src/lib/display/bodies/base.js'
      'src/lib/display/bodies/group.js'
      'src/lib/display/bodies/member.js'
      'src/lib/display/bodies.js'
      'src/lib/display.js'

      # Controllers
      'src/lib/controllers/group.js'
      'src/lib/controllers/member.js'
      'src/lib/controllers/store.js'

      # Display Behaviors 
      # 'src/lib/display/behaviors/member.js'
      'src/lib/display/behaviors/group.js'

    ]

  wrapContent = (src, filepath) ->
    injection =
      data:
        content: grunt.file.read source.content

    grunt.template.process( src, injection )


  # Project Configuration
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    concat:
      options:
        separator: ';'
      content:
        src: source.files
        dest: source.content
      dist:
        options:
          process: wrapContent
        src: source.wrapper
        dest: source.final

    jasmine:
      src: source.final
      options:
        specs: 'spec/**/*-spec.js'
        helpers: 'spec/helpers/*-helper.js'
        vendor: 'vendor/**/*.js'

    watch:
      files: ['src/**/*.js', 'spec/**/*.js']
      tasks: ['dev-full']

  # Load Tasks from Plugins
  require('load-grunt-tasks')(grunt)

  # Register Tasks
  grunt.registerTask 'default', ['watch']
  grunt.registerTask 'dev-full', ['concat:content', 'concat:dist', 'jasmine']
