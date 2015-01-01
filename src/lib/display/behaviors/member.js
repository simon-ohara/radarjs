(function() {
  var memberBehaviors = [
    { name: 'body-impulse-response', id: 'impulse' },
    { name: 'sweep-prune', id: 'sweep' },
    { name: 'body-collision-detection', id: 'collision' }
  ];

  function behaviorMethods() {
    var display = this;

    function applyMemberBehavior( member ) {
      var attractor, members;

      attractor = display.findBehaviorById('member:attractor:' + member.group);
      members = display.findAll('member');

      memberBehaviors.map( function( item, index, arr ) {
        display.findBehaviorById( 'member:' + item.id ).applyTo( members );
      }, this);

      attractor.applyTo( members );
    }

    return function( parent ) {
      return {
        init: function( options ) {
          parent.init.call( this );
          this.options( options );
        },
        connect: function( world ) {
          world.on('display:member:added', applyMemberBehavior, this);
          // world.on('store:member:updated', updateMember, this);
          // world.on('display:member:updated', this.updateMemberBehaviors, this);
          memberBehaviors.map( function( item, index, arr ) {
            var newBehavior = physics.behavior( item.name, { id: 'member:' + item.id });
            world.addBehavior( newBehavior.applyTo( [] ) );
          }, this);
        },
        disconnect: function( world ) {
          // Remove member behaviors
          memberBehaviors.map( function( item, index, arr ) {
            world.removeBehavior( item );
          }, this);
          // Unsubscribe from events
          world.off('display:member:added', applyMemberBehavior, this);
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
