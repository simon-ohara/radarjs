(function( _global ) {
  'use strict';
  // world / display
  // behaviors
  // bodies
  // store
  // receiver
  // services
  
  // this.store = new RadarStore(); 
  // this.geometries = new RadarGeometries();
  // this.receiver = new WebSocket( options.url );

  var // Internal package variable declarations
  
  // The root of this package
  _root = {

    // Models to be used
    models: {},

    // The data store
    stores: {},

    // Modules to be used in this package
    modules: {},

    // Code concerned with display only
    display: {
      behaviors: [],
      bodies: {},
      // Modules to be used only for the display
      modules: {}
    }
  },

  // The DOM this package has access to
  _dom = _global.document,

  // The PhysicsJS reference
  physics = _global.Physics;

// _internal = {
//   modules: {},
//   services: {},
//   display: {}
// };


  function Radar() {
    this.models = _root.models;

    // initializeServices.call(this);
    initializeModules.call(this);
  }

  // Radar.prototype.physicsEngine = Physics;
  Radar.prototype.start = function() {
    physics.util.ticker.start();
  };

  <%= content %>

  function initializeModules() {
    var module, modules = _root.modules; 
    for( module in modules ) {
      this[ module ] = modules[ module ].call(this);
    }
  }

  function initializeServices() {
    this.services = {};

    for( var service in _internal.services ) {
      this.services[ service ] = _internal.services[ service ].call(this);  
    }
  }

  // Export the Radar package
  _global.Radar = Radar;

})( this );
