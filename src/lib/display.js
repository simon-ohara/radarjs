(function( _internal ) {

  var screen, display, internals = _internal.display;

  function init() {
    var renderer = internals.renderer( screen );
        // behaviors = internals.behaviors.init();

    display = physics( function(world) {
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

      world.add( renderer );
      // world.add( behaviors );
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


  function RadarDisplay(radar) {
    screen = radar.screen;

    init.call(this);
    _internal.display.behaviors.addTo( display );

    return display;
  };

  _internal.modules.display = RadarDisplay;
}( _internal ));
