(function() {

  // Register a new body based on a circle
  physics.body('base', 'circle', function( parent ) {
    return {
      init: function( options ) {
        parent.init.call( this, options );
      }
    };
  });

  var // private declarations

  groupRGB = '189, 195, 199',

  groupProperties = {
    x: 0,
    y: 0,
    restitution: 0.99,
    radius: 30,
    mass: 4,
    styles: {
      fillStyle: 'rgba(' + groupRGB + ', 0.15)',
      strokeStyle: 'rgba(' + groupRGB + ', 0.1)',
      lineWidth: 15
    }
  },

  memberProperties = {
    x: 0,
    y: 0,
    radius: 5,
    mass: 100,
    styles: {
      fillStyle: 'rgba(46, 204, 113, 1)'
    }
  };

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

  function GroupBody( groupId ) {
    this.entity = 'group';
    this.uid = groupId;
    this.__proto__ = new BaseBody( groupProperties );
  }

  function MemberBody( memberId ) {
    this.entity = 'member';
    this.uid = memberId;
    this.__proto__ = new BaseBody( memberProperties ); 
  }


  function RadarGeometries() {}

  RadarGeometries.prototype = {
    groupBody: GroupBody,
    memberBody: MemberBody
  };

  _internal.geometries = new RadarGeometries();

}());
