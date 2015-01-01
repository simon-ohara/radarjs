(function() {

  function Display() {
    var prop, engine, _this = this;

    this._radar = {
      behaviors: []
    };

    applyDisplayModules.call( this );

    engine = physics( function(world) {
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

      world.add( _this.renderer );
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

    for( prop in engine ) {
      if( engine.hasOwnProperty( prop ) ) {
        this[ prop ] = engine[ prop ];
      }
    }

    this.__proto__ = engine.__proto__;

    this.findAll = function( entity ) {
      return this.find({ entity: entity });
    };

    this.findMembersOfGroup = function( groupId ) {
      return this.find({ entity: 'member', group: groupId });
    };
  }

  function applyDisplayModules() {
    var module, modules = _root.display.modules;

    for( module in modules ) {
      this[ module ] = modules[ module ].call(this);
    }
  }

  function RadarDisplay() {
    var display =  new Display();
    display.add( display._radar.behaviors );

    return display;
  }

  _root.modules.display = RadarDisplay;

})();
