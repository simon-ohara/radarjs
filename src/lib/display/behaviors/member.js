(function() {
  var memberBehaviors = [
    { name: 'body-impulse-response', id: 'impulse' },
    { name: 'sweep-prune', id: 'sweep' },
    { name: 'body-collision-detection', id: 'collision' }
  ];

  function behaviorMethods() {
    var display = this;

    function applyMemberBehavior( member ) {
      var attractor, containment, allMembers, siblingMembers;

      attractor = display.findBehaviorById('member:attractor:' + member.group);
      containment = display.findBehaviorById('member:containment:' + member.group);
      allMembers = display.findAll('member');
      siblingMembers = display.findMembersOfGroup( member.group );

      // Update each behaviors targets
      memberBehaviors.map( function( item, index, arr ) {
        display.findBehaviorById( 'member:' + item.id ).applyTo( allMembers );
      }, this);
      // Update the member attractor of the group
      attractor.applyTo( siblingMembers );
      containment.applyTo( siblingMembers );
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
            var behavior = display.findBehaviorById( 'member:' + item.id );
            world.removeBehavior( behavior );
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
