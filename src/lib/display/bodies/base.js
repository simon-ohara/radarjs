(function() {

  // Register a new body based on a circle
  physics.body('base', 'circle', function( parent ) {
    return {
      init: function( options ) {
        parent.init.call( this, options );
      }
    };
  });

  // A class that generates a PhysicsJS Body
  function BaseBody( options ) {
    var prop, baseBody = physics.body( 'base', options );

    // Merge the PhysicsJS body object into this class
    for( prop in baseBody ) {
      if( baseBody.hasOwnProperty( prop ) ) {
        this[ prop ] = baseBody[ prop ];
      } 
    }
    this.__proto__ = baseBody.__proto__;
  }

  _root.display.bodies.base = BaseBody;

})();
