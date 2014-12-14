(function(root, R) {
  root.Radar = R.call( root );  
})(this, function() {
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

  var window = this, 
      document = window.document,
      physics = window.Physics,
      _internal = {
        modules: {},
        services: {},
        display: {}
      };


  function Radar() {
    var element = document.createElement('canvas');
    element.id = 'RadarScreen';

    this.screen = {
      element: element,
      name: element.id,
      width: window.innerWidth,
      height: window.innerHeight
    };


    _internal.radar = this;

    initializeServices.call(this);
    initializeModules.call(this);

    console.log( this.services.display );
  }

  // Radar.prototype.physicsEngine = Physics;
  Radar.prototype.start = function() {
    physics.util.ticker.start();
  };

  <%= content %>

  function initializeModules() {
    for( var module in _internal.modules ) {

      if( module === 'store' ) {
        this[ module ] = _internal.modules[ module ].call(this);
      } else {
        this[ module ] = new _internal.modules[ module ](this);
      }

      if( module === 'display' ) {
        _internal.display.instance = this[ module ];
      }
    }
  }

  function initializeServices() {
    this.services = {};

    for( var service in _internal.services ) {
      this.services[ service ] = _internal.services[ service ].call(this);  
    }
  }

  return Radar;

});
