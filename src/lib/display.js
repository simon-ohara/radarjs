(function() {

  function Display() {
    var display = this;

    display.behaviors = _root.display.behaviors;
    applyDisplayModules.call( display );

    this.findAll = function( entity ) {
      return display.find({ entity: entity });
    };

    this.findMembersOfGroup = function( groupId ) {
      return display.find({ entity: 'member', group: groupId });
    };

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

      world.add( display.renderer );
      world.add( display.behaviors );
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
    });
  }

  function applyDisplayModules() {
    var module, modules = _root.display.modules;

    for( module in modules ) {
      this[ module ] = modules[ module ].call(this);
    }
  }

  function RadarDisplay() {
    return new Display();
  };

  _root.modules.display = RadarDisplay;

})();
