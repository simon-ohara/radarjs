(function() {

  // var screen, display, internals = _internal.display;

  function Display( modules ) {
    // var renderer = internals.renderer( screen );
        // behaviors = internals.behaviors.init();

    this.__proto__ = physics( function(world) {
      // subscribe to events
      world.on('step', function() { world.render(); });
      // world.on({
        // 'step': function() { world.render(); },
        // 'service:convoy:added': addConvoy,
        // 'service:convoy:removed': removeConvoy,
        // 'service:container:added': addContainer,
        // 'service:container:removed': removeContainer,
        // 'service:container:updated': updateContainer
      // });

      world.add( modules.renderer );
      world.add( modules.behaviors );
      // apply settings to world
      // world.add([
        // Physics.behavior('container-behavior'),
        // Physics.behavior('convoy-behavior'),
        // Physics.behavior('convoy-interact'),
        // Physics.behavior('lockring-behavior'),
        // viewPortEdge,
      // ]);

      // subscribe to ticker to advance the simulation
      physics.util.ticker.on( function( time, dt ){
        world.step( time );
      });

      // start the ticker
      // physics.util.ticker.start();
    });
  }

  function applyDisplayModules() {
    var module, modules = _root.display.modules;

    for( module in modules ) {
      this[ module ] = modules[ module ].call(this);
    }
  }

  function RadarDisplay() {
    // _internal.display.behaviors.addTo( display );
    this.behaviors = _root.display.behaviors;

    applyDisplayModules.call( this );

    return new Display( this );
  };

  _root.modules.display = RadarDisplay;

})();
