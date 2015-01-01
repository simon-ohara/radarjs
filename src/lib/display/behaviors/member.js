(function() {
  var memberBehaviors = [
    physics.behavior('body-impulse-response'),
    physics.behavior('sweep-prune'),
    physics.behavior('body-collision-detection')
  ];

  // function addMember( memberData ) {
  //   // create a new member entity
  //   var member = new _internal.geometries.memberBody( memberData.uid );

  //   // save a reference to the store
  //   memberData.body = member;

  //   // update the radar
  //   this.display.add( member );
  //   this.display.emit( 'display:member:added', memberData.uid );
  // }

  // function updateMember( memberData ) {
  //   var member = this.display.findOne({ uid: memberData.uid, entity: 'member' });

  //   if( member ) {
  //     this.display.emit( 'display:member:updated', memberData.uid );
  //   }
  // }

  // function updateMemberBehaviors() {
  //   var allMembers = this.allMembers();

  //   memberBehaviors.map( function( item, index, arr ) {
  //     item.applyTo( allMembers );
  //   }, this);
  // }

  // function allMembers() {
  //   return this.display.find({ entity: 'member' });
  // }

  function behaviorMethods() {
    return function( parent ) {
      return {
        init: function( options ) {
          parent.init.call( this );
          this.options( options );
        },
        connect: function( world ) {
          // world.on('store:member:added', addMember, this);
          // world.on('store:member:updated', updateMember, this);
          // world.on('display:member:updated', this.updateMemberBehaviors, this);
          // memberBehaviors.map( function( item, index, arr ) {
            // world.add( item.applyTo( [] ) );
          // }, this);
        },
        disconnect: function( world ) {
          // world.off('store:member:added', addMember, this);
          // world.off('store:member:updated', updateMember, this);
        }
      };
    };
  }

  function MemberBehavior( display ) {
    // Register new behavior with the physics engine
    physics.behavior( 'member', behaviorMethods.call( this ) );

    this._radar.behaviors.push( physics.behavior( 'member', { id: 'display:member' } ) );
  }

  _root.display.modules.memberBehavior = MemberBehavior;
  
})();
